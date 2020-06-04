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

router.post("/config/update", async (req, res) => {
  try {
    console.log(req.body);
    require("fs").writeFileSync(
      require("path").resolve(__dirname, "../config.js"),
      require("prettier").format(
        `
      var config = ${JSON.stringify(
        { ...require("../config"), ...req.body },
        null,
        2
      )}

      module.exports = config
    `,
        { semi: false, parser: "babel" }
      )
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

router.get("/config/get", async (req, res) => {
  try {
    const { cors, redisTick, ...config } = require("../config");
    console.log(req.body);
    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

module.exports = router;
