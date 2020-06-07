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
    Mailbox.create({
      id: Util.uuid(),
      disable: false,
      picked: false,
    }),
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
  const query = {
    disable: false,
  };
  if (type !== undefined) {
    query.picked = type;
  }
  return (
    await Promise.all(
      (await user.getMailboxes({ where: query })).map(async (item) => {
        return {
          box: item.dataValues,
          article: (await item.getArticles())[0],
        };
      })
    )
  ).filter((item) => item.article && item.article.checked === true);
};

exports.disable = (id) => {
  console.log(id);
  return Mailbox.update(
    {
      disable: true,
    },
    {
      where: { id },
    }
  );
};

// // 暂时用不到
// exports.picked = async (id, times) => {
//   const theMailBox = await Mailbox.findOne({
//     where: { id },
//   });

//   if (theMailBox.dataValues.maxTimes <= theMailBox.dataValues.currentTimes) {
//     return {
//       success: false,
//       ret: config.emptyTip || "亲，已经被提取完啦",
//     };
//   } else {
//     await theMailBox.update({
//       currentTimes: theMailBox.dataValues.currentTimes + 1,
//     });
//     return {
//       success: false,
//       ret: config.successTip || "提取成功啦",
//     };
//   }
// };

exports.model = Mailbox;
