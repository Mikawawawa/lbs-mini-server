const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");

const { Article, User } = require("../models");

router.get("/activity/list", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        activities:
          (await Article.list(
            parseInt(req.query.page),
            parseInt(req.query.count)
          )) || [],
        pages: Math.ceil((await Article.model.findAndCountAll()).count),
      },
    });
  } catch (error) {
    console.log("/activity/list", error);
    res.json({
      success: false,
    });
  }
});

router.post("/activity/enable", async (req, res) => {
  try {
    await Article.check(req.body.id);
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("/activity/enable", error);
    res.json({
      success: false,
    });
  }
});

router.post("/activity/disable", async (req, res) => {
  await Article.uncheck(req.body.id);
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("/activity/disable", error);
    res.json({
      success: false,
    });
  }
});

router.post("/activity/set_checked", async (req, res) => {
  await Article.setCheckedImg(req.body.id, req.body.url);
  res.json({
    success: true,
  });
});

router.post("/activity/relocate", async (req, res) => {
  try {
    await Article.relocate(req.body.id, req.body.lat, req.body.lng);
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
    });
  }
});
module.exports = router;
