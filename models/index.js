const link = require("./models/db");
const Sequelize = require("sequelize");

const model = {
  User: require("./models/User"),
  Article: require("./models/Article"),
  Range: require("./models/Range"),
  Mailbox: require("./models/Mailbox"),
};

const init = async () => {
  model.User.model.hasMany(model.Article.model);
  model.Article.model.belongsTo(model.User.model);

  model.Article.model.belongsToMany(model.Mailbox.model, {
    through: "AttachMsg",
  });
  model.Mailbox.model.belongsToMany(model.Article.model, {
    through: "AttachMsg",
  });

  model.Mailbox.model.belongsToMany(model.User.model, {
    through: "PostMessage",
  });
  model.User.model.belongsToMany(model.Mailbox.model, {
    through: "PostMessage",
  });
  // model.User.model.sync({
  //   alter: true,
  // });
  // model.Article.model.sync({
  //   alter: true,
  // });
  await link.sync({
    // alter: true,
  });
  console.log("[ORM]", "Sync db ok!");
};

init();

module.exports = model;
