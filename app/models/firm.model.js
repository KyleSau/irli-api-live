module.exports = (sequelize, Sequelize) => {
  const Firm = sequelize.define("firms", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING
    },
    street: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    zip: {
      type: Sequelize.STRING
    },
    longitude: {
      type: Sequelize.DOUBLE
    },
    latitude: {
      type: Sequelize.DOUBLE
    },
    website: {
      type: Sequelize.STRING
    },
    attorneys: {
      type: Sequelize.JSON
    },
    longitude: {
      type: Sequelize.DOUBLE
    },
    latitude: {
      type: Sequelize.DOUBLE
    }
  });
  return Firm;
};