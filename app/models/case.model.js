module.exports = (sequelize, Sequelize) => {
  const Case = sequelize.define("cases", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    case_name: {
      type: Sequelize.STRING
    },
    case_id: {
      type: Sequelize.STRING
    },
    courts: {
      type: Sequelize.JSON
    },
    description: {
      type: Sequelize.TEXT
    },
    staff_member: {
      type: Sequelize.STRING
    },
    next_steps: {
      type: Sequelize.TEXT
    },
    documents: {
      type: Sequelize.JSON
    },
    lead_counsel: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    document_type: {
      type: Sequelize.TEXT
    },
    deadline: {
      type: Sequelize.DATEONLY
    }
  });
  return Case;
};