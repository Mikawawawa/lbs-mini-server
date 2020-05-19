const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));

const User = require("./User");

const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class Range extends Sequelize.Model {}
Range.init(
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true,
    },
    top: Sequelize.DOUBLE(),
    bottom: Sequelize.DOUBLE(),
    left: Sequelize.DOUBLE(),
    right: Sequelize.DOUBLE(),
  },
  { sequelize, modelName: "Range" }
);

exports.addOne = (top, bottom, left, right) => {
  return Range.create({
    id: Util.uuid(),
    top,
    bottom,
    left,
    right,
  });
};

exports.remove = (id) => {
  return Range.destroy({
    where: {
      id,
    },
  });
};

exports.check = async (lat, lng) => {
  const data = await Range.findOne({
    where: {
      top: { [Sequelize.Op.gt]: lat },
      bottom: { [Sequelize.Op.lt]: lat },
      left: { [Sequelize.Op.lt]: lng },
      right: { [Sequelize.Op.gt]: lng },
    },
  });
  return data !== null;
};

exports.get = async (top, bottom, left, right) => {
  return (
    await Range.findAll({
      where: {
        // top: { [Sequelize.Op.lt]: top },
        // bottom: { [Sequelize.Op.gt]: bottom },
        // left: { [Sequelize.Op.gt]: left },
        // right: { [Sequelize.Op.lt]: right },
      },
    })
  ).map((item) => item.dataValues);
};

exports.model = Range;
