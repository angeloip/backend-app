const { v2 } = require("cloudinary");

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadImage = async (filePath) => {
  return await v2.uploader.upload(filePath, {
    folder: "avatar"
  });
};

const deleteImage = async (id) => {
  return await v2.uploader.destroy(id);
};

module.exports = {
  uploadImage,
  deleteImage
};
