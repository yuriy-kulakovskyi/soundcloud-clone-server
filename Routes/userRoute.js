const express = require('express');
const multer = require('multer');
const { 
  registerUser, 
  loginUser, 
  findUser,
  getUsers,
  getAvatar
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
router.get("/", getUsers);
router.get("/avatar/:avatar", getAvatar);

module.exports = router;