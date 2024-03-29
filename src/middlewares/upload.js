const fs = require("fs-extra");

module.exports = async (req, res, next) => {
  if (req.file) {
    if (typeof req.file === "undefined" || typeof req.body === "undefined")
      return res.status(400).json({ msg: "Problema al subir el archivo" });

    if (req.file.fieldname !== "xlsx") {
      if (
        req.file.mimetype !== "image/jpg" &&
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "image/jpeg"
      ) {
        await fs.remove(req.file.path);
        return res.status(400).json({ msg: "Formato no permitido" });
      }
    }

    if (req.file.size > 1024 * 1024) {
      await fs.remove(req.file.path);
      return res
        .status(400)
        .json({ msg: "El archivo es demasiado grande (Máx.: 1 MB)" });
    }
    next();
  } else {
    next();
  }
};
