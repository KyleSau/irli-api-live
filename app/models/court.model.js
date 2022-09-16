module.exports = (sequelize, Sequelize) => {
  const Court = sequelize.define("courts", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING
    },
    abbreviation: {
      type: Sequelize.STRING
    }
  });
  return Court;
};