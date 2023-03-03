const fs = require("fs-extra");

module.exports = async (req, res, next) => {
  if (typeof req.file === "undefined" || typeof req.body === "undefined")
    return res.status(400).json({ msg: "Problema al subir esta imagen" });

  if (
    req.file.mimetype !== "image/jpg" &&
    req.file.mimetype !== "image/png" &&
    req.file.mimetype !== "image/jpeg"
  ) {
    await fs.remove(req.file.path);
    return res.status(400).json({ msg: "Formato no permitido" });
  }

  if (req.file.size > 1024 * 1024) {
    await fs.remove(req.file.path);
    return res
      .status(400)
      .json({ msg: "El archivo es demasiado grande (Máx.: 1 MB)" });
  }

  next();
};
