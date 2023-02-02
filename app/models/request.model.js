module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define("requests", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    agency: {
      type: Sequelize.STRING
    },
    agency_contacts: {
      type: Sequelize.JSON
    },
    agency_tracking_numbers: {
      type: Sequelize.STRING
    },
    current_status: {
      type: Sequelize.TEXT
    },
    category: {
      type: Sequelize.STRING
    },
    subject: {
      type: Sequelize.TEXT
    },
    short_description: {
      type: Sequelize.STRING
    },
    submission_date: {
      type: Sequelize.DATEONLY
    },
    acknowledgement_date: {
      type: Sequelize.DATEONLY
    },
    records_received: {
      type: Sequelize.STRING
    },
    urgent: {
      type: Sequelize.STRING
    },
    overdue: {
      type: Sequelize.STRING
    },
    documents: {
      type: Sequelize.JSON
    }
  });
  return Request;
};