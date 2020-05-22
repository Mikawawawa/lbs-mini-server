const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));

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
    images: Sequelize.TEXT(),
    dele: Sequelize.BOOLEAN(),
    checked: Sequelize.BOOLEAN(),
    private: { type: Sequelize.BOOLEAN(), defaultValue: false },
  },
  { sequelize, modelName: "Article" }
);

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

exports.create = async (user, raw, lat, lng, images, private = false) => {
  const theUser = await User.model.findOne({ where: { token: user } });
  const code = Util.hash(raw + lat + lng + user);
  const theArticle = await Article.create({
    raw,
    lat,
    lng,
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

exports.getAll = async (user) => {
  const theUser = await User.model.findOne({ where: { token: user } });
  return await theUser.getArticles({
    order: [["createdAt", "DESC"]],
    where: { dele: false, checked: true },
  });
};

exports.list = async (pages = 1, count = 20) => {
  return Promise.all(
    await Article.findAll({
      offset: (pages - 1) * count,
      limit: count,
      order: [["createdAt", "DESC"]],
    }).map(async (item) => ({
      ...item.dataValues,
      user: (
        await User.model.findOne({
          where: { uuid: item.dataValues.UserUuid },
        })
      ).dataValues,
    }))
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

exports.model = Article;
