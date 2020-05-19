const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");

const { Article, User, Range } = require("../models");

router.get("/", async (req, res) => {
  res.json({
    success: true,
  });
});

router.get("/ranges", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Range.get(
        req.query.top,
        req.query.bottom,
        req.query.left,
        req.query.right
      ),
    });
  } catch (error) {
    console.log("/system/ranges", error);
    res.json({
      success: false,
    });
  }
});

router.post("/ranges/add", async (req, res) => {
  try {
    await Range.addOne(
      parseFloat(req.body.top),
      parseFloat(req.body.bottom),
      parseFloat(req.body.left),
      parseFloat(req.body.right)
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("/system/ranges/add", error);
    res.json({
      success: false,
    });
  }
});

router.post("/ranges/remove", async (req, res) => {
  try {
    await Range.remove(req.body.id);
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("/system/ranges", error);
    res.json({
      success: false,
    });
  }
});

module.exports = router;
