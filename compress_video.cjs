const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

console.log('Starting compression...');

ffmpeg('public/IMG_5247.mp4')
  .outputOptions([
    '-vcodec libx264',
    '-crf 28',         // higher value = smaller file size, lower quality
    '-preset fast',
    '-vf scale=-2:720' // Resize to 720p height
  ])
  .save('public/IMG_5247_compressed.mp4')
  .on('end', () => {
    console.log('Compression finished!');
  })
  .on('error', (err) => {
    console.log('Error compressing video:', err);
  })
  .on('progress', (progress) => {
    if (progress.percent) {
      console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  });
