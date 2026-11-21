import {
	type ColorThemeId,
	type ColorThemeMeta,
	getHairColor,
	getTheme,
	type HairColorId,
	type HairColorMeta,
} from "../data/items";

export function hexToRgb(hex: string): [number, number, number] {
	const clean = hex.replace("#", "");
	const full =
		clean.length === 3
			? clean
					.split("")
					.map((c) => c + c)
					.join("")
			: clean;
	const n = Number.parseInt(full, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
	const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
	return (
		"#" +
		[clamp(r), clamp(g), clamp(b)]
			.map((x) => x.toString(16).padStart(2, "0"))
			.join("")
	);
}

export function rgba(hex: string, alpha: number): string {
	const [r, g, b] = hexToRgb(hex);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mixHex(a: string, b: string, t: number): string {
	const [r1, g1, b1] = hexToRgb(a);
	const [r2, g2, b2] = hexToRgb(b);
	return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return [0, 0, l];
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h = 0;
	if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
	else if (max === gn) h = (bn - rn) / d + 2;
	else h = (rn - gn) / d + 4;
	return [h / 6, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const hue2rgb = (p: number, q: number, tRaw: number) => {
		let t = tRaw;
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	if (s === 0) {
		const v = Math.round(l * 255);
		return [v, v, v];
	}
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return [
		Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
		Math.round(hue2rgb(p, q, h) * 255),
		Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
	];
}

export function shiftHueHex(hex: string, deg: number): string {
	if (deg === 0) return hex;
	const [r, g, b] = hexToRgb(hex);
	const [h, s, l] = rgbToHsl(r, g, b);
	// Very low-saturation blacks/whites only get a subtle tint if hue shifted strongly
	const adjH = (((h + deg / 360) % 1) + 1) % 1;
	const adjS = s < 0.08 ? s : s;
	const [nr, ng, nb] = hslToRgb(adjH, adjS, l);
	return rgbToHex(nr, ng, nb);
}

export function resolveThemeColors(
	themeId: ColorThemeId,
	hueShift: number,
): ColorThemeMeta {
	const base = getTheme(themeId);
	if (hueShift === 0) return base;
	return {
		...base,
		main: shiftHueHex(base.main, hueShift),
		mainDark: shiftHueHex(base.mainDark, hueShift),
		mainLight: shiftHueHex(base.mainLight, hueShift),
		accent: shiftHueHex(base.accent, hueShift),
		accentDark: shiftHueHex(base.accentDark, hueShift),
		accentLight: shiftHueHex(base.accentLight, hueShift),
		trim: shiftHueHex(base.trim, hueShift),
		glow: shiftHueHex(base.glow, hueShift),
		glowSoft: shiftHueHex(base.glowSoft, hueShift),
	};
}

export function resolveHairColors(
	colorId: HairColorId,
	mainHue: number,
	innerHue: number,
): HairColorMeta {
	const base = getHairColor(colorId);
	return {
		...base,
		main: shiftHueHex(base.main, mainHue),
		mainShade: shiftHueHex(base.mainShade, mainHue),
		mainHighlight: shiftHueHex(base.mainHighlight, mainHue),
		inner: shiftHueHex(base.inner, innerHue),
		innerShade: shiftHueHex(base.innerShade, innerHue),
		innerLight: shiftHueHex(base.innerLight, innerHue),
		eye: shiftHueHex(base.eye, innerHue),
	};
}
