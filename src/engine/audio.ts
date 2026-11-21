/**
 * Web Audio API による中華エレクトロ風 BGM & 効果音シンセサイザー（外部音声ファイル不要）
 */

const PENTATONIC_HZ = [
	293.66, // D4
	329.63, // E4
	392.0, // G4
	440.0, // A4
	523.25, // C5
	587.33, // D5
	659.25, // E5
	783.99, // G5
	880.0, // A5
];

const MELODY_PATTERN = [
	5, -1, 6, 7, 5, -1, 4, 3, 2, -1, 3, 4, 5, 4, 3, -1, 5, 7, 8, -1, 7, 6, 5, 3,
	4, -1, 3, 2, 0, -1, 2, 3,
];

const BASS_PATTERN = [
	0, -1, 0, -1, 2, -1, 2, -1, 1, -1, 1, -1, 0, -1, 3, -1, 0, -1, 2, -1, 3, -1,
	4, -1, 2, -1, 1, -1, 0, -1, -1, -1,
];

export class SoundEngine {
	private ctx: AudioContext | null = null;
	private bgmEnabled = false;
	private seEnabled = true;
	private timer: number | null = null;
	private step = 0;

	private ensureCtx(): AudioContext | null {
		if (typeof window === "undefined") return null;
		if (!this.ctx) {
			const Ctor = window.AudioContext;
			if (!Ctor) return null;
			this.ctx = new Ctor();
		}
		if (this.ctx.state === "suspended") {
			void this.ctx.resume();
		}
		return this.ctx;
	}

	public isBgmEnabled(): boolean {
		return this.bgmEnabled;
	}

	public isSeEnabled(): boolean {
		return this.seEnabled;
	}

	public setSeEnabled(on: boolean): void {
		this.seEnabled = on;
	}

	public toggleBgm(): boolean {
		this.bgmEnabled = !this.bgmEnabled;
		if (this.bgmEnabled) {
			this.startBgm();
		} else {
			this.stopBgm();
		}
		return this.bgmEnabled;
	}

	private startBgm(): void {
		const ctx = this.ensureCtx();
		if (!ctx) return;
		if (this.timer !== null) {
			window.clearInterval(this.timer);
		}
		this.step = 0;
		const tick = () => {
			if (!this.bgmEnabled) return;
			const c = this.ensureCtx();
			if (!c) return;
			const now = c.currentTime;
			const mIdx = MELODY_PATTERN[this.step % MELODY_PATTERN.length];
			if (mIdx >= 0) {
				this.pluck(c, PENTATONIC_HZ[mIdx], now, 0.22, 0.055, "triangle");
			}
			const bIdx = BASS_PATTERN[this.step % BASS_PATTERN.length];
			if (bIdx >= 0) {
				this.pluck(c, PENTATONIC_HZ[bIdx] * 0.5, now, 0.26, 0.04, "sine");
			}
			if (this.step % 4 === 0) {
				this.tickHat(c, now, 0.015);
			}
			this.step += 1;
		};
		tick();
		this.timer = window.setInterval(tick, 195);
	}

	private stopBgm(): void {
		if (this.timer !== null) {
			window.clearInterval(this.timer);
			this.timer = null;
		}
	}

	private pluck(
		ctx: AudioContext,
		freq: number,
		start: number,
		dur: number,
		vol: number,
		type: OscillatorType,
	): void {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, start);
		gain.gain.setValueAtTime(0.0001, start);
		gain.gain.exponentialRampToValueAtTime(vol, start + 0.015);
		gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(start);
		osc.stop(start + dur + 0.02);
	}

	private tickHat(ctx: AudioContext, start: number, vol: number): void {
		const len = Math.floor(ctx.sampleRate * 0.03);
		const buf = ctx.createBuffer(1, len, ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < len; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / len);
		}
		const src = ctx.createBufferSource();
		src.buffer = buf;
		const filter = ctx.createBiquadFilter();
		filter.type = "highpass";
		filter.frequency.value = 6000;
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(vol, start);
		gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.03);
		src.connect(filter);
		filter.connect(gain);
		gain.connect(ctx.destination);
		src.start(start);
	}

	public playTap(): void {
		if (!this.seEnabled) return;
		const ctx = this.ensureCtx();
		if (!ctx) return;
		const now = ctx.currentTime;
		this.pluck(ctx, 659.25, now, 0.08, 0.05, "sine");
	}

	public playEquip(): void {
		if (!this.seEnabled) return;
		const ctx = this.ensureCtx();
		if (!ctx) return;
		const now = ctx.currentTime;
		this.pluck(ctx, 587.33, now, 0.1, 0.06, "triangle");
		this.pluck(ctx, 880.0, now + 0.055, 0.14, 0.06, "triangle");
	}

	public playSparkle(): void {
		if (!this.seEnabled) return;
		const ctx = this.ensureCtx();
		if (!ctx) return;
		const now = ctx.currentTime;
		[523.25, 659.25, 783.99, 1046.5].forEach((hz, i) => {
			this.pluck(ctx, hz, now + i * 0.045, 0.16, 0.055, "triangle");
		});
	}

	public playShutter(): void {
		if (!this.seEnabled) return;
		const ctx = this.ensureCtx();
		if (!ctx) return;
		const now = ctx.currentTime;
		this.tickHat(ctx, now, 0.09);
		this.pluck(ctx, 987.77, now + 0.04, 0.12, 0.05, "sine");
	}

	public playFanfare(rank: "S" | "A" | "B" | "C"): void {
		if (!this.seEnabled) return;
		const ctx = this.ensureCtx();
		if (!ctx) return;
		const now = ctx.currentTime;
		const notes =
			rank === "S"
				? [587.33, 659.25, 880.0, 1174.66]
				: rank === "A"
					? [523.25, 659.25, 783.99]
					: [440.0, 523.25];
		notes.forEach((hz, i) => {
			this.pluck(ctx, hz, now + i * 0.09, 0.28, 0.065, "triangle");
		});
	}
}
