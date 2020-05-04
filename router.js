const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");

const { Article, User } = require("./models");

router.post("/post/write", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Article.create(
        req.body.key,
        req.body.raw,
        req.body.lat,
        req.body.lng,
        JSON.stringify(req.body.images)
      ),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

router.post("/post/dele", async (req, res) => {
  try {
    await Article.model.update(
      { dele: true },
      {
        where: { code: req.body.code },
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.get("/post/lbs", async (req, res) => {
  let { lat, lng } = req.query;
  lat = JSON.parse(lat);
  lng = JSON.parse(lng);

  try {
    res.json({
      success: true,
      data: (await Article.search(lng, lat)).filter(
        (item) => item.UserUuid !== null
      ),
    });
  } catch (error) {
    res.json({
      success: false,
    });
  }
});

router.get("/post/all", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Article.getAll(req.query.key),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

module.exports = router;
