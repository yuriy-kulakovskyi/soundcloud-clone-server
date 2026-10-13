// songRoute.js
const express = require('express');
const multer = require('multer');
const {
  postSong,
  getSongs,
  getSongsByUserId,
  getSongById
} = require("../Controllers/songController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "song") {
      cb(null, "./public/uploads/songs");
    } else if (file.fieldname === "image") {
      cb(null, "./public/uploads/images");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/add", upload.fields([
  { name: 'song', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), postSong);
router.get("/", getSongs);
router.get("/:userId", getSongsByUserId);
router.get("/get/:songId", getSongById);

module.exports = router;
