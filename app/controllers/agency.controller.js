const db = require("../models");
//const Lawyer = require("../models/attorney.model.js");
const Agency = db.agency;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const agency = {
    name: req.body.name,
    description: req.body.description,
  };
  // Save Case in the database
  Agency.create(agency)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating agency."
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Agency.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving agency."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Agency.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find agency with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving agency with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Agency.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "agency was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update agency with id=${id}. Maybe agency was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating case with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Agency.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "agency was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete agency with id=${id}. Maybe case was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete agency with id=" + id
      });
    });
};

