import type { BackFxId, BgId, BgTone } from "../data/items";
import { rgba } from "./color";
import { CANVAS_H, CANVAS_W, drawYinYang } from "./rig";

export function drawBackground(
	ctx: CanvasRenderingContext2D,
	bg: BgId,
	bgTone: BgTone,
	time: number,
	transparent: boolean,
): void {
	if (transparent) {
		ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
		return;
	}

	const isLight = bgTone === "light";

	if (bg === "simple_studio") {
		const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
		if (isLight) {
			g.addColorStop(0, "#f5f2eb");
			g.addColorStop(0.65, "#eae7df");
			g.addColorStop(1, "#dcebe6");
		} else {
			g.addColorStop(0, "#141120");
			g.addColorStop(0.65, "#1b172b");
			g.addColorStop(1, "#101b1e");
		}
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

		// Subtle top spotlight
		const rad = ctx.createRadialGradient(450, 440, 80, 450, 560, 620);
		rad.addColorStop(
			0,
			isLight ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.1)",
		);
		rad.addColorStop(1, "rgba(0,0,0,0)");
		ctx.fillStyle = rad;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

		// Floor shadow oval
		ctx.fillStyle = isLight ? "rgba(34,26,38,0.12)" : "rgba(0,0,0,0.34)";
		ctx.beginPath();
		ctx.ellipse(455, 1068, 180, 26, 0, 0, Math.PI * 2);
		ctx.fill();
		return;
	}

	if (bg === "cyber_china") {
		const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
		if (isLight) {
			g.addColorStop(0, "#eef6f2");
			g.addColorStop(0.55, "#f7e9dc");
			g.addColorStop(1, "#e8d6cd");
		} else {
			g.addColorStop(0, "#090b16");
			g.addColorStop(0.55, "#151126");
			g.addColorStop(1, "#1e1222");
		}
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

		// Perspective floor grid
		ctx.save();
		ctx.strokeStyle = isLight
			? "rgba(25, 130, 105, 0.22)"
			: "rgba(38, 179, 145, 0.25)";
		ctx.lineWidth = 2;
		const horizon = 840;
		for (let i = -8; i <= 8; i++) {
			ctx.beginPath();
			ctx.moveTo(450 + i * 28, horizon);
			ctx.lineTo(450 + i * 165, CANVAS_H);
			ctx.stroke();
		}
		for (let r = 0; r < 8; r++) {
			const p = (r / 8) ** 1.7;
			const y = horizon + p * (CANVAS_H - horizon);
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(CANVAS_W, y);
			ctx.stroke();
		}
		ctx.restore();

		// Pagoda silhouettes
		ctx.fillStyle = isLight ? "#dfd3c5" : "#0e0c1b";
		ctx.fillRect(0, 520, 175, 340);
		ctx.fillRect(725, 490, 175, 370);
		ctx.strokeStyle = "#c92434";
		ctx.lineWidth = 4;
		for (const [rx, ry, rw] of [
			[20, 520, 165],
			[40, 410, 130],
			[715, 490, 165],
			[735, 380, 130],
		]) {
			ctx.fillStyle = isLight ? "#cbb9a9" : "#161124";
			ctx.beginPath();
			ctx.moveTo(rx - 18, ry);
			ctx.quadraticCurveTo(rx + rw / 2, ry - 26, rx + rw + 18, ry);
			ctx.lineTo(rx + rw, ry + 16);
			ctx.lineTo(rx, ry + 16);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		// Lanterns
		const lanterns = [
			[115, 210],
			[190, 295],
			[785, 225],
			[710, 310],
		];
		for (let i = 0; i < lanterns.length; i++) {
			const [lx, baseY] = lanterns[i];
			const ly = baseY + Math.sin(time * 1.4 + i) * 6;
			ctx.strokeStyle = isLight ? "#7a5e5e" : "#48333f";
			ctx.lineWidth = 2.5;
			ctx.beginPath();
			ctx.moveTo(lx, 0);
			ctx.lineTo(lx, ly - 34);
			ctx.stroke();

			const lg = ctx.createRadialGradient(lx, ly, 6, lx, ly, 75);
			lg.addColorStop(
				0,
				isLight ? "rgba(255, 110, 130, 0.3)" : "rgba(255, 82, 108, 0.52)",
			);
			lg.addColorStop(1, "rgba(255, 82, 108, 0)");
			ctx.fillStyle = lg;
			ctx.beginPath();
			ctx.arc(lx, ly, 75, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "#d9263a";
			ctx.strokeStyle = "#2b0d15";
			ctx.lineWidth = 2.5;
			ctx.beginPath();
			ctx.ellipse(lx, ly, 26, 33, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "#e8bc5c";
			ctx.fillRect(lx - 13, ly - 35, 26, 6);
			ctx.fillRect(lx - 11, ly + 29, 22, 6);
			ctx.strokeStyle = "#e8bc5c";
			ctx.beginPath();
			ctx.moveTo(lx, ly + 35);
			ctx.lineTo(lx, ly + 56);
			ctx.stroke();
		}

		// Diamond frame
		const pulse = 0.65 + 0.35 * Math.sin(time * 2.2);
		ctx.save();
		ctx.translate(450, 460);
		ctx.rotate(Math.PI / 4);
		ctx.strokeStyle = `rgba(38, 179, 145, ${0.32 * pulse})`;
		ctx.lineWidth = 6;
		ctx.strokeRect(-210, -210, 420, 420);
		ctx.strokeStyle = `rgba(225, 45, 75, ${0.28 * pulse})`;
		ctx.lineWidth = 3;
		ctx.strokeRect(-185, -185, 370, 370);
		ctx.restore();
		return;
	}

	if (bg === "ghost_shrine") {
		const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
		if (isLight) {
			g.addColorStop(0, "#e2f3ee");
			g.addColorStop(0.58, "#f3e7ee");
			g.addColorStop(1, "#cce2da");
		} else {
			g.addColorStop(0, "#0b0918");
			g.addColorStop(0.6, "#16142e");
			g.addColorStop(1, "#0d1a1c");
		}
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

		// Moon / Sun disc
		ctx.fillStyle = isLight
			? "rgba(255, 255, 255, 0.85)"
			: "rgba(232, 255, 248, 0.88)";
		ctx.beginPath();
		ctx.arc(450, 255, 138, 0, Math.PI * 2);
		ctx.fill();

		// Bamboo stalks
		ctx.strokeStyle = isLight ? "#7eb09f" : "#162d2c";
		for (let i = 0; i < 11; i++) {
			const bx = i < 5 ? 45 + i * 48 : 655 + (i - 5) * 48;
			const bend = Math.sin(time * 0.9 + i) * 14;
			ctx.lineWidth = 10 + (i % 3) * 4;
			ctx.beginPath();
			ctx.moveTo(bx, CANVAS_H);
			ctx.quadraticCurveTo(bx + bend, 520, bx + bend * 1.8, 0);
			ctx.stroke();
		}

		const mist = ctx.createLinearGradient(0, 820, 0, CANVAS_H);
		mist.addColorStop(0, "rgba(255, 128, 190, 0)");
		mist.addColorStop(0.6, "rgba(255, 128, 190, 0.16)");
		mist.addColorStop(1, "rgba(45, 150, 130, 0.28)");
		ctx.fillStyle = mist;
		ctx.fillRect(0, 820, CANVAS_W, 380);
		return;
	}

	if (bg === "utau_stage") {
		const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
		if (isLight) {
			g.addColorStop(0, "#e5faf4");
			g.addColorStop(0.65, "#f7e9f4");
			g.addColorStop(1, "#d8e6ef");
		} else {
			g.addColorStop(0, "#0b0718");
			g.addColorStop(0.65, "#190f32");
			g.addColorStop(1, "#090a14");
		}
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

		// Spotlight beams
		for (let i = 0; i < 4; i++) {
			const sx = 120 + i * 220;
			const angle = Math.sin(time * 1.1 + i * 1.3) * 0.14;
			ctx.save();
			ctx.translate(sx, -20);
			ctx.rotate(angle);
			const sg = ctx.createLinearGradient(0, 0, 0, 1050);
			const col = i % 2 === 0 ? "53, 240, 200" : "255, 78, 147";
			sg.addColorStop(0, `rgba(${col}, ${isLight ? 0.24 : 0.3})`);
			sg.addColorStop(1, `rgba(${col}, 0)`);
			ctx.fillStyle = sg;
			ctx.beginPath();
			ctx.moveTo(-25, 0);
			ctx.lineTo(25, 0);
			ctx.lineTo(190, 1050);
			ctx.lineTo(-190, 1050);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}

		// Audio visualizer spectrum bars
		const barCount = 32;
		const barW = CANVAS_W / barCount;
		for (let i = 0; i < barCount; i++) {
			const h =
				45 +
				Math.abs(Math.sin(time * 4.5 + i * 0.45)) * 135 +
				Math.abs(Math.cos(time * 2.8 - i * 0.3)) * 65;
			ctx.fillStyle =
				i % 2 === 0 ? "rgba(38, 179, 145, 0.28)" : "rgba(255, 92, 160, 0.24)";
			ctx.fillRect(i * barW + 4, 860 - h, barW - 8, h);
		}

		ctx.fillStyle = isLight ? "#cfe4df" : "#121022";
		ctx.fillRect(0, 860, CANVAS_W, 340);
		ctx.strokeStyle = "rgba(38, 179, 145, 0.55)";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, 860);
		ctx.lineTo(CANVAS_W, 860);
		ctx.stroke();
		return;
	}

	if (bg === "onj_room") {
		const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
		if (isLight) {
			g.addColorStop(0, "#f5efe6");
			g.addColorStop(1, "#e3ddd6");
		} else {
			g.addColorStop(0, "#171424");
			g.addColorStop(1, "#221c33");
		}
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

		// Wall poster
		ctx.fillStyle = isLight ? "#e0d8cc" : "#2b243f";
		ctx.fillRect(70, 150, 210, 280);
		ctx.strokeStyle = isLight ? "#b8ad9f" : "#3c3357";
		ctx.lineWidth = 6;
		ctx.strokeRect(70, 150, 210, 280);
		drawYinYang(ctx, 175, 270, 52, "#36a888", "#f5f2eb", "#dcb45c", false, 0);

		// Window on right
		ctx.fillStyle = isLight ? "#b9e5f5" : "#0e1529";
		ctx.fillRect(635, 130, 200, 310);
		ctx.strokeStyle = isLight ? "#a69b8d" : "#3a3454";
		ctx.lineWidth = 8;
		ctx.strokeRect(635, 130, 200, 310);
		if (!isLight) {
			ctx.fillStyle = "rgba(255, 240, 190, 0.7)";
			for (let i = 0; i < 12; i++) {
				ctx.fillRect(655 + ((i * 37) % 160), 155 + ((i * 59) % 240), 3, 3);
			}
		}

		// Desk & monitors
		ctx.fillStyle = isLight ? "#cbbba9" : "#161220";
		ctx.fillRect(0, 820, CANVAS_W, 380);
		ctx.fillStyle = isLight ? "#dfd2c3" : "#27223a";
		ctx.fillRect(40, 795, 820, 32);
		ctx.fillStyle = isLight ? "#22343d" : "#14262e";
		ctx.strokeStyle = "#38d8b0";
		ctx.lineWidth = 3;
		ctx.fillRect(60, 620, 195, 135);
		ctx.strokeRect(60, 620, 195, 135);
		ctx.fillStyle = "#f4f2f8";
		ctx.fillRect(620, 775, 210, 22);
		ctx.fillStyle = "#1b1826";
		for (let k = 0; k < 14; k++) {
			if (k % 7 !== 2 && k % 7 !== 6) {
				ctx.fillRect(628 + k * 15, 775, 8, 13);
			}
		}
		return;
	}

	// sunset_sea (light = bright daytime seaside, dark = twilight sunset)
	const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
	if (isLight) {
		g.addColorStop(0, "#7bc6eb");
		g.addColorStop(0.55, "#ccebfa");
		g.addColorStop(1, "#eaf3f7");
	} else {
		g.addColorStop(0, "#24193c");
		g.addColorStop(0.45, "#9c3b5c");
		g.addColorStop(0.72, "#f0865c");
		g.addColorStop(1, "#2b2038");
	}
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

	if (isLight) {
		// Soft clouds
		ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
		for (const [cx, cy, r] of [
			[180, 220, 56],
			[235, 210, 72],
			[680, 290, 64],
			[745, 280, 50],
		]) {
			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.fill();
		}
	} else {
		const sunG = ctx.createRadialGradient(640, 560, 20, 640, 560, 165);
		sunG.addColorStop(0, "#fff2c2");
		sunG.addColorStop(0.45, "#ffae66");
		sunG.addColorStop(1, "rgba(255, 130, 90, 0)");
		ctx.fillStyle = sunG;
		ctx.beginPath();
		ctx.arc(640, 560, 165, 0, Math.PI * 2);
		ctx.fill();
	}

	// Sea horizon
	ctx.fillStyle = isLight ? "#4da6cf" : "#35284d";
	ctx.fillRect(0, 720, CANVAS_W, 200);
	ctx.fillStyle = isLight
		? "rgba(255, 255, 255, 0.55)"
		: "rgba(255, 208, 128, 0.55)";
	for (let r = 0; r < 14; r++) {
		const w = 130 - r * 7 + Math.sin(time * 2 + r) * 14;
		ctx.fillRect(640 - w / 2, 728 + r * 12, w, 4);
	}

	// Station platform
	ctx.fillStyle = isLight ? "#d4d0c8" : "#1f192b";
	ctx.fillRect(0, 905, CANVAS_W, 295);
	ctx.strokeStyle = "#f2a65a";
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(0, 908);
	ctx.lineTo(CANVAS_W, 908);
	ctx.stroke();
	ctx.strokeStyle = isLight ? "#7a8594" : "#3f3454";
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(0, 840);
	ctx.lineTo(CANVAS_W, 840);
	ctx.stroke();
	for (let x = 40; x < CANVAS_W; x += 110) {
		ctx.beginPath();
		ctx.moveTo(x, 840);
		ctx.lineTo(x, 908);
		ctx.stroke();
	}
}

export function drawBackEffect(
	ctx: CanvasRenderingContext2D,
	fx: BackFxId,
	time: number,
): void {
	if (fx === "none") return;

	if (fx === "onibi_aura") {
		const wisps = [
			{ x: 225, y: 490, r: 34, c: "#ff66a8", sp: 1.4 },
			{ x: 675, y: 470, r: 30, c: "#ff66a8", sp: 1.7 },
			{ x: 250, y: 740, r: 26, c: "#35f0c8", sp: 1.2 },
			{ x: 655, y: 760, r: 32, c: "#ff85bd", sp: 1.5 },
			{ x: 295, y: 270, r: 22, c: "#35f0c8", sp: 1.9 },
			{ x: 615, y: 260, r: 24, c: "#ff85bd", sp: 1.3 },
		];
		for (let i = 0; i < wisps.length; i++) {
			const w = wisps[i];
			const wx = w.x + Math.sin(time * w.sp + i * 2.1) * 18;
			const wy = w.y + Math.cos(time * (w.sp * 0.85) + i) * 24;
			const g = ctx.createRadialGradient(wx, wy, 4, wx, wy, w.r * 2.2);
			g.addColorStop(0, "rgba(255,255,255,0.9)");
			g.addColorStop(0.35, rgba(w.c, 0.72));
			g.addColorStop(1, rgba(w.c, 0));
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(wx, wy, w.r * 2.2, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = rgba(w.c, 0.78);
			ctx.beginPath();
			ctx.moveTo(wx - w.r * 0.45, wy);
			ctx.quadraticCurveTo(
				wx - w.r * 0.2,
				wy - w.r * 1.4,
				wx + Math.sin(time * 4 + i) * 8,
				wy - w.r * 1.85,
			);
			ctx.quadraticCurveTo(
				wx + w.r * 0.35,
				wy - w.r * 1.1,
				wx + w.r * 0.45,
				wy,
			);
			ctx.arc(wx, wy, w.r * 0.45, 0, Math.PI);
			ctx.fill();
		}
		return;
	}

	if (fx === "bagua_ring") {
		ctx.save();
		ctx.translate(450, 440);
		ctx.rotate(time * 0.22);

		ctx.strokeStyle = "rgba(215, 165, 65, 0.58)";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(0, 0, 260, 0, Math.PI * 2);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(0, 0, 215, 0, Math.PI * 2);
		ctx.stroke();

		ctx.strokeStyle = "rgba(38, 179, 145, 0.65)";
		ctx.lineWidth = 5;
		for (let i = 0; i < 8; i++) {
			ctx.save();
			ctx.rotate((i * Math.PI) / 4);
			for (let bar = 0; bar < 3; bar++) {
				const by = -246 + bar * 9;
				const broken = ((i >> bar) & 1) === 1;
				if (broken) {
					ctx.beginPath();
					ctx.moveTo(-22, by);
					ctx.lineTo(-5, by);
					ctx.moveTo(5, by);
					ctx.lineTo(22, by);
					ctx.stroke();
				} else {
					ctx.beginPath();
					ctx.moveTo(-22, by);
					ctx.lineTo(22, by);
					ctx.stroke();
				}
			}
			ctx.restore();
		}
		ctx.restore();
		return;
	}

	if (fx === "cyber_glitch") {
		ctx.save();
		for (let i = 0; i < 8; i++) {
			const y = 160 + ((i * 117 + Math.floor(time * 28)) % 820);
			const w = 90 + ((i * 53) % 160);
			const x = i % 2 === 0 ? 110 + i * 17 : 640 - i * 19;
			ctx.fillStyle =
				i % 2 === 0 ? "rgba(38, 200, 165, 0.42)" : "rgba(255, 78, 147, 0.38)";
			ctx.fillRect(x, y, w, 7);
		}
		ctx.strokeStyle = "rgba(38, 200, 165, 0.45)";
		ctx.lineWidth = 3;
		ctx.strokeRect(190, 140, 520, 860);
		ctx.restore();
		return;
	}

	// music_notes
	ctx.save();
	for (let i = 0; i < 10; i++) {
		const nx = 160 + ((i * 73) % 580) + Math.sin(time * 1.4 + i) * 18;
		const ny = 880 - ((time * 48 + i * 92) % 740);
		const alpha = Math.sin(((880 - ny) / 740) * Math.PI);
		ctx.fillStyle =
			i % 3 === 0
				? `rgba(38, 195, 160, ${0.85 * alpha})`
				: i % 3 === 1
					? `rgba(240, 82, 150, ${0.85 * alpha})`
					: `rgba(225, 175, 70, ${0.85 * alpha})`;
		ctx.font = "bold 34px sans-serif";
		ctx.fillText(i % 2 === 0 ? "♪" : "♫", nx, ny);
	}
	ctx.restore();
}

export function drawForegroundEmbers(
	ctx: CanvasRenderingContext2D,
	fx: BackFxId,
	time: number,
): void {
	if (fx === "none") return;
	ctx.save();
	for (let i = 0; i < 12; i++) {
		const px = 140 + ((i * 137) % 620) + Math.sin(time * 1.8 + i) * 22;
		const py = 1080 - ((time * 55 + i * 110) % 920);
		const r = 2.5 + (i % 3) * 1.4;
		const col =
			fx === "cyber_glitch"
				? i % 2 === 0
					? "#35f0c8"
					: "#ff4e93"
				: i % 2 === 0
					? "#ff80bd"
					: "#4de2be";
		ctx.fillStyle = rgba(col, 0.7);
		ctx.beginPath();
		ctx.arc(px, py, r, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}
