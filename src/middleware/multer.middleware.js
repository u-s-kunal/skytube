import multer from "multer";

const storage = multer.diskStorage;
({
  destination: function (req, res, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, res, cb) {
    cb(null, this.file.originalName);
  },
});

export const upload = multer({
  storage,
});
