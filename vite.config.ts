import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";

const externalDependencies = new Set([
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  "react/jsx-runtime",
  "react/jsx-dev-runtime"
]);

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/index.ts", "src/editing.ts", "src/config/scrivitoConfig.ts"],
      exclude: ["src/development/dev-main.tsx"],
      outDir: "dist",
      tsconfigPath: "./tsconfig.build.json"
    })
  ],
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    emptyOutDir: true,
    lib: {
      entry: [
        resolve(__dirname, "src/index.ts"),
        resolve(__dirname, "src/editing.ts")
      ],
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: Array.from(externalDependencies),
      output: {
        assetFileNames: (assetInfo) => {
          const originals = assetInfo?.originalFileNames ?? [];
          const relatesToEditing = originals.some((fileName) => fileName.includes("editing"));
          const baseName = relatesToEditing ? "editing" : "index";
          return `${baseName}[extname]`;
        }
      }
    }
  }
});
