import type { PoseId } from "../data/items";

export const CANVAS_W = 900;
export const CANVAS_H = 1200;

export const INK = "#221a26";
export const SKIN_BASE = "#fde2d2";
export const SKIN_SHADE = "#efc0ab";
export const SKIN_DEEP = "#dfa18c";
export const SKIN_BLUSH = "#f795a6";

export interface Vec2 {
	x: number;
	y: number;
}

export interface ArmJoints {
	shoulder: Vec2;
	elbow: Vec2;
	wrist: Vec2;
	side: -1 | 1; // -1 = viewer's left (character right), 1 = viewer's right (character left)
}

export interface LegJoints {
	hip: Vec2;
	knee: Vec2;
	ankle: Vec2;
	toe: Vec2;
	side: -1 | 1;
	lifted: boolean;
}

export interface CharacterRig {
	pose: PoseId;
	time: number;
	breathe: number;
	sway: number;
	blink: number; // 0 = open, 1 = closed
	head: Vec2;
	headTilt: number;
	neck: Vec2;
	bust: Vec2;
	waist: Vec2;
	hip: Vec2;
	rightArm: ArmJoints; // viewer's left
	leftArm: ArmJoints; // viewer's right (has 0J mark)
	rightLeg: LegJoints; // viewer's left
	leftLeg: LegJoints; // viewer's right
}

export function computeRig(
	pose: PoseId,
	time: number,
	animate = true,
): CharacterRig {
	const t = animate ? time : 0;
	const breathe = Math.sin(t * 2.1) * 2.5;
	const sway = Math.sin(t * 1.55);

	// Blink every ~3.9 seconds smoothly
	let blink = 0;
	if (animate) {
		const cycle = t % 3.9;
		if (cycle > 3.72) {
			const p = (cycle - 3.72) / 0.18;
			blink = Math.sin(p * Math.PI);
		}
	}

	const hipShift = pose === "cool" ? 8 : pose === "idol" ? -4 : 0;
	const headTilt =
		pose === "idol"
			? -0.055
			: pose === "cool"
				? 0.03
				: Math.sin(t * 1.1) * 0.012;

	const head: Vec2 = {
		x: 450 + (pose === "idol" ? -6 : pose === "cool" ? 6 : 0),
		y: 230 + breathe * 1.15,
	};
	const neck: Vec2 = { x: 450, y: 316 + breathe };
	const bust: Vec2 = { x: 450 + hipShift * 0.25, y: 408 + breathe * 0.9 };
	const waist: Vec2 = { x: 450 + hipShift * 0.6, y: 492 + breathe * 0.55 };
	const hip: Vec2 = { x: 450 + hipShift, y: 566 + breathe * 0.25 };

	let rightArm: ArmJoints;
	let leftArm: ArmJoints;
	let rightLeg: LegJoints;
	let leftLeg: LegJoints;

	if (pose === "official") {
		rightArm = {
			side: -1,
			shoulder: { x: 392, y: 342 + breathe },
			elbow: { x: 322, y: 444 + breathe + sway * 3.5 },
			wrist: { x: 222, y: 396 + breathe + sway * 6.0 },
		};
		leftArm = {
			side: 1,
			shoulder: { x: 508, y: 342 + breathe },
			elbow: { x: 576, y: 452 + breathe - sway * 3.0 },
			wrist: { x: 676, y: 430 + breathe - sway * 5.5 },
		};
		rightLeg = {
			side: -1,
			hip: { x: 416, y: 586 },
			knee: { x: 382, y: 762 },
			ankle: { x: 332, y: 834 },
			toe: { x: 314, y: 874 },
			lifted: true,
		};
		leftLeg = {
			side: 1,
			hip: { x: 484, y: 586 },
			knee: { x: 494, y: 794 },
			ankle: { x: 482, y: 996 },
			toe: { x: 472, y: 1054 },
			lifted: false,
		};
	} else if (pose === "idol") {
		rightArm = {
			side: -1,
			shoulder: { x: 390, y: 342 + breathe },
			elbow: { x: 320, y: 412 + breathe + sway * 2.5 },
			wrist: { x: 288, y: 312 + breathe + sway * 4.5 },
		};
		leftArm = {
			side: 1,
			shoulder: { x: 510, y: 342 + breathe },
			elbow: { x: 582, y: 422 + breathe - sway * 2.5 },
			wrist: { x: 626, y: 492 + breathe - sway * 4.0 },
		};
		rightLeg = {
			side: -1,
			hip: { x: 412, y: 586 },
			knee: { x: 404, y: 792 },
			ankle: { x: 388, y: 998 },
			toe: { x: 374, y: 1052 },
			lifted: false,
		};
		leftLeg = {
			side: 1,
			hip: { x: 486, y: 586 },
			knee: { x: 504, y: 780 },
			ankle: { x: 534, y: 980 },
			toe: { x: 548, y: 1036 },
			lifted: false,
		};
	} else {
		// cool model pose
		rightArm = {
			side: -1,
			shoulder: { x: 394, y: 342 + breathe },
			elbow: { x: 356, y: 468 + breathe + sway * 2 },
			wrist: { x: 374, y: 572 + breathe + sway * 2.5 },
		};
		leftArm = {
			side: 1,
			shoulder: { x: 510, y: 342 + breathe },
			elbow: { x: 556, y: 458 + breathe - sway * 2 },
			wrist: { x: 576, y: 556 + breathe - sway * 2.5 },
		};
		rightLeg = {
			side: -1,
			hip: { x: 424, y: 586 },
			knee: { x: 440, y: 794 },
			ankle: { x: 432, y: 998 },
			toe: { x: 424, y: 1054 },
			lifted: false,
		};
		leftLeg = {
			side: 1,
			hip: { x: 494, y: 586 },
			knee: { x: 498, y: 794 },
			ankle: { x: 492, y: 998 },
			toe: { x: 502, y: 1052 },
			lifted: false,
		};
	}

	return {
		pose,
		time: t,
		breathe,
		sway,
		blink,
		head,
		headTilt,
		neck,
		bust,
		waist,
		hip,
		rightArm,
		leftArm,
		rightLeg,
		leftLeg,
	};
}

export function lerpVec(a: Vec2, b: Vec2, t: number): Vec2 {
	return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function normVec(v: Vec2): Vec2 {
	const len = Math.hypot(v.x, v.y) || 1;
	return { x: v.x / len, y: v.y / len };
}

export function drawPolyOutline(
	ctx: CanvasRenderingContext2D,
	pts: Vec2[],
	fill: string | CanvasGradient,
	stroke = INK,
	lineWidth = 3.2,
	closed = true,
): void {
	if (pts.length === 0) return;
	ctx.beginPath();
	ctx.moveTo(pts[0].x, pts[0].y);
	for (let i = 1; i < pts.length; i++) {
		ctx.lineTo(pts[i].x, pts[i].y);
	}
	if (closed) ctx.closePath();
	ctx.fillStyle = fill;
	ctx.fill();
	if (lineWidth > 0) {
		ctx.strokeStyle = stroke;
		ctx.lineWidth = lineWidth;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.stroke();
	}
}

/**
 * Draw a tapered smooth organic tube through points (like legs, arms, tails).
 */
export function buildTaperedPath(
	spine: Vec2[],
	radii: number[],
): { left: Vec2[]; right: Vec2[] } {
	const left: Vec2[] = [];
	const right: Vec2[] = [];
	for (let i = 0; i < spine.length; i++) {
		const prev = spine[Math.max(0, i - 1)];
		const next = spine[Math.min(spine.length - 1, i + 1)];
		const dir = normVec({ x: next.x - prev.x, y: next.y - prev.y });
		const perp = { x: -dir.y, y: dir.x };
		const r = radii[i];
		left.push({ x: spine[i].x + perp.x * r, y: spine[i].y + perp.y * r });
		right.push({ x: spine[i].x - perp.x * r, y: spine[i].y - perp.y * r });
	}
	return { left, right };
}

export function traceClosedTube(
	ctx: CanvasRenderingContext2D,
	left: Vec2[],
	right: Vec2[],
): void {
	ctx.beginPath();
	ctx.moveTo(left[0].x, left[0].y);
	for (let i = 1; i < left.length; i++) {
		const p0 = left[i - 1];
		const p1 = left[i];
		const mx = (p0.x + p1.x) * 0.5;
		const my = (p0.y + p1.y) * 0.5;
		ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
	}
	const lastL = left[left.length - 1];
	const lastR = right[right.length - 1];
	ctx.lineTo(lastL.x, lastL.y);
	ctx.quadraticCurveTo(
		(lastL.x + lastR.x) * 0.5 + (lastL.y - lastR.y) * 0.15,
		(lastL.y + lastR.y) * 0.5 + (lastR.x - lastL.x) * 0.15,
		lastR.x,
		lastR.y,
	);
	for (let i = right.length - 2; i >= 0; i--) {
		const p0 = right[i + 1];
		const p1 = right[i];
		const mx = (p0.x + p1.x) * 0.5;
		const my = (p0.y + p1.y) * 0.5;
		ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
	}
	ctx.lineTo(right[0].x, right[0].y);
	ctx.closePath();
}

export function drawBow(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	scale: number,
	angle: number,
	color: string,
	shadeColor: string,
): void {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate(angle);
	ctx.scale(scale, scale);

	// Tails
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6 / Math.max(0.5, scale);
	ctx.fillStyle = shadeColor;
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.moveTo(0, 2);
		ctx.quadraticCurveTo(s * 7, 13, s * 11, 22);
		ctx.lineTo(s * 5, 20);
		ctx.quadraticCurveTo(s * 3, 12, 0, 4);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	// Loops
	ctx.fillStyle = color;
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.bezierCurveTo(s * 12, -10, s * 22, -4, s * 18, 5);
		ctx.bezierCurveTo(s * 14, 11, s * 4, 6, 0, 2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	// Knot
	ctx.beginPath();
	ctx.ellipse(0, 1, 4.5, 4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

export function drawYinYang(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	yangColor: string,
	yinColor: string,
	rimColor: string,
	flip = false,
	tilt = 0,
): void {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate(tilt);
	if (flip) ctx.scale(-1, 1);

	// Outer rim shadow + base
	ctx.beginPath();
	ctx.arc(0, 0, r + 2.5, 0, Math.PI * 2);
	ctx.fillStyle = rimColor;
	ctx.fill();
	ctx.lineWidth = 2.6;
	ctx.strokeStyle = INK;
	ctx.stroke();

	ctx.save();
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, Math.PI * 2);
	ctx.clip();

	// Full yin background
	ctx.fillStyle = yinColor;
	ctx.fillRect(-r, -r, r * 2, r * 2);

	// Yang half (S-curve)
	ctx.fillStyle = yangColor;
	ctx.beginPath();
	ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
	ctx.arc(0, r / 2, r / 2, Math.PI / 2, -Math.PI / 2, true);
	ctx.arc(0, -r / 2, r / 2, Math.PI / 2, -Math.PI / 2, false);
	ctx.closePath();
	ctx.fill();

	// Dots
	ctx.fillStyle = yinColor;
	ctx.beginPath();
	ctx.arc(0, -r / 2, r * 0.18, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = yangColor;
	ctx.beginPath();
	ctx.arc(0, r / 2, r * 0.18, 0, Math.PI * 2);
	ctx.fill();

	// Glossy specular highlight
	ctx.fillStyle = "rgba(255,255,255,0.45)";
	ctx.beginPath();
	ctx.ellipse(-r * 0.3, -r * 0.32, r * 0.28, r * 0.14, -0.6, 0, Math.PI * 2);
	ctx.fill();

	ctx.restore();

	ctx.beginPath();
	ctx.arc(0, 0, r, 0, Math.PI * 2);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();
	ctx.restore();
}

export function drawHand(
	ctx: CanvasRenderingContext2D,
	wrist: Vec2,
	angle: number,
	side: -1 | 1,
	gloveColor?: string,
): void {
	ctx.save();
	ctx.translate(wrist.x, wrist.y);
	ctx.rotate(angle);
	ctx.scale(side, 1);

	const fill = gloveColor ?? SKIN_BASE;
	ctx.fillStyle = fill;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.lineJoin = "round";

	// Palm + delicate fingers
	ctx.beginPath();
	ctx.moveTo(-4, -7);
	ctx.quadraticCurveTo(10, -10, 21, -5);
	ctx.quadraticCurveTo(25, -2, 22, 1);
	ctx.lineTo(25, 4);
	ctx.quadraticCurveTo(27, 7, 21, 9);
	ctx.lineTo(19, 12);
	ctx.quadraticCurveTo(15, 15, 10, 12);
	ctx.quadraticCurveTo(3, 14, -4, 7);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Thumb
	ctx.beginPath();
	ctx.moveTo(2, -6);
	ctx.quadraticCurveTo(9, -15, 14, -12);
	ctx.quadraticCurveTo(16, -9, 10, -4);
	ctx.stroke();

	ctx.restore();
}
