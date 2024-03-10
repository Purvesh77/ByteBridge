const dotenv = require("dotenv");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const nodemailer = require("nodemailer");

dotenv.config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  // console.log(user);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const url = `${req.protocol}://${req.get("host")}/me`;

  createSendToken(newUser, 201, res);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "impostercrewfreedom@gmail.com",
      pass: "avuwpktrouxkalqw",
    },
  });
  let mailoptions = {
    from: "impostercrewfreedom@gmail.com",
    to: req.body.email,
    subject: "click on this link to verify your",
  };
  transporter.sendMail(mailoptions, (err, result) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log("Email send: " + result.response);
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  const { email, password } = req.body;
  if (!email || !password) {
    //so that after the response no other response will send to client
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  // console.log(user);
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  const correct = await user.correctPassword(password, user.password);
  // console.log("kkk");
  if (!correct) {
    return next(new AppError("Invalid email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Checking if it contain token or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);
  if (!token) {
    return next(new AppError("You are not logged in! Please login first", 401));
  }

  //Verification
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  // console.log(decoded);
  //User is still a active user
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User belonging to this token does no longer exists", 401)
    );
  }

  //Grant access to the user
  // console.log(freshUser);
  req.user = freshUser;
  // console.log("000000000000000000");
  // console.log(req.user);
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies)
  if (req.cookies.jwt) {
    try {
      // 1) verify token

      const decoded = await jwt.verify(req.cookies.jwt, "mysecretkey");

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // console.log(decoded)
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not permission to perform this action", 403)
      );
    }
    next();
  };
};
