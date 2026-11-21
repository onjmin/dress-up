import {
	BACK_FXS,
	BGS,
	BOTTOMS_LIST,
	CATEGORIES,
	type CategoryId,
	CHALLENGE_THEMES,
	CHEEK_STYLES,
	COLOR_THEMES,
	type ColorThemeId,
	DEFAULT_STATE,
	type DressUpState,
	decodeStateFromQuery,
	EYE_STYLES,
	encodeStateToQuery,
	evaluateChallenge,
	FACE_ACCS,
	HAIR_COLORS,
	HAIR_STYLES,
	HEADSETS,
	HEADWEARS,
	type ItemMeta,
	LEGWEAR_LIST,
	MOUTH_STYLES,
	ORNAMENTS,
	POSES,
	PRESET_OUTFITS,
	PROPS,
	type SavedClosetSlot,
	SLEEVES_LIST,
	TOPS_LIST,
} from "../data/items";
import { SoundEngine } from "../engine/audio";
import { renderPixelRoze } from "../engine/pixelRenderer";
import { renderCharacter } from "../engine/renderer";
import { CANVAS_H, CANVAS_W } from "../engine/rig";

const CLOSET_STORAGE_KEY = "roze_dressup_closet_v1";
const MAX_HISTORY = 25;

export class DressUpApp {
	private root: HTMLElement;
	private state: DressUpState;
	private history: DressUpState[] = [];
	private activeCategory: CategoryId = "presets";
	private animate = true;
	private mainPixelMode = false;
	private currentQuote = PRESET_OUTFITS[0].quote;
	private sound = new SoundEngine();

	private mainCanvas!: HTMLCanvasElement;
	private pixelCanvas!: HTMLCanvasElement;
	private pixelWipeEl!: HTMLButtonElement;
	private speechTextEl!: HTMLElement;
	private wardrobeEl!: HTMLElement;
	private tabsEl!: HTMLElement;
	private modalEl!: HTMLElement;
	private toastEl!: HTMLElement;
	private toastTimer: number | null = null;
	private rafId: number | null = null;
	private startTime = performance.now();

	constructor(root: HTMLElement) {
		this.root = root;
		const urlParams = new URLSearchParams(window.location.search);
		const encoded = urlParams.get("c");
		const decoded = encoded ? decodeStateFromQuery(encoded) : null;
		this.state = { ...DEFAULT_STATE, ...(decoded ?? {}) };
		this.buildShell();
		this.renderTabs();
		this.renderWardrobe();
		this.bindGlobalShortcuts();
		this.startLoop();
	}

	private buildShell(): void {
		this.root.innerHTML = "";

		// Topbar
		const topbar = document.createElement("header");
		topbar.className = "topbar";

		const brand = document.createElement("div");
		brand.className = "brand";
		brand.innerHTML = `
			<div class="brand-crest" aria-hidden="true"></div>
			<div>
				<div class="brand-title">束音ロゼの着せ替え館</div>
				<span class="brand-sub">TABANE ROZE // ROSENFELD DRESS-UP</span>
			</div>
		`;

		const actions = document.createElement("div");
		actions.className = "topbar-actions";

		const addTopBtn = (
			label: string,
			icon: string,
			cls: string,
			onClick: () => void,
			hideLabelOnMobile = false,
		) => {
			const b = document.createElement("button");
			b.type = "button";
			b.className = `btn ${cls}`;
			b.innerHTML = `<span>${icon}</span><span class="${hideLabelOnMobile ? "btn-label-hide-sm" : ""}">${label}</span>`;
			b.addEventListener("click", onClick);
			actions.appendChild(b);
			return b;
		};

		addTopBtn("おまかせ", "🎲", "", () => this.randomizeOutfit(), true);
		addTopBtn("公式", "↺", "", () => this.resetToOfficial(), true);
		addTopBtn("お題採点", "★", "btn-jade", () => this.openChallengeModal());
		addTopBtn("保存帳", "📁", "", () => this.openClosetModal(), true);
		addTopBtn("共有", "🔗", "", () => void this.copyShareUrl(), true);
		addTopBtn("撮影", "📷", "btn-primary", () => this.openExportModal());

		topbar.append(brand, actions);

		// Main workspace
		const workspace = document.createElement("main");
		workspace.className = "workspace";

		// Stage Pane
		const stagePane = document.createElement("section");
		stagePane.className = "stage-pane";

		const stageFrame = document.createElement("div");
		stageFrame.className = "stage-frame";

		this.mainCanvas = document.createElement("canvas");
		this.mainCanvas.id = "main-canvas";
		this.mainCanvas.width = CANVAS_W;
		this.mainCanvas.height = CANVAS_H;

		// Stage floating HUD
		const hudTop = document.createElement("div");
		hudTop.className = "stage-hud-top";

		const leftGroup = document.createElement("div");
		leftGroup.className = "hud-pill-group";

		const undoBtn = document.createElement("button");
		undoBtn.type = "button";
		undoBtn.className = "hud-btn";
		undoBtn.textContent = "↶ もどす";
		undoBtn.addEventListener("click", () => this.undo());

		const pixelToggleBtn = document.createElement("button");
		pixelToggleBtn.type = "button";
		pixelToggleBtn.className = "hud-btn";
		pixelToggleBtn.textContent = "👾 ドット表示";
		pixelToggleBtn.addEventListener("click", () => {
			this.sound.playTap();
			this.mainPixelMode = !this.mainPixelMode;
			pixelToggleBtn.classList.toggle("on", this.mainPixelMode);
			this.syncCanvasMode();
		});

		const animBtn = document.createElement("button");
		animBtn.type = "button";
		animBtn.className = "hud-btn on";
		animBtn.textContent = "✦ 動き ON";
		animBtn.addEventListener("click", () => {
			this.sound.playTap();
			this.animate = !this.animate;
			animBtn.classList.toggle("on", this.animate);
			animBtn.textContent = this.animate ? "✦ 動き ON" : "✦ 動き OFF";
		});

		leftGroup.append(undoBtn, pixelToggleBtn, animBtn);

		const rightGroup = document.createElement("div");
		rightGroup.className = "hud-pill-group";

		const bgmBtn = document.createElement("button");
		bgmBtn.type = "button";
		bgmBtn.className = "hud-btn";
		bgmBtn.textContent = "♫ BGM OFF";
		bgmBtn.addEventListener("click", () => {
			const on = this.sound.toggleBgm();
			bgmBtn.classList.toggle("on", on);
			bgmBtn.textContent = on ? "♫ BGM ON" : "♫ BGM OFF";
		});

		const seBtn = document.createElement("button");
		seBtn.type = "button";
		seBtn.className = "hud-btn on";
		seBtn.textContent = "🔊 SE";
		seBtn.addEventListener("click", () => {
			const next = !this.sound.isSeEnabled();
			this.sound.setSeEnabled(next);
			seBtn.classList.toggle("on", next);
			seBtn.textContent = next ? "🔊 SE" : "🔇 SE";
			if (next) this.sound.playTap();
		});

		rightGroup.append(bgmBtn, seBtn);
		hudTop.append(leftGroup, rightGroup);

		// Speech Bubble
		const speech = document.createElement("div");
		speech.className = "speech-bubble";
		const spName = document.createElement("span");
		spName.className = "speech-name";
		spName.textContent = "束音ロゼ";
		this.speechTextEl = document.createElement("span");
		this.speechTextEl.textContent = this.currentQuote;
		speech.append(spName, this.speechTextEl);

		// Pixel corner wipe
		this.pixelWipeEl = document.createElement("button");
		this.pixelWipeEl.type = "button";
		this.pixelWipeEl.className = "pixel-wipe";
		this.pixelWipeEl.title = "クリックでドット絵拡大表示に切替";
		this.pixelCanvas = document.createElement("canvas");
		this.pixelCanvas.id = "pixel-canvas";
		this.pixelCanvas.width = 64;
		this.pixelCanvas.height = 64;
		const pxLabel = document.createElement("span");
		pxLabel.className = "pixel-wipe-label";
		pxLabel.textContent = "64×64 DOT";
		this.pixelWipeEl.append(this.pixelCanvas, pxLabel);
		this.pixelWipeEl.addEventListener("click", () => {
			this.sound.playTap();
			this.mainPixelMode = !this.mainPixelMode;
			pixelToggleBtn.classList.toggle("on", this.mainPixelMode);
			this.syncCanvasMode();
		});

		stageFrame.append(this.mainCanvas, hudTop, speech, this.pixelWipeEl);
		stagePane.appendChild(stageFrame);

		// Wardrobe Pane
		const wardrobePane = document.createElement("section");
		wardrobePane.className = "wardrobe-pane";

		this.tabsEl = document.createElement("nav");
		this.tabsEl.className = "cat-tabs";

		this.wardrobeEl = document.createElement("div");
		this.wardrobeEl.className = "wardrobe-scroll";

		wardrobePane.append(this.tabsEl, this.wardrobeEl);
		workspace.append(stagePane, wardrobePane);

		// Modal & Toast
		this.modalEl = document.createElement("div");
		this.modalEl.className = "modal-backdrop hidden";
		this.modalEl.addEventListener("click", (e) => {
			if (e.target === this.modalEl) this.closeModal();
		});

		this.toastEl = document.createElement("div");
		this.toastEl.className = "toast";

		this.root.append(topbar, workspace, this.modalEl, this.toastEl);
	}

	private syncCanvasMode(): void {
		this.mainCanvas.classList.toggle("pixel-mode", this.mainPixelMode);
		this.pixelWipeEl.classList.toggle("hidden", this.mainPixelMode);
		if (this.mainPixelMode) {
			this.mainCanvas.width = 64;
			this.mainCanvas.height = 64;
		} else {
			this.mainCanvas.width = CANVAS_W;
			this.mainCanvas.height = CANVAS_H;
		}
	}

	private bindGlobalShortcuts(): void {
		window.addEventListener("keydown", (e) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return;
			}
			if (e.key === "Escape") {
				this.closeModal();
			} else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				this.undo();
			}
		});
	}

	private startLoop(): void {
		const loop = (now: number) => {
			const t = this.animate ? (now - this.startTime) / 1000 : 0;
			if (this.mainPixelMode) {
				renderPixelRoze(this.mainCanvas, this.state, t, false);
			} else {
				const ctx = this.mainCanvas.getContext("2d");
				if (ctx) {
					renderCharacter(ctx, this.state, t, { animate: this.animate });
				}
				renderPixelRoze(this.pixelCanvas, this.state, t, false);
			}
			this.rafId = window.requestAnimationFrame(loop);
		};
		this.rafId = window.requestAnimationFrame(loop);
	}

	public destroy(): void {
		if (this.rafId !== null) window.cancelAnimationFrame(this.rafId);
	}

	private updateState(
		patch: Partial<DressUpState>,
		quote?: string,
		silent = false,
	): void {
		this.history.push({ ...this.state });
		if (this.history.length > MAX_HISTORY) this.history.shift();
		this.state = { ...this.state, ...patch };
		if (!silent) this.sound.playEquip();
		if (quote) {
			this.currentQuote = quote;
			this.speechTextEl.textContent = quote;
		}
		this.renderWardrobe();
	}

	private undo(): void {
		const prev = this.history.pop();
		if (!prev) {
			this.showToast("これ以上戻せません");
			return;
		}
		this.state = prev;
		this.sound.playTap();
		this.renderWardrobe();
		this.showToast("1つ前の状態に戻しました");
	}

	private resetToOfficial(): void {
		this.sound.playSparkle();
		this.updateState({ ...DEFAULT_STATE }, PRESET_OUTFITS[0].quote, true);
		this.showToast("公式立ち絵コーデに戻しました");
	}

	private randomizeOutfit(): void {
		const pick = <T>(arr: readonly T[]): T =>
			arr[Math.floor(Math.random() * arr.length)];
		this.sound.playSparkle();
		this.updateState(
			{
				pose: pick(POSES).id,
				hair: pick(HAIR_STYLES).id,
				hairColor: pick(HAIR_COLORS).id,
				hairHue: 0,
				innerHue: 0,
				eyes: pick(EYE_STYLES).id,
				mouth: pick(MOUTH_STYLES).id,
				cheek: pick(CHEEK_STYLES).id,
				faceAcc: Math.random() < 0.35 ? pick(FACE_ACCS).id : "none",
				tops: pick(TOPS_LIST).id,
				topsTheme: pick(COLOR_THEMES).id,
				topsHue: 0,
				sleeves: pick(SLEEVES_LIST).id,
				sleevesTheme: pick(COLOR_THEMES).id,
				sleevesHue: 0,
				bottoms: pick(BOTTOMS_LIST).id,
				bottomsTheme: pick(COLOR_THEMES).id,
				bottomsHue: 0,
				legwear: pick(LEGWEAR_LIST).id,
				legwearTheme: pick(COLOR_THEMES).id,
				legwearHue: 0,
				ornament: pick(ORNAMENTS).id,
				headset: pick(HEADSETS).id,
				headwear: Math.random() < 0.55 ? pick(HEADWEARS).id : "none",
				prop: Math.random() < 0.7 ? pick(PROPS).id : "none",
				bg: pick(BGS).id,
				backFx: pick(BACK_FXS).id,
			},
			"じゃじゃーん！ランダムおまかせコーデ、どうかな？似合ってる？",
			true,
		);
	}

	private renderTabs(): void {
		this.tabsEl.innerHTML = "";
		for (const cat of CATEGORIES) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = `cat-tab ${this.activeCategory === cat.id ? "active" : ""}`;
			btn.innerHTML = `<span>${cat.icon}</span><span>${cat.label}</span>`;
			btn.addEventListener("click", () => {
				this.sound.playTap();
				this.activeCategory = cat.id;
				this.renderTabs();
				this.renderWardrobe();
			});
			this.tabsEl.appendChild(btn);
		}
	}

	private renderWardrobe(): void {
		this.wardrobeEl.innerHTML = "";
		const cat = this.activeCategory;

		if (cat === "presets") {
			this.renderPresetSection();
			this.renderItemSection("ポーズ", POSES, "pose");
			this.renderOjToggle();
		} else if (cat === "hair") {
			this.renderItemSection("髪型スタイル", HAIR_STYLES, "hair");
			this.renderHairColorSection();
		} else if (cat === "face") {
			this.renderItemSection("目・瞳", EYE_STYLES, "eyes");
			this.renderItemSection("口元", MOUTH_STYLES, "mouth");
			this.renderItemSection("チーク・ホクロ", CHEEK_STYLES, "cheek");
			this.renderItemSection("眼鏡・眼帯・バイザー", FACE_ACCS, "faceAcc");
		} else if (cat === "tops") {
			this.renderColorBar("トップスの配色", "topsTheme", "topsHue");
			this.renderItemSection("トップス", TOPS_LIST, "tops");
		} else if (cat === "sleeves") {
			this.renderColorBar(
				"袖・アームウェアの配色",
				"sleevesTheme",
				"sleevesHue",
			);
			this.renderItemSection("袖・アームウェア", SLEEVES_LIST, "sleeves");
		} else if (cat === "bottoms") {
			this.renderColorBar("ボトムス・腰布の配色", "bottomsTheme", "bottomsHue");
			this.renderItemSection("ボトムス・腰布", BOTTOMS_LIST, "bottoms");
		} else if (cat === "legwear") {
			this.renderColorBar(
				"靴・レッグウェアの配色",
				"legwearTheme",
				"legwearHue",
			);
			this.renderItemSection("靴・レッグウェア", LEGWEAR_LIST, "legwear");
		} else if (cat === "accessory") {
			this.renderItemSection("陰陽玉の髪飾り", ORNAMENTS, "ornament");
			this.renderItemSection("左耳ヘッドセット", HEADSETS, "headset");
			this.renderItemSection("帽子・頭飾り", HEADWEARS, "headwear");
			this.renderItemSection("手持ち・周囲のマスコット", PROPS, "prop");
			this.renderOjToggle();
		} else if (cat === "bg") {
			this.renderItemSection("背景ロケーション", BGS, "bg");
			if (this.state.bg === "simple_studio") {
				this.renderStudioColorPicker();
			}
			this.renderItemSection("背面エフェクト", BACK_FXS, "backFx");
		}
	}

	private renderPresetSection(): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-header"><div class="section-title">お気に入りコーデ一括着せ替え</div></div>`;

		const grid = document.createElement("div");
		grid.className = "item-grid";
		for (const p of PRESET_OUTFITS) {
			const expected = { ...DEFAULT_STATE, ...p.patch };
			const isCurrent = (Object.keys(expected) as (keyof DressUpState)[]).every(
				(k) => this.state[k] === expected[k],
			);
			const card = document.createElement("button");
			card.type = "button";
			card.className = `item-card ${isCurrent ? "selected" : ""}`;
			card.innerHTML = `
				<div class="item-top">
					<span class="swatch-dots">
						${p.swatch.map((c) => `<span class="swatch-dot" style="background:${c}"></span>`).join("")}
					</span>
				</div>
				<div class="item-name">${p.name}</div>
				<div class="item-desc">${p.subtitle}</div>
			`;
			card.addEventListener("click", () => {
				this.sound.playSparkle();
				this.updateState({ ...DEFAULT_STATE, ...p.patch }, p.quote, true);
			});
			grid.appendChild(card);
		}
		block.appendChild(grid);
		this.wardrobeEl.appendChild(block);
	}

	private renderOjToggle(): void {
		const row = document.createElement("div");
		row.className = "toggle-row";
		row.innerHTML = `<span>左肩の「0J」刻印を表示</span>`;
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = `btn ${this.state.ojMark ? "btn-active" : ""}`;
		btn.textContent = this.state.ojMark ? "表示 ON" : "非表示 OFF";
		btn.addEventListener("click", () => {
			this.updateState({ ojMark: !this.state.ojMark });
		});
		row.appendChild(btn);
		this.wardrobeEl.appendChild(row);
	}

	private renderItemSection<K extends keyof DressUpState>(
		title: string,
		items: ItemMeta<DressUpState[K] & string>[],
		stateKey: K,
	): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-header"><div class="section-title">${title}</div></div>`;

		const grid = document.createElement("div");
		grid.className = "item-grid";

		for (const item of items) {
			const selected = this.state[stateKey] === item.id;
			const card = document.createElement("button");
			card.type = "button";
			card.className = `item-card ${selected ? "selected" : ""}`;
			card.innerHTML = `
				<div class="item-top">
					<span class="swatch-dots">
						${item.swatch.map((c) => `<span class="swatch-dot" style="background:${c}"></span>`).join("")}
					</span>
					${item.badge ? `<span class="item-badge">${item.badge}</span>` : ""}
				</div>
				<div class="item-name">${item.name}</div>
				<div class="item-desc">${item.desc}</div>
			`;
			card.addEventListener("click", () => {
				this.updateState({
					[stateKey]: item.id,
				} as Partial<DressUpState>);
			});
			grid.appendChild(card);
		}
		block.appendChild(grid);
		this.wardrobeEl.appendChild(block);
	}

	private renderColorBar(
		title: string,
		themeKey: "topsTheme" | "sleevesTheme" | "bottomsTheme" | "legwearTheme",
		hueKey: "topsHue" | "sleevesHue" | "bottomsHue" | "legwearHue",
	): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-header"><div class="section-title">${title}</div></div>`;

		const bar = document.createElement("div");
		bar.className = "color-bar";

		const chips = document.createElement("div");
		chips.className = "theme-chips";
		for (const t of COLOR_THEMES) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = `theme-chip ${this.state[themeKey] === t.id ? "active" : ""}`;
			btn.innerHTML = `
				<span class="swatch-dots">
					<span class="swatch-dot" style="background:${t.main}"></span>
					<span class="swatch-dot" style="background:${t.accent}"></span>
				</span>
				<span>${t.name}</span>
			`;
			btn.addEventListener("click", () => {
				this.updateState({
					[themeKey]: t.id as ColorThemeId,
					[hueKey]: 0,
				} as Partial<DressUpState>);
			});
			chips.appendChild(btn);
		}
		bar.appendChild(chips);
		bar.appendChild(this.createHueRow("色相微調整", hueKey));

		block.appendChild(bar);
		this.wardrobeEl.appendChild(block);
	}

	private renderHairColorSection(): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-header"><div class="section-title">髪色＆インナーカラー</div></div>`;

		const bar = document.createElement("div");
		bar.className = "color-bar";

		const chips = document.createElement("div");
		chips.className = "theme-chips";
		for (const hc of HAIR_COLORS) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = `theme-chip ${this.state.hairColor === hc.id ? "active" : ""}`;
			btn.innerHTML = `
				<span class="swatch-dots">
					<span class="swatch-dot" style="background:${hc.main}"></span>
					<span class="swatch-dot" style="background:${hc.inner}"></span>
				</span>
				<span>${hc.name}</span>
			`;
			btn.addEventListener("click", () => {
				this.updateState({
					hairColor: hc.id,
					hairHue: 0,
					innerHue: 0,
				});
			});
			chips.appendChild(btn);
		}
		bar.appendChild(chips);
		bar.appendChild(this.createHueRow("メイン髪色相", "hairHue"));
		bar.appendChild(this.createHueRow("インナー・瞳色相", "innerHue"));

		block.appendChild(bar);
		this.wardrobeEl.appendChild(block);
	}

	private createHueRow(
		label: string,
		hueKey:
			| "hairHue"
			| "innerHue"
			| "topsHue"
			| "sleevesHue"
			| "bottomsHue"
			| "legwearHue",
	): HTMLElement {
		const row = document.createElement("div");
		row.className = "hue-row";
		const lbl = document.createElement("span");
		lbl.textContent = label;

		const slider = document.createElement("input");
		slider.type = "range";
		slider.className = "hue-slider";
		slider.min = "-180";
		slider.max = "180";
		slider.step = "5";
		slider.value = String(this.state[hueKey]);
		slider.addEventListener("input", () => {
			this.state = { ...this.state, [hueKey]: Number(slider.value) };
		});

		const reset = document.createElement("button");
		reset.type = "button";
		reset.className = "hue-reset";
		reset.textContent = "0°";
		reset.addEventListener("click", () => {
			this.updateState({ [hueKey]: 0 } as Partial<DressUpState>);
		});

		row.append(lbl, slider, reset);
		return row;
	}

	private renderStudioColorPicker(): void {
		const row = document.createElement("div");
		row.className = "toggle-row";
		row.innerHTML = `<span>スタジオ背景色</span>`;

		const input = document.createElement("input");
		input.type = "color";
		input.value = this.state.studioBg;
		input.addEventListener("input", () => {
			this.state = { ...this.state, studioBg: input.value };
		});
		row.appendChild(input);
		this.wardrobeEl.appendChild(row);
	}

	private openModal(inner: HTMLElement): void {
		this.modalEl.innerHTML = "";
		this.modalEl.appendChild(inner);
		this.modalEl.classList.remove("hidden");
	}

	private closeModal(): void {
		this.modalEl.classList.add("hidden");
	}

	private openChallengeModal(): void {
		this.sound.playTap();
		const card = document.createElement("div");
		card.className = "modal-card";
		card.innerHTML = `
			<div class="modal-head">
				<div class="modal-title">★ お題コーデチャレンジ</div>
				<button type="button" class="btn" id="close-modal">✕</button>
			</div>
			<p class="item-desc">選んだテーマに合わせてロゼを着せ替えよう！採点ボタンを押すと今のコーデをロゼが評価してくれるよ。</p>
		`;

		const resultContainer = document.createElement("div");
		const list = document.createElement("div");
		list.style.display = "flex";
		list.style.flexDirection = "column";
		list.style.gap = "10px";

		for (const th of CHALLENGE_THEMES) {
			const item = document.createElement("div");
			item.className = "challenge-card";
			item.innerHTML = `
				<div class="item-top">
					<div>
						<div class="item-name">${th.title}</div>
						<div class="item-desc">${th.subtitle}</div>
					</div>
					<button type="button" class="btn btn-jade">採点する</button>
				</div>
				<div class="item-desc">${th.clientHint}</div>
			`;
			const gradeBtn = item.querySelector("button");
			gradeBtn?.addEventListener("click", () => {
				const res = evaluateChallenge(this.state, th);
				this.sound.playFanfare(res.rank);
				this.currentQuote = res.comment;
				this.speechTextEl.textContent = res.comment;
				resultContainer.innerHTML = `
					<div class="challenge-result">
						<div style="display:flex;align-items:center;gap:12px;">
							<div class="rank-badge">${res.rank}</div>
							<div>
								<div style="font-weight:800;font-size:1rem;">${th.title} — ${res.score} / 100点</div>
								<div class="item-desc">一致タグ: ${res.matchedTags.join(", ") || "なし"}</div>
							</div>
						</div>
						<div style="font-size:0.84rem;line-height:1.45;">${res.comment}</div>
					</div>
				`;
			});
			list.appendChild(item);
		}

		card.append(resultContainer, list);
		card
			.querySelector("#close-modal")
			?.addEventListener("click", () => this.closeModal());
		this.openModal(card);
	}

	private readCloset(): (SavedClosetSlot | null)[] {
		try {
			const raw = localStorage.getItem(CLOSET_STORAGE_KEY);
			if (!raw) return Array(6).fill(null);
			const parsed = JSON.parse(raw) as (SavedClosetSlot | null)[];
			return Array.from({ length: 6 }, (_, i) => parsed[i] ?? null);
		} catch {
			return Array(6).fill(null);
		}
	}

	private writeCloset(slots: (SavedClosetSlot | null)[]): void {
		localStorage.setItem(CLOSET_STORAGE_KEY, JSON.stringify(slots));
	}

	private openClosetModal(): void {
		this.sound.playTap();
		const card = document.createElement("div");
		card.className = "modal-card";
		card.innerHTML = `
			<div class="modal-head">
				<div class="modal-title">📁 マイクローゼット（6枠保存）</div>
				<button type="button" class="btn" id="close-modal">✕</button>
			</div>
			<p class="item-desc">お気に入りの着せ替えコーデをブラウザに保存して、いつでも着替えられます。</p>
		`;

		const grid = document.createElement("div");
		grid.className = "closet-grid";

		const rebuildGrid = () => {
			grid.innerHTML = "";
			const slots = this.readCloset();
			slots.forEach((slot, idx) => {
				const el = document.createElement("div");
				el.className = "closet-slot";
				el.innerHTML = slot
					? `<div class="item-name">スロット ${idx + 1}: ${slot.name}</div><div class="item-desc">${slot.savedAt}</div>`
					: `<div class="item-name">スロット ${idx + 1}（空き）</div><div class="item-desc">現在のコーデを保存できます</div>`;

				const row = document.createElement("div");
				row.style.display = "flex";
				row.style.gap = "6px";

				const saveBtn = document.createElement("button");
				saveBtn.type = "button";
				saveBtn.className = "btn btn-jade";
				saveBtn.textContent = "上書保存";
				saveBtn.addEventListener("click", () => {
					const next = this.readCloset();
					next[idx] = {
						name: `コーデ #${idx + 1}`,
						savedAt: new Date().toLocaleString("ja-JP"),
						state: { ...this.state },
					};
					this.writeCloset(next);
					this.sound.playEquip();
					this.showToast(`スロット ${idx + 1} に保存しました`);
					rebuildGrid();
				});
				row.appendChild(saveBtn);

				if (slot) {
					const loadBtn = document.createElement("button");
					loadBtn.type = "button";
					loadBtn.className = "btn";
					loadBtn.textContent = "着る";
					loadBtn.addEventListener("click", () => {
						this.updateState(
							{ ...DEFAULT_STATE, ...slot.state },
							`保存してあった「${slot.name}」に着替えたよ！`,
						);
						this.closeModal();
					});
					const delBtn = document.createElement("button");
					delBtn.type = "button";
					delBtn.className = "btn";
					delBtn.textContent = "削除";
					delBtn.addEventListener("click", () => {
						const next = this.readCloset();
						next[idx] = null;
						this.writeCloset(next);
						rebuildGrid();
					});
					row.append(loadBtn, delBtn);
				}

				el.appendChild(row);
				grid.appendChild(el);
			});
		};

		rebuildGrid();
		card.appendChild(grid);
		card
			.querySelector("#close-modal")
			?.addEventListener("click", () => this.closeModal());
		this.openModal(card);
	}

	private openExportModal(): void {
		this.sound.playTap();
		const card = document.createElement("div");
		card.className = "modal-card";
		card.innerHTML = `
			<div class="modal-head">
				<div class="modal-title">📷 撮影・PNG画像保存</div>
				<button type="button" class="btn" id="close-modal">✕</button>
			</div>
			<p class="item-desc">形式を選んでダウンロードできます（高解像度 900×1200 または ドット絵 512×512）。</p>
		`;

		const btns = document.createElement("div");
		btns.style.display = "grid";
		btns.style.gap = "8px";

		const mkBtn = (label: string, desc: string, onClick: () => void) => {
			const b = document.createElement("button");
			b.type = "button";
			b.className = "item-card";
			b.innerHTML = `<div class="item-name">${label}</div><div class="item-desc">${desc}</div>`;
			b.addEventListener("click", () => {
				this.sound.playShutter();
				onClick();
				this.closeModal();
			});
			btns.appendChild(b);
		};

		mkBtn(
			"通常イラスト保存（背景あり）",
			"現在の背景・エフェクト込みで保存",
			() =>
				this.downloadIllustration({ transparent: false, cardWatermark: false }),
		);
		mkBtn(
			"背景透過イラスト保存（切り抜きPNG）",
			"動画・サムネ素材に便利な透過PNG",
			() =>
				this.downloadIllustration({ transparent: true, cardWatermark: false }),
		);
		mkBtn(
			"ロゴ入り記念カード保存",
			"枠と「束音ロゼ」ネームロゴ付きカード",
			() =>
				this.downloadIllustration({ transparent: false, cardWatermark: true }),
		);
		mkBtn(
			"64×64 ドット絵拡大保存（512×512 PNG）",
			"くっきり拡大したちびドット絵",
			() => this.downloadPixelPng(),
		);

		card.appendChild(btns);
		card
			.querySelector("#close-modal")
			?.addEventListener("click", () => this.closeModal());
		this.openModal(card);
	}

	private downloadIllustration(opts: {
		transparent: boolean;
		cardWatermark: boolean;
	}): void {
		const off = document.createElement("canvas");
		off.width = CANVAS_W;
		off.height = CANVAS_H;
		const ctx = off.getContext("2d");
		if (!ctx) return;
		renderCharacter(ctx, this.state, 0, {
			animate: false,
			transparent: opts.transparent,
			cardWatermark: opts.cardWatermark,
		});
		const suffix = opts.transparent
			? "transparent"
			: opts.cardWatermark
				? "card"
				: "illust";
		this.triggerDownload(off, `tabane_roze_${suffix}.png`);
		this.showToast("画像を保存しました！");
	}

	private downloadPixelPng(): void {
		const small = document.createElement("canvas");
		renderPixelRoze(small, this.state, 0, false);
		const big = document.createElement("canvas");
		big.width = 512;
		big.height = 512;
		const ctx = big.getContext("2d");
		if (!ctx) return;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(small, 0, 0, 512, 512);
		this.triggerDownload(big, "tabane_roze_pixel.png");
		this.showToast("ドット絵画像を保存しました！");
	}

	private triggerDownload(canvas: HTMLCanvasElement, filename: string): void {
		const a = document.createElement("a");
		a.href = canvas.toDataURL("image/png");
		a.download = filename;
		a.click();
	}

	private async copyShareUrl(): Promise<void> {
		this.sound.playTap();
		const encoded = encodeStateToQuery(this.state);
		const url = new URL(window.location.href);
		url.searchParams.set("c", encoded);
		window.history.replaceState(null, "", url.toString());
		try {
			await navigator.clipboard.writeText(url.toString());
			this.showToast("共有URLをクリップボードにコピーしました！");
		} catch {
			this.showToast("URL欄を更新しました（コピーして共有できます）");
		}
	}

	private showToast(msg: string): void {
		this.toastEl.textContent = msg;
		this.toastEl.classList.add("show");
		if (this.toastTimer !== null) window.clearTimeout(this.toastTimer);
		this.toastTimer = window.setTimeout(() => {
			this.toastEl.classList.remove("show");
		}, 2400);
	}
}
