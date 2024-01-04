import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "admin",
  },
},{
  timestamps: true,
});

//never use arrow function here because arrow function doesn't have this keyword
//use normal function here
userSchema.pre("save", async function (next) {
  //check if password is not modified
  if (!this.isModified("password")) return next();

  //generate a salt
  const salt = await bcrypt.genSalt(10);
  //reassign the password to the hashed version
  this.password = await bcrypt.hash(this.password, salt);

  return next();
});

//check if password is correct
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generate a token
userSchema.methods.generateTokens = function () {

  console.log("started generating tokens")
  //generate a token
  return jwt.sign(
    //payload
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    //secret
    process.env.ACCESS_TOKEN_SECRETE,
    //options
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  //generate a token
  return jwt.sign(
    //payload
    { _id: this._id },
    //secret
    process.env.REFRESH_TOKEN_SECRETE,
    //options
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
