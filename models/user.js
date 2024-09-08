const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  provider: String, // for social logins
  profilePicture: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);


