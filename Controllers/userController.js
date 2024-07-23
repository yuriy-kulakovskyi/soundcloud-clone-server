const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const path = require('path');
const songModel = require("../Models/songModel");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" })
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json("User with the given email already exists...");

    if (!name || !email || !password)
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email...");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password is not strong enough...");

    if (password !== confirmPassword)
      return res.status(400).json("Passwords do not match...");

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    if (req.file) {
      user.avatar = `/uploads/images/${req.file.filename}`;
    }

    user.likedSongs = [];

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const loginUser = async(req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) 
      return res.status(400).json("Invalid email or password...");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) 
      return res.status(400).json("Invalid email or password...");

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, token });
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const findUser = async(req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const getUserWithoutToken = async(req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const getUsers = async(req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const getAvatar = async (req, res) => {
  try {
    const avatarPath = req.params.avatar;
    const fullPath = path.join(__dirname, '..', 'public/uploads/images', avatarPath);

    console.log('Full path:', fullPath);

    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath);
    } else {
      res.status(404).json({ error: 'Avatar not found' });
    }
  } catch (err) {
    console.error('Error sending avatar:', err);
    res.status(500).json({ error: 'Failed to send avatar' });
  }
};

// like song function
const like = async (req, res) => {
  const userId = req.params.userId;
  const songId = req.params.songId;

  try {
    const user = await userModel.findById(userId);

    if (!user)
      return res.status(404).json("User not found...");

    user.likedSongs.push(songId);

    await user.save();

    res.status(200).json(user.likedSongs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

// dislike song function
const dislike = async (req, res) => {
  const userId = req.params.userId;
  const songId = req.params.songId;

  try {
    const user = await userModel.findById(userId);
    const song = await songModel.findById(songId);

    if (!user)
      return res.status(404).json("User not found...");

    user.likedSongs = user.likedSongs.filter(
      song => !song.equals(songId)
    );
    
    await user.save();

    res.status(200).json(user.likedSongs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const getLikedSongs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    if (!user)
      return res.status(404).json("User not found...");

    // find songs by the list of id's and pass them to the client
    const likedSongs = await songModel.find({
      _id: { $in: user.likedSongs }
    });

    res.status(200).json(likedSongs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}


module.exports = { 
  registerUser, 
  loginUser, 
  findUser, 
  getUsers, 
  getAvatar, 
  getUserWithoutToken,
  getLikedSongs,
  like,
  dislike
};