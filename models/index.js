const link = require("./models/db");
const Sequelize = require("sequelize");

const model = {
  User: require("./models/User"),
  Article: require("./models/Article"),
};

const init = async () => {
  model.User.model.hasMany(model.Article.model);
  model.Article.model.belongsTo(model.User.model);

  await link.sync();
  console.log("[ORM]", "Sync db ok.");
};

init();

module.exports = model;
