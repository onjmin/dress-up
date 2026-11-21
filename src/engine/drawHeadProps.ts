import type { DressUpState, HairColorMeta } from "../data/items";
import { mixHex, resolveHairColors, resolveThemeColors, rgba } from "./color";
import {
	type CharacterRig,
	drawYinYang,
	INK,
	SKIN_BLUSH,
	SKIN_SHADE,
} from "./rig";

export function drawBackHair(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const hc = resolveHairColors(state.hairColor, state.hairHue, state.innerHue);
	const sway = rig.sway * 5;
	ctx.save();
	ctx.translate(rig.head.x, rig.head.y);
	ctx.rotate(rig.headTilt);

	if (state.hair === "hime_bun" || state.hair === "long_hime") {
		const isLong = state.hair === "long_hime";
		const innerY = isLong ? 338 : 252;
		const outerY = isLong ? 305 : 178;

		// Inner teal hair panels flowing gracefully down behind neck & back (signature Roze look)
		ctx.fillStyle = hc.inner;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		for (const s of [-1, 1]) {
			ctx.beginPath();
			ctx.moveTo(s * 24, 18);
			ctx.bezierCurveTo(
				s * 54,
				55,
				s * 58,
				145,
				s * (56 + s * sway * 0.45),
				innerY,
			);
			ctx.quadraticCurveTo(s * 46, innerY + 12, s * 40, innerY - 10);
			ctx.quadraticCurveTo(s * 34, innerY + 14, s * 22, innerY - 14);
			ctx.lineTo(s * 18, 60);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Inner teal highlight stripe
			ctx.fillStyle = rgba(hc.innerLight, 0.48);
			ctx.beginPath();
			ctx.moveTo(s * 36, 95);
			ctx.quadraticCurveTo(s * 48, 165, s * 46, innerY - 24);
			ctx.lineTo(s * 38, innerY - 26);
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = hc.inner;
		}

		// Outer black back hair layer framing neck & upper back
		ctx.beginPath();
		ctx.moveTo(-58, -8);
		ctx.quadraticCurveTo(-64, 75, -52 + sway * 0.35, outerY);
		ctx.lineTo(-26, outerY - 14);
		ctx.lineTo(0, outerY - 6);
		ctx.lineTo(26, outerY - 14);
		ctx.lineTo(52 + sway * 0.35, outerY);
		ctx.quadraticCurveTo(64, 75, 58, -8);
		ctx.closePath();
		ctx.fillStyle = hc.mainShade;
		ctx.fill();
		ctx.stroke();
	} else if (state.hair === "high_twin") {
		for (const s of [-1, 1]) {
			// Inner teal layer under high twin tails
			ctx.fillStyle = hc.inner;
			ctx.strokeStyle = INK;
			ctx.lineWidth = 3.0;
			ctx.beginPath();
			ctx.moveTo(s * 52, -40);
			ctx.bezierCurveTo(
				s * 145,
				-20,
				s * 165,
				145,
				s * (112 + s * sway * 0.8),
				295,
			);
			ctx.quadraticCurveTo(s * 90, 215, s * 78, 95);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Outer dark twin tail
			ctx.fillStyle = hc.main;
			ctx.beginPath();
			ctx.moveTo(s * 52, -45);
			ctx.bezierCurveTo(
				s * 138,
				-35,
				s * 148,
				120,
				s * (126 + s * sway * 0.8),
				255,
			);
			ctx.quadraticCurveTo(s * 96, 175, s * 74, 45);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	} else if (state.hair === "bob_cut") {
		ctx.fillStyle = hc.inner;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.beginPath();
		ctx.moveTo(-64, 0);
		ctx.quadraticCurveTo(-72, 74, -46, 98);
		ctx.lineTo(46, 98);
		ctx.quadraticCurveTo(72, 74, 64, 0);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	ctx.restore();
}

function drawSingleEye(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	side: -1 | 1,
	state: DressUpState,
	hc: HairColorMeta,
	blink: number,
): void {
	ctx.save();
	ctx.translate(cx, cy);

	const style = state.eyes;
	const isWinkClosed = style === "wink" && side === 1;
	if (style === "smile" || isWinkClosed) {
		ctx.strokeStyle = INK;
		ctx.lineWidth = 4.2;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(-16, 4);
		ctx.quadraticCurveTo(0, -11, 16, 4);
		ctx.stroke();
		ctx.restore();
		return;
	}

	// Blink squeeze
	const openScaleY = Math.max(0.08, 1 - blink * 0.92);
	if (openScaleY < 0.2) {
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.8;
		ctx.beginPath();
		ctx.moveTo(-17, 2);
		ctx.quadraticCurveTo(0, 6, 17, 2);
		ctx.stroke();
		ctx.restore();
		return;
	}

	ctx.scale(1, openScaleY);

	const eyeW = 19;
	const eyeH = style === "surprised" ? 19 : style === "jito" ? 13 : 16.5;

	// Sclera (white of eye)
	ctx.beginPath();
	ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
	ctx.fillStyle = "#ffffff";
	ctx.fill();

	// Clip inside eye for iris & top lid shadow
	ctx.save();
	ctx.clip();

	// Upper lid shadow
	ctx.fillStyle = "rgba(185, 195, 210, 0.48)";
	ctx.fillRect(-eyeW - 2, -eyeH - 2, eyeW * 2 + 4, eyeH * 0.52);

	if (style === "spiral") {
		ctx.strokeStyle = hc.eye;
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		for (let a = 0; a < Math.PI * 4.5; a += 0.3) {
			const r = a * 1.1;
			const px = Math.cos(a) * r;
			const py = Math.sin(a) * r;
			if (a === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.stroke();
	} else {
		const irisR = style === "surprised" ? 9.5 : 13.5;
		const irisX = side * -1.2;
		const irisY = style === "jito" ? 2 : 0.5;
		const ig = ctx.createLinearGradient(0, -irisR, 0, irisR);
		ig.addColorStop(0, mixHex(hc.eye, "#0b1a16", 0.35));
		ig.addColorStop(0.55, hc.eye);
		ig.addColorStop(1, mixHex(hc.eye, "#a8ffea", 0.5));

		ctx.beginPath();
		ctx.ellipse(irisX, irisY, irisR * 0.92, irisR * 1.05, 0, 0, Math.PI * 2);
		ctx.fillStyle = ig;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.6;
		ctx.stroke();

		// Pupil
		ctx.fillStyle = "#102822";
		ctx.beginPath();
		ctx.ellipse(irisX, irisY, irisR * 0.42, irisR * 0.5, 0, 0, Math.PI * 2);
		ctx.fill();

		// Heart highlight or classic round specular highlights
		if (style === "heart") {
			ctx.fillStyle = "#ff78b4";
			ctx.beginPath();
			ctx.moveTo(irisX, irisY + 5);
			ctx.bezierCurveTo(
				irisX - 7,
				irisY,
				irisX - 6,
				irisY - 6,
				irisX,
				irisY - 2,
			);
			ctx.bezierCurveTo(
				irisX + 6,
				irisY - 6,
				irisX + 7,
				irisY,
				irisX,
				irisY + 5,
			);
			ctx.fill();
		}

		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.arc(irisX - 4.5, irisY - 5, 4.0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(irisX + 4.2, irisY + 4.5, 2.1, 0, Math.PI * 2);
		ctx.fill();
	}

	// Jito flat top eyelid cut
	if (style === "jito") {
		ctx.fillStyle = "#fde2d2";
		ctx.fillRect(-eyeW - 2, -eyeH - 2, eyeW * 2 + 4, eyeH * 0.65);
	}
	ctx.restore();

	// Crisp upper eyelash + cute outer wing
	ctx.strokeStyle = INK;
	ctx.lineWidth = 4.6;
	ctx.lineCap = "round";
	ctx.beginPath();
	if (style === "jito") {
		ctx.moveTo(-eyeW - 2, -eyeH * 0.35);
		ctx.lineTo(eyeW + 3, -eyeH * 0.35);
	} else {
		ctx.moveTo(-eyeW - 1, -3);
		ctx.quadraticCurveTo(0, -eyeH - 4, eyeW + 2, -2);
		// Outer lash flick
		ctx.lineTo(eyeW + side * 4.5, -5);
	}
	ctx.stroke();

	// Subtle lower eyelash
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(0, 1, eyeW - 2, 0.35, Math.PI - 0.35);
	ctx.stroke();

	ctx.restore();
}

export function drawHeadAndFace(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const hc = resolveHairColors(state.hairColor, state.hairHue, state.innerHue);
	ctx.save();
	ctx.translate(rig.head.x, rig.head.y);
	ctx.rotate(rig.headTilt);

	// Ears
	ctx.fillStyle = "#fde2d2";
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.ellipse(s * 59, 12, 9, 16, s * 0.14, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}

	// Head contour (anime jaw + rounded cheeks)
	ctx.beginPath();
	ctx.moveTo(-56, -12);
	ctx.bezierCurveTo(-60, 28, -42, 60, 0, 72);
	ctx.bezierCurveTo(42, 60, 60, 28, 56, -12);
	ctx.bezierCurveTo(56, -64, -56, -64, -56, -12);
	ctx.closePath();
	ctx.fillStyle = "#fde2d2";
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.stroke();

	// Cheek blush / tear mole
	if (
		state.cheek === "normal" ||
		state.cheek === "blush_lines" ||
		state.cheek === "tear_mole"
	) {
		for (const s of [-1, 1]) {
			const cg = ctx.createRadialGradient(s * 34, 24, 2, s * 34, 24, 20);
			cg.addColorStop(
				0,
				rgba(SKIN_BLUSH, state.cheek === "blush_lines" ? 0.65 : 0.45),
			);
			cg.addColorStop(1, rgba(SKIN_BLUSH, 0));
			ctx.fillStyle = cg;
			ctx.beginPath();
			ctx.ellipse(s * 34, 24, 20, 12, 0, 0, Math.PI * 2);
			ctx.fill();

			if (state.cheek === "blush_lines") {
				ctx.strokeStyle = rgba("#e05572", 0.72);
				ctx.lineWidth = 1.9;
				for (const dx of [-6, 0, 6]) {
					ctx.beginPath();
					ctx.moveTo(s * 34 + dx - 2, 28);
					ctx.lineTo(s * 34 + dx + 3, 20);
					ctx.stroke();
				}
			}
		}
		if (state.cheek === "tear_mole") {
			ctx.fillStyle = "#3a252e";
			ctx.beginPath();
			ctx.arc(28, 22, 2.2, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Eyes
	drawSingleEye(ctx, -26, 4, -1, state, hc, rig.blink);
	drawSingleEye(ctx, 26, 4, 1, state, hc, rig.blink);

	// Eyebrows (soft visible through bangs)
	ctx.strokeStyle = mixHex(hc.main, "#4a333b", 0.25);
	ctx.lineWidth = 2.6;
	ctx.lineCap = "round";
	for (const s of [-1, 1]) {
		const yOff =
			state.eyes === "surprised" ? -24 : state.eyes === "jito" ? -16 : -20;
		ctx.beginPath();
		ctx.moveTo(s * 12, yOff + (state.eyes === "jito" ? 2 : 0));
		ctx.quadraticCurveTo(s * 26, yOff - 4, s * 40, yOff + 1);
		ctx.stroke();
	}

	// Delicate nose
	ctx.fillStyle = rgba(SKIN_SHADE, 0.85);
	ctx.beginPath();
	ctx.ellipse(0, 26, 1.8, 3.0, 0, 0, Math.PI * 2);
	ctx.fill();

	// Mouth
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.lineCap = "round";
	if (state.mouth === "smile") {
		ctx.beginPath();
		ctx.moveTo(-11, 43);
		ctx.quadraticCurveTo(0, 50, 11, 43);
		ctx.stroke();
	} else if (state.mouth === "calm") {
		ctx.beginPath();
		ctx.moveTo(-8, 45);
		ctx.quadraticCurveTo(0, 46.5, 8, 45);
		ctx.stroke();
	} else if (state.mouth === "pout") {
		ctx.beginPath();
		ctx.moveTo(-8, 46);
		ctx.quadraticCurveTo(0, 41, 8, 46);
		ctx.stroke();
	} else if (state.mouth === "open_o") {
		ctx.fillStyle = "#d95b6e";
		ctx.beginPath();
		ctx.ellipse(0, 46, 5.5, 6.5, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	} else if (state.mouth === "fang") {
		ctx.fillStyle = "#cc495c";
		ctx.beginPath();
		ctx.moveTo(-12, 42);
		ctx.lineTo(12, 42);
		ctx.quadraticCurveTo(10, 56, 0, 56);
		ctx.quadraticCurveTo(-10, 56, -12, 42);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// White upper teeth + cute fang
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.moveTo(-10, 42);
		ctx.lineTo(10, 42);
		ctx.lineTo(8, 46);
		ctx.lineTo(5, 49);
		ctx.lineTo(3, 46);
		ctx.lineTo(-9, 46);
		ctx.closePath();
		ctx.fill();
	} else {
		// tongue
		ctx.beginPath();
		ctx.moveTo(-11, 43);
		ctx.quadraticCurveTo(0, 48, 11, 43);
		ctx.stroke();
		ctx.fillStyle = "#ff7894";
		ctx.beginPath();
		ctx.ellipse(4, 48, 5.5, 6.5, 0.1, 0, Math.PI);
		ctx.fill();
		ctx.stroke();
	}

	// Face Accessories
	if (
		state.faceAcc === "eyepatch_white" ||
		state.faceAcc === "eyepatch_black"
	) {
		const isWhite = state.faceAcc === "eyepatch_white";
		ctx.strokeStyle = isWhite ? "#d5d2df" : "#221a26";
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(-54, -18);
		ctx.lineTo(-26, 4);
		ctx.lineTo(48, -28);
		ctx.stroke();

		ctx.fillStyle = isWhite ? "#f7f5fc" : "#241f2d";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.ellipse(-26, 4, 22, 18, -0.08, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		if (!isWhite) {
			ctx.strokeStyle = "#c92434";
			ctx.lineWidth = 2.2;
			ctx.strokeRect(-33, -3, 14, 14);
		}
	} else if (state.faceAcc === "cyber_visor") {
		ctx.fillStyle = "rgba(42, 232, 188, 0.34)";
		ctx.strokeStyle = "#38f5ca";
		ctx.lineWidth = 3.0;
		ctx.beginPath();
		ctx.roundRect(-52, -14, 104, 34, 10);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "rgba(255,255,255,0.45)";
		ctx.fillRect(-42, -9, 28, 4);
	} else if (state.faceAcc === "round_glasses") {
		ctx.strokeStyle = "#dcb45c";
		ctx.lineWidth = 3.0;
		for (const s of [-1, 1]) {
			ctx.fillStyle = "rgba(235, 248, 255, 0.22)";
			ctx.beginPath();
			ctx.arc(s * 27, 4, 21, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.moveTo(-6, 4);
		ctx.lineTo(6, 4);
		ctx.stroke();
	}

	ctx.restore();
}

function drawFloatingWisp(
	ctx: CanvasRenderingContext2D,
	pts: [number, number][],
	color: string,
	w: number,
): void {
	ctx.save();
	ctx.strokeStyle = INK;
	ctx.lineWidth = w + 3.2;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(pts[0][0], pts[0][1]);
	ctx.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
	ctx.stroke();

	ctx.strokeStyle = color;
	ctx.lineWidth = w;
	ctx.stroke();
	ctx.restore();
}

export function drawFrontHairAndOrnaments(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const hc = resolveHairColors(state.hairColor, state.hairHue, state.innerHue);
	const sway = rig.sway * 4.5;

	ctx.save();
	ctx.translate(rig.head.x, rig.head.y);
	ctx.rotate(rig.headTilt);

	// Hair crown / bangs (blunt straight hime bangs with crisp partings)
	ctx.fillStyle = hc.main;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;

	ctx.beginPath();
	ctx.moveTo(-64, 18);
	ctx.bezierCurveTo(-68, -58, -32, -78, 0, -78);
	ctx.bezierCurveTo(32, -78, 68, -58, 64, 18);
	// Right side hime lock (viewer's right)
	ctx.lineTo(54, 48);
	ctx.lineTo(44, -6);
	// Blunt bangs with tiny natural splits
	ctx.lineTo(24, -6);
	ctx.lineTo(20, -18);
	ctx.lineTo(17, -5);
	ctx.lineTo(-14, -5);
	ctx.lineTo(-17, -18);
	ctx.lineTo(-21, -5);
	ctx.lineTo(-44, -6);
	// Left side hime lock
	ctx.lineTo(-54, 48);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Hime-cut cheek-framing locks (姫毛)
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.moveTo(s * 54, -20);
		ctx.quadraticCurveTo(s * 66, 36, s * (48 + s * sway * 0.2), 116);
		ctx.quadraticCurveTo(s * 42, 68, s * 44, -4);
		ctx.closePath();
		ctx.fillStyle = hc.main;
		ctx.fill();
		ctx.stroke();
	}

	// Hair gloss highlight arc across bangs
	ctx.fillStyle = rgba(hc.mainHighlight, 0.72);
	ctx.beginPath();
	ctx.moveTo(-38, -36);
	ctx.quadraticCurveTo(0, -45, 38, -36);
	ctx.quadraticCurveTo(32, -26, 20, -29);
	ctx.quadraticCurveTo(0, -34, -20, -29);
	ctx.quadraticCurveTo(-32, -26, -38, -36);
	ctx.closePath();
	ctx.fill();

	// Twin bun flared side-tails + floating hair wisps (for hime_bun & chignon)
	if (state.hair === "hime_bun" || state.hair === "chignon") {
		const isBun = state.hair === "hime_bun";
		for (const s of [-1, 1]) {
			const bx = s * 56;
			const by = -48;
			// Bun base
			ctx.fillStyle = hc.main;
			ctx.strokeStyle = INK;
			ctx.lineWidth = 3.0;
			ctx.beginPath();
			ctx.arc(bx, by, 17, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();

			if (isBun) {
				// Floating wisps radiating outward-upward from bun
				drawFloatingWisp(
					ctx,
					[
						[bx + s * 10, by - 4],
						[bx + s * 34, by - 16 - sway * 0.6],
						[bx + s * 54, by - 14 - sway],
					],
					hc.main,
					5.5,
				);
				drawFloatingWisp(
					ctx,
					[
						[bx + s * 14, by + 6],
						[bx + s * 38, by + 2 - sway * 0.4],
						[bx + s * 56, by + 12 - sway * 0.8],
					],
					hc.main,
					4.5,
				);

				// Flared bun tails hugging face neatly down to chin/collarbone (leaving shoulder 0J mark clear)
				ctx.fillStyle = hc.main;
				ctx.beginPath();
				ctx.moveTo(bx + s * 4, by + 8);
				ctx.bezierCurveTo(
					bx + s * 32,
					by + 30,
					bx + s * 36,
					66,
					bx + s * (22 + s * sway * 0.35),
					92,
				);
				ctx.lineTo(bx + s * 13, 76);
				ctx.lineTo(bx + s * 8, 94);
				ctx.quadraticCurveTo(bx - s * 4, 62, bx - s * 4, by + 18);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
		}
	}

	// Yin-yang ornaments
	if (state.ornament !== "none") {
		const yangCol =
			state.ornament === "jade"
				? "#36a888"
				: state.ornament === "red_white"
					? "#c92434"
					: "#231e2c";
		const yinCol = state.ornament === "black_gold" ? "#e5b84b" : "#f5f2eb";
		const rimCol = "#dcb45c";
		for (const s of [-1, 1]) {
			drawYinYang(
				ctx,
				s * 59,
				-48,
				15.5,
				yangCol,
				yinCol,
				rimCol,
				s === 1,
				s * 0.2,
			);
		}
	}

	// Left-ear headset microphone (viewer's right side, side === +1)
	if (state.headset !== "none") {
		const hsAccent =
			state.headset === "jade"
				? "#36a888"
				: state.headset === "neon_pink"
					? "#ff66a8"
					: "#e5b84b";
		// Ear piece
		ctx.fillStyle = "#31313b";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.roundRect(54, -4, 16, 36, 7);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = hsAccent;
		ctx.fillRect(60, 4, 6, 20);

		// Boom mic curving cleanly near chin
		ctx.strokeStyle = "#2b2b34";
		ctx.lineWidth = 4.2;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(60, 26);
		ctx.quadraticCurveTo(46, 56, 12, 56);
		ctx.stroke();
		ctx.fillStyle = "#18181f";
		ctx.beginPath();
		ctx.ellipse(9, 56, 6.5, 4.2, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	// Headwear
	const hwTheme = resolveThemeColors(state.headwearTheme, 0);
	if (state.headwear === "jiangshi_hat") {
		ctx.fillStyle = "#1f1d29";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		// Brim
		ctx.beginPath();
		ctx.ellipse(0, -72, 72, 16, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		// Crown
		ctx.beginPath();
		ctx.roundRect(-42, -120, 84, 50, [18, 18, 4, 4]);
		ctx.fill();
		ctx.stroke();
		// Top red bead + gold crest
		ctx.fillStyle = "#c92434";
		ctx.beginPath();
		ctx.arc(0, -126, 8, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		// Yellow talisman ofuda (ends neatly at brow/bangs without covering nose bridge)
		ctx.fillStyle = "#f2df74";
		ctx.save();
		ctx.rotate(sway * 0.015);
		ctx.beginPath();
		ctx.roundRect(-13, -84, 26, 58, 3);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = "#c92434";
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(0, -74);
		ctx.lineTo(0, -34);
		ctx.moveTo(-7, -60);
		ctx.lineTo(7, -60);
		ctx.moveTo(-6, -46);
		ctx.lineTo(6, -46);
		ctx.stroke();
		ctx.restore();
	} else if (state.headwear === "neko_headphones") {
		// Headband
		ctx.strokeStyle = "#222630";
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.arc(0, -18, 66, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
		for (const s of [-1, 1]) {
			ctx.fillStyle = "#222630";
			ctx.strokeStyle = INK;
			ctx.lineWidth = 2.8;
			ctx.beginPath();
			ctx.moveTo(s * 22, -74);
			ctx.lineTo(s * 44, -114);
			ctx.lineTo(s * 58, -62);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "#35f0c8";
			ctx.beginPath();
			ctx.moveTo(s * 30, -76);
			ctx.lineTo(s * 43, -101);
			ctx.lineTo(s * 51, -68);
			ctx.closePath();
			ctx.fill();
		}
	} else if (state.headwear === "kanzashi") {
		for (const s of [-1, 1]) {
			const fx = s * 46;
			const fy = -58;
			ctx.fillStyle = hwTheme.accentLight;
			ctx.strokeStyle = INK;
			ctx.lineWidth = 2.2;
			for (let p = 0; p < 5; p++) {
				const a = (p * Math.PI * 2) / 5;
				ctx.beginPath();
				ctx.ellipse(
					fx + Math.cos(a) * 10,
					fy + Math.sin(a) * 10,
					7,
					5,
					a,
					0,
					Math.PI * 2,
				);
				ctx.fill();
				ctx.stroke();
			}
			ctx.fillStyle = "#f2c85b";
			ctx.beginPath();
			ctx.arc(fx, fy, 5, 0, Math.PI * 2);
			ctx.fill();
		}
	} else if (state.headwear === "crown") {
		ctx.fillStyle = "#f0c965";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(-26, -66);
		ctx.lineTo(-30, -96);
		ctx.lineTo(-12, -82);
		ctx.lineTo(0, -104);
		ctx.lineTo(12, -82);
		ctx.lineTo(30, -96);
		ctx.lineTo(26, -66);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#26b391";
		ctx.beginPath();
		ctx.arc(0, -78, 5, 0, Math.PI * 2);
		ctx.fill();
	} else if (state.headwear === "beret") {
		ctx.fillStyle = hwTheme.main;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.beginPath();
		ctx.ellipse(-10, -74, 62, 26, -0.18, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = hwTheme.accent;
		ctx.beginPath();
		ctx.arc(-18, -100, 6, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}

	ctx.restore();
}

export function drawProps(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	if (state.prop === "none") return;
	const hand = rig.rightArm.wrist;
	const t = rig.time;

	if (state.prop === "fan") {
		ctx.save();
		ctx.translate(hand.x, hand.y);
		ctx.rotate(-0.45 + Math.sin(t * 2) * 0.05);
		ctx.fillStyle = "#c92434";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.arc(0, 0, 96, -Math.PI * 0.85, -Math.PI * 0.15);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// Gold ribs & wave
		ctx.strokeStyle = "#e8bc5c";
		ctx.lineWidth = 2.4;
		for (let i = 0; i <= 5; i++) {
			const a = -Math.PI * 0.85 + (i / 5) * (Math.PI * 0.7);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(Math.cos(a) * 90, Math.sin(a) * 90);
			ctx.stroke();
		}
		// Jade tassel
		ctx.strokeStyle = "#36a888";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, 4);
		ctx.lineTo(8, 36);
		ctx.stroke();
		ctx.restore();
		return;
	}

	if (state.prop === "onibi_lantern") {
		ctx.save();
		ctx.translate(hand.x, hand.y);
		ctx.strokeStyle = "#2b2833";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(-22, 48);
		ctx.stroke();

		const lx = -22;
		const ly = 96 + Math.sin(t * 2.5) * 4;
		const lg = ctx.createRadialGradient(lx, ly, 8, lx, ly, 92);
		lg.addColorStop(0, "rgba(77, 226, 190, 0.7)");
		lg.addColorStop(0.5, "rgba(255, 110, 175, 0.35)");
		lg.addColorStop(1, "rgba(77, 226, 190, 0)");
		ctx.fillStyle = lg;
		ctx.beginPath();
		ctx.arc(lx, ly, 92, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#1c2a30";
		ctx.strokeStyle = "#dcb45c";
		ctx.lineWidth = 3.0;
		ctx.beginPath();
		ctx.roundRect(lx - 26, ly - 38, 52, 76, 14);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#69e8c8";
		ctx.beginPath();
		ctx.ellipse(lx, ly, 15, 24, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
		return;
	}

	if (state.prop === "stand_mic") {
		const mx = rig.pose === "idol" ? hand.x - 8 : 262;
		const my = rig.pose === "idol" ? hand.y : 345;
		ctx.save();
		// Stand pole
		ctx.strokeStyle = "#3a3946";
		ctx.lineWidth = 7;
		ctx.beginPath();
		ctx.moveTo(mx, my + 24);
		ctx.lineTo(mx + 14, 1068);
		ctx.stroke();
		// Stand base
		ctx.fillStyle = "#25242e";
		ctx.beginPath();
		ctx.ellipse(mx + 14, 1068, 52, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		// Retro silver/gold mic head
		ctx.fillStyle = "#e2e5ed";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.roundRect(mx - 14, my - 22, 28, 42, 14);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = "#35f0c8";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(mx - 12, my);
		ctx.lineTo(mx + 12, my);
		ctx.stroke();
		ctx.restore();
		return;
	}

	if (state.prop === "guitar") {
		ctx.save();
		ctx.translate(rig.waist.x, rig.waist.y + 20);
		ctx.rotate(-0.48);
		// Electric guitar body
		ctx.fillStyle = "#1d222b";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(-25, -45);
		ctx.bezierCurveTo(-75, -35, -80, 35, -35, 60);
		ctx.quadraticCurveTo(0, 72, 35, 55);
		ctx.bezierCurveTo(75, 35, 65, -35, 25, -45);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// Emerald pick-guard accent
		ctx.strokeStyle = "#26b391";
		ctx.lineWidth = 4;
		ctx.stroke();
		// Neck
		ctx.fillStyle = "#3a2d28";
		ctx.fillRect(-10, -210, 20, 175);
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.5;
		ctx.strokeRect(-10, -210, 20, 175);
		ctx.restore();
		return;
	}

	if (state.prop === "plush_myau") {
		const px = hand.x - 10;
		const py = hand.y + 42 + Math.sin(t * 2.1) * 4;
		ctx.save();
		ctx.translate(px, py);
		// Tan dress
		ctx.fillStyle = "#a6866a";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.roundRect(-22, 12, 44, 40, 8);
		ctx.fill();
		ctx.stroke();
		// Face
		ctx.fillStyle = "#fde2d2";
		ctx.beginPath();
		ctx.arc(0, -10, 24, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		// Squid hood
		ctx.fillStyle = "#d9eff2";
		ctx.beginPath();
		ctx.moveTo(-28, -4);
		ctx.lineTo(0, -48);
		ctx.lineTo(28, -4);
		ctx.quadraticCurveTo(0, -14, -28, -4);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// Eyes
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.arc(-8, -8, 3.2, 0, Math.PI * 2);
		ctx.arc(8, -8, 3.2, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
		return;
	}

	// plush_ghost (おばけロゼちゃん)
	const gx = hand.x - 16;
	const gy = hand.y + 20 + Math.sin(t * 2.6) * 8;
	ctx.save();
	ctx.translate(gx, gy);
	ctx.fillStyle = "#eefcf8";
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.beginPath();
	ctx.arc(0, -6, 30, Math.PI, 0);
	ctx.lineTo(32, 34);
	ctx.quadraticCurveTo(16, 42, 0, 32);
	ctx.quadraticCurveTo(-16, 42, -32, 34);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	drawYinYang(ctx, -28, -22, 10, "#36a888", "#f5f2eb", "#dcb45c");
	drawYinYang(ctx, 28, -22, 10, "#36a888", "#f5f2eb", "#dcb45c", true);
	ctx.fillStyle = "#22b895";
	ctx.beginPath();
	ctx.arc(-10, -4, 4, 0, Math.PI * 2);
	ctx.arc(10, -4, 4, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = rgba(SKIN_BLUSH, 0.7);
	ctx.beginPath();
	ctx.ellipse(-18, 4, 6, 3.5, 0, 0, Math.PI * 2);
	ctx.ellipse(18, 4, 6, 3.5, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
