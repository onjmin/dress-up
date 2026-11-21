export type PoseId = "official" | "idol" | "cool";

export type BgTone = "light" | "dark";

export type ColorThemeId =
	| "official"
	| "cyber_teal"
	| "crimson_gold"
	| "white_fox"
	| "night_sakura";

export type HairStyleId =
	| "hime_bun"
	| "long_hime"
	| "high_twin"
	| "chignon"
	| "bob_cut";

export type HairColorId =
	| "roze_official"
	| "midnight_crimson"
	| "silver_jade"
	| "plum_sakura"
	| "amber_obsidian";

export type EyeStyleId =
	| "normal"
	| "wink"
	| "smile"
	| "jito"
	| "surprised"
	| "heart"
	| "spiral";

export type MouthStyleId =
	| "smile"
	| "fang"
	| "calm"
	| "pout"
	| "open_o"
	| "tongue";

export type CheekStyleId = "normal" | "blush_lines" | "tear_mole" | "none";

export type FaceAccId =
	| "none"
	| "eyepatch_white"
	| "eyepatch_black"
	| "cyber_visor"
	| "round_glasses";

export type TopId =
	| "china_keyhole"
	| "china_vest"
	| "cyber_crop"
	| "red_china_dress"
	| "oversize_hoodie"
	| "gothic_corset"
	| "summer_bikini";

export type SleeveId =
	| "bell_wide"
	| "neon_wide"
	| "hagoromo"
	| "china_gloves"
	| "cyber_arm"
	| "none";

export type BottomId =
	| "flame_hakama"
	| "china_miniskirt"
	| "cyber_shorts"
	| "miko_hakama"
	| "gothic_skirt"
	| "tech_cargo";

export type LegwearId =
	| "barefoot"
	| "china_boots"
	| "cyber_kneehigh"
	| "garter_heels"
	| "kungfu_tights"
	| "striped_leggings";

export type OrnamentId = "jade" | "red_white" | "black_gold" | "none";

export type HeadsetId = "jade" | "neon_pink" | "gold" | "none";

export type HeadwearId =
	| "none"
	| "jiangshi_hat"
	| "neko_headphones"
	| "kanzashi"
	| "crown"
	| "beret";

export type PropId =
	| "none"
	| "fan"
	| "onibi_lantern"
	| "stand_mic"
	| "guitar"
	| "plush_myau"
	| "plush_ghost";

export type BgId =
	| "cyber_china"
	| "ghost_shrine"
	| "utau_stage"
	| "onj_room"
	| "sunset_sea"
	| "simple_studio";

export type BackFxId =
	| "none"
	| "onibi_aura"
	| "cyber_glitch"
	| "bagua_ring"
	| "music_notes";

export type CategoryId =
	| "presets"
	| "hair"
	| "face"
	| "tops"
	| "bottoms"
	| "accessory"
	| "bg";

export interface DressUpState {
	pose: PoseId;
	ojMark: boolean;
	hair: HairStyleId;
	hairColor: HairColorId;
	eyes: EyeStyleId;
	mouth: MouthStyleId;
	cheek: CheekStyleId;
	faceAcc: FaceAccId;
	tops: TopId;
	topsTheme: ColorThemeId;
	sleeves: SleeveId;
	sleevesTheme: ColorThemeId;
	bottoms: BottomId;
	bottomsTheme: ColorThemeId;
	legwear: LegwearId;
	legwearTheme: ColorThemeId;
	ornament: OrnamentId;
	headset: HeadsetId;
	headwear: HeadwearId;
	prop: PropId;
	bg: BgId;
	bgTone: BgTone;
	backFx: BackFxId;
}

export interface ItemMeta<T extends string> {
	id: T;
	name: string;
	badge?: string;
	swatch: [string, string, string];
}

export interface ColorThemeMeta {
	id: ColorThemeId;
	name: string;
	main: string;
	mainDark: string;
	mainLight: string;
	accent: string;
	accentDark: string;
	accentLight: string;
	trim: string;
	glow: string;
	glowSoft: string;
}

export interface HairColorMeta {
	id: HairColorId;
	name: string;
	main: string;
	mainShade: string;
	mainHighlight: string;
	inner: string;
	innerShade: string;
	innerLight: string;
	eye: string;
}

export interface PresetOutfit {
	id: string;
	name: string;
	patch: Partial<DressUpState>;
	swatch: [string, string, string];
}

export interface SavedClosetSlot {
	name: string;
	savedAt: string;
	state: DressUpState;
}

export const DEFAULT_STATE: DressUpState = {
	pose: "official",
	ojMark: true,
	hair: "hime_bun",
	hairColor: "roze_official",
	eyes: "normal",
	mouth: "smile",
	cheek: "normal",
	faceAcc: "none",
	tops: "china_keyhole",
	topsTheme: "official",
	sleeves: "bell_wide",
	sleevesTheme: "official",
	bottoms: "flame_hakama",
	bottomsTheme: "official",
	legwear: "barefoot",
	legwearTheme: "official",
	ornament: "jade",
	headset: "jade",
	headwear: "none",
	prop: "none",
	bg: "simple_studio",
	bgTone: "light",
	backFx: "onibi_aura",
};

export const CATEGORIES: { id: CategoryId; label: string }[] = [
	{ id: "presets", label: "コーデ" },
	{ id: "hair", label: "髪" },
	{ id: "face", label: "顔" },
	{ id: "tops", label: "トップス" },
	{ id: "bottoms", label: "ボトムス" },
	{ id: "accessory", label: "飾り" },
	{ id: "bg", label: "背景" },
];

export const COLOR_THEMES: ColorThemeMeta[] = [
	{
		id: "official",
		name: "標準",
		main: "#2b2833",
		mainDark: "#191720",
		mainLight: "#444052",
		accent: "#c92434",
		accentDark: "#8c1321",
		accentLight: "#ef4b5b",
		trim: "#dcb45c",
		glow: "#ff66a8",
		glowSoft: "#ffcbe3",
	},
	{
		id: "cyber_teal",
		name: "蒼翠",
		main: "#1e262e",
		mainDark: "#11161c",
		mainLight: "#354352",
		accent: "#1ea889",
		accentDark: "#106f5a",
		accentLight: "#4de2be",
		trim: "#9ff5df",
		glow: "#35f0c8",
		glowSoft: "#bffcf0",
	},
	{
		id: "crimson_gold",
		name: "紅蓮",
		main: "#b81d2b",
		mainDark: "#790e1a",
		mainLight: "#dc3d4b",
		accent: "#e5b84b",
		accentDark: "#a87e22",
		accentLight: "#ffe187",
		trim: "#f7e7c0",
		glow: "#ff9b42",
		glowSoft: "#ffe4b8",
	},
	{
		id: "white_fox",
		name: "白狐",
		main: "#f0ecf2",
		mainDark: "#cbc3d4",
		mainLight: "#ffffff",
		accent: "#d12a3d",
		accentDark: "#961827",
		accentLight: "#f45d6d",
		trim: "#d8af52",
		glow: "#ff729f",
		glowSoft: "#ffd9e8",
	},
	{
		id: "night_sakura",
		name: "夜桜",
		main: "#33254a",
		mainDark: "#1f1530",
		mainLight: "#4f3a70",
		accent: "#e85fa6",
		accentDark: "#a83373",
		accentLight: "#ff93cb",
		trim: "#f4d1ff",
		glow: "#ff80d5",
		glowSoft: "#ffd8f4",
	},
];

export const HAIR_COLORS: HairColorMeta[] = [
	{
		id: "roze_official",
		name: "黒×青緑",
		main: "#22222c",
		mainShade: "#13131a",
		mainHighlight: "#47485c",
		inner: "#26b391",
		innerShade: "#147d64",
		innerLight: "#69e8c8",
		eye: "#169c74",
	},
	{
		id: "midnight_crimson",
		name: "漆黒×紅",
		main: "#1f1c24",
		mainShade: "#121017",
		mainHighlight: "#463c50",
		inner: "#d92b42",
		innerShade: "#941628",
		innerLight: "#ff7385",
		eye: "#d42c44",
	},
	{
		id: "silver_jade",
		name: "白銀×翡翠",
		main: "#e8ebf2",
		mainShade: "#bcc3d4",
		mainHighlight: "#ffffff",
		inner: "#2cc7a4",
		innerShade: "#17886f",
		innerLight: "#8ef7df",
		eye: "#22b895",
	},
	{
		id: "plum_sakura",
		name: "紫紺×桜",
		main: "#443066",
		mainShade: "#2a1c42",
		mainHighlight: "#70549e",
		inner: "#f578b8",
		innerShade: "#b5417d",
		innerLight: "#ffb6dc",
		eye: "#56cc9d",
	},
	{
		id: "amber_obsidian",
		name: "琥珀×黒",
		main: "#2b2420",
		mainShade: "#1a1512",
		mainHighlight: "#57483f",
		inner: "#f0b443",
		innerShade: "#b37c19",
		innerLight: "#ffe08c",
		eye: "#e09c2b",
	},
];

export const POSES: ItemMeta<PoseId>[] = [
	{
		id: "official",
		name: "公式立ち絵",
		badge: "公式",
		swatch: ["#2b2833", "#c92434", "#26b391"],
	},
	{ id: "idol", name: "ステージ", swatch: ["#26b391", "#ff66a8", "#ffe187"] },
	{ id: "cool", name: "モデル立ち", swatch: ["#354352", "#dcb45c", "#f0ecf2"] },
];

export const HAIR_STYLES: ItemMeta<HairStyleId>[] = [
	{
		id: "hime_bun",
		name: "姫カット＋お団子",
		badge: "公式",
		swatch: ["#22222c", "#26b391", "#69e8c8"],
	},
	{
		id: "long_hime",
		name: "ロング姫カット",
		swatch: ["#22222c", "#26b391", "#47485c"],
	},
	{
		id: "high_twin",
		name: "ハイツイン",
		swatch: ["#22222c", "#26b391", "#ff66a8"],
	},
	{
		id: "chignon",
		name: "中華シニヨン",
		swatch: ["#22222c", "#c92434", "#dcb45c"],
	},
	{
		id: "bob_cut",
		name: "内巻きボブ",
		swatch: ["#22222c", "#26b391", "#f0b443"],
	},
];

export const EYE_STYLES: ItemMeta<EyeStyleId>[] = [
	{
		id: "normal",
		name: "通常",
		badge: "公式",
		swatch: ["#169c74", "#ffffff", "#22222c"],
	},
	{ id: "wink", name: "ウィンク", swatch: ["#169c74", "#ff729f", "#ffffff"] },
	{ id: "smile", name: "にっこり", swatch: ["#22222c", "#ff8ab2", "#ffe4b8"] },
	{ id: "jito", name: "ジト目", swatch: ["#147d64", "#444052", "#ffffff"] },
	{
		id: "surprised",
		name: "びっくり",
		swatch: ["#2cc7a4", "#ffffff", "#dcb45c"],
	},
	{ id: "heart", name: "ハート瞳", swatch: ["#ff4e93", "#ff99c6", "#ffffff"] },
	{
		id: "spiral",
		name: "ぐるぐる目",
		swatch: ["#35f0c8", "#ff66a8", "#22222c"],
	},
];

export const MOUTH_STYLES: ItemMeta<MouthStyleId>[] = [
	{
		id: "smile",
		name: "微笑顔",
		badge: "公式",
		swatch: ["#e07882", "#fde2d2", "#22222c"],
	},
	{ id: "fang", name: "八重歯笑い", swatch: ["#ef4b5b", "#ffffff", "#fde2d2"] },
	{ id: "calm", name: "おすまし", swatch: ["#b8636d", "#fde2d2", "#22222c"] },
	{ id: "pout", name: "むっ", swatch: ["#d9707d", "#f89aa8", "#fde2d2"] },
	{ id: "open_o", name: "ほわっ", swatch: ["#e86477", "#ffd8de", "#fde2d2"] },
	{ id: "tongue", name: "てへぺろ", swatch: ["#ff7796", "#fde2d2", "#ffffff"] },
];

export const CHEEK_STYLES: ItemMeta<CheekStyleId>[] = [
	{
		id: "normal",
		name: "標準チーク",
		badge: "公式",
		swatch: ["#f89aa8", "#fde2d2", "#ffffff"],
	},
	{
		id: "blush_lines",
		name: "照れ斜線",
		swatch: ["#ff6b8b", "#ffb0c4", "#fde2d2"],
	},
	{
		id: "tear_mole",
		name: "泣きぼくろ",
		swatch: ["#362934", "#f89aa8", "#fde2d2"],
	},
	{ id: "none", name: "なし", swatch: ["#fde2d2", "#f2bfa8", "#ffffff"] },
];

export const FACE_ACCS: ItemMeta<FaceAccId>[] = [
	{
		id: "none",
		name: "なし",
		badge: "公式",
		swatch: ["#fde2d2", "#2b2833", "#26b391"],
	},
	{
		id: "eyepatch_white",
		name: "白眼帯",
		swatch: ["#f4f2f7", "#d3cde0", "#22222c"],
	},
	{
		id: "eyepatch_black",
		name: "黒中華眼帯",
		swatch: ["#231f2b", "#c92434", "#dcb45c"],
	},
	{
		id: "cyber_visor",
		name: "電脳バイザー",
		swatch: ["#2ce8be", "#12242c", "#9ff5df"],
	},
	{
		id: "round_glasses",
		name: "丸メガネ",
		swatch: ["#dcb45c", "#e4f2f7", "#2b2833"],
	},
];

export const TOPS_LIST: ItemMeta<TopId>[] = [
	{
		id: "china_keyhole",
		name: "黒チャイナ開口",
		badge: "公式",
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
	{
		id: "china_vest",
		name: "チャイナベスト",
		swatch: ["#2b2833", "#dcb45c", "#c92434"],
	},
	{
		id: "cyber_crop",
		name: "電脳ジャケット",
		swatch: ["#1e262e", "#26b391", "#4de2be"],
	},
	{
		id: "red_china_dress",
		name: "華紅チャイナ",
		swatch: ["#c92434", "#dcb45c", "#f7e7c0"],
	},
	{
		id: "oversize_hoodie",
		name: "ダボパーカー",
		swatch: ["#d46b48", "#2b2833", "#26b391"],
	},
	{
		id: "gothic_corset",
		name: "ゴシックコルセット",
		swatch: ["#231e2c", "#f0ecf2", "#1ea889"],
	},
	{
		id: "summer_bikini",
		name: "中華ビキニ",
		swatch: ["#2b2833", "#ff66a8", "#dcb45c"],
	},
];

export const SLEEVES_LIST: ItemMeta<SleeveId>[] = [
	{
		id: "bell_wide",
		name: "紅袖口の黒広袖",
		badge: "公式",
		swatch: ["#2b2833", "#c92434", "#ef4b5b"],
	},
	{
		id: "neon_wide",
		name: "青緑ネオン広袖",
		swatch: ["#1e262e", "#26b391", "#4de2be"],
	},
	{
		id: "hagoromo",
		name: "天女の羽衣袖",
		swatch: ["#ff9bc7", "#69e8c8", "#fff0f7"],
	},
	{
		id: "china_gloves",
		name: "ロング手袋",
		swatch: ["#2b2833", "#dcb45c", "#c92434"],
	},
	{
		id: "cyber_arm",
		name: "アームカバー",
		swatch: ["#252c36", "#35f0c8", "#dcb45c"],
	},
	{
		id: "none",
		name: "なし（素腕）",
		swatch: ["#fde2d2", "#c92434", "#f2bfa8"],
	},
];

export const BOTTOMS_LIST: ItemMeta<BottomId>[] = [
	{
		id: "flame_hakama",
		name: "鬼火と雷文の腰布",
		badge: "公式",
		swatch: ["#c92434", "#ff8fc1", "#dcb45c"],
	},
	{
		id: "china_miniskirt",
		name: "チャイナミニ",
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
	{
		id: "cyber_shorts",
		name: "電脳ショーツ",
		swatch: ["#1e262e", "#26b391", "#9ff5df"],
	},
	{
		id: "miko_hakama",
		name: "幽玄・緋袴",
		swatch: ["#b81d2b", "#f7f3f0", "#dcb45c"],
	},
	{
		id: "gothic_skirt",
		name: "ゴシックフリル",
		swatch: ["#231e2c", "#1ea889", "#d8d0e5"],
	},
	{
		id: "tech_cargo",
		name: "カーゴパンツ",
		swatch: ["#343642", "#26b391", "#dcb45c"],
	},
];

export const LEGWEAR_LIST: ItemMeta<LegwearId>[] = [
	{
		id: "barefoot",
		name: "素足（鬼火）",
		badge: "公式",
		swatch: ["#fde2d2", "#ff8fc1", "#ffcbe3"],
	},
	{
		id: "china_boots",
		name: "中華ブーツ",
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
	{
		id: "cyber_kneehigh",
		name: "サイバーニーハイ",
		swatch: ["#1b1e26", "#26b391", "#4de2be"],
	},
	{
		id: "garter_heels",
		name: "ガーター＆ヒール",
		swatch: ["#f0ecf2", "#231e2c", "#d12a3d"],
	},
	{
		id: "kungfu_tights",
		name: "カンフー＆タイツ",
		swatch: ["#2b2833", "#f0ecf2", "#c92434"],
	},
	{
		id: "striped_leggings",
		name: "ラインソックス",
		swatch: ["#2b2833", "#26b391", "#ffffff"],
	},
];

export const ORNAMENTS: ItemMeta<OrnamentId>[] = [
	{
		id: "jade",
		name: "翡翠の陰陽玉",
		badge: "公式",
		swatch: ["#36a888", "#f5f2eb", "#dcb45c"],
	},
	{
		id: "red_white",
		name: "紅白の陰陽玉",
		swatch: ["#c92434", "#f5f2eb", "#dcb45c"],
	},
	{
		id: "black_gold",
		name: "黒金の陰陽玉",
		swatch: ["#231e2c", "#dcb45c", "#f5f2eb"],
	},
	{ id: "none", name: "なし", swatch: ["#22222c", "#47485c", "#26b391"] },
];

export const HEADSETS: ItemMeta<HeadsetId>[] = [
	{
		id: "jade",
		name: "公式ヘッドセット",
		badge: "公式",
		swatch: ["#34343e", "#36a888", "#c92434"],
	},
	{
		id: "neon_pink",
		name: "ピンクマイク",
		swatch: ["#2b2833", "#ff66a8", "#ffffff"],
	},
	{
		id: "gold",
		name: "ゴールドマイク",
		swatch: ["#dcb45c", "#2b2833", "#f7e7c0"],
	},
	{ id: "none", name: "なし", swatch: ["#fde2d2", "#22222c", "#f89aa8"] },
];

export const HEADWEARS: ItemMeta<HeadwearId>[] = [
	{
		id: "none",
		name: "帽子なし",
		badge: "公式",
		swatch: ["#22222c", "#36a888", "#f5f2eb"],
	},
	{
		id: "jiangshi_hat",
		name: "キョンシー帽",
		swatch: ["#21202b", "#f0dc73", "#c92434"],
	},
	{
		id: "neko_headphones",
		name: "ネコミミ",
		swatch: ["#222630", "#35f0c8", "#ff66a8"],
	},
	{
		id: "kanzashi",
		name: "蓮花かんざし",
		swatch: ["#ff7ba8", "#dcb45c", "#c92434"],
	},
	{
		id: "crown",
		name: "ミニティアラ",
		swatch: ["#f0c965", "#26b391", "#ffffff"],
	},
	{
		id: "beret",
		name: "中華ベレー",
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
];

export const PROPS: ItemMeta<PropId>[] = [
	{
		id: "none",
		name: "なし",
		badge: "公式",
		swatch: ["#2b2833", "#444052", "#c92434"],
	},
	{
		id: "fan",
		name: "紅金の中華扇",
		swatch: ["#c92434", "#dcb45c", "#36a888"],
	},
	{
		id: "onibi_lantern",
		name: "鬼火提灯",
		swatch: ["#26b391", "#ff80bd", "#2b2833"],
	},
	{
		id: "stand_mic",
		name: "スタンドマイク",
		swatch: ["#dcb45c", "#2b2833", "#35f0c8"],
	},
	{
		id: "guitar",
		name: "エレキギター",
		swatch: ["#1e262e", "#26b391", "#ef4b5b"],
	},
	{
		id: "plush_myau",
		name: "ミャウミャウ",
		swatch: ["#b8dde0", "#a68567", "#26b391"],
	},
	{
		id: "plush_ghost",
		name: "おばけロゼ",
		swatch: ["#eefcf9", "#36a888", "#ff8fc1"],
	},
];

export const BGS: ItemMeta<BgId>[] = [
	{
		id: "simple_studio",
		name: "シンプル背景",
		badge: "見やすい",
		swatch: ["#f3efe6", "#26b391", "#1b1626"],
	},
	{
		id: "cyber_china",
		name: "中華街",
		swatch: ["#e8e2d8", "#c92434", "#26b391"],
	},
	{
		id: "ghost_shrine",
		name: "竹林の祠",
		swatch: ["#cfe5de", "#ff66a8", "#16142e"],
	},
	{
		id: "utau_stage",
		name: "ライブ会場",
		swatch: ["#daf4ec", "#35f0c8", "#ff4e93"],
	},
	{
		id: "onj_room",
		name: "配信部屋",
		swatch: ["#ebe6dc", "#26b391", "#f0b443"],
	},
	{
		id: "sunset_sea",
		name: "海辺の駅",
		swatch: ["#9ed4ef", "#f06a5b", "#ffd387"],
	},
];

export const BACK_FXS: ItemMeta<BackFxId>[] = [
	{
		id: "onibi_aura",
		name: "鬼火ゆらめき",
		badge: "公式",
		swatch: ["#ff66a8", "#ffcbe3", "#26b391"],
	},
	{
		id: "bagua_ring",
		name: "八卦・陰陽陣",
		swatch: ["#dcb45c", "#26b391", "#c92434"],
	},
	{
		id: "cyber_glitch",
		name: "電脳フレーム",
		swatch: ["#35f0c8", "#ff4e93", "#1e262e"],
	},
	{
		id: "music_notes",
		name: "音符きらめき",
		swatch: ["#35f0c8", "#ffe187", "#ff80bd"],
	},
	{ id: "none", name: "なし", swatch: ["#2b2833", "#444052", "#ffffff"] },
];

export const PRESET_OUTFITS: PresetOutfit[] = [
	{
		id: "official",
		name: "公式立ち絵",
		swatch: ["#2b2833", "#c92434", "#26b391"],
		patch: { ...DEFAULT_STATE },
	},
	{
		id: "cyber_live",
		name: "電脳ライブ",
		swatch: ["#1e262e", "#26b391", "#4de2be"],
		patch: {
			pose: "idol",
			hair: "high_twin",
			hairColor: "roze_official",
			eyes: "wink",
			mouth: "fang",
			cheek: "normal",
			faceAcc: "none",
			tops: "cyber_crop",
			topsTheme: "cyber_teal",
			sleeves: "neon_wide",
			sleevesTheme: "cyber_teal",
			bottoms: "china_miniskirt",
			bottomsTheme: "cyber_teal",
			legwear: "cyber_kneehigh",
			legwearTheme: "cyber_teal",
			ornament: "jade",
			headset: "jade",
			headwear: "neko_headphones",
			prop: "stand_mic",
			bg: "utau_stage",
			bgTone: "dark",
			backFx: "music_notes",
		},
	},
	{
		id: "jiangshi_night",
		name: "キョンシー",
		swatch: ["#21202b", "#f0dc73", "#c92434"],
		patch: {
			pose: "official",
			hair: "hime_bun",
			hairColor: "midnight_crimson",
			eyes: "surprised",
			mouth: "fang",
			cheek: "blush_lines",
			faceAcc: "none",
			tops: "china_vest",
			topsTheme: "official",
			sleeves: "bell_wide",
			sleevesTheme: "official",
			bottoms: "flame_hakama",
			bottomsTheme: "official",
			legwear: "china_boots",
			legwearTheme: "official",
			ornament: "red_white",
			headset: "none",
			headwear: "jiangshi_hat",
			prop: "onibi_lantern",
			bg: "ghost_shrine",
			bgTone: "dark",
			backFx: "bagua_ring",
		},
	},
	{
		id: "street_stream",
		name: "宅録パーカー",
		swatch: ["#d46b48", "#343642", "#26b391"],
		patch: {
			pose: "cool",
			hair: "bob_cut",
			hairColor: "roze_official",
			eyes: "jito",
			mouth: "pout",
			cheek: "normal",
			faceAcc: "round_glasses",
			tops: "oversize_hoodie",
			topsTheme: "official",
			sleeves: "none",
			bottoms: "tech_cargo",
			bottomsTheme: "cyber_teal",
			legwear: "striped_leggings",
			legwearTheme: "cyber_teal",
			ornament: "none",
			headset: "jade",
			headwear: "neko_headphones",
			prop: "plush_myau",
			bg: "onj_room",
			bgTone: "light",
			backFx: "none",
		},
	},
	{
		id: "gothic_fox",
		name: "白狐ゴシック",
		swatch: ["#f0ecf2", "#d12a3d", "#dcb45c"],
		patch: {
			pose: "cool",
			hair: "long_hime",
			hairColor: "silver_jade",
			eyes: "normal",
			mouth: "calm",
			cheek: "tear_mole",
			faceAcc: "eyepatch_black",
			tops: "gothic_corset",
			topsTheme: "white_fox",
			sleeves: "hagoromo",
			sleevesTheme: "white_fox",
			bottoms: "gothic_skirt",
			bottomsTheme: "white_fox",
			legwear: "garter_heels",
			legwearTheme: "white_fox",
			ornament: "red_white",
			headset: "none",
			headwear: "kanzashi",
			prop: "fan",
			bg: "ghost_shrine",
			bgTone: "light",
			backFx: "onibi_aura",
		},
	},
	{
		id: "summer_seaside",
		name: "海辺サマー",
		swatch: ["#2b2833", "#ff66a8", "#ffd387"],
		patch: {
			pose: "idol",
			hair: "chignon",
			hairColor: "roze_official",
			eyes: "smile",
			mouth: "open_o",
			cheek: "blush_lines",
			faceAcc: "none",
			tops: "summer_bikini",
			topsTheme: "night_sakura",
			sleeves: "hagoromo",
			sleevesTheme: "night_sakura",
			bottoms: "china_miniskirt",
			bottomsTheme: "night_sakura",
			legwear: "barefoot",
			ornament: "jade",
			headset: "none",
			headwear: "kanzashi",
			prop: "plush_ghost",
			bg: "sunset_sea",
			bgTone: "light",
			backFx: "none",
		},
	},
];

export function getTheme(id: ColorThemeId): ColorThemeMeta {
	return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

export function getHairColor(id: HairColorId): HairColorMeta {
	return HAIR_COLORS.find((h) => h.id === id) ?? HAIR_COLORS[0];
}

export function encodeStateToQuery(state: DressUpState): string {
	const json = JSON.stringify(state);
	const bytes = new TextEncoder().encode(json);
	let bin = "";
	for (const b of bytes) {
		bin += String.fromCharCode(b);
	}
	return btoa(bin)
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replaceAll("=", "");
}

export function decodeStateFromQuery(
	encoded: string,
): Partial<DressUpState> | null {
	try {
		const norm = encoded.replaceAll("-", "+").replaceAll("_", "/");
		const bin = atob(norm);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) {
			bytes[i] = bin.charCodeAt(i);
		}
		const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Record<
			string,
			unknown
		>;
		if (typeof parsed !== "object" || parsed === null) return null;
		const next: Partial<DressUpState> = {};
		for (const key of Object.keys(DEFAULT_STATE) as (keyof DressUpState)[]) {
			if (key in parsed && typeof parsed[key] === typeof DEFAULT_STATE[key]) {
				(next as Record<string, unknown>)[key] = parsed[key];
			}
		}
		return next;
	} catch {
		return null;
	}
}
