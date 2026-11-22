// bring-the-humans-03: the entry is the video itself, so this program has a
// single job — hand the gate the video's address by copying VIDEO.json from
// the repository root into the output directory. It prints nothing on success.
//
// The ad is an original 30-second vertical TikTok ad for make.fun, made in
// the session that built this repository: a ghost holds a giant gold coin,
// the bounty board screenshot shows the site is real, the prize lines name
// the $500 pot, and the video ends on make.fun's referral card with the
// account's own code. The program never touches the video — the house reads
// its views from TikTok, and nothing written here is scored.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// VIDEO.json holds the video's address once it is posted; until then it
// names the account's handle with a placeholder id, which the gate refuses
// — that is on purpose, since a placeholder that passed would need no video
// at all.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const videoPath = join(botDir, 'VIDEO.json');
let video: unknown;
try {
  video = JSON.parse(readFileSync(videoPath, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
if (
  typeof video !== 'object' ||
  video === null ||
  !('url' in video) ||
  typeof (video as { url: unknown }).url !== 'string' ||
  (video as { url: string }).url.length === 0
) {
  console.error('VIDEO.json must name the video with a non-empty url string');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
try {
  copyFileSync(videoPath, join(outDir, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied to ${outDir}: ${(err as Error).message}`);
  process.exit(1);
}
