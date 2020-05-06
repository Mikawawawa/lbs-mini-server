const express = require("express");
const router = express.Router();
const request = require("request");
const moment = require("moment");
const qs = require("querystring");

const config = require("./config");

const User = require("./models/models/User");

function createToken() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = chars.length;
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.substr(Math.round(Math.random() * length), 1);
  }
  return str;
}

/**
 * 登录接口
 * 接收前端传入的用户基本信息
 * nickname:用户名
 * head_img:用户头像
 * code:用户凭证
 * openID:用户登录唯一凭证
 */
router.post("/login", async (req, res, next) => {
  var nickname = req.body.nickName;
  var avatar = req.body.avatar;
  var code = req.body.code;
  const query = qs.encode({
    grant_type: "authorization_code",
    appid: config.AppId,
    secret: config.AppSecret,
    js_code: code,
  });

  const data = await new Promise((resolve, reject) => {
    request.get(
      {
        url: "https://api.weixin.qq.com/sns/jscode2session?" + query,
      },
      function (err, res, data) {
        if (res.statusCode === 200) {
          resolve(typeof data === "string" ? JSON.parse(data) : data);
        } else {
          reject("error");
        }
      }
    );
  });
  // console.log(data);
  const theUser = await User.model.findOne({
    where: {
      uuid: data.openid,
    },
  });

  if (theUser !== null && theUser.dataValues !== {}) {
    // console.info("用户已经存在");
    console.info("Exist login", theUser.dataValues.token);
    // req.session.user = theUser.dataValues;
    return res.send({
      token: theUser.dataValues.token,
      idnumber: theUser.dataValues.idnumber,
    });
  } else {
    const token = createToken();
    const newUser = await User.create(data.openid, nickname, avatar, token);
    // req.session.user = newUser.dataValues;
    return res.json({ token, idnumber: newUser.dataValues.idnumber });
  }
});

module.exports = router;
