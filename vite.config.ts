import { crx, defineManifest } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import zipPack from "vite-plugin-zip-pack";

// https://crxjs.dev/vite-plugin/concepts/manifest
const manifest = defineManifest(({ mode }) => ({
  manifest_version: 3,
  name: "ニコニコリンクプレビュー",
  version: "0.1.1",
  icons: {
    128: "assets/128x128.png",
  },
  description: "ニコニコサイト内でリンクにカーソルを合わせるとプレビューを表示します",

  content_scripts: [
    {
      js: ["src/content.ts"],
      matches: ["https://*.nicovideo.jp/*"]
    }
  ],
  options_page: "options.html",
  background: {
    service_worker: "src/background.ts"
  },

  permissions: [
    "storage",
  ],

  host_permissions: [
    // 開発時のホットリロード等の vite サーバーのためのアクセス許可
    ...(mode === "development" ? ["<all_urls>"] : []),
  ],

  // これがないと background.ts でアイコンクリック時の動作を設定できない
  action: {},
}));

export default defineConfig({
  plugins: [
    solidPlugin(),
    crx({ manifest }),
    zipPack({ outDir: "." }),
  ],

  build: {
    rollupOptions: {
      input: {
        options: "./options.html",
      }
    },
  },

  // 拡張機能でホットリロードを使うにはポートの指定が必要
  server: {
    hmr: { port: 5174 },
    port: 5173
  },

  legacy: {
    skipWebSocketTokenCheck: true,
  },
});