const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// @desc Get goals
// @route GET /api.goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  if (req.user) {
    const userId = req.user.id;
    console.log("User ID:", userId); // Log the user ID

    const goals = await Goal.find({ user: userId });
    res.status(200).json(goals);
  } else {
    res.status(401);
    throw new Error("User not authenticated");
  }
});

// @desc Set goals
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const userId = req.user?.id;
  if (userId) {
    const goal = await Goal.create({
      text: req.body.text,
      user: userId,
    });

    res.status(200).json(goal);
  } else {
    res.status(401);
    throw new Error("User not authenticated");
  }
});

// @desc Update goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // const user = await User.findById(req.user.id);

  //check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  //make sue logged in user matches goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not Authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

// @desc Delete goal
// @route DELETE /api.goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not Authorized");
  }

  await goal.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
