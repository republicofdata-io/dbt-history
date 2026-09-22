import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import yaml from "js-yaml";

/**
 * Turns any imported .yaml file into a JSON module. The app's content lives in
 * documentation/content/ as YAML so it stays reviewable without touching code.
 */
function yamlPlugin(): Plugin {
  return {
    name: "yaml-as-json",
    transform(code, id) {
      if (!id.endsWith(".yaml") && !id.endsWith(".yml")) return null;
      const data = yaml.load(code);
      return { code: `export default ${JSON.stringify(data)};`, map: null };
    },
  };
}

// The app is served under republicofdata.io/labs/dbt-history via a Netlify
// proxy rule in the website repo, so every asset URL must carry that base.
export const BASE_PATH = "/labs/dbt-history/";

export default defineConfig(() => ({
  base: BASE_PATH,
  server: { host: "::", port: 8081 },
  plugins: [react(), yamlPlugin()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src"), "@content": path.resolve(import.meta.dirname, "./documentation/content") },
  },
}));
