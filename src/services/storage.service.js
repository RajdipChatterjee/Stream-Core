const { ImageKit } = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  const response = await client.files.upload({
    file,
    fileName: 'music_' + Date.now(),
    folder: 'back-end/music',
  });

  return response;
}

// console.log(response);

module.exports = { uploadFile };
