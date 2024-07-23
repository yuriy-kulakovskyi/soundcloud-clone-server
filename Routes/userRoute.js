const express = require('express');
const multer = require('multer');
const { 
  registerUser, 
  loginUser, 
  findUser,
  getUsers,
  getAvatar,
  getUserWithoutToken,
  getLikedSongs,
  like,
  dislike
} = require('../Controllers/userController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single('avatar'), registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/get/:userId", getUserWithoutToken);
router.get("/", getUsers);
router.get("/avatar/:avatar", getAvatar);
router.get("/:userId/likedSongs", getLikedSongs);
router.post("/:userId/like/:songId", like);
router.post("/:userId/dislike/:songId", dislike);

module.exports = router;