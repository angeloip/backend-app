const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload.single("picture");

/* module.exports = (req, res, next) => {
  console.log(req.file);
  upload.single(req.file?.fieldname);

  console.log("ra");
  next();
}; */
