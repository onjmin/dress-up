import {
	BACK_FXS,
	BGS,
	BOTTOMS_LIST,
	CATEGORIES,
	type CategoryId,
	CHEEK_STYLES,
	COLOR_THEMES,
	type ColorThemeId,
	DEFAULT_STATE,
	type DressUpState,
	decodeStateFromQuery,
	EYE_STYLES,
	encodeStateToQuery,
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
import { renderCharacter } from "../engine/renderer";
import { CANVAS_H, CANVAS_W } from "../engine/rig";

const CLOSET_STORAGE_KEY = "roze_dressup_closet_v1";
const MAX_HISTORY = 25;

export class DressUpApp {
	private root: HTMLElement;
	private state: DressUpState;
	private history: DressUpState[] = [];
	private activeCategory: CategoryId = "presets";
	private faceZoom = false;
	private stageExpanded = false;
	private panX = 0;
	private panY = 0;
	private dragging = false;
	private dragStartX = 0;
	private dragStartY = 0;
	private lastTapTime = 0;

	private workspaceEl!: HTMLElement;
	private mainCanvas!: HTMLCanvasElement;
	private zoomBtn!: HTMLButtonElement;
	private toneBtn!: HTMLButtonElement;
	private expandBtn!: HTMLButtonElement;
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
		this.syncHudButtons();
		this.bindGlobalShortcuts();
		this.startLoop();
	}

	private buildShell(): void {
		this.root.innerHTML = "";

		// Compact Topbar (mobile-first: title + 4 clean actions)
		const topbar = document.createElement("header");
		topbar.className = "topbar";

		const brand = document.createElement("div");
		brand.className = "brand";
		brand.innerHTML = `
			<div class="brand-crest" aria-hidden="true"></div>
			<div class="brand-title">束音ロゼ着せ替え</div>
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
		};

		addTopBtn("おまかせ", "🎲", "", () => this.randomizeOutfit(), true);
		addTopBtn("公式", "↺", "", () => this.resetToOfficial(), true);
		addTopBtn("保存帳", "📁", "", () => this.openClosetModal(), true);
		addTopBtn("保存/共有", "📷", "btn-primary", () => this.openExportModal());

		topbar.append(brand, actions);

		// Workspace
		this.workspaceEl = document.createElement("main");
		this.workspaceEl.className = "workspace";

		// Stage Pane
		const stagePane = document.createElement("section");
		stagePane.className = "stage-pane";

		const stageFrame = document.createElement("div");
		stageFrame.className = "stage-frame";

		this.mainCanvas = document.createElement("canvas");
		this.mainCanvas.id = "main-canvas";
		this.mainCanvas.width = CANVAS_W;
		this.mainCanvas.height = CANVAS_H;
		this.bindStageGestures(stageFrame);

		// Minimal Stage Floating HUD (Top Left & Top Right only)
		const hudTop = document.createElement("div");
		hudTop.className = "stage-hud-top";

		const leftGroup = document.createElement("div");
		leftGroup.className = "hud-pill-group";

		const undoBtn = document.createElement("button");
		undoBtn.type = "button";
		undoBtn.className = "hud-btn";
		undoBtn.textContent = "↶ もどす";
		undoBtn.addEventListener("click", () => this.undo());

		this.zoomBtn = document.createElement("button");
		this.zoomBtn.type = "button";
		this.zoomBtn.className = "hud-btn";
		this.zoomBtn.addEventListener("click", () => this.toggleFaceZoom());

		leftGroup.append(undoBtn, this.zoomBtn);

		const rightGroup = document.createElement("div");
		rightGroup.className = "hud-pill-group";

		this.toneBtn = document.createElement("button");
		this.toneBtn.type = "button";
		this.toneBtn.className = "hud-btn";
		this.toneBtn.addEventListener("click", () => {
			this.updateState({
				bgTone: this.state.bgTone === "light" ? "dark" : "light",
			});
		});

		this.expandBtn = document.createElement("button");
		this.expandBtn.type = "button";
		this.expandBtn.className = "hud-btn mobile-only";
		this.expandBtn.addEventListener("click", () => {
			this.stageExpanded = !this.stageExpanded;
			this.workspaceEl.classList.toggle("stage-expanded", this.stageExpanded);
			this.syncHudButtons();
		});

		rightGroup.append(this.toneBtn, this.expandBtn);
		hudTop.append(leftGroup, rightGroup);

		stageFrame.append(this.mainCanvas);
		stagePane.append(stageFrame, hudTop);

		// Wardrobe Pane
		const wardrobePane = document.createElement("section");
		wardrobePane.className = "wardrobe-pane";

		this.tabsEl = document.createElement("nav");
		this.tabsEl.className = "cat-tabs";

		this.wardrobeEl = document.createElement("div");
		this.wardrobeEl.className = "wardrobe-scroll";

		wardrobePane.append(this.tabsEl, this.wardrobeEl);
		this.workspaceEl.append(stagePane, wardrobePane);

		// Modal & Toast
		this.modalEl = document.createElement("div");
		this.modalEl.className = "modal-backdrop hidden";
		this.modalEl.addEventListener("click", (e) => {
			if (e.target === this.modalEl) this.closeModal();
		});

		this.toastEl = document.createElement("div");
		this.toastEl.className = "toast";

		this.root.append(topbar, this.workspaceEl, this.modalEl, this.toastEl);
	}

	private bindStageGestures(stageFrame: HTMLElement): void {
		stageFrame.addEventListener("pointerdown", (e) => {
			if ((e.target as HTMLElement).closest(".hud-btn")) return;
			const now = Date.now();
			if (now - this.lastTapTime < 280) {
				this.toggleFaceZoom();
				this.lastTapTime = 0;
				return;
			}
			this.lastTapTime = now;
			if (!this.faceZoom) return;
			this.dragging = true;
			this.dragStartX = e.clientX - this.panX;
			this.dragStartY = e.clientY - this.panY;
			stageFrame.setPointerCapture(e.pointerId);
		});

		stageFrame.addEventListener("pointermove", (e) => {
			if (!this.dragging || !this.faceZoom) return;
			this.panX = Math.max(-110, Math.min(110, e.clientX - this.dragStartX));
			this.panY = Math.max(-180, Math.min(90, e.clientY - this.dragStartY));
			this.applyCanvasTransform();
		});

		const stopDrag = () => {
			this.dragging = false;
		};
		stageFrame.addEventListener("pointerup", stopDrag);
		stageFrame.addEventListener("pointercancel", stopDrag);
	}

	private toggleFaceZoom(): void {
		this.faceZoom = !this.faceZoom;
		if (!this.faceZoom) {
			this.panX = 0;
			this.panY = 0;
		}
		this.applyCanvasTransform();
		this.syncHudButtons();
	}

	private applyCanvasTransform(): void {
		if (!this.faceZoom) {
			this.mainCanvas.style.transform = "scale(1) translate(0px, 0px)";
			return;
		}
		this.mainCanvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(2.0)`;
	}

	private syncHudButtons(): void {
		this.zoomBtn.textContent = this.faceZoom ? "🔍 全身" : "🔍 顔アップ";
		this.zoomBtn.classList.toggle("on", this.faceZoom);

		const isLight = this.state.bgTone === "light";
		this.toneBtn.textContent = isLight ? "☀️ 明るめ" : "🌙 暗め";
		this.toneBtn.classList.toggle("light-pill", isLight);

		this.expandBtn.textContent = this.stageExpanded ? "↕ 標準" : "↕ 広く見る";
		this.expandBtn.classList.toggle("on", this.stageExpanded);
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
			const t = (now - this.startTime) / 1000;
			const ctx = this.mainCanvas.getContext("2d");
			if (ctx) {
				renderCharacter(ctx, this.state, t, { animate: true });
			}
			this.rafId = window.requestAnimationFrame(loop);
		};
		this.rafId = window.requestAnimationFrame(loop);
	}

	public destroy(): void {
		if (this.rafId !== null) window.cancelAnimationFrame(this.rafId);
	}

	private updateState(patch: Partial<DressUpState>): void {
		this.history.push({ ...this.state });
		if (this.history.length > MAX_HISTORY) this.history.shift();
		this.state = { ...this.state, ...patch };
		this.syncHudButtons();
		this.renderWardrobe();
	}

	private undo(): void {
		const prev = this.history.pop();
		if (!prev) {
			this.showToast("これ以上戻せません");
			return;
		}
		this.state = prev;
		this.syncHudButtons();
		this.renderWardrobe();
		this.showToast("1つ前に戻しました");
	}

	private resetToOfficial(): void {
		this.updateState({ ...DEFAULT_STATE });
		this.showToast("公式立ち絵に戻しました");
	}

	private randomizeOutfit(): void {
		const pick = <T>(arr: readonly T[]): T =>
			arr[Math.floor(Math.random() * arr.length)];
		this.updateState({
			pose: pick(POSES).id,
			hair: pick(HAIR_STYLES).id,
			hairColor: pick(HAIR_COLORS).id,
			eyes: pick(EYE_STYLES).id,
			mouth: pick(MOUTH_STYLES).id,
			cheek: pick(CHEEK_STYLES).id,
			faceAcc: Math.random() < 0.3 ? pick(FACE_ACCS).id : "none",
			tops: pick(TOPS_LIST).id,
			topsTheme: pick(COLOR_THEMES).id,
			sleeves: pick(SLEEVES_LIST).id,
			sleevesTheme: pick(COLOR_THEMES).id,
			bottoms: pick(BOTTOMS_LIST).id,
			bottomsTheme: pick(COLOR_THEMES).id,
			legwear: pick(LEGWEAR_LIST).id,
			legwearTheme: pick(COLOR_THEMES).id,
			ornament: pick(ORNAMENTS).id,
			headset: pick(HEADSETS).id,
			headwear: Math.random() < 0.45 ? pick(HEADWEARS).id : "none",
			prop: Math.random() < 0.65 ? pick(PROPS).id : "none",
			bg: pick(BGS).id,
			backFx: pick(BACK_FXS).id,
		});
	}

	private renderTabs(): void {
		this.tabsEl.innerHTML = "";
		for (const cat of CATEGORIES) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = `cat-tab ${this.activeCategory === cat.id ? "active" : ""}`;
			btn.textContent = cat.label;
			btn.addEventListener("click", () => {
				this.activeCategory = cat.id;
				this.renderTabs();
				this.renderWardrobe();
				this.wardrobeEl.scrollTop = 0;
				const active = this.tabsEl.querySelector(".cat-tab.active");
				active?.scrollIntoView({
					behavior: "smooth",
					inline: "center",
					block: "nearest",
				});
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
		} else if (cat === "hair") {
			this.renderHairColorSection();
			this.renderItemSection("髪型", HAIR_STYLES, "hair");
		} else if (cat === "face") {
			this.renderItemSection("目・瞳", EYE_STYLES, "eyes");
			this.renderItemSection("口元", MOUTH_STYLES, "mouth");
			this.renderItemSection("チーク", CHEEK_STYLES, "cheek");
			this.renderItemSection("眼鏡・眼帯", FACE_ACCS, "faceAcc");
		} else if (cat === "tops") {
			this.renderColorBar("トップスの色", "topsTheme");
			this.renderItemSection("トップス", TOPS_LIST, "tops");
			this.renderColorBar("袖の色", "sleevesTheme");
			this.renderItemSection("袖・アームウェア", SLEEVES_LIST, "sleeves");
		} else if (cat === "bottoms") {
			this.renderColorBar("ボトムスの色", "bottomsTheme");
			this.renderItemSection("ボトムス・腰布", BOTTOMS_LIST, "bottoms");
			this.renderColorBar("靴・レッグウェアの色", "legwearTheme");
			this.renderItemSection("靴・レッグウェア", LEGWEAR_LIST, "legwear");
		} else if (cat === "accessory") {
			this.renderItemSection("陰陽玉", ORNAMENTS, "ornament");
			this.renderItemSection("ヘッドセット", HEADSETS, "headset");
			this.renderItemSection("帽子・頭飾り", HEADWEARS, "headwear");
			this.renderItemSection("手持ち・マスコット", PROPS, "prop");
			this.renderOjToggle();
		} else if (cat === "bg") {
			this.renderBgToneBar();
			this.renderItemSection("背景ロケーション", BGS, "bg");
			this.renderItemSection("背面エフェクト", BACK_FXS, "backFx");
		}
	}

	private renderPresetSection(): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-title">お気に入りコーデ</div>`;

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
			`;
			card.addEventListener("click", () => {
				this.updateState({ ...DEFAULT_STATE, ...p.patch });
			});
			grid.appendChild(card);
		}
		block.appendChild(grid);
		this.wardrobeEl.appendChild(block);
	}

	private renderBgToneBar(): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-title">背景の明るさ</div>`;

		const bar = document.createElement("div");
		bar.className = "seg-bar";

		for (const opt of [
			{ id: "light" as const, label: "☀️ 明るめ（見やすい）" },
			{ id: "dark" as const, label: "🌙 暗め（夜・ネオン）" },
		]) {
			const b = document.createElement("button");
			b.type = "button";
			b.className = `seg-btn ${this.state.bgTone === opt.id ? "active" : ""}`;
			b.textContent = opt.label;
			b.addEventListener("click", () => this.updateState({ bgTone: opt.id }));
			bar.appendChild(b);
		}
		block.appendChild(bar);
		this.wardrobeEl.appendChild(block);
	}

	private renderOjToggle(): void {
		const row = document.createElement("div");
		row.className = "toggle-row";
		row.innerHTML = `<span>左肩「0J」刻印</span>`;
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = `btn ${this.state.ojMark ? "btn-active" : ""}`;
		btn.textContent = this.state.ojMark ? "表示 ON" : "OFF";
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
		block.innerHTML = `<div class="section-title">${title}</div>`;

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
	): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-title">${title}</div>`;

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
				} as Partial<DressUpState>);
			});
			chips.appendChild(btn);
		}
		block.appendChild(chips);
		this.wardrobeEl.appendChild(block);
	}

	private renderHairColorSection(): void {
		const block = document.createElement("div");
		block.className = "section-block";
		block.innerHTML = `<div class="section-title">髪色＆インナー</div>`;

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
				this.updateState({ hairColor: hc.id });
			});
			chips.appendChild(btn);
		}
		block.appendChild(chips);
		this.wardrobeEl.appendChild(block);
	}

	private openModal(inner: HTMLElement): void {
		this.modalEl.innerHTML = "";
		this.modalEl.appendChild(inner);
		this.modalEl.classList.remove("hidden");
	}

	private closeModal(): void {
		this.modalEl.classList.add("hidden");
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
		const card = document.createElement("div");
		card.className = "modal-card";
		card.innerHTML = `
			<div class="modal-head">
				<div class="modal-title">📁 コーデ保存帳</div>
				<button type="button" class="btn" id="close-modal">✕</button>
			</div>
			<p class="item-desc">お気に入りのコーデを最大6つ保存できます。</p>
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
					? `<div class="item-name">枠 ${idx + 1}: ${slot.name}</div><div class="item-desc">${slot.savedAt}</div>`
					: `<div class="item-name">枠 ${idx + 1}（空き）</div>`;

				const row = document.createElement("div");
				row.style.display = "flex";
				row.style.gap = "6px";

				const saveBtn = document.createElement("button");
				saveBtn.type = "button";
				saveBtn.className = "btn btn-jade";
				saveBtn.textContent = "保存";
				saveBtn.addEventListener("click", () => {
					const next = this.readCloset();
					next[idx] = {
						name: `コーデ #${idx + 1}`,
						savedAt: new Date().toLocaleString("ja-JP"),
						state: { ...this.state },
					};
					this.writeCloset(next);
					this.showToast(`枠 ${idx + 1} に保存しました`);
					rebuildGrid();
				});
				row.appendChild(saveBtn);

				if (slot) {
					const loadBtn = document.createElement("button");
					loadBtn.type = "button";
					loadBtn.className = "btn";
					loadBtn.textContent = "着る";
					loadBtn.addEventListener("click", () => {
						this.updateState({ ...DEFAULT_STATE, ...slot.state });
						this.closeModal();
					});
					const delBtn = document.createElement("button");
					delBtn.type = "button";
					delBtn.className = "btn";
					delBtn.textContent = "消す";
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
		const card = document.createElement("div");
		card.className = "modal-card";
		card.innerHTML = `
			<div class="modal-head">
				<div class="modal-title">📷 画像保存・共有</div>
				<button type="button" class="btn" id="close-modal">✕</button>
			</div>
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
				onClick();
				this.closeModal();
			});
			btns.appendChild(b);
		};

		mkBtn("画像保存（背景あり PNG）", "900×1200 の高解像度画像", () =>
			this.downloadIllustration({ transparent: false, cardWatermark: false }),
		);
		mkBtn("透過PNG保存（切り抜き）", "背景なしの立ち絵素材として保存", () =>
			this.downloadIllustration({ transparent: true, cardWatermark: false }),
		);
		mkBtn("ロゴ入りカード保存", "枠と「束音ロゼ」ネームロゴ付き", () =>
			this.downloadIllustration({ transparent: false, cardWatermark: true }),
		);
		mkBtn("共有URLをコピー", "今のコーデをURLで送れます", () => {
			void this.copyShareUrl();
		});

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
		const a = document.createElement("a");
		a.href = off.toDataURL("image/png");
		a.download = `tabane_roze_${suffix}.png`;
		a.click();
		this.showToast("画像を保存しました");
	}

	private async copyShareUrl(): Promise<void> {
		const encoded = encodeStateToQuery(this.state);
		const url = new URL(window.location.href);
		url.searchParams.set("c", encoded);
		window.history.replaceState(null, "", url.toString());
		try {
			await navigator.clipboard.writeText(url.toString());
			this.showToast("共有URLをコピーしました");
		} catch {
			this.showToast("アドレス欄のURLをコピーできます");
		}
	}

	private showToast(msg: string): void {
		this.toastEl.textContent = msg;
		this.toastEl.classList.add("show");
		if (this.toastTimer !== null) window.clearTimeout(this.toastTimer);
		this.toastTimer = window.setTimeout(() => {
			this.toastEl.classList.remove("show");
		}, 2200);
	}
}
