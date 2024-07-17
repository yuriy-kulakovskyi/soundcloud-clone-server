const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, minLength: 3, maxLength: 30},
  email: {type: String, required: true, minLength: 3, maxLength: 200, unique: true},
  password: {type: String, required: true, minLength: 3, maxLength: 1024},
  avatar: {type: String, required: false}
}, {
  timestamps: true,
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;