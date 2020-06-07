const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));
const config = require("../../config");

const User = require("./User");

const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class Article extends Sequelize.Model {}
Article.init(
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true,
    },
    raw: Sequelize.TEXT(),
    code: Sequelize.STRING(100),
    lat: Sequelize.DOUBLE(),
    lng: Sequelize.DOUBLE(),
    // 用户上传图片
    images: Sequelize.TEXT(),
    // 是否已删除
    dele: Sequelize.BOOLEAN(),
    // 受否通过审核
    checked: Sequelize.BOOLEAN(),
    private: { type: Sequelize.BOOLEAN(), defaultValue: false },
    // 运营图片地址
    checkedImg: Sequelize.STRING(),
    // 封底
    backCover: Sequelize.STRING(),
    // 动态类型[AIM定向,NORMAL普通,RANDOM随机]
    type: Sequelize.STRING(),
    currentTimes: { type: Sequelize.INTEGER(), defaultValue: 0 },
    maxTimes: {
      type: Sequelize.INTEGER(),
      defaultValue: config.maxTimes === undefined ? 1 : config.maxTimes,
    },
  },
  { sequelize, modelName: "Article" }
);

// 在修改模型后开启，仅开发阶段开启，开启一次后关闭
// Article.sync({
//   alter: true,
// });

exports.search = (lng, lat) => {
  console.log(lng, lat);
  return Article.findAll({
    where: {
      lng: {
        [Sequelize.Op.between]: lng,
      },
      lat: {
        [Sequelize.Op.between]: lat,
      },
      dele: false,
      checked: true,
    },
    order: [["createdAt", "DESC"]],
  });
};

exports.create = async (user, raw, lat, lng, type, images, private = false) => {
  console.log(type, images);
  const theUser = await User.model.findOne({ where: { token: user } });
  const code = Util.hash(raw + lat + lng + user);
  const theArticle = await Article.create({
    raw,
    lat,
    lng,
    type,
    images,
    code,
    dele: false,
    checked: false,
    id: Util.uuid(),
    private,
  });

  await theUser.addArticle(theArticle);
  return theArticle;
};

exports.getAll = async (user, needCheck = true) => {
  const query =
    needCheck === true ? { dele: false, checked: true } : { dele: false };
  const theUser = await User.model.findOne({ where: { token: user } });
  return await theUser.getArticles({
    order: [["createdAt", "DESC"]],
    where: query,
  });
};

exports.list = async (pages = 1, count = 20) => {
  return Promise.all(
    await Article.findAll({
      offset: (pages - 1) * count,
      limit: count,
      order: [["createdAt", "DESC"]],
    }).map(async (item) => {
      return {
        ...item.dataValues,
        nickname:
          (
            (await User.model.findOne({
              where: { uuid: item.dataValues.UserUuid },
            })) || { dataValues: {} }
          ).dataValues.nickname || "",
      };
    })
  );
};

exports.check = (id) => {
  return Article.update(
    {
      checked: true,
    },
    {
      where: { id },
    }
  );
};

exports.uncheck = (id) => {
  return Article.update(
    {
      checked: false,
    },
    {
      where: { id },
    }
  );
};

exports.setCheckedImg = (id, src) => {
  return Article.update(
    {
      checkedImg: src,
    },
    {
      where: { id },
    }
  );
};

exports.setBackCover = (id, src) => {
  return Article.update(
    {
      backCover: src,
    },
    {
      where: { id },
    }
  );
};

exports.setMaxTimes = (id, times) => {
  console.log(id, times);
  return Article.update(
    {
      maxTimes: times,
    },
    {
      where: { id },
    }
  );
};

exports.relocate = (id, lat, lng) => {
  return Article.update({ lat, lng }, { where: { id } });
};

exports.model = Article;
