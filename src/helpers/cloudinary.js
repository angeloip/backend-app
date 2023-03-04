const { v2 } = require("cloudinary");

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadPictureProduct = async (filePath) => {
  return await v2.uploader.upload(filePath, {
    folder: "picture"
  });
};
const deletePictureProduct = async (id) => {
  return await v2.uploader.destroy(id);
};

const uploadPictureUser = async (filePath) => {
  return await v2.uploader.upload(filePath, {
    folder: "avatar"
  });
};
const deletePictureUser = async (id) => {
  return await v2.uploader.destroy(id);
};

module.exports = {
  uploadPictureProduct,
  deletePictureProduct,
  uploadPictureUser,
  deletePictureUser
};
