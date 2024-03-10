const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    maxlength: 20,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide us your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid Email"],
  },
  photo: {
    type: String,
    default:
      "http://res.cloudinary.com/df4t1zu7e/image/upload/v1678403577/i9refylv9btn7xrb69gd.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendsRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  githubHandle: {
    type: String,
    unique: true,
  },
  codeforcesHandle: {
    type: String,
    unique: true,
  },
  codeforcesRating: {
    type: String,
  },
  codechefHandle: { type: String, unique: true },
  leetcodeHandle: {
    type: String,
    unique: true,
  },
  leetcodeQuestion: {
    type: String,
  },
  gfgHandle: {
    type: String,
    unique: true,
  },
  college: {
    type: String,
  },
  techStack: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and Confirm Password are not same",
    },
  },
  bookmarkChats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

// userSchema.pre('save', function(next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
