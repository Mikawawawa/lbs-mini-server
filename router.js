const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");

const { Article, User, Mailbox } = require("./models");

router.post("/post/write", async (req, res) => {
  try {
    console.log(req.body.secret);
    if (req.body.secret === true) {
      const theArticle = await Article.create(
        req.body.key,
        req.body.raw,
        req.body.subject,
        req.body.lat,
        req.body.lng,
        req.body.type,
        JSON.stringify(req.body.images),
        req.body.audio,
        true
      );
      res.json({
        success: true,
        data: await Mailbox.add(
          req.body.targetUser.key,
          theArticle.dataValues.code
        ),
      });
    } else {
      res.json({
        success: true,
        data: await Article.create(
          req.body.key,
          req.body.raw,
          req.body.subject,
          req.body.lat,
          req.body.lng,
          req.body.type,
          JSON.stringify(req.body.images),
          req.body.audio
        ),
      });
    }
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
      data: await Article.getAll(req.query.key, req.query.needCheck || true),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

router.post("/mailbox/add", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Mailbox.add(req.body.key, req.body.msgId),
    });
  } catch (error) {
    console.log("e");
    res.json({
      success: false,
    });
  }
});

router.get("/mailbox/list", async (req, res) => {
  try {
    res.json({
      success: true,
      data:
        req.query.type === "0"
          ? await Mailbox.get(req.query.key)
          : await Mailbox.get(req.query.key, req.query.type === "2"),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

router.get("/user/check", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await User.model.findOne({ where: { idnumber: req.query.number } }),
    });
  } catch (error) {
    res.json({ success: false });
  }
});

router.post("/mailbox/push", async (req, res) => {
  try {
    const theMessage = await Article.create(
      req.body.key,
      req.body.raw,
      req.body.subject || req.body.raw.slice(0, 15),
      req.body.lat,
      req.body.lng,
      JSON.stringify(req.body.images),
      req.body.audio,
      true
    );

    res.json({
      success: true,
      data: await Mailbox.add(req.body.target, theMessage.dataValues.id),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

router.post("/mailbox/dele", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Mailbox.disable(req.body.id),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

router.get("/share", async (req, res) => {
  try {
    const theArticle = await Article.model.findOne({
      where: { code: req.query.code },
    });

    const theUser = await theArticle.getUser();

    res.json({
      success: true,
      data: {
        raw: theArticle.dataValues,
        user: theUser.dataValues,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
    });
  }
});

/* 随机获取 */
router.get("/randomGet", async (req, res) => {
  const Articles = await Article.list();
  const optionArt = [];
  Articles.forEach(e => {
    if(e.checkedImg && e.backCover){
      optionArt.push(e)
    }
  });

  let data = optionArt[parseInt(Math.random()*optionArt.length)]
  res.json({
    data
  })
});

module.exports = router;
