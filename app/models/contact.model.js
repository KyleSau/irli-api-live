module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define("contacts", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    title: {
      type: Sequelize.STRING
    },
    name: {
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
    primary_phone: {
      type: Sequelize.STRING
    },
    secondary_phone: {
      type: Sequelize.STRING
    },
    fax: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    agency_name: {
      type: Sequelize.STRING
    }
  });
  return Contact;
};