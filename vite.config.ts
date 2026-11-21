import { defineConfig } from "vite";

// GitHub Pages（https://onjmin.github.io/dress-up/）ではサブパス配信になる。
export default defineConfig({
	base: process.env.GITHUB_PAGES ? "/dress-up/" : "/",
	build: {
		outDir: "build",
		target: "es2022",
	},
});
