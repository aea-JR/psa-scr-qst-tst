import { promises as fs } from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");

async function mergeRuntimeCss() {
  let entries;
  try {
    entries = await fs.readdir(distDir);
  } catch (error) {
    console.error("[postbuild] Unable to read dist directory", error);
    process.exitCode = 1;
    return;
  }

  const runtimeCssFiles = entries.filter(
    (file) => file.endsWith(".css") && !file.startsWith("editing")
  );

  if (runtimeCssFiles.length === 0) {
    return;
  }

  runtimeCssFiles.sort();

  const merged = await Promise.all(
    runtimeCssFiles.map(async (file) => {
      const filePath = path.join(distDir, file);
      return fs.readFile(filePath, "utf8");
    })
  );

  const indexCssPath = path.join(distDir, "index.css");
  await fs.writeFile(indexCssPath, merged.join("\n"), "utf8");

  await Promise.all(
    runtimeCssFiles
      .filter((file) => file !== "index.css")
      .map((file) => fs.rm(path.join(distDir, file)))
  );
}

await mergeRuntimeCss();
