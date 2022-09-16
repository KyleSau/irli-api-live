module.exports = (sequelize, Sequelize) => {
  const Agency = sequelize.define("agencies", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    
  });
  return Agency;
};