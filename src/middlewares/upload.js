module.exports = (req, res, next) => {
  if (typeof req.file === "undefined" || typeof req.body === "undefined")
    return res.status(400).json({ msg: "Problema al subir esta imagen" });

  if (
    req.file.mimetype !== "image/jpg" &&
    req.file.mimetype !== "image/png" &&
    req.file.mimetype !== "image/jpeg"
  ) {
    return res.status(400).json({ msg: "Formato no soportado" });
  }

  if (req.file.size > 1024 * 1024) {
    return res
      .status(400)
      .json({ msg: "El archivo es demasiado grande (Máx.: 1 MB)" });
  }

  next();
};
