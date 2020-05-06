const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));

const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class User extends Sequelize.Model {}
User.init(
  {
    uuid: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true,
    },
    avatar: Sequelize.TEXT(),
    nickname: Sequelize.STRING(100),
    mobile: Sequelize.STRING(100),
    token: Sequelize.STRING(100),
    idnumber: {
      type: Sequelize.INTEGER(),
    },
  },
  { sequelize, modelName: "User" }
);

User.sync({
  alter: true,
});

exports.create = async (uuid, nickname, avatar, token) => {
  return await User.create({
    uuid,
    nickname,
    avatar,
    mobile: "",
    token,
    idnumber: (await User.max("idnumber")) + 1,
  });
  // .then(res => console.log(res.dataValues))
  // .catch(e => console.log(e.sqlMessage, e.sqlState));
};
exports.model = User;
