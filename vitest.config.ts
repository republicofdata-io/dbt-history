import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import yaml from "js-yaml";

function yamlPlugin(): Plugin {
  return {
    name: "yaml-as-json",
    transform(code, id) {
      if (!id.endsWith(".yaml") && !id.endsWith(".yml")) return null;
      return { code: `export default ${JSON.stringify(yaml.load(code))};`, map: null };
    },
  };
}

export default defineConfig({
  plugins: [react(), yamlPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src"), "@content": path.resolve(import.meta.dirname, "./documentation/content") },
  },
});
