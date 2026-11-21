import type { DressUpState } from "../data/items";
import { drawBackEffect, drawBackground, drawForegroundEmbers } from "./drawBg";
import {
	drawBodyAndLimbs,
	drawBottoms,
	drawLegwear,
	drawSleevesAndHands,
	drawTops,
} from "./drawBodyClothes";
import {
	drawBackHair,
	drawFrontHairAndOrnaments,
	drawHeadAndFace,
	drawProps,
} from "./drawHeadProps";
import { CANVAS_H, CANVAS_W, computeRig } from "./rig";

export interface RenderOptions {
	transparent?: boolean;
	animate?: boolean;
	cardWatermark?: boolean;
}

export function renderCharacter(
	ctx: CanvasRenderingContext2D,
	state: DressUpState,
	time: number,
	options: RenderOptions = {},
): void {
	const transparent = options.transparent ?? false;
	const animate = options.animate ?? true;
	const rig = computeRig(state.pose, time, animate);

	ctx.save();
	ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

	drawBackground(ctx, state.bg, state.studioBg, rig.time, transparent);
	if (!transparent) {
		drawBackEffect(ctx, state.backFx, rig.time);
	}

	drawBackHair(ctx, rig, state);
	drawBodyAndLimbs(ctx, rig, state);
	drawLegwear(ctx, rig, state);
	drawBottoms(ctx, rig, state);
	drawTops(ctx, rig, state);
	drawSleevesAndHands(ctx, rig, state);
	drawHeadAndFace(ctx, rig, state);
	drawFrontHairAndOrnaments(ctx, rig, state);
	drawProps(ctx, rig, state);

	if (!transparent) {
		drawForegroundEmbers(ctx, state.backFx, rig.time);
	}

	if (options.cardWatermark) {
		drawCardOverlay(ctx);
	}

	ctx.restore();
}

function drawCardOverlay(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.strokeStyle = "rgba(220, 180, 92, 0.72)";
	ctx.lineWidth = 5;
	ctx.strokeRect(22, 22, CANVAS_W - 44, CANVAS_H - 44);

	ctx.fillStyle = "rgba(13, 11, 20, 0.78)";
	ctx.beginPath();
	ctx.roundRect(42, CANVAS_H - 122, 340, 78, 12);
	ctx.fill();
	ctx.strokeStyle = "#36a888";
	ctx.lineWidth = 2.5;
	ctx.stroke();

	ctx.fillStyle = "#f7f3eb";
	ctx.font = "700 34px 'Noto Serif JP', serif";
	ctx.fillText("束音ロゼ", 64, CANVAS_H - 80);

	ctx.fillStyle = "#e8bc5c";
	ctx.font = "700 15px 'M PLUS Rounded 1c', sans-serif";
	ctx.fillText("TABANE ROZE // ROSENFELD", 64, CANVAS_H - 56);
	ctx.restore();
}
