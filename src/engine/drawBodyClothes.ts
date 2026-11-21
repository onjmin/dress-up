import type { ColorThemeMeta, DressUpState } from "../data/items";
import { mixHex, resolveThemeColors, rgba } from "./color";
import {
	type ArmJoints,
	buildTaperedPath,
	type CharacterRig,
	drawBow,
	drawHand,
	drawPolyOutline,
	INK,
	type LegJoints,
	lerpVec,
	normVec,
	SKIN_BASE,
	SKIN_DEEP,
	SKIN_SHADE,
	traceClosedTube,
	type Vec2,
} from "./rig";

function drawLegSkin(ctx: CanvasRenderingContext2D, leg: LegJoints): void {
	const midThigh = lerpVec(leg.hip, leg.knee, 0.48);
	const calf = lerpVec(leg.knee, leg.ankle, 0.36);
	const spine = [leg.hip, midThigh, leg.knee, calf, leg.ankle, leg.toe];
	const radii = [32, 28, 19, 21, 13, 12];
	const { left, right } = buildTaperedPath(spine, radii);

	const g = ctx.createLinearGradient(
		leg.hip.x - 24,
		leg.hip.y,
		leg.hip.x + 28,
		leg.ankle.y,
	);
	g.addColorStop(0, SKIN_BASE);
	g.addColorStop(0.65, SKIN_BASE);
	g.addColorStop(1, SKIN_SHADE);

	traceClosedTube(ctx, left, right);
	ctx.fillStyle = g;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.stroke();

	// Subtle knee & inner thigh shading
	ctx.fillStyle = rgba(SKIN_SHADE, 0.45);
	ctx.beginPath();
	ctx.ellipse(leg.knee.x, leg.knee.y - 2, 10, 14, 0, 0, Math.PI * 2);
	ctx.fill();
}

function drawArmSkin(
	ctx: CanvasRenderingContext2D,
	arm: ArmJoints,
	ojMark: boolean,
): void {
	const midUpper = lerpVec(arm.shoulder, arm.elbow, 0.5);
	const midFore = lerpVec(arm.elbow, arm.wrist, 0.5);
	const spine = [arm.shoulder, midUpper, arm.elbow, midFore, arm.wrist];
	const radii = [16, 14, 12, 11, 8.5];
	const { left, right } = buildTaperedPath(spine, radii);

	traceClosedTube(ctx, left, right);
	ctx.fillStyle = SKIN_BASE;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.0;
	ctx.stroke();

	// Left shoulder (viewer's right, side === 1) "0J" mark
	if (ojMark && arm.side === 1) {
		const markPos = lerpVec(arm.shoulder, arm.elbow, 0.2);
		const ang = Math.atan2(
			arm.elbow.y - arm.shoulder.y,
			arm.elbow.x - arm.shoulder.x,
		);
		ctx.save();
		ctx.translate(markPos.x + 5, markPos.y - 3);
		ctx.rotate(ang * 0.25);
		ctx.fillStyle = "#d92638";
		ctx.font = "900 17px 'M PLUS Rounded 1c', sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("0J", 0, 0);
		ctx.restore();
	}
}

export function drawBodyAndLimbs(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	// Legs (draw lifted leg first if overlapping, or standard back-to-front)
	drawLegSkin(ctx, rig.rightLeg);
	drawLegSkin(ctx, rig.leftLeg);

	// Torso + Neck + Bust
	const { neck, bust, waist, hip, rightArm, leftArm } = rig;
	const torsoGrad = ctx.createLinearGradient(
		bust.x - 60,
		bust.y,
		bust.x + 60,
		hip.y,
	);
	torsoGrad.addColorStop(0, SKIN_BASE);
	torsoGrad.addColorStop(0.75, SKIN_BASE);
	torsoGrad.addColorStop(1, SKIN_SHADE);

	// Neck
	ctx.fillStyle = SKIN_BASE;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(neck.x - 19, neck.y - 42);
	ctx.lineTo(neck.x - 21, neck.y + 8);
	ctx.lineTo(neck.x + 21, neck.y + 8);
	ctx.lineTo(neck.x + 19, neck.y - 42);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	// Chin shadow on neck
	ctx.fillStyle = rgba(SKIN_SHADE, 0.72);
	ctx.beginPath();
	ctx.ellipse(neck.x, neck.y - 24, 18, 12, 0, 0, Math.PI * 2);
	ctx.fill();

	// Main Torso silhouette
	ctx.beginPath();
	ctx.moveTo(neck.x - 21, neck.y - 4);
	ctx.quadraticCurveTo(
		rightArm.shoulder.x + 8,
		rightArm.shoulder.y - 12,
		rightArm.shoulder.x - 8,
		rightArm.shoulder.y + 8,
	);
	ctx.quadraticCurveTo(bust.x - 62, bust.y + 10, waist.x - 42, waist.y);
	ctx.quadraticCurveTo(hip.x - 64, hip.y - 12, hip.x - 62, hip.y + 26);
	ctx.quadraticCurveTo(hip.x, hip.y + 52, hip.x + 62, hip.y + 26);
	ctx.quadraticCurveTo(hip.x + 64, hip.y - 12, waist.x + 42, waist.y);
	ctx.quadraticCurveTo(
		bust.x + 62,
		bust.y + 10,
		leftArm.shoulder.x + 8,
		leftArm.shoulder.y + 8,
	);
	ctx.quadraticCurveTo(
		leftArm.shoulder.x - 8,
		leftArm.shoulder.y - 12,
		neck.x + 21,
		neck.y - 4,
	);
	ctx.closePath();
	ctx.fillStyle = torsoGrad;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.stroke();

	// Collarbones
	ctx.strokeStyle = rgba(SKIN_DEEP, 0.75);
	ctx.lineWidth = 2.2;
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.moveTo(neck.x + s * 10, neck.y + 18);
		ctx.quadraticCurveTo(
			neck.x + s * 36,
			neck.y + 23,
			neck.x + s * 56,
			neck.y + 13,
		);
		ctx.stroke();
	}

	// Bust shading & cleavage
	ctx.fillStyle = rgba(SKIN_SHADE, 0.55);
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.ellipse(bust.x + s * 28, bust.y + 18, 28, 22, s * 0.15, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.strokeStyle = rgba(SKIN_DEEP, 0.78);
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(bust.x, bust.y - 12);
	ctx.quadraticCurveTo(bust.x + 2, bust.y + 6, bust.x, bust.y + 18);
	ctx.stroke();

	// Waist & Navel (へそ出し)
	ctx.fillStyle = rgba(SKIN_SHADE, 0.35);
	ctx.beginPath();
	ctx.ellipse(waist.x, waist.y + 18, 18, 34, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = rgba(SKIN_DEEP, 0.85);
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(waist.x, waist.y + 26);
	ctx.lineTo(waist.x, waist.y + 33);
	ctx.stroke();

	// Arms skin (drawn cleanly before detached sleeves/tops)
	drawArmSkin(ctx, rig.rightArm, state.ojMark);
	drawArmSkin(ctx, rig.leftArm, state.ojMark);
}

export function drawLegwear(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const theme = resolveThemeColors(state.legwearTheme, state.legwearHue);
	const legs = [rig.rightLeg, rig.leftLeg];

	if (state.legwear === "barefoot") {
		// Delicate ghost-fire wisps swirling around ankles when official bottoms or barefoot
		for (let idx = 0; idx < legs.length; idx++) {
			const leg = legs[idx];
			const wispX = leg.ankle.x + leg.side * 12;
			const wispY = leg.ankle.y + 10;
			const pulse = Math.sin(rig.time * 3.1 + idx * 1.9) * 5;
			const g = ctx.createRadialGradient(
				wispX,
				wispY + pulse,
				2,
				wispX,
				wispY + pulse,
				32,
			);
			g.addColorStop(0, "rgba(255,255,255,0.65)");
			g.addColorStop(0.4, rgba(theme.glow, 0.42));
			g.addColorStop(1, rgba(theme.glow, 0));
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(wispX, wispY + pulse, 32, 0, Math.PI * 2);
			ctx.fill();
		}
		return;
	}

	for (const leg of legs) {
		const isStocking =
			state.legwear === "cyber_kneehigh" ||
			state.legwear === "garter_heels" ||
			state.legwear === "kungfu_tights" ||
			state.legwear === "striped_leggings";

		if (isStocking) {
			const topFrac =
				state.legwear === "kungfu_tights"
					? 0.02
					: state.legwear === "striped_leggings"
						? 0.56
						: 0.34;
			const start = lerpVec(leg.hip, leg.knee, topFrac);
			const mid = lerpVec(leg.hip, leg.knee, Math.max(topFrac + 0.15, 0.65));
			const calf = lerpVec(leg.knee, leg.ankle, 0.36);
			const spine = [start, mid, leg.knee, calf, leg.ankle, leg.toe];
			const radii =
				state.legwear === "kungfu_tights"
					? [31, 27, 19.5, 21.5, 13.5, 12.5]
					: [25, 22, 19.5, 21.5, 13.5, 12.5];
			const { left, right } = buildTaperedPath(spine, radii);
			traceClosedTube(ctx, left, right);
			if (state.legwear === "garter_heels") {
				ctx.fillStyle = rgba(theme.main, 0.85);
			} else if (state.legwear === "kungfu_tights") {
				ctx.fillStyle = rgba(theme.mainDark, 0.78);
			} else {
				ctx.fillStyle = theme.main;
			}
			ctx.fill();
			ctx.strokeStyle = INK;
			ctx.lineWidth = 2.6;
			ctx.stroke();

			// Top trim / stripes
			const dir = normVec({ x: leg.knee.x - start.x, y: leg.knee.y - start.y });
			const perp = { x: -dir.y, y: dir.x };
			const topR = radii[0];
			ctx.strokeStyle =
				state.legwear === "garter_heels" ? theme.accent : theme.trim;
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(start.x - perp.x * topR, start.y - perp.y * topR);
			ctx.lineTo(start.x + perp.x * topR, start.y + perp.y * topR);
			ctx.stroke();

			if (
				state.legwear === "striped_leggings" ||
				state.legwear === "cyber_kneehigh"
			) {
				const s2 = lerpVec(start, leg.knee, 0.18);
				ctx.strokeStyle = theme.accentLight;
				ctx.lineWidth = 3.5;
				ctx.beginPath();
				ctx.moveTo(s2.x - perp.x * (topR - 2), s2.y - perp.y * (topR - 2));
				ctx.lineTo(s2.x + perp.x * (topR - 2), s2.y + perp.y * (topR - 2));
				ctx.stroke();
			}
		}

		// Footwear
		const cuffPt =
			state.legwear === "china_boots"
				? lerpVec(leg.knee, leg.ankle, 0.45)
				: state.legwear === "cyber_kneehigh"
					? lerpVec(leg.knee, leg.ankle, 0.65)
					: lerpVec(leg.knee, leg.ankle, 0.86);
		const bootSpine = [cuffPt, leg.ankle, leg.toe];
		const bootRadii =
			state.legwear === "china_boots"
				? [21, 16, 15]
				: state.legwear === "cyber_kneehigh"
					? [19, 17, 17]
					: [15, 14.5, 13.5];
		const { left, right } = buildTaperedPath(bootSpine, bootRadii);
		traceClosedTube(ctx, left, right);
		ctx.fillStyle =
			state.legwear === "garter_heels" ? theme.accentDark : theme.mainDark;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.stroke();

		// Boot cuff / sole accent
		const dir = normVec({
			x: leg.ankle.x - cuffPt.x,
			y: leg.ankle.y - cuffPt.y,
		});
		const perp = { x: -dir.y, y: dir.x };
		if (state.legwear === "china_boots") {
			ctx.strokeStyle = theme.accent;
			ctx.lineWidth = 6;
			ctx.beginPath();
			ctx.moveTo(cuffPt.x - perp.x * 21, cuffPt.y - perp.y * 21);
			ctx.lineTo(cuffPt.x + perp.x * 21, cuffPt.y + perp.y * 21);
			ctx.stroke();
			ctx.fillStyle = theme.trim;
			ctx.beginPath();
			ctx.arc(cuffPt.x + leg.side * 12, cuffPt.y + 4, 4.5, 0, Math.PI * 2);
			ctx.fill();
		} else if (state.legwear === "cyber_kneehigh") {
			ctx.strokeStyle = theme.accentLight;
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(leg.toe.x - 14, leg.toe.y + 8);
			ctx.lineTo(leg.toe.x + 14, leg.toe.y + 8);
			ctx.stroke();
		} else if (
			state.legwear === "kungfu_tights" ||
			state.legwear === "striped_leggings"
		) {
			ctx.strokeStyle = "#f2f0f5";
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.moveTo(leg.toe.x - 12, leg.toe.y + 6);
			ctx.lineTo(leg.toe.x + 12, leg.toe.y + 6);
			ctx.stroke();
		}
	}
}

function drawChineseMeander(
	ctx: CanvasRenderingContext2D,
	pts: Vec2[],
	color: string,
): void {
	if (pts.length < 2) return;
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = 2.8;
	ctx.lineCap = "square";
	ctx.lineJoin = "miter";
	for (let i = 0; i < pts.length - 1; i++) {
		const a = pts[i];
		const b = pts[i + 1];
		const d = { x: b.x - a.x, y: b.y - a.y };
		const len = Math.hypot(d.x, d.y);
		if (len < 12) continue;
		const u = { x: d.x / len, y: d.y / len };
		const n = { x: -u.y, y: u.x };
		const p = (t: number, h: number) => ({
			x: a.x + u.x * (len * t) + n.x * h,
			y: a.y + u.y * (len * t) + n.y * h,
		});
		const seq = [
			p(0.05, -7),
			p(0.05, 7),
			p(0.55, 7),
			p(0.55, -7),
			p(0.28, -7),
			p(0.28, -1),
			p(0.42, -1),
			p(0.42, 3),
			p(0.18, 3),
			p(0.18, -3),
			p(0.95, -3),
		];
		ctx.beginPath();
		ctx.moveTo(seq[0].x, seq[0].y);
		for (let j = 1; j < seq.length; j++) {
			ctx.lineTo(seq[j].x, seq[j].y);
		}
		ctx.stroke();
	}
	ctx.restore();
}

function drawBeltAndShorts(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	theme: ColorThemeMeta,
	drawBelt: boolean,
): void {
	const { hip } = rig;
	// Inner dark low-rise panties / shorts
	ctx.beginPath();
	ctx.moveTo(hip.x - 62, hip.y - 6);
	ctx.lineTo(hip.x + 62, hip.y - 6);
	ctx.quadraticCurveTo(hip.x + 60, hip.y + 34, hip.x + 12, hip.y + 62);
	ctx.lineTo(hip.x - 12, hip.y + 62);
	ctx.quadraticCurveTo(hip.x - 60, hip.y + 34, hip.x - 62, hip.y - 6);
	ctx.closePath();
	ctx.fillStyle = theme.mainDark;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.0;
	ctx.stroke();

	if (!drawBelt) return;

	// Black leather belt
	ctx.beginPath();
	ctx.moveTo(hip.x - 63, hip.y - 12);
	ctx.quadraticCurveTo(hip.x, hip.y - 2, hip.x + 63, hip.y - 12);
	ctx.lineTo(hip.x + 64, hip.y + 11);
	ctx.quadraticCurveTo(hip.x, hip.y + 21, hip.x - 64, hip.y + 11);
	ctx.closePath();
	ctx.fillStyle = theme.main;
	ctx.fill();
	ctx.stroke();

	// 4 vertical red belt loops
	ctx.fillStyle = theme.accent;
	for (const lx of [-48, -31, 31, 48]) {
		ctx.beginPath();
		ctx.roundRect(hip.x + lx - 4, hip.y - 10, 8, 24, 2);
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2;
		ctx.stroke();
	}

	// Gold square buckle with cloud swirl motif
	ctx.fillStyle = "#b89f6d";
	ctx.strokeStyle = theme.trim;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.roundRect(hip.x - 19, hip.y - 9, 38, 28, 3);
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.strokeRect(hip.x - 21, hip.y - 11, 42, 32);

	// Cloud motif inside buckle
	ctx.strokeStyle = "#f7eed6";
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(hip.x - 4, hip.y + 5, 6, Math.PI * 0.7, Math.PI * 2.2);
	ctx.arc(hip.x + 5, hip.y + 4, 5, Math.PI * 1.1, Math.PI * 0.4);
	ctx.stroke();
}

function drawFlameHakamaLeg(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	leg: LegJoints,
	theme: ColorThemeMeta,
): void {
	const s = leg.side;
	const t = rig.time;
	const wave = Math.sin(t * 2.4 + s) * 8;
	const wave2 = Math.cos(t * 3.1 - s) * 10;

	const hipOuter = { x: rig.hip.x + s * 62, y: rig.hip.y - 2 };
	const kneeOuter = { x: leg.knee.x + s * 56, y: leg.knee.y - 10 };
	const ankleOuter = {
		x: leg.ankle.x + s * (leg.lifted ? 86 : 74) + wave,
		y: leg.ankle.y + (leg.lifted ? 16 : 62),
	};
	const ankleInner = {
		x: leg.ankle.x - s * (leg.lifted ? 54 : 56) + wave * 0.7,
		y: leg.ankle.y + (leg.lifted ? 32 : 76),
	};
	const kneeInner = { x: leg.knee.x - s * 10, y: leg.knee.y + 24 };
	const slitPeak = lerpVec(leg.hip, leg.knee, 0.78);
	const hipSideTop = { x: rig.hip.x + s * 46, y: rig.hip.y + 10 };

	// Billowing hakama gradient (red -> glowing pink ghost-fire -> pale pink)
	const grad = ctx.createLinearGradient(
		leg.knee.x,
		leg.knee.y - 20,
		(ankleOuter.x + ankleInner.x) * 0.5,
		Math.max(ankleOuter.y, ankleInner.y) + 30,
	);
	grad.addColorStop(0, theme.accent);
	grad.addColorStop(0.62, theme.accent);
	grad.addColorStop(0.84, theme.glow);
	grad.addColorStop(1, theme.glowSoft);

	ctx.beginPath();
	ctx.moveTo(hipOuter.x, hipOuter.y);
	ctx.quadraticCurveTo(
		kneeOuter.x + s * 22,
		(hipOuter.y + kneeOuter.y) * 0.5,
		ankleOuter.x,
		ankleOuter.y,
	);
	// Flame-licked billowing bottom edge
	const hemMid1 = lerpVec(ankleOuter, ankleInner, 0.25);
	const hemMid2 = lerpVec(ankleOuter, ankleInner, 0.55);
	const hemMid3 = lerpVec(ankleOuter, ankleInner, 0.8);
	ctx.quadraticCurveTo(
		hemMid1.x + s * 18,
		hemMid1.y + 24 + wave2 * 0.5,
		hemMid2.x + wave * 0.5,
		hemMid2.y + 18,
	);
	ctx.quadraticCurveTo(
		hemMid3.x - s * 12,
		hemMid3.y + 8 - wave2 * 0.5,
		ankleInner.x,
		ankleInner.y,
	);
	// Up the inner closed part below knee
	ctx.quadraticCurveTo(
		kneeInner.x - s * 20,
		(ankleInner.y + kneeInner.y) * 0.5,
		slitPeak.x - s * 4,
		slitPeak.y + 22,
	);
	// Teardrop thigh slit opening up to hip
	ctx.quadraticCurveTo(
		leg.hip.x - s * 18,
		(slitPeak.y + hipSideTop.y) * 0.52,
		hipSideTop.x,
		hipSideTop.y,
	);
	ctx.closePath();

	ctx.fillStyle = grad;
	ctx.fill();

	// Soft cloth fold shadows
	ctx.save();
	ctx.clip();
	ctx.fillStyle = rgba(theme.accentDark, 0.32);
	ctx.beginPath();
	ctx.moveTo(kneeOuter.x - s * 12, kneeOuter.y + 10);
	ctx.quadraticCurveTo(
		ankleOuter.x - s * 36,
		ankleOuter.y - 30,
		ankleInner.x + s * 20,
		ankleInner.y - 20,
	);
	ctx.lineTo(ankleInner.x + s * 44, ankleInner.y + 10);
	ctx.closePath();
	ctx.fill();

	// White Chinese meander key-fret border above the flame fade
	const mA = lerpVec(kneeOuter, ankleOuter, 0.65);
	const mB = lerpVec(kneeInner, ankleInner, 0.65);
	const mM = lerpVec(mA, mB, 0.5);
	mM.y += 14;
	drawChineseMeander(ctx, [mA, mM, mB], "rgba(255, 245, 248, 0.85)");
	ctx.restore();

	// Outer ink + slit piping
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(hipOuter.x, hipOuter.y);
	ctx.quadraticCurveTo(
		kneeOuter.x + s * 22,
		(hipOuter.y + kneeOuter.y) * 0.5,
		ankleOuter.x,
		ankleOuter.y,
	);
	ctx.stroke();

	// Dark inner piping along teardrop thigh slit
	ctx.strokeStyle = theme.mainDark;
	ctx.lineWidth = 6.5;
	ctx.beginPath();
	ctx.moveTo(hipSideTop.x, hipSideTop.y);
	ctx.quadraticCurveTo(
		leg.hip.x - s * 18,
		(slitPeak.y + hipSideTop.y) * 0.52,
		slitPeak.x - s * 4,
		slitPeak.y + 22,
	);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke();

	// Rising pink ghost-fire tongues from outer hem
	for (let f = 0; f < 3; f++) {
		const fx = ankleOuter.x - s * (8 + f * 24) + Math.sin(t * 3.5 + f + s) * 8;
		const fy = ankleOuter.y - 22 - f * 18;
		const tipY = fy - 42 - Math.sin(t * 4.2 + f * 2) * 14;
		ctx.fillStyle = rgba(f % 2 === 0 ? theme.glow : theme.glowSoft, 0.72);
		ctx.beginPath();
		ctx.moveTo(fx - 12, fy + 16);
		ctx.quadraticCurveTo(fx + s * 22, fy - 14, fx + s * 14, tipY);
		ctx.quadraticCurveTo(fx - s * 6, fy - 10, fx + 10, fy + 16);
		ctx.closePath();
		ctx.fill();
	}
}

export function drawBottoms(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const theme = resolveThemeColors(state.bottomsTheme, state.bottomsHue);
	const { hip } = rig;

	if (state.bottoms === "flame_hakama") {
		drawBeltAndShorts(ctx, rig, theme, true);
		drawFlameHakamaLeg(ctx, rig, rig.rightLeg, theme);
		drawFlameHakamaLeg(ctx, rig, rig.leftLeg, theme);
		return;
	}

	if (state.bottoms === "china_miniskirt") {
		drawBeltAndShorts(ctx, rig, theme, false);
		const sway = rig.sway * 5;
		ctx.beginPath();
		ctx.moveTo(hip.x - 58, hip.y - 16);
		ctx.quadraticCurveTo(hip.x, hip.y - 4, hip.x + 58, hip.y - 16);
		ctx.quadraticCurveTo(
			hip.x + 92,
			hip.y + 62,
			hip.x + 98 + sway,
			hip.y + 116,
		);
		ctx.lineTo(hip.x + 68 + sway, hip.y + 124);
		ctx.lineTo(hip.x + 56, hip.y + 66); // side slit
		ctx.lineTo(hip.x + 48, hip.y + 128);
		ctx.quadraticCurveTo(hip.x, hip.y + 138, hip.x - 48, hip.y + 128);
		ctx.lineTo(hip.x - 56, hip.y + 66);
		ctx.lineTo(hip.x - 68 + sway, hip.y + 124);
		ctx.lineTo(hip.x - 98 + sway, hip.y + 116);
		ctx.quadraticCurveTo(hip.x - 92, hip.y + 62, hip.x - 58, hip.y - 16);
		ctx.closePath();
		ctx.fillStyle = theme.main;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.stroke();

		// Red piping hem & gold tassels
		ctx.strokeStyle = theme.accent;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(hip.x - 48, hip.y + 122);
		ctx.quadraticCurveTo(hip.x, hip.y + 132, hip.x + 48, hip.y + 122);
		ctx.stroke();
		drawBow(
			ctx,
			hip.x - 54,
			hip.y + 52,
			0.75,
			-0.2,
			theme.accent,
			theme.accentDark,
		);
		drawBow(
			ctx,
			hip.x + 54,
			hip.y + 52,
			0.75,
			0.2,
			theme.accent,
			theme.accentDark,
		);
		return;
	}

	if (state.bottoms === "cyber_shorts") {
		drawBeltAndShorts(ctx, rig, theme, false);
		ctx.beginPath();
		ctx.moveTo(hip.x - 60, hip.y - 14);
		ctx.lineTo(hip.x + 60, hip.y - 14);
		ctx.lineTo(hip.x + 76, hip.y + 82);
		ctx.lineTo(hip.x + 12, hip.y + 88);
		ctx.lineTo(hip.x, hip.y + 58);
		ctx.lineTo(hip.x - 12, hip.y + 88);
		ctx.lineTo(hip.x - 76, hip.y + 82);
		ctx.closePath();
		ctx.fillStyle = theme.main;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.stroke();

		// Neon straps & trim
		ctx.strokeStyle = theme.accentLight;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(hip.x - 72, hip.y + 74);
		ctx.lineTo(hip.x - 14, hip.y + 80);
		ctx.moveTo(hip.x + 72, hip.y + 74);
		ctx.lineTo(hip.x + 14, hip.y + 80);
		ctx.stroke();

		// Hanging strap on left thigh
		ctx.strokeStyle = theme.accent;
		ctx.lineWidth = 7;
		ctx.beginPath();
		ctx.moveTo(hip.x - 62, hip.y + 4);
		ctx.quadraticCurveTo(
			hip.x - 86,
			hip.y + 85,
			hip.x - 72 + rig.sway * 6,
			hip.y + 150,
		);
		ctx.stroke();
		return;
	}

	if (state.bottoms === "miko_hakama") {
		const sway = rig.sway * 6;
		ctx.beginPath();
		ctx.moveTo(hip.x - 56, hip.y - 24);
		ctx.lineTo(hip.x + 56, hip.y - 24);
		ctx.quadraticCurveTo(
			hip.x + 118,
			hip.y + 210,
			hip.x + 126 + sway,
			hip.y + 420,
		);
		ctx.quadraticCurveTo(hip.x + 48, hip.y + 436, hip.x + 12, hip.y + 422);
		ctx.lineTo(hip.x, hip.y + 180);
		ctx.lineTo(hip.x - 12, hip.y + 422);
		ctx.quadraticCurveTo(
			hip.x - 48,
			hip.y + 436,
			hip.x - 126 + sway,
			hip.y + 420,
		);
		ctx.quadraticCurveTo(hip.x - 118, hip.y + 210, hip.x - 56, hip.y - 24);
		ctx.closePath();
		ctx.fillStyle = theme.accent;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.stroke();

		// Pleats
		ctx.strokeStyle = theme.accentDark;
		ctx.lineWidth = 2.4;
		for (const px of [-36, -18, 18, 36]) {
			ctx.beginPath();
			ctx.moveTo(hip.x + px, hip.y + 8);
			ctx.lineTo(hip.x + px * 2.4 + sway * 0.6, hip.y + 410);
			ctx.stroke();
		}

		// White obi sash
		ctx.fillStyle = "#f7f4ef";
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.roundRect(hip.x - 58, hip.y - 28, 116, 30, 5);
		ctx.fill();
		ctx.stroke();
		drawBow(ctx, hip.x - 28, hip.y - 6, 0.9, 0.1, "#f7f4ef", "#dcd5c8");
		return;
	}

	if (state.bottoms === "gothic_skirt") {
		const sway = rig.sway * 7;
		// Back long fishtail layer
		ctx.beginPath();
		ctx.moveTo(hip.x - 58, hip.y - 12);
		ctx.lineTo(hip.x + 58, hip.y - 12);
		ctx.quadraticCurveTo(
			hip.x + 135,
			hip.y + 190,
			hip.x + 148 + sway,
			hip.y + 390,
		);
		ctx.quadraticCurveTo(hip.x, hip.y + 430, hip.x - 148 + sway, hip.y + 390);
		ctx.quadraticCurveTo(hip.x - 135, hip.y + 190, hip.x - 58, hip.y - 12);
		ctx.closePath();
		ctx.fillStyle = theme.mainDark;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.stroke();

		// Front shorter asymmetrical frill tier
		ctx.beginPath();
		ctx.moveTo(hip.x - 58, hip.y - 14);
		ctx.lineTo(hip.x + 58, hip.y - 14);
		ctx.quadraticCurveTo(
			hip.x + 98,
			hip.y + 72,
			hip.x + 105 + sway * 0.5,
			hip.y + 136,
		);
		ctx.quadraticCurveTo(
			hip.x,
			hip.y + 92,
			hip.x - 105 + sway * 0.5,
			hip.y + 136,
		);
		ctx.quadraticCurveTo(hip.x - 98, hip.y + 72, hip.x - 58, hip.y - 14);
		ctx.closePath();
		ctx.fillStyle = theme.main;
		ctx.fill();
		ctx.stroke();

		// Lace trim
		ctx.strokeStyle = theme.trim;
		ctx.lineWidth = 4;
		ctx.setLineDash([8, 6]);
		ctx.beginPath();
		ctx.moveTo(hip.x - 102 + sway * 0.5, hip.y + 132);
		ctx.quadraticCurveTo(
			hip.x,
			hip.y + 88,
			hip.x + 102 + sway * 0.5,
			hip.y + 132,
		);
		ctx.stroke();
		ctx.setLineDash([]);
		drawBow(ctx, hip.x, hip.y - 2, 1.05, 0, theme.accent, theme.accentDark);
		return;
	}

	// tech_cargo
	for (const leg of [rig.rightLeg, rig.leftLeg]) {
		const calf = lerpVec(leg.knee, leg.ankle, 0.55);
		const spine = [leg.hip, leg.knee, calf, leg.ankle];
		const radii = [36, 38, 40, 22];
		const { left, right } = buildTaperedPath(spine, radii);
		traceClosedTube(ctx, left, right);
		ctx.fillStyle = theme.main;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.stroke();

		// Cargo pocket
		const pkt = lerpVec(leg.hip, leg.knee, 0.55);
		ctx.fillStyle = theme.mainDark;
		ctx.beginPath();
		ctx.roundRect(pkt.x + leg.side * 10 - 14, pkt.y - 16, 28, 36, 4);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = theme.accent;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(pkt.x + leg.side * 10 - 12, pkt.y - 8);
		ctx.lineTo(pkt.x + leg.side * 10 + 12, pkt.y - 8);
		ctx.stroke();
	}
	drawBeltAndShorts(ctx, rig, theme, true);
}

export function drawTops(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const theme = resolveThemeColors(state.topsTheme, state.topsHue);
	const { neck, bust, waist, rightArm, leftArm } = rig;

	if (
		state.tops === "china_keyhole" ||
		state.tops === "china_vest" ||
		state.tops === "red_china_dress"
	) {
		const isKeyhole = state.tops === "china_keyhole";
		const isRedDress = state.tops === "red_china_dress";
		const bodyFill = isRedDress ? theme.accent : theme.main;
		const bodyShade = isRedDress ? theme.accentDark : theme.mainDark;
		const pipeFill = isRedDress ? theme.trim : theme.accent;

		// Cropped sleeveless halter silhouette
		const hemY = isRedDress ? waist.y + 42 : waist.y - 12;
		ctx.beginPath();
		ctx.moveTo(neck.x - 24, neck.y - 14);
		ctx.quadraticCurveTo(
			rightArm.shoulder.x + 26,
			bust.y - 36,
			bust.x - 56,
			bust.y + 10,
		);
		ctx.quadraticCurveTo(bust.x - 54, bust.y + 38, waist.x - 42, hemY);
		ctx.quadraticCurveTo(waist.x, hemY + 12, waist.x + 42, hemY);
		ctx.quadraticCurveTo(bust.x + 54, bust.y + 38, bust.x + 56, bust.y + 10);
		ctx.quadraticCurveTo(
			leftArm.shoulder.x - 26,
			bust.y - 36,
			neck.x + 24,
			neck.y - 14,
		);
		ctx.closePath();

		const g = ctx.createLinearGradient(bust.x - 55, neck.y, bust.x + 55, hemY);
		g.addColorStop(0, mixHex(bodyFill, "#ffffff", 0.08));
		g.addColorStop(0.55, bodyFill);
		g.addColorStop(1, bodyShade);
		ctx.fillStyle = g;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.stroke();

		// Underbust shading line
		ctx.strokeStyle = rgba(bodyShade, 0.7);
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(bust.x - 44, bust.y + 28);
		ctx.quadraticCurveTo(bust.x, bust.y + 40, bust.x + 44, bust.y + 28);
		ctx.stroke();

		// Horizontal keyhole chest cutout on official china_keyhole
		if (isKeyhole) {
			const ky = bust.y - 24;
			ctx.save();
			ctx.beginPath();
			ctx.ellipse(bust.x, ky, 42, 13.5, 0, 0, Math.PI * 2);
			ctx.fillStyle = SKIN_BASE;
			ctx.fill();
			// Cleavage & upper shadow inside keyhole
			ctx.clip();
			ctx.fillStyle = rgba(SKIN_SHADE, 0.7);
			ctx.fillRect(bust.x - 46, ky - 16, 92, 9);
			ctx.strokeStyle = rgba(SKIN_DEEP, 0.9);
			ctx.lineWidth = 2.4;
			ctx.beginPath();
			ctx.moveTo(bust.x, ky - 12);
			ctx.lineTo(bust.x, ky + 14);
			ctx.stroke();
			ctx.restore();

			// Red piping around keyhole
			ctx.strokeStyle = pipeFill;
			ctx.lineWidth = 4.5;
			ctx.beginPath();
			ctx.ellipse(bust.x, ky, 42, 13.5, 0, 0, Math.PI * 2);
			ctx.stroke();
			ctx.strokeStyle = INK;
			ctx.lineWidth = 1.8;
			ctx.stroke();
		}

		// Armhole & hem red piping
		ctx.strokeStyle = pipeFill;
		ctx.lineWidth = 4.2;
		ctx.beginPath();
		ctx.moveTo(neck.x - 24, neck.y - 10);
		ctx.quadraticCurveTo(
			rightArm.shoulder.x + 26,
			bust.y - 36,
			bust.x - 56,
			bust.y + 10,
		);
		ctx.moveTo(neck.x + 24, neck.y - 10);
		ctx.quadraticCurveTo(
			leftArm.shoulder.x - 26,
			bust.y - 36,
			bust.x + 56,
			bust.y + 10,
		);
		ctx.moveTo(waist.x - 42, hemY);
		ctx.quadraticCurveTo(waist.x, hemY + 12, waist.x + 42, hemY);
		ctx.stroke();

		// Vertical red stitch lines & small side bow (official detail)
		ctx.lineWidth = 3.0;
		for (const s of [-1, 1]) {
			ctx.beginPath();
			ctx.moveTo(bust.x + s * 30, bust.y + 8);
			ctx.quadraticCurveTo(
				bust.x + s * 36,
				waist.y - 24,
				waist.x + s * 31,
				hemY - 2,
			);
			ctx.stroke();
		}
		drawBow(
			ctx,
			waist.x + 31,
			hemY - 6,
			0.58,
			0.12,
			pipeFill,
			theme.accentDark,
		);

		// Standing Mandarin collar + gold button + 2 frog clasps
		ctx.fillStyle = bodyFill;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.beginPath();
		ctx.roundRect(neck.x - 25, neck.y - 26, 50, 22, 6);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = pipeFill;
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(neck.x - 23, neck.y - 25);
		ctx.lineTo(neck.x + 23, neck.y - 25);
		ctx.stroke();

		// Gold collar button
		ctx.fillStyle = theme.trim;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(neck.x, neck.y - 14, 4.2, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// Two Chinese frog clasps between collar and chest
		for (const cy of [neck.y + 8, neck.y + 23]) {
			ctx.strokeStyle = pipeFill;
			ctx.lineWidth = 3.0;
			ctx.beginPath();
			ctx.moveTo(neck.x - 20, cy);
			ctx.lineTo(neck.x + 20, cy);
			ctx.stroke();
			for (const sx of [-20, 20]) {
				ctx.beginPath();
				ctx.arc(neck.x + sx, cy, 4, 0, Math.PI * 2);
				ctx.stroke();
			}
			ctx.fillStyle = pipeFill;
			ctx.beginPath();
			ctx.arc(neck.x, cy, 4.2, 0, Math.PI * 2);
			ctx.fill();
		}
		return;
	}

	if (state.tops === "cyber_crop") {
		const hemY = waist.y - 6;
		ctx.beginPath();
		ctx.moveTo(neck.x - 26, neck.y - 16);
		ctx.lineTo(rightArm.shoulder.x - 10, rightArm.shoulder.y - 6);
		ctx.lineTo(bust.x - 62, bust.y + 28);
		ctx.lineTo(waist.x - 45, hemY);
		ctx.quadraticCurveTo(waist.x, hemY + 10, waist.x + 45, hemY);
		ctx.lineTo(bust.x + 62, bust.y + 28);
		ctx.lineTo(leftArm.shoulder.x + 10, leftArm.shoulder.y - 6);
		ctx.lineTo(neck.x + 26, neck.y - 16);
		ctx.closePath();
		ctx.fillStyle = theme.main;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.2;
		ctx.stroke();

		// Neon V-zip & glowing cyan stripes
		ctx.strokeStyle = theme.accentLight;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(neck.x, neck.y - 8);
		ctx.lineTo(waist.x, hemY + 4);
		ctx.moveTo(bust.x - 42, bust.y - 12);
		ctx.lineTo(waist.x - 28, hemY);
		ctx.moveTo(bust.x + 42, bust.y - 12);
		ctx.lineTo(waist.x + 28, hemY);
		ctx.stroke();
		return;
	}

	if (state.tops === "oversize_hoodie") {
		const hoodieCol =
			state.topsTheme === "official" && state.topsHue === 0
				? "#c96a48"
				: theme.accent;
		const hemY = waist.y + 58;
		ctx.beginPath();
		ctx.moveTo(neck.x - 38, neck.y - 14);
		ctx.quadraticCurveTo(
			rightArm.shoulder.x - 16,
			rightArm.shoulder.y - 8,
			rightArm.elbow.x + 18,
			rightArm.elbow.y + 10,
		);
		ctx.lineTo(waist.x - 74, hemY);
		ctx.quadraticCurveTo(waist.x, hemY + 16, waist.x + 74, hemY);
		ctx.lineTo(leftArm.elbow.x - 18, leftArm.elbow.y + 10);
		ctx.quadraticCurveTo(
			leftArm.shoulder.x + 16,
			leftArm.shoulder.y - 8,
			neck.x + 38,
			neck.y - 14,
		);
		ctx.closePath();
		ctx.fillStyle = hoodieCol;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.4;
		ctx.stroke();

		// Kangaroo pocket & hood drawstrings
		ctx.fillStyle = rgba(INK, 0.14);
		ctx.beginPath();
		ctx.roundRect(waist.x - 36, waist.y + 4, 72, 42, 8);
		ctx.fill();
		ctx.stroke();

		ctx.strokeStyle = "#f4f0e8";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(neck.x - 12, neck.y + 6);
		ctx.quadraticCurveTo(neck.x - 14, bust.y - 10, neck.x - 10, bust.y + 18);
		ctx.moveTo(neck.x + 12, neck.y + 6);
		ctx.quadraticCurveTo(neck.x + 14, bust.y - 10, neck.x + 10, bust.y + 18);
		ctx.stroke();
		return;
	}

	if (state.tops === "gothic_corset") {
		const hemY = waist.y + 24;
		// White blouse upper
		ctx.beginPath();
		ctx.moveTo(neck.x - 24, neck.y - 12);
		ctx.lineTo(rightArm.shoulder.x + 2, rightArm.shoulder.y);
		ctx.lineTo(bust.x - 52, bust.y + 8);
		ctx.lineTo(bust.x + 52, bust.y + 8);
		ctx.lineTo(leftArm.shoulder.x - 2, leftArm.shoulder.y);
		ctx.lineTo(neck.x + 24, neck.y - 12);
		ctx.closePath();
		ctx.fillStyle = "#f2eef6";
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 3.0;
		ctx.stroke();

		// Corset waist
		ctx.beginPath();
		ctx.moveTo(bust.x - 52, bust.y - 6);
		ctx.quadraticCurveTo(bust.x, bust.y + 8, bust.x + 52, bust.y - 6);
		ctx.lineTo(waist.x + 42, hemY);
		ctx.quadraticCurveTo(waist.x, hemY + 14, waist.x - 42, hemY);
		ctx.closePath();
		ctx.fillStyle = theme.main;
		ctx.fill();
		ctx.stroke();

		// Criss-cross lacing
		ctx.strokeStyle = theme.accent;
		ctx.lineWidth = 2.6;
		for (let i = 0; i < 4; i++) {
			const y0 = bust.y + 6 + i * 16;
			ctx.beginPath();
			ctx.moveTo(bust.x - 10, y0);
			ctx.lineTo(bust.x + 10, y0 + 12);
			ctx.moveTo(bust.x + 10, y0);
			ctx.lineTo(bust.x - 10, y0 + 12);
			ctx.stroke();
		}
		drawBow(ctx, neck.x, neck.y + 12, 0.9, 0, theme.accent, theme.accentDark);
		return;
	}

	// summer_bikini
	ctx.fillStyle = theme.main;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.0;
	for (const s of [-1, 1]) {
		ctx.beginPath();
		ctx.moveTo(neck.x + s * 16, neck.y + 2);
		ctx.lineTo(bust.x + s * 28, bust.y - 24);
		ctx.stroke();
		ctx.beginPath();
		ctx.ellipse(bust.x + s * 28, bust.y + 6, 26, 22, s * 0.25, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
	ctx.strokeStyle = theme.accent;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(bust.x - 48, bust.y + 14);
	ctx.quadraticCurveTo(bust.x, bust.y + 22, bust.x + 48, bust.y + 14);
	ctx.stroke();
	ctx.fillStyle = theme.trim;
	ctx.beginPath();
	ctx.arc(bust.x, bust.y + 8, 6, 0, Math.PI * 2);
	ctx.fill();
}

function drawSingleWideSleeve(
	ctx: CanvasRenderingContext2D,
	arm: ArmJoints,
	theme: ColorThemeMeta,
	sway: number,
	neonMode: boolean,
): void {
	const s = arm.side;
	const dir = normVec({
		x: arm.wrist.x - arm.shoulder.x,
		y: arm.wrist.y - arm.shoulder.y,
	});
	const start = lerpVec(arm.shoulder, arm.elbow, 0.34);

	// 1. Fitted red bicep band (二の腕バンド)
	const bandP = { x: -dir.y, y: dir.x };
	ctx.strokeStyle = neonMode ? theme.accentLight : theme.accent;
	ctx.lineWidth = 14;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(start.x - bandP.x * 13, start.y - bandP.y * 13);
	ctx.lineTo(start.x + bandP.x * 13, start.y + bandP.y * 13);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke();

	// 2. Detached puffy draped wide sleeve (gravity sags downward +Y)
	const sleeveStart = lerpVec(arm.shoulder, arm.elbow, 0.38);
	const midPt = lerpVec(arm.elbow, arm.wrist, 0.25);
	const cuffAnchor = lerpVec(arm.elbow, arm.wrist, 0.84);

	const top1 = {
		x: sleeveStart.x - bandP.x * 16,
		y: sleeveStart.y - bandP.y * 16,
	};
	const top2 = { x: midPt.x, y: midPt.y - 36 + sway * 3 };
	const topEnd = { x: cuffAnchor.x - bandP.x * 46, y: cuffAnchor.y - 38 };

	const bot1 = {
		x: sleeveStart.x + bandP.x * 18,
		y: sleeveStart.y + bandP.y * 18,
	};
	const botSag = { x: midPt.x - s * 10, y: midPt.y + 86 + sway * 5 };
	const botEnd = { x: cuffAnchor.x + bandP.x * 52, y: cuffAnchor.y + 52 };

	ctx.beginPath();
	ctx.moveTo(top1.x, top1.y);
	ctx.bezierCurveTo(
		top1.x + s * 22,
		top1.y - 34,
		top2.x - s * 12,
		top2.y - 18,
		topEnd.x,
		topEnd.y,
	);
	ctx.lineTo(botEnd.x, botEnd.y);
	ctx.bezierCurveTo(
		botSag.x + s * 18,
		botSag.y + 18,
		bot1.x + s * 10,
		bot1.y + 38,
		bot1.x,
		bot1.y,
	);
	ctx.closePath();

	const sg = ctx.createLinearGradient(
		top2.x,
		top2.y - 20,
		botSag.x,
		botSag.y + 20,
	);
	sg.addColorStop(0, theme.mainLight);
	sg.addColorStop(0.55, theme.main);
	sg.addColorStop(1, theme.mainDark);
	ctx.fillStyle = sg;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.stroke();

	// 2 parallel stripes along sleeve exterior + little bow
	const stripeCol = neonMode ? theme.accentLight : theme.accent;
	for (const off of [-10, 10]) {
		ctx.strokeStyle = stripeCol;
		ctx.lineWidth = 4.2;
		ctx.beginPath();
		ctx.moveTo(sleeveStart.x, sleeveStart.y + off);
		ctx.quadraticCurveTo(
			midPt.x,
			midPt.y - 14 + off + sway * 2,
			lerpVec(topEnd, botEnd, 0.45).x,
			lerpVec(topEnd, botEnd, 0.45).y + off,
		);
		ctx.stroke();
	}

	const bowPt = lerpVec(sleeveStart, midPt, 0.72);
	drawBow(
		ctx,
		bowPt.x + s * 4,
		bowPt.y - 10,
		0.72,
		s * 0.25,
		stripeCol,
		theme.accentDark,
	);

	// 3. Turned-back hollow red cuff (赤い空洞袖口)
	const cuffDir = normVec({
		x: arm.wrist.x - cuffAnchor.x,
		y: arm.wrist.y - cuffAnchor.y,
	});
	const cuffEnd = {
		x: cuffAnchor.x + cuffDir.x * 46,
		y: cuffAnchor.y + cuffDir.y * 46,
	};
	const cuffColor = neonMode ? theme.accent : theme.accent;
	const cuffRim = mixHex(cuffColor, "#ffffff", 0.14);

	// Outer folded cuff body
	ctx.beginPath();
	ctx.moveTo(topEnd.x, topEnd.y);
	ctx.lineTo(cuffEnd.x - bandP.x * 48, cuffEnd.y - 36);
	ctx.quadraticCurveTo(
		cuffEnd.x + cuffDir.x * 16,
		cuffEnd.y + 8,
		cuffEnd.x + bandP.x * 52,
		cuffEnd.y + 46,
	);
	ctx.lineTo(botEnd.x, botEnd.y);
	ctx.closePath();
	ctx.fillStyle = cuffRim;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.2;
	ctx.stroke();

	// Vertical black stitch seam down cuff middle
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(lerpVec(topEnd, botEnd, 0.5).x, lerpVec(topEnd, botEnd, 0.5).y);
	ctx.lineTo(cuffEnd.x, cuffEnd.y + 4);
	ctx.stroke();

	// Hollow cuff opening ellipse + dark interior
	const openCenter = { x: cuffEnd.x + cuffDir.x * 4, y: cuffEnd.y + 4 };
	const cuffAngle = Math.atan2(cuffDir.y, cuffDir.x);
	ctx.save();
	ctx.translate(openCenter.x, openCenter.y);
	ctx.rotate(cuffAngle);
	ctx.fillStyle = theme.mainDark;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3.0;
	ctx.beginPath();
	ctx.ellipse(0, 0, 17, 42, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

export function drawSleevesAndHands(
	ctx: CanvasRenderingContext2D,
	rig: CharacterRig,
	state: DressUpState,
): void {
	const theme = resolveThemeColors(state.sleevesTheme, state.sleevesHue);
	const arms = [rig.rightArm, rig.leftArm];

	for (const arm of arms) {
		const handAngle = Math.atan2(
			arm.wrist.y - arm.elbow.y,
			arm.wrist.x - arm.elbow.x,
		);

		if (state.sleeves === "bell_wide" || state.sleeves === "neon_wide") {
			drawSingleWideSleeve(
				ctx,
				arm,
				theme,
				rig.sway,
				state.sleeves === "neon_wide",
			);
			drawHand(ctx, arm.wrist, handAngle, 1);
		} else if (state.sleeves === "hagoromo") {
			const s = arm.side;
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(arm.shoulder.x, arm.shoulder.y - 6);
			ctx.bezierCurveTo(
				arm.elbow.x,
				arm.elbow.y - 38,
				arm.wrist.x - s * 10,
				arm.wrist.y - 12,
				arm.wrist.x + s * 42,
				arm.wrist.y + 42 + rig.sway * 8,
			);
			ctx.quadraticCurveTo(
				arm.elbow.x,
				arm.elbow.y + 74 + rig.sway * 5,
				arm.shoulder.x,
				arm.shoulder.y + 22,
			);
			ctx.closePath();
			const hg = ctx.createLinearGradient(
				arm.shoulder.x,
				arm.shoulder.y,
				arm.wrist.x,
				arm.wrist.y + 40,
			);
			hg.addColorStop(0, rgba(theme.glow, 0.55));
			hg.addColorStop(1, rgba(theme.glowSoft, 0.25));
			ctx.fillStyle = hg;
			ctx.fill();
			ctx.strokeStyle = rgba(theme.glowSoft, 0.8);
			ctx.lineWidth = 2.2;
			ctx.stroke();
			ctx.restore();
			drawHand(ctx, arm.wrist, handAngle, 1);
		} else if (
			state.sleeves === "china_gloves" ||
			state.sleeves === "cyber_arm"
		) {
			const start = lerpVec(arm.shoulder, arm.elbow, 0.35);
			const midFore = lerpVec(arm.elbow, arm.wrist, 0.5);
			const { left, right } = buildTaperedPath(
				[start, arm.elbow, midFore, arm.wrist],
				[15, 13.5, 12.5, 10],
			);
			traceClosedTube(ctx, left, right);
			ctx.fillStyle = theme.main;
			ctx.fill();
			ctx.strokeStyle = INK;
			ctx.lineWidth = 2.8;
			ctx.stroke();

			ctx.strokeStyle =
				state.sleeves === "cyber_arm" ? theme.accentLight : theme.trim;
			ctx.lineWidth = 4;
			const dir = normVec({
				x: arm.elbow.x - start.x,
				y: arm.elbow.y - start.y,
			});
			const perp = { x: -dir.y, y: dir.x };
			ctx.beginPath();
			ctx.moveTo(start.x - perp.x * 15, start.y - perp.y * 15);
			ctx.lineTo(start.x + perp.x * 15, start.y + perp.y * 15);
			ctx.stroke();

			drawHand(ctx, arm.wrist, handAngle, 1, theme.mainDark);
		} else {
			drawHand(ctx, arm.wrist, handAngle, 1);
		}
	}

	// Suppress unused import warning if drawPolyOutline is used elsewhere
	void drawPolyOutline;
}
