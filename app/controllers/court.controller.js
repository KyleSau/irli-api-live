const db = require("../models");
const Court = db.court;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const court = {
    name: req.body.name,
    abbreviation: req.body.abbreviation,
  };
  // Save Case in the database
  Court.create(court)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating court."
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Court.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving court."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Court.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find court with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving court with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Court.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "court was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update court with id=${id}. Maybe court was not found or req.body is empty!`
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
  Court.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "court was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete court with id=${id}. Maybe court was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete court with id=" + id
      });
    });
};

