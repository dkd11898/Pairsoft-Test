const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { execFileSync } = require('child_process');

(async () => {
  try {
    const inputPath = path.resolve(__dirname, '..', 'docs', 'demo.webm');
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      process.exit(1);
    }

    const outPath = path.resolve(__dirname, '..', 'docs', 'demo.gif');

    console.log('Running ffmpeg to create GIF (this may take a while)...');
    execFileSync(ffmpegPath, [
      '-y',
      '-i', inputPath,
      '-vf', 'fps=10,scale=640:-1:flags=lanczos',
      outPath
    ], { stdio: 'inherit' });

    console.log('Conversion complete:', outPath);
  } catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
})();
