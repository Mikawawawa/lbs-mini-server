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
    },
    order: [["createdAt", "DESC"]],
  });
};

exports.create = async (user, raw, lat, lng, images) => {
  const theUser = await User.model.findOne({ where: { token: user } });
  const code = Util.hash(raw + lat + lng + user);
  const theArticle = await Article.create({
    raw,
    lat,
    lng,
    images,
    code,
    dele: false,
    checked: true,
    id: Util.uuid(),
  });

  await theUser.addArticle(theArticle);
  return theArticle;
};

exports.getAll = async (user) => {
  const theUser = await User.model.findOne({ where: { token: user } });
  return await theUser.getArticles({
    order: [["createdAt", "DESC"]],
    where: { dele: false },
  });
};

exports.model = Article;
