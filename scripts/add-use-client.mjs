/**
 * Post-build script: prepends "use client"; to all dist JS files.
 * This is required for Next.js App Router to treat the package as client-only
 * without needing consumers to add `transpilePackages`.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DIRECTIVE = '"use client";\n';
const files = ["dist/index.js", "dist/index.cjs"];

for (const file of files) {
  const filePath = join(process.cwd(), file);
  const content = readFileSync(filePath, "utf-8");

  // Only prepend if not already present
  if (!content.startsWith('"use client"')) {
    writeFileSync(filePath, DIRECTIVE + content, "utf-8");
    console.log(`✓ Added "use client" to ${file}`);
  } else {
    console.log(`⚡ Already has "use client" in ${file}`);
  }
}
