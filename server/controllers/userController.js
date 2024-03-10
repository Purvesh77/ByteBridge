const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const axios = require("axios");

exports.allUsers = catchAsync(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log(keyword);
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(201).json({ users });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.find({ name: req.params.name })
    .populate("friends")
    .populate("friendsRequest");
  res.status(203).json({ user });
});

exports.addBookmark = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const chatId = req.body.chatId;
  const isPresent = await User.find({
    _id: userId,
    $and: [{ bookmarkChats: { $elemMatch: { $eq: chatId } } }],
  });
  // console.log("------------isPresent--------------");
  // console.log(isPresent);
  // console.log("------------isPresent--------------");
  if (isPresent.length > 0) {
    const bookmark = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { bookmarkChats: chatId },
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      status: "sucsess",
      user: bookmark,
    });
  }
  const bookmark = await User.findByIdAndUpdate(
    userId,
    {
      $push: { bookmarkChats: chatId },
    },
    {
      new: true,
    }
  ).populate("bookmarkChats", "chatName discription upvotes downvotes");
  return res.status(201).json({
    status: "sucsess",
    user: bookmark,
  });
});

exports.makeFriend = catchAsync(async (req, res, next) => {
  const friendId = req.body.friendId;
  const userId = req.user._id;

  if (userId == friendId) {
    return next(new AppError("You can't make friend to yourself", 400));
  }
  const isPresent = await User.find({
    _id: req.user._id,
    $and: [{ friends: { $elemMatch: { $eq: friendId } } }],
  });
  if (isPresent.length > 0) {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: friendId },
      },
      {
        new: true,
      }
    );
    await User.findByIdAndUpdate(
      friendId,
      {
        $pull: { friends: userId },
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      status: "sucsess",
      message: "Friend removed sucessfully",
    });
  }

  const alreadyRequested = await User.find({
    _id: friendId,
    $and: [{ friendsRequest: { $elemMatch: { $eq: userId } } }],
  });

  if (alreadyRequested.length > 0) {
    return next(new AppError("You already requested to this Id ", 400));
  }
  const friend = await User.findByIdAndUpdate(
    friendId,
    {
      $push: { friendsRequest: userId },
    },
    {
      new: true,
    }
  );

  if (!friend) {
    // return res.status(401).json({
    //   status: "fail",
    //   message: "Friend request failed",
    // });
    return next(new AppError("Friend request failed", 400));
  }
  return res.status(201).json({
    status: "success",
    data: friend,
    message: "Friend request sent",
  });
});

exports.responseToFriendRequest = catchAsync(async (req, res, next) => {
  const friendId = req.body.friendId;
  const userId = req.user._id;

  if (req.body.accept === true) {
    const isPresent = await User.find({
      _id: req.user._id,
      $and: [{ friendsRequest: { $elemMatch: { $eq: friendId } } }],
    });

    if (isPresent.length < 1) {
      return next(new AppError("You have no request from this Id", 401));
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friendsRequest: friendId },
      },
      {
        new: true,
      }
    );
    const friend = await User.findByIdAndUpdate(
      userId,
      {
        $push: { friends: friendId },
      },
      {
        new: true,
      }
    );

    const friendOther = await User.findByIdAndUpdate(
      friendId,
      {
        $push: { friends: userId },
      },
      {
        new: true,
      }
    );

    if (!friend || !friendOther) {
      return next(new AppError("User not found", 401));
    }
    return res.status(201).json({
      status: "success",
      data: friend,
      message: "Friend request accepted",
    });
  } else {
    const friend = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friendsRequest: friendId },
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      status: "success",
      data: friend,
      message: "Friend request rejected",
    });
  }
});

exports.register = catchAsync(async (req, res, next) => {
  const {
    githubHandle,
    codeforcesHandle,
    codechefHandle,
    leetcodeHandle,
    gfgHandle,
    college,
    techStack,
  } = req.body;

  const userId = req.user._id;
  const obj = {};
  if (college.length > 0) {
    obj.college = college;
  }
  if (githubHandle.length > 0) {
    obj.githubHandle = githubHandle;
  }
  if (codeforcesHandle.length > 0) {
    obj.codeforcesHandle = codeforcesHandle;
    const handle = codeforcesHandle;
    const fdata = await axios.get(
      `https://codenova-webscrapping.onrender.com/api/v1/codeforces/${handle}`
    );
    // console.log(fdata.data.result[0].rating);
    obj.codeforcesRating = fdata.data.result[0].rating;
  }
  if (codechefHandle.length > 0) {
    obj.codechefHandle = codechefHandle;
  }
  if (leetcodeHandle.length > 0) {
    obj.leetcodeHandle = leetcodeHandle;
    const handle = leetcodeHandle;
    const fdata = await axios.get(
      `https://codenova-webscrapping.onrender.com/api/v1/leetcode/${handle}`
    );

    // console.log(fdata.data);
    if (fdata.data.data.status === "error") {
      return next(new AppError("Leetcode Handle does not exist", 401));
    }
    obj.leetcodeQuestion = fdata.data.data.totalSolved;
  }
  if (gfgHandle.length > 0) {
    obj.gfgHandle = gfgHandle;
  }

  if (techStack.length > 0) {
    obj.techStack = techStack;
  }
  console.log(obj);

  // console.log(gfgHandle.length);
  // console.log(githubHandle.length);
  const user = await User.findByIdAndUpdate(userId, obj);
  // console.log(user);

  if (!user) {
    return next(new AppError("please try again", 401));
  }
  res.status(201).json({
    status: "success",
    data: user,
  });
});
