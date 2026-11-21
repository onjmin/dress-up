import type { DressUpState } from "../data/items";
import { resolveHairColors, resolveThemeColors } from "./color";

export const PX_W = 64;
export const PX_H = 64;

const INK = "#1b1420";
const SKIN = "#fddcc9";
const SKIN_S = "#e7b199";
const BLUSH = "#f78fa2";

type Grid = (string | null)[][];

function makeGrid(): Grid {
	return Array.from({ length: PX_H }, () =>
		Array<string | null>(PX_W).fill(null),
	);
}

function setPx(g: Grid, x: number, y: number, c: string | null): void {
	const rx = Math.round(x);
	const ry = Math.round(y);
	if (rx >= 0 && rx < PX_W && ry >= 0 && ry < PX_H) {
		g[ry][rx] = c;
	}
}

function fillRectPx(
	g: Grid,
	x: number,
	y: number,
	w: number,
	h: number,
	c: string,
): void {
	for (let dy = 0; dy < h; dy++) {
		for (let dx = 0; dx < w; dx++) {
			setPx(g, x + dx, y + dy, c);
		}
	}
}

function drawRowsPx(
	g: Grid,
	y0: number,
	rows: [number, string][],
	pal: Record<string, string>,
): void {
	for (let i = 0; i < rows.length; i++) {
		const [x0, str] = rows[i];
		for (let j = 0; j < str.length; j++) {
			const ch = str[j];
			if (ch !== "." && pal[ch]) {
				setPx(g, x0 + j, y0 + i, pal[ch]);
			}
		}
	}
}

function applyOutline(src: Grid, outlineCol = INK): Grid {
	const out = makeGrid();
	const dirs = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];
	for (let y = 0; y < PX_H; y++) {
		for (let x = 0; x < PX_W; x++) {
			if (src[y][x] !== null) {
				out[y][x] = src[y][x];
				continue;
			}
			for (const [dx, dy] of dirs) {
				const nx = x + dx;
				const ny = y + dy;
				if (
					nx >= 0 &&
					nx < PX_W &&
					ny >= 0 &&
					ny < PX_H &&
					src[ny][nx] !== null
				) {
					out[y][x] = outlineCol;
					break;
				}
			}
		}
	}
	return out;
}

function mergeLayer(dst: Grid, src: Grid): void {
	for (let y = 0; y < PX_H; y++) {
		for (let x = 0; x < PX_W; x++) {
			if (src[y][x] !== null) {
				dst[y][x] = src[y][x];
			}
		}
	}
}

export function renderPixelRoze(
	targetCanvas: HTMLCanvasElement,
	state: DressUpState,
	time: number,
	transparentBg = false,
): void {
	if (targetCanvas.width !== PX_W) targetCanvas.width = PX_W;
	if (targetCanvas.height !== PX_H) targetCanvas.height = PX_H;
	const ctx = targetCanvas.getContext("2d");
	if (!ctx) return;

	const hc = resolveHairColors(state.hairColor, state.hairHue, state.innerHue);
	const topT = resolveThemeColors(state.topsTheme, state.topsHue);
	const slvT = resolveThemeColors(state.sleevesTheme, state.sleevesHue);
	const botT = resolveThemeColors(state.bottomsTheme, state.bottomsHue);
	const legT = resolveThemeColors(state.legwearTheme, state.legwearHue);

	const bob = Math.floor(time * 2.5) % 2;
	const flicker = Math.floor(time * 5.0) % 2;

	const composite = makeGrid();

	// 1. Back hair
	{
		const g = makeGrid();
		if (state.hair === "hime_bun" || state.hair === "long_hime") {
			const hLen = state.hair === "long_hime" ? 26 : 19;
			fillRectPx(g, 20, 14 + bob, 24, hLen, hc.mainShade);
			// Inner teal back hair peeking out
			fillRectPx(g, 19, 22 + bob, 4, hLen - 3, hc.inner);
			fillRectPx(g, 41, 22 + bob, 4, hLen - 3, hc.inner);
		} else if (state.hair === "high_twin") {
			fillRectPx(g, 14, 14 + bob, 6, 22, hc.main);
			fillRectPx(g, 44, 14 + bob, 6, 22, hc.main);
			fillRectPx(g, 15, 22 + bob, 4, 16, hc.inner);
			fillRectPx(g, 45, 22 + bob, 4, 16, hc.inner);
		} else if (state.hair === "bob_cut") {
			fillRectPx(g, 21, 14 + bob, 22, 14, hc.inner);
		}
		mergeLayer(composite, applyOutline(g));
	}

	// 2. Legs & Legwear
	{
		const g = makeGrid();
		const rLift = state.pose === "official" ? 2 : 0;
		// Right leg (viewer left)
		fillRectPx(g, 26, 42, 4, 14 - rLift, SKIN);
		// Left leg (viewer right)
		fillRectPx(g, 34, 42, 4, 15, SKIN);
		if (state.legwear !== "barefoot") {
			const sockCol =
				state.legwear === "garter_heels" ? legT.main : legT.mainDark;
			if (state.legwear !== "china_boots") {
				fillRectPx(g, 26, 47 - rLift, 4, 7, sockCol);
				fillRectPx(g, 34, 47, 4, 8, sockCol);
			}
			fillRectPx(g, 25, 53 - rLift, 5, 4, legT.mainDark);
			fillRectPx(g, 34, 53, 5, 4, legT.mainDark);
			fillRectPx(g, 25, 53 - rLift, 5, 1, legT.accent);
			fillRectPx(g, 34, 53, 5, 1, legT.accent);
		}
		mergeLayer(composite, applyOutline(g));
	}

	// 3. Torso + Waist + Bottoms
	{
		const g = makeGrid();
		// Bare midriff
		fillRectPx(g, 27, 30 + bob, 10, 12, SKIN);
		setPx(g, 31, 36 + bob, SKIN_S);
		// Belt / panties
		fillRectPx(g, 26, 39, 12, 5, botT.mainDark);

		if (state.bottoms === "flame_hakama") {
			fillRectPx(g, 26, 39, 12, 3, botT.main);
			fillRectPx(g, 30, 39, 4, 3, botT.trim); // Gold buckle
			// Left & right flowing red legs with thigh slit
			fillRectPx(g, 23, 41, 4, 12, botT.accent);
			fillRectPx(g, 23, 50, 8, 5, botT.accent);
			fillRectPx(g, 37, 41, 4, 13, botT.accent);
			fillRectPx(g, 33, 51, 9, 5, botT.accent);
			// Meander stripe + animated pink flame hem
			fillRectPx(g, 23, 53, 8, 1, "#f7eef2");
			fillRectPx(g, 33, 54, 9, 1, "#f7eef2");
			fillRectPx(g, 22, 55, 9, 2 + flicker, botT.glow);
			fillRectPx(g, 33, 56, 9, 2 + (1 - flicker), botT.glow);
			setPx(g, 22 + flicker, 57, botT.glowSoft);
			setPx(g, 41 - flicker, 58, botT.glowSoft);
		} else if (
			state.bottoms === "china_miniskirt" ||
			state.bottoms === "cyber_shorts"
		) {
			fillRectPx(g, 24, 40, 16, 7, botT.main);
			fillRectPx(g, 24, 46, 16, 1, botT.accent);
		} else if (
			state.bottoms === "miko_hakama" ||
			state.bottoms === "gothic_skirt"
		) {
			const c = state.bottoms === "miko_hakama" ? botT.accent : botT.main;
			fillRectPx(g, 24, 40, 16, 15, c);
			fillRectPx(
				g,
				26,
				40,
				12,
				2,
				state.bottoms === "miko_hakama" ? "#f5f2eb" : botT.trim,
			);
		} else {
			fillRectPx(g, 24, 40, 6, 15, botT.main);
			fillRectPx(g, 34, 40, 6, 15, botT.main);
		}
		mergeLayer(composite, applyOutline(g));
	}

	// 4. Tops & Arms & Sleeves
	{
		const g = makeGrid();
		const topFill =
			state.tops === "red_china_dress"
				? topT.accent
				: state.tops === "oversize_hoodie"
					? "#c96a48"
					: topT.main;
		// Collar + chest
		fillRectPx(g, 29, 26 + bob, 6, 3, topFill);
		fillRectPx(g, 26, 29 + bob, 12, 8, topFill);
		if (state.tops === "china_keyhole") {
			fillRectPx(g, 28, 31 + bob, 8, 2, SKIN);
			fillRectPx(g, 27, 30 + bob, 10, 1, topT.accent);
			fillRectPx(g, 27, 33 + bob, 10, 1, topT.accent);
		} else if (state.tops === "cyber_crop") {
			fillRectPx(g, 31, 29 + bob, 2, 8, topT.accentLight);
		} else if (state.tops === "oversize_hoodie") {
			fillRectPx(g, 25, 29 + bob, 14, 11, topFill);
		}

		// Bare shoulders (0J mark)
		fillRectPx(g, 23, 29 + bob, 3, 4, SKIN);
		fillRectPx(g, 38, 29 + bob, 3, 4, SKIN);
		if (state.ojMark) {
			setPx(g, 39, 30 + bob, "#c92434");
		}

		// Sleeves
		if (state.sleeves === "bell_wide" || state.sleeves === "neon_wide") {
			const stripe =
				state.sleeves === "neon_wide" ? slvT.accentLight : slvT.accent;
			// Left puffy bell sleeve
			fillRectPx(g, 15, 31 + bob, 8, 7, slvT.main);
			fillRectPx(g, 11, 33 + bob, 5, 5, slvT.accent);
			fillRectPx(g, 17, 33 + bob, 6, 1, stripe);
			// Right puffy bell sleeve
			fillRectPx(g, 41, 31 + bob, 8, 7, slvT.main);
			fillRectPx(g, 48, 33 + bob, 5, 5, slvT.accent);
			fillRectPx(g, 41, 33 + bob, 6, 1, stripe);
		} else if (state.sleeves === "hagoromo") {
			fillRectPx(g, 17, 31 + bob, 6, 6, slvT.glowSoft);
			fillRectPx(g, 41, 31 + bob, 6, 6, slvT.glowSoft);
		} else if (state.sleeves !== "none") {
			fillRectPx(g, 19, 31 + bob, 4, 8, slvT.main);
			fillRectPx(g, 41, 31 + bob, 4, 8, slvT.main);
		} else {
			fillRectPx(g, 20, 31 + bob, 3, 8, SKIN);
			fillRectPx(g, 41, 31 + bob, 3, 8, SKIN);
		}

		mergeLayer(composite, applyOutline(g));
	}

	// 5. Head, Face & Front Hair
	{
		const g = makeGrid();
		fillRectPx(g, 24, 15 + bob, 16, 12, SKIN);
		fillRectPx(g, 25, 26 + bob, 14, 2, SKIN);
		// Cheek blush
		if (state.cheek !== "none") {
			setPx(g, 25, 24 + bob, BLUSH);
			setPx(g, 26, 24 + bob, BLUSH);
			setPx(g, 37, 24 + bob, BLUSH);
			setPx(g, 38, 24 + bob, BLUSH);
		}
		mergeLayer(composite, applyOutline(g));

		// Eyes & Mouth directly onto composite
		const blink = Math.floor(time * 0.9) % 7 === 6;
		const pal: Record<string, string> = {
			K: INK,
			W: "#ffffff",
			E: hc.eye,
			M: "#d95b6e",
		};
		if (blink || state.eyes === "smile") {
			drawRowsPx(composite, 21 + bob, [[26, "KKK..KKK"]], pal);
		} else if (state.eyes === "wink") {
			drawRowsPx(
				composite,
				20 + bob,
				[
					[26, "KKK"],
					[26, "WEK..KKK"],
					[26, "WEK"],
				],
				pal,
			);
		} else {
			drawRowsPx(
				composite,
				20 + bob,
				[
					[26, "KKK..KKK"],
					[26, "WEK..KEW"],
					[26, "WEE..EEW"],
				],
				pal,
			);
		}
		setPx(composite, 31, 25 + bob, state.mouth === "fang" ? "#d95b6e" : INK);
		setPx(composite, 32, 25 + bob, state.mouth === "open_o" ? "#d95b6e" : INK);

		// Hair crown, bangs, twin buns, ornaments, wisps
		const hg = makeGrid();
		fillRectPx(hg, 23, 10 + bob, 18, 9, hc.main);
		fillRectPx(hg, 25, 13 + bob, 14, 1, hc.mainHighlight); // Shine
		// Hime side locks (shorter on chignon / bob_cut)
		const sideLen =
			state.hair === "chignon" ? 7 : state.hair === "bob_cut" ? 11 : 14;
		fillRectPx(hg, 22, 16 + bob, 3, sideLen, hc.main);
		fillRectPx(hg, 39, 16 + bob, 3, sideLen, hc.main);

		if (state.hair === "hime_bun") {
			// Floating wisps
			setPx(hg, 17, 10 + bob, hc.main);
			setPx(hg, 18, 11 + bob, hc.main);
			setPx(hg, 46, 10 + bob, hc.main);
			setPx(hg, 45, 11 + bob, hc.main);
			setPx(hg, 16, 13 + bob, hc.main);
			setPx(hg, 47, 13 + bob, hc.main);
		}
		if (state.ornament !== "none") {
			const oc =
				state.ornament === "jade"
					? "#36a888"
					: state.ornament === "red_white"
						? "#c92434"
						: "#dcb45c";
			fillRectPx(hg, 20, 11 + bob, 3, 3, oc);
			setPx(hg, 21, 12 + bob, "#f5f2eb");
			fillRectPx(hg, 41, 11 + bob, 3, 3, oc);
			setPx(hg, 42, 12 + bob, "#f5f2eb");
		}
		if (state.headset !== "none") {
			fillRectPx(hg, 40, 19 + bob, 2, 4, "#34343e");
			setPx(hg, 41, 20 + bob, "#36a888");
			setPx(hg, 38, 25 + bob, INK);
			setPx(hg, 36, 25 + bob, INK);
		}
		if (state.headwear === "jiangshi_hat") {
			fillRectPx(hg, 23, 4 + bob, 18, 6, "#1f1d29");
			fillRectPx(hg, 31, 3 + bob, 2, 2, "#c92434");
			fillRectPx(hg, 30, 10 + bob, 4, 6, "#f2df74");
		} else if (state.headwear === "neko_headphones") {
			fillRectPx(hg, 21, 7 + bob, 4, 4, "#222630");
			fillRectPx(hg, 39, 7 + bob, 4, 4, "#222630");
			setPx(hg, 22, 8 + bob, "#35f0c8");
			setPx(hg, 40, 8 + bob, "#35f0c8");
		} else if (state.headwear === "crown") {
			fillRectPx(hg, 28, 7 + bob, 8, 3, "#f0c965");
			setPx(hg, 31, 6 + bob, "#26b391");
		}
		mergeLayer(composite, applyOutline(hg));
	}

	// Render pixel grid to canvas
	ctx.clearRect(0, 0, PX_W, PX_H);
	if (!transparentBg) {
		ctx.fillStyle = state.bg === "simple_studio" ? state.studioBg : "#161224";
		ctx.fillRect(0, 0, PX_W, PX_H);
	}
	for (let y = 0; y < PX_H; y++) {
		for (let x = 0; x < PX_W; x++) {
			const c = composite[y][x];
			if (c) {
				ctx.fillStyle = c;
				ctx.fillRect(x, y, 1, 1);
			}
		}
	}
}
