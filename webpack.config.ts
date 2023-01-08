import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/* const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 */
export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".mjs"]
  },
  target: "node"
};
