const fs = require('fs');
const path = require('path');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

(async () => {
  try {
    const ffmpeg = createFFmpeg({ log: true });
    console.log('Loading ffmpeg wasm...');
    await ffmpeg.load();

    const inputPath = path.resolve(__dirname, '..', 'docs', 'demo.webm');
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      process.exit(1);
    }

    console.log('Reading input...');
    const data = await fetchFile(inputPath);
    ffmpeg.FS('writeFile', 'input.webm', data);

    console.log('Running ffmpeg to create GIF (this may take a while)...');
    await ffmpeg.run('-i', 'input.webm', '-vf', 'fps=10,scale=640:-1:flags=lanczos', 'output.gif');

    console.log('Writing output gif...');
    const out = ffmpeg.FS('readFile', 'output.gif');
    const outPath = path.resolve(__dirname, '..', 'docs', 'demo.gif');
    fs.writeFileSync(outPath, Buffer.from(out));

    console.log('Conversion complete:', outPath);
  } catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
})();
