module.exports = (sequelize, Sequelize) => {
  const Attorney = sequelize.define("attorneys", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    practice_area: {
      type: Sequelize.STRING
    },
    organizations: {
      type: Sequelize.STRING
    },
    referred: {
      type: Sequelize.STRING
    },
    admitted: {
      type: Sequelize.STRING
    },
    street_address: {
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
    courts: {
      type: Sequelize.JSON
    },
    month_year_joined: {
      type: Sequelize.STRING
    },
    longitude: {
      type: Sequelize.DOUBLE
    },
    latitude: {
      type: Sequelize.DOUBLE
    }
  });
  return Attorney;
};