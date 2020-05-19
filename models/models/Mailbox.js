const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));

const User = require("./User");
const Article = require("./Article");

const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class Mailbox extends Sequelize.Model {}
Mailbox.init(
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true,
    },
    disable: Sequelize.BOOLEAN(),
    picked: Sequelize.BOOLEAN(),
  },
  { sequelize, modelName: "Mailbox" }
);

// Mailbox.sync({
//   alter: true,
// });

exports.add = async (userKey, msgId) => {
  const [box, user, msg] = await Promise.all([
    Mailbox.create({ id: Util.uuid(), disable: false, picked: false }),
    User.model.findOne({ where: { token: userKey } }),
    Article.model.findOne({ where: { code: msgId } }),
  ]);
  // console.log(await box.addUser(user));
  await [box.addUser(user), box.addArticle(msg)];
  return box;
};

// TODO后期优化可以做个分页，现在用不到
exports.get = async (userKey, type = undefined) => {
  const user = await User.model.findOne({ where: { token: userKey } });
  const query = {};
  if (type !== undefined) {
    query.picked = type;
  }
  console.log(query);
  return await Promise.all(
    (await user.getMailboxes({ where: query })).map(async (item) => {
      return {
        box: item.dataValues,
        article: (await item.getArticles())[0],
      };
    })
  );
};

exports.disable = (id) => {
  return Mailbox.update(
    {
      disable: true,
    },
    {
      where: { id },
    }
  );
};

exports.model = Mailbox;
