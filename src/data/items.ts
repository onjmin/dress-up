export type PoseId = "official" | "idol" | "cool";

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
	| "sleeves"
	| "bottoms"
	| "legwear"
	| "accessory"
	| "bg";

export interface DressUpState {
	pose: PoseId;
	ojMark: boolean;
	hair: HairStyleId;
	hairColor: HairColorId;
	hairHue: number;
	innerHue: number;
	eyes: EyeStyleId;
	mouth: MouthStyleId;
	cheek: CheekStyleId;
	faceAcc: FaceAccId;
	tops: TopId;
	topsTheme: ColorThemeId;
	topsHue: number;
	sleeves: SleeveId;
	sleevesTheme: ColorThemeId;
	sleevesHue: number;
	bottoms: BottomId;
	bottomsTheme: ColorThemeId;
	bottomsHue: number;
	legwear: LegwearId;
	legwearTheme: ColorThemeId;
	legwearHue: number;
	ornament: OrnamentId;
	headset: HeadsetId;
	headwear: HeadwearId;
	headwearTheme: ColorThemeId;
	prop: PropId;
	bg: BgId;
	studioBg: string;
	backFx: BackFxId;
}

export interface ItemMeta<T extends string> {
	id: T;
	name: string;
	desc: string;
	badge?: string;
	tags: string[];
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
	subtitle: string;
	quote: string;
	patch: Partial<DressUpState>;
	swatch: [string, string, string];
}

export interface ChallengeTheme {
	id: string;
	title: string;
	subtitle: string;
	clientHint: string;
	requiredTags: string[];
	bonusTags: string[];
	preferredBg?: BgId[];
	preferredHair?: HairStyleId[];
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
	hairHue: 0,
	innerHue: 0,
	eyes: "normal",
	mouth: "smile",
	cheek: "normal",
	faceAcc: "none",
	tops: "china_keyhole",
	topsTheme: "official",
	topsHue: 0,
	sleeves: "bell_wide",
	sleevesTheme: "official",
	sleevesHue: 0,
	bottoms: "flame_hakama",
	bottomsTheme: "official",
	bottomsHue: 0,
	legwear: "barefoot",
	legwearTheme: "official",
	legwearHue: 0,
	ornament: "jade",
	headset: "jade",
	headwear: "none",
	headwearTheme: "official",
	prop: "none",
	bg: "cyber_china",
	studioBg: "#1b1626",
	backFx: "onibi_aura",
};

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
	{ id: "presets", label: "コーデ", icon: "✦" },
	{ id: "hair", label: "髪型", icon: "❖" },
	{ id: "face", label: "表情", icon: "◉" },
	{ id: "tops", label: "トップス", icon: "◈" },
	{ id: "sleeves", label: "袖・腕", icon: "❂" },
	{ id: "bottoms", label: "ボトムス", icon: "✧" },
	{ id: "legwear", label: "靴・脚", icon: "❖" },
	{ id: "accessory", label: "小物", icon: "☯" },
	{ id: "bg", label: "背景・効果", icon: "☼" },
];

export const COLOR_THEMES: ColorThemeMeta[] = [
	{
		id: "official",
		name: "標準（黒紅）",
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
		name: "蒼翠（翡翠）",
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
		name: "紅蓮（祝祭）",
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
		name: "白狐（白紅）",
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
		name: "夜桜（紫桃）",
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
		name: "黒×青緑（公式）",
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
		name: "漆黒×紅蓮",
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
		name: "紫紺×夜桜",
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
		name: "琥珀×黒曜",
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
		desc: "片足を軽く上げた定番ポーズ",
		badge: "公式",
		tags: ["official", "china", "ghost", "idol"],
		swatch: ["#2b2833", "#c92434", "#26b391"],
	},
	{
		id: "idol",
		name: "ステージポーズ",
		desc: "歌唱ライブ向けの華やかなポーズ",
		tags: ["live", "cyber", "idol", "cute"],
		swatch: ["#26b391", "#ff66a8", "#ffe187"],
	},
	{
		id: "cool",
		name: "モデル立ち",
		desc: "スラッと脚を見せるクール立ち",
		tags: ["cool", "street", "gothic", "date"],
		swatch: ["#354352", "#dcb45c", "#f0ecf2"],
	},
];

export const HAIR_STYLES: ItemMeta<HairStyleId>[] = [
	{
		id: "hime_bun",
		name: "姫カット＋お団子",
		desc: "ぱっつん＆お団子＆遊び毛の公式髪型",
		badge: "公式",
		tags: ["official", "china", "ghost", "idol", "jiangshi"],
		swatch: ["#22222c", "#26b391", "#69e8c8"],
	},
	{
		id: "long_hime",
		name: "ロング姫カット",
		desc: "お団子を外したさらさら黒髪ロング",
		tags: ["date", "gothic", "cool", "ghost"],
		swatch: ["#22222c", "#26b391", "#47485c"],
	},
	{
		id: "high_twin",
		name: "ハイツインテール",
		desc: "青緑インナーが映えるライブ向けツイン",
		tags: ["live", "cyber", "idol", "cute"],
		swatch: ["#22222c", "#26b391", "#ff66a8"],
	},
	{
		id: "chignon",
		name: "中華シニヨン",
		desc: "うなじがすっきり見えるお団子アップ",
		tags: ["china", "summer", "date", "jiangshi"],
		swatch: ["#22222c", "#c92434", "#dcb45c"],
	},
	{
		id: "bob_cut",
		name: "内巻きボブ",
		desc: "軽やかなショートボブ＋青緑メッシュ",
		tags: ["street", "cute", "summer", "date"],
		swatch: ["#22222c", "#26b391", "#f0b443"],
	},
];

export const EYE_STYLES: ItemMeta<EyeStyleId>[] = [
	{
		id: "normal",
		name: "通常（翡翠瞳）",
		desc: "澄んだ青緑の公式アイ",
		badge: "公式",
		tags: ["official", "idol", "date"],
		swatch: ["#169c74", "#ffffff", "#22222c"],
	},
	{
		id: "wink",
		name: "ウィンク",
		desc: "ステージで決めるお茶目ウィンク",
		tags: ["live", "idol", "cute", "date"],
		swatch: ["#169c74", "#ff729f", "#ffffff"],
	},
	{
		id: "smile",
		name: "にっこり笑顔",
		desc: "楽しそうに目を細めた笑顔",
		tags: ["cute", "summer", "date", "idol"],
		swatch: ["#22222c", "#ff8ab2", "#ffe4b8"],
	},
	{
		id: "jito",
		name: "ジト目",
		desc: "ちょっと呆れたようなクール目線",
		tags: ["street", "cool", "gothic", "ghost"],
		swatch: ["#147d64", "#444052", "#ffffff"],
	},
	{
		id: "surprised",
		name: "びっくり",
		desc: "見開いた丸い瞳",
		tags: ["jiangshi", "cute", "street"],
		swatch: ["#2cc7a4", "#ffffff", "#dcb45c"],
	},
	{
		id: "heart",
		name: "ハート瞳",
		desc: "きらめくハートハイライト",
		tags: ["idol", "cute", "live"],
		swatch: ["#ff4e93", "#ff99c6", "#ffffff"],
	},
	{
		id: "spiral",
		name: "ぐるぐる目",
		desc: "電脳グリッチ＆おんJネタ風の渦巻き目",
		tags: ["cyber", "ghost", "jiangshi"],
		swatch: ["#35f0c8", "#ff66a8", "#22222c"],
	},
];

export const MOUTH_STYLES: ItemMeta<MouthStyleId>[] = [
	{
		id: "smile",
		name: "微笑顔",
		desc: "上品に微笑む公式口元",
		badge: "公式",
		tags: ["official", "china", "date"],
		swatch: ["#e07882", "#fde2d2", "#22222c"],
	},
	{
		id: "fang",
		name: "八重歯笑い",
		desc: "ちっちゃな八重歯が見える元気笑顔",
		tags: ["live", "idol", "cute", "summer"],
		swatch: ["#ef4b5b", "#ffffff", "#fde2d2"],
	},
	{
		id: "calm",
		name: "おすまし",
		desc: "きりっと閉じたクールな口",
		tags: ["cool", "gothic", "ghost"],
		swatch: ["#b8636d", "#fde2d2", "#22222c"],
	},
	{
		id: "pout",
		name: "むっ（テレ口）",
		desc: "ふくれっ面の可愛い口元",
		tags: ["cute", "street", "date"],
		swatch: ["#d9707d", "#f89aa8", "#fde2d2"],
	},
	{
		id: "open_o",
		name: "ほわっ（◯口）",
		desc: "歌うような小さな丸口",
		tags: ["live", "jiangshi", "cute"],
		swatch: ["#e86477", "#ffd8de", "#fde2d2"],
	},
	{
		id: "tongue",
		name: "てへぺろ",
		desc: "ちろっと舌を出したお茶目顔",
		tags: ["street", "cyber", "idol"],
		swatch: ["#ff7796", "#fde2d2", "#ffffff"],
	},
];

export const CHEEK_STYLES: ItemMeta<CheekStyleId>[] = [
	{
		id: "normal",
		name: "ふんわりチーク",
		desc: "自然な桃色の頬",
		badge: "公式",
		tags: ["official", "date"],
		swatch: ["#f89aa8", "#fde2d2", "#ffffff"],
	},
	{
		id: "blush_lines",
		name: "照れ斜線",
		desc: "アニメ調の照れ線入り赤面",
		tags: ["cute", "date", "summer"],
		swatch: ["#ff6b8b", "#ffb0c4", "#fde2d2"],
	},
	{
		id: "tear_mole",
		name: "泣きぼくろ",
		desc: "左目下の色っぽいホクロ",
		tags: ["gothic", "ghost", "cool"],
		swatch: ["#362934", "#f89aa8", "#fde2d2"],
	},
	{
		id: "none",
		name: "チークなし",
		desc: "すっきりした透明肌",
		tags: ["cool", "cyber"],
		swatch: ["#fde2d2", "#f2bfa8", "#ffffff"],
	},
];

export const FACE_ACCS: ItemMeta<FaceAccId>[] = [
	{
		id: "none",
		name: "装飾なし",
		desc: "素顔のまま",
		badge: "公式",
		tags: ["official"],
		swatch: ["#fde2d2", "#2b2833", "#26b391"],
	},
	{
		id: "eyepatch_white",
		name: "白眼帯",
		desc: "中二病・幽玄な雰囲気の白い医療眼帯",
		tags: ["ghost", "gothic"],
		swatch: ["#f4f2f7", "#d3cde0", "#22222c"],
	},
	{
		id: "eyepatch_black",
		name: "黒中華眼帯",
		desc: "赤リボン付き黒サテン眼帯",
		tags: ["china", "gothic", "cool"],
		swatch: ["#231f2b", "#c92434", "#dcb45c"],
	},
	{
		id: "cyber_visor",
		name: "電脳バイザー",
		desc: "半透明青緑のホログラムグラス",
		tags: ["cyber", "live", "street"],
		swatch: ["#2ce8be", "#12242c", "#9ff5df"],
	},
	{
		id: "round_glasses",
		name: "金縁丸メガネ",
		desc: "知的な細フレーム眼鏡",
		tags: ["street", "date", "cool"],
		swatch: ["#dcb45c", "#e4f2f7", "#2b2833"],
	},
];

export const TOPS_LIST: ItemMeta<TopId>[] = [
	{
		id: "china_keyhole",
		name: "黒チャイナ・キーホール",
		desc: "公式の立て襟＆胸元開口＆赤チャイナ留め",
		badge: "公式",
		tags: ["official", "china", "ghost", "live"],
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
	{
		id: "china_vest",
		name: "フルカバー・チャイナベスト",
		desc: "開口を閉じた金刺繍チャイナトップス",
		tags: ["china", "date", "jiangshi"],
		swatch: ["#2b2833", "#dcb45c", "#c92434"],
	},
	{
		id: "cyber_crop",
		name: "電脳クロップジャケット",
		desc: "発光ネオンライン入りテックショート上着",
		tags: ["cyber", "live", "street"],
		swatch: ["#1e262e", "#26b391", "#4de2be"],
	},
	{
		id: "red_china_dress",
		name: "華紅チャイナトップス",
		desc: "祝祭感のある紅地×金パイピング",
		tags: ["china", "idol", "live", "jiangshi"],
		swatch: ["#c92434", "#dcb45c", "#f7e7c0"],
	},
	{
		id: "oversize_hoodie",
		name: "ストリートパーカー",
		desc: "配信部屋や私服にぴったりのダボパーカー",
		tags: ["street", "cute", "date"],
		swatch: ["#d46b48", "#2b2833", "#26b391"],
	},
	{
		id: "gothic_corset",
		name: "ゴシックコルセット",
		desc: "フリル襟＆編み上げの幽玄ブラウス",
		tags: ["gothic", "ghost", "cool"],
		swatch: ["#231e2c", "#f0ecf2", "#1ea889"],
	},
	{
		id: "summer_bikini",
		name: "サマーチャイナビキニ",
		desc: "夏海向けのフリル付き中華水着トップ",
		tags: ["summer", "cute", "date"],
		swatch: ["#2b2833", "#ff66a8", "#dcb45c"],
	},
];

export const SLEEVES_LIST: ItemMeta<SleeveId>[] = [
	{
		id: "bell_wide",
		name: "紅袖口の黒広袖",
		desc: "公式の離れ袖・2本赤ライン・リボン・空洞袖口",
		badge: "公式",
		tags: ["official", "china", "ghost", "jiangshi"],
		swatch: ["#2b2833", "#c92434", "#ef4b5b"],
	},
	{
		id: "neon_wide",
		name: "青緑ネオン広袖",
		desc: "電脳ラインが光るサイバー離れ広袖",
		tags: ["cyber", "live", "idol"],
		swatch: ["#1e262e", "#26b391", "#4de2be"],
	},
	{
		id: "hagoromo",
		name: "天女の羽衣袖",
		desc: "鬼火色に透ける幻想的なシースルー袖",
		tags: ["ghost", "summer", "cute", "date"],
		swatch: ["#ff9bc7", "#69e8c8", "#fff0f7"],
	},
	{
		id: "china_gloves",
		name: "ロングチャイナ手袋",
		desc: "金縁付きのスリムなロンググローブ",
		tags: ["china", "gothic", "cool"],
		swatch: ["#2b2833", "#dcb45c", "#c92434"],
	},
	{
		id: "cyber_arm",
		name: "サイバーアームカバー",
		desc: "ベルトと発光リング付きアームウォーマー",
		tags: ["cyber", "street", "live"],
		swatch: ["#252c36", "#35f0c8", "#dcb45c"],
	},
	{
		id: "none",
		name: "なし（素腕）",
		desc: "肩の「0J」刻印と腕をすっきり見せる",
		tags: ["summer", "street", "date"],
		swatch: ["#fde2d2", "#c92434", "#f2bfa8"],
	},
];

export const BOTTOMS_LIST: ItemMeta<BottomId>[] = [
	{
		id: "flame_hakama",
		name: "鬼火と雷文の紅腰布",
		desc: "公式の雲バックルベルト＆スリット袴＆ピンク鬼火",
		badge: "公式",
		tags: ["official", "china", "ghost"],
		swatch: ["#c92434", "#ff8fc1", "#dcb45c"],
	},
	{
		id: "china_miniskirt",
		name: "チャイナミニスカート",
		desc: "サイドスリット＆タッセル飾りの軽快スカート",
		tags: ["china", "idol", "live", "date", "cute"],
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
	{
		id: "cyber_shorts",
		name: "電脳ショートパンツ",
		desc: "青緑ネオンライン＆垂れベルトのテックショーツ",
		tags: ["cyber", "street", "live", "summer"],
		swatch: ["#1e262e", "#26b391", "#9ff5df"],
	},
	{
		id: "miko_hakama",
		name: "幽玄・緋袴",
		desc: "深紅のプリーツ袴＋白帯の伝統スタイル",
		tags: ["ghost", "jiangshi", "china"],
		swatch: ["#b81d2b", "#f7f3f0", "#dcb45c"],
	},
	{
		id: "gothic_skirt",
		name: "ゴシックフリルスカート",
		desc: "二段レースとリボン付きのロング＆フィッシュテール",
		tags: ["gothic", "cool", "ghost"],
		swatch: ["#231e2c", "#1ea889", "#d8d0e5"],
	},
	{
		id: "tech_cargo",
		name: "ストリートカーゴ",
		desc: "ゆったりシルエットのポケット付きテックパンツ",
		tags: ["street", "cool", "cyber"],
		swatch: ["#343642", "#26b391", "#dcb45c"],
	},
];

export const LEGWEAR_LIST: ItemMeta<LegwearId>[] = [
	{
		id: "barefoot",
		name: "素足（鬼火）",
		desc: "公式の素足＋足首に揺れる淡い鬼火",
		badge: "公式",
		tags: ["official", "ghost", "summer"],
		swatch: ["#fde2d2", "#ff8fc1", "#ffcbe3"],
	},
	{
		id: "china_boots",
		name: "中華ショートブーツ",
		desc: "赤パイピング＆金バックル付きの黒ブーツ",
		tags: ["china", "jiangshi", "idol"],
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
	{
		id: "cyber_kneehigh",
		name: "サイバーニーハイ＆厚底",
		desc: "青緑ラインのニーソックス＋光る厚底スニーカー",
		tags: ["cyber", "live", "street"],
		swatch: ["#1b1e26", "#26b391", "#4de2be"],
	},
	{
		id: "garter_heels",
		name: "レースガーター＆ヒール",
		desc: "透け感のあるガーターソックス＋華奢なパンプス",
		tags: ["gothic", "date", "cute"],
		swatch: ["#f0ecf2", "#231e2c", "#d12a3d"],
	},
	{
		id: "kungfu_tights",
		name: "カンフー靴＆黒タイツ",
		desc: "素足感を残した透けタイツ＋白底カンフーシューズ",
		tags: ["china", "cool", "date"],
		swatch: ["#2b2833", "#f0ecf2", "#c92434"],
	},
	{
		id: "striped_leggings",
		name: "スポーティソックス",
		desc: "青緑ライン入りハイソックス＆スニーカー",
		tags: ["street", "cute", "summer"],
		swatch: ["#2b2833", "#26b391", "#ffffff"],
	},
];

export const ORNAMENTS: ItemMeta<OrnamentId>[] = [
	{
		id: "jade",
		name: "翡翠の陰陽玉",
		desc: "公式の青緑×白・金縁お団子飾り",
		badge: "公式",
		tags: ["official", "china", "ghost"],
		swatch: ["#36a888", "#f5f2eb", "#dcb45c"],
	},
	{
		id: "red_white",
		name: "紅白の陰陽玉",
		desc: "お祝いカラーの紅白お団子飾り",
		tags: ["china", "jiangshi", "idol"],
		swatch: ["#c92434", "#f5f2eb", "#dcb45c"],
	},
	{
		id: "black_gold",
		name: "黒金の陰陽玉",
		desc: "ゴシック＆クールな黒金お団子飾り",
		tags: ["gothic", "cool"],
		swatch: ["#231e2c", "#dcb45c", "#f5f2eb"],
	},
	{
		id: "none",
		name: "なし",
		desc: "髪飾りを外す",
		tags: ["street", "summer"],
		swatch: ["#22222c", "#47485c", "#26b391"],
	},
];

export const HEADSETS: ItemMeta<HeadsetId>[] = [
	{
		id: "jade",
		name: "公式ヘッドセット",
		desc: "左耳のマイク付きヘッドセット（翡翠石）",
		badge: "公式",
		tags: ["official", "live", "cyber"],
		swatch: ["#34343e", "#36a888", "#c92434"],
	},
	{
		id: "neon_pink",
		name: "ネオンピンクマイク",
		desc: "アイドル配信用の桃色発光ヘッドセット",
		tags: ["idol", "cute", "live"],
		swatch: ["#2b2833", "#ff66a8", "#ffffff"],
	},
	{
		id: "gold",
		name: "ゴールドマイク",
		desc: "ステージ用ラグジュアリーモデル",
		tags: ["china", "live", "cool"],
		swatch: ["#dcb45c", "#2b2833", "#f7e7c0"],
	},
	{
		id: "none",
		name: "なし",
		desc: "ヘッドセットを外す",
		tags: ["date", "summer", "ghost"],
		swatch: ["#fde2d2", "#22222c", "#f89aa8"],
	},
];

export const HEADWEARS: ItemMeta<HeadwearId>[] = [
	{
		id: "none",
		name: "帽子なし",
		desc: "お団子・陰陽玉そのまま",
		badge: "公式",
		tags: ["official"],
		swatch: ["#22222c", "#36a888", "#f5f2eb"],
	},
	{
		id: "jiangshi_hat",
		name: "キョンシー帽＆お札",
		desc: "赤いふさと黄色い霊符付きの官帽",
		tags: ["jiangshi", "china", "ghost"],
		swatch: ["#21202b", "#f0dc73", "#c92434"],
	},
	{
		id: "neko_headphones",
		name: "ネコミミヘッドホン",
		desc: "青緑に光るサイバー猫耳ヘッドホン",
		tags: ["cyber", "street", "cute", "live"],
		swatch: ["#222630", "#35f0c8", "#ff66a8"],
	},
	{
		id: "kanzashi",
		name: "蓮花かんざし",
		desc: "揺れるタッセルと中華花飾り",
		tags: ["china", "date", "summer"],
		swatch: ["#ff7ba8", "#dcb45c", "#c92434"],
	},
	{
		id: "crown",
		name: "ミニティアラ",
		desc: "翡翠宝石が輝く小さな王冠",
		tags: ["idol", "gothic", "cute"],
		swatch: ["#f0c965", "#26b391", "#ffffff"],
	},
	{
		id: "beret",
		name: "中華ベレー帽",
		desc: "金バッジ付きのおしゃれベレー",
		tags: ["date", "street", "cute"],
		swatch: ["#2b2833", "#c92434", "#dcb45c"],
	},
];

export const PROPS: ItemMeta<PropId>[] = [
	{
		id: "none",
		name: "小物なし",
		desc: "両手を自由に見せる",
		badge: "公式",
		tags: ["official"],
		swatch: ["#2b2833", "#444052", "#c92434"],
	},
	{
		id: "fan",
		name: "紅金の中華扇子",
		desc: "雲模様と翡翠房付きの折りたたみ扇",
		tags: ["china", "date", "jiangshi"],
		swatch: ["#c92434", "#dcb45c", "#36a888"],
	},
	{
		id: "onibi_lantern",
		name: "鬼火の提灯",
		desc: "蒼と桃色の火が揺れる中華ランタン",
		tags: ["ghost", "jiangshi", "summer"],
		swatch: ["#26b391", "#ff80bd", "#2b2833"],
	},
	{
		id: "stand_mic",
		name: "スタンドマイク",
		desc: "UTAU歌姫のステージ用レトロマイク",
		tags: ["live", "idol", "cyber"],
		swatch: ["#dcb45c", "#2b2833", "#35f0c8"],
	},
	{
		id: "guitar",
		name: "電脳エレキギター",
		desc: "翡翠ラインが走るロックなギター",
		tags: ["live", "cool", "street", "cyber"],
		swatch: ["#1e262e", "#26b391", "#ef4b5b"],
	},
	{
		id: "plush_myau",
		name: "ミャウミャウぬいぐるみ",
		desc: "青い髪とイカ頭巾がキュートなマスコット",
		tags: ["cute", "street", "date"],
		swatch: ["#b8dde0", "#a68567", "#26b391"],
	},
	{
		id: "plush_ghost",
		name: "おばけロゼちゃん",
		desc: "陰陽玉がついたぷにぷにおばけ仲間",
		tags: ["ghost", "cute", "jiangshi"],
		swatch: ["#eefcf9", "#36a888", "#ff8fc1"],
	},
];

export const BGS: ItemMeta<BgId>[] = [
	{
		id: "cyber_china",
		name: "電脳九龍・中華街",
		desc: "青緑と紅のネオン提灯が輝く夜の街",
		tags: ["official", "cyber", "china"],
		swatch: ["#0f1624", "#c92434", "#26b391"],
	},
	{
		id: "ghost_shrine",
		name: "鬼火の幽玄祠",
		desc: "月夜と竹林にピンクの鬼火が舞う幻想空間",
		tags: ["ghost", "jiangshi", "gothic"],
		swatch: ["#110e1f", "#ff66a8", "#2d6b5e"],
	},
	{
		id: "utau_stage",
		name: "UTAUライブステージ",
		desc: "スペクトラム波形とスポットライトが踊る会場",
		tags: ["live", "idol", "cyber"],
		swatch: ["#120c24", "#35f0c8", "#ff4e93"],
	},
	{
		id: "onj_room",
		name: "配信・DTM部屋",
		desc: "デュアルモニターと鍵盤がある深夜の自室",
		tags: ["street", "cute", "date"],
		swatch: ["#1a1826", "#26b391", "#f0b443"],
	},
	{
		id: "sunset_sea",
		name: "黄昏の海辺駅",
		desc: "茜色の空と海風が心地よい夕暮れのホーム",
		tags: ["summer", "date", "cute"],
		swatch: ["#3b2038", "#f06a5b", "#ffd387"],
	},
	{
		id: "simple_studio",
		name: "撮影スタジオ",
		desc: "好きな背景色（透過PNG対応）で綺麗に撮影",
		tags: ["official", "cool"],
		swatch: ["#1b1626", "#f0ecf2", "#26b391"],
	},
];

export const BACK_FXS: ItemMeta<BackFxId>[] = [
	{
		id: "onibi_aura",
		name: "鬼火ゆらめき",
		desc: "ピンクと翡翠の霊火が背後に漂う",
		badge: "公式",
		tags: ["official", "ghost", "jiangshi"],
		swatch: ["#ff66a8", "#ffcbe3", "#26b391"],
	},
	{
		id: "bagua_ring",
		name: "八卦・陰陽陣",
		desc: "背後に回転する黄金と翡翠の魔法陣",
		tags: ["china", "ghost", "gothic"],
		swatch: ["#dcb45c", "#26b391", "#c92434"],
	},
	{
		id: "cyber_glitch",
		name: "電脳グリッチ",
		desc: "ネオンの幾何学フレームとデータ片",
		tags: ["cyber", "live", "street"],
		swatch: ["#35f0c8", "#ff4e93", "#1e262e"],
	},
	{
		id: "music_notes",
		name: "音符きらめき",
		desc: "歌声に乗せて舞うメロディの粒",
		tags: ["live", "idol", "cute"],
		swatch: ["#35f0c8", "#ffe187", "#ff80bd"],
	},
	{
		id: "none",
		name: "エフェクトなし",
		desc: "すっきりとしたシルエット重視",
		tags: ["cool", "date"],
		swatch: ["#2b2833", "#444052", "#ffffff"],
	},
];

export const PRESET_OUTFITS: PresetOutfit[] = [
	{
		id: "official",
		name: "公式立ち絵コーデ",
		subtitle: "Tabane Roze Standard",
		quote:
			"お待たせ！これが私・束音ロゼの基本スタイルだよ。今日もいい声出していくよ〜！",
		swatch: ["#2b2833", "#c92434", "#26b391"],
		patch: { ...DEFAULT_STATE },
	},
	{
		id: "cyber_live",
		name: "電脳ライブ歌姫",
		subtitle: "Cyber UTAU Diva",
		quote:
			"マイクチェック完了！ネオンと音符の海で、みんなまとめて震わせてあげるっ！",
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
			backFx: "music_notes",
		},
	},
	{
		id: "jiangshi_night",
		name: "幽玄キョンシー",
		subtitle: "Moonlit Jiangshi",
		quote:
			"キョンシーって跳ねるから動きやすいんだよ？ほら、お札が揺れる前に捕まえてみて！",
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
			backFx: "bagua_ring",
		},
	},
	{
		id: "street_stream",
		name: "深夜の宅録＆配信",
		subtitle: "Late Night Streamer",
		quote:
			"ふぁ〜、あと1トラックだけ録ったら寝る予定……たぶん！夜食何にしようかな？",
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
			backFx: "none",
		},
	},
	{
		id: "gothic_fox",
		name: "白狐ゴシック花魁",
		subtitle: "White Fox Maiden",
		quote:
			"たまには白ベースで上品に決めてみたよ。翡翠の目と紅が映えて、ちょっと大人っぽくない？",
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
			backFx: "onibi_aura",
		},
	},
	{
		id: "summer_seaside",
		name: "夕暮れ海辺バカンス",
		subtitle: "Twilight Seaside",
		quote:
			"海の風って髪がなびいて気持ちいい〜！アイスおごってくれたら1曲歌ってあげる♪",
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
			backFx: "none",
		},
	},
];

export const CHALLENGE_THEMES: ChallengeTheme[] = [
	{
		id: "challenge_live",
		title: "電脳チャイナライブ！",
		subtitle: "Cyber UTAU Concert",
		clientHint:
			"歌姫らしくマイクや楽器＋サイバーorチャイナ感で、ライブステージ映えする華やかなコーデにしよう！",
		requiredTags: ["live", "cyber"],
		bonusTags: ["idol", "china", "official"],
		preferredBg: ["utau_stage", "cyber_china"],
		preferredHair: ["high_twin", "hime_bun"],
	},
	{
		id: "challenge_ghost",
		title: "幽玄・鬼火の百鬼夜行",
		subtitle: "Onibi & Jiangshi Night",
		clientHint:
			"妖しく美しい和中華ホラーテイスト！鬼火や広袖、キョンシー・白狐系の小物を取り入れてみよう。",
		requiredTags: ["ghost", "china"],
		bonusTags: ["jiangshi", "gothic", "official"],
		preferredBg: ["ghost_shrine"],
	},
	{
		id: "challenge_stream",
		title: "深夜のまったり配信オフ",
		subtitle: "Relaxed Night Stream",
		clientHint:
			"おうちでくつろぐカジュアル・ストリートスタイル！パーカーやメガネ、ぬいぐるみがあると完璧！",
		requiredTags: ["street", "cute"],
		bonusTags: ["date", "cyber"],
		preferredBg: ["onj_room"],
	},
	{
		id: "challenge_date",
		title: "黄昏どきのお出かけデート",
		subtitle: "Twilight Date Style",
		clientHint:
			"可愛さと少しの上品さを両立した私服・お出かけコーデ！扇子や花飾り、ブーツやヒールが好相性。",
		requiredTags: ["date", "cute"],
		bonusTags: ["summer", "china", "cool"],
		preferredBg: ["sunset_sea", "cyber_china"],
	},
];

export function getTheme(id: ColorThemeId): ColorThemeMeta {
	return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

export function getHairColor(id: HairColorId): HairColorMeta {
	return HAIR_COLORS.find((h) => h.id === id) ?? HAIR_COLORS[0];
}

/**
 * Evaluate current dress-up state against a ChallengeTheme.
 */
export function evaluateChallenge(
	state: DressUpState,
	theme: ChallengeTheme,
): {
	score: number;
	rank: "S" | "A" | "B" | "C";
	comment: string;
	matchedTags: string[];
} {
	const pickedTags: string[] = [];
	const pushTags = <T extends string>(list: ItemMeta<T>[], id: T) => {
		const item = list.find((x) => x.id === id);
		if (item) pickedTags.push(...item.tags);
	};

	pushTags(POSES, state.pose);
	pushTags(HAIR_STYLES, state.hair);
	pushTags(EYE_STYLES, state.eyes);
	pushTags(MOUTH_STYLES, state.mouth);
	pushTags(CHEEK_STYLES, state.cheek);
	pushTags(FACE_ACCS, state.faceAcc);
	pushTags(TOPS_LIST, state.tops);
	pushTags(SLEEVES_LIST, state.sleeves);
	pushTags(BOTTOMS_LIST, state.bottoms);
	pushTags(LEGWEAR_LIST, state.legwear);
	pushTags(ORNAMENTS, state.ornament);
	pushTags(HEADSETS, state.headset);
	pushTags(HEADWEARS, state.headwear);
	pushTags(PROPS, state.prop);
	pushTags(BGS, state.bg);
	pushTags(BACK_FXS, state.backFx);

	let reqHits = 0;
	let bonusHits = 0;
	const matchedSet = new Set<string>();

	for (const tag of pickedTags) {
		if (theme.requiredTags.includes(tag)) {
			reqHits += 1;
			matchedSet.add(tag);
		} else if (theme.bonusTags.includes(tag)) {
			bonusHits += 1;
			matchedSet.add(tag);
		}
	}

	let rawScore = 38 + reqHits * 8 + bonusHits * 5;
	if (theme.preferredBg?.includes(state.bg)) rawScore += 12;
	if (theme.preferredHair?.includes(state.hair)) rawScore += 8;
	if (state.prop !== "none") rawScore += 5;
	const score = Math.min(100, Math.max(25, Math.round(rawScore)));

	let rank: "S" | "A" | "B" | "C" = "C";
	let comment = "";
	if (score >= 90) {
		rank = "S";
		comment = `完璧っ！！「${theme.title}」にこれ以上ないくらいピッタリ！このままサムネにしてみんなに見せびらかしちゃお♪`;
	} else if (score >= 76) {
		rank = "A";
		comment = `いい感じ〜！「${theme.title}」の雰囲気ばっちり出てるよ。あと1つ小物か背景を寄せたら100点間違いなし！`;
	} else if (score >= 60) {
		rank = "B";
		comment = `なかなか個性的で可愛いじゃん！ただ「${theme.title}」としてはもう少しテーマ寄りのアイテムを足しても面白いかも？`;
	} else {
		rank = "C";
		comment = `えへへ、別の方向性としてはアリだけど「${theme.title}」のお題とはちょっと違うかも…？ヒントを見て再挑戦してみよ！`;
	}

	return {
		score,
		rank,
		comment,
		matchedTags: [...matchedSet],
	};
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
