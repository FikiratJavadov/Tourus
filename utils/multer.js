const multer = require("multer");

const multerUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    
  }
});

module.exports = multerUpload;
