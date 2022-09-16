const db = require("../models");
const Contact = db.contact;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const contact = {
    title: req.body.title,
    name: req.body.name,
    street_address: req.body.street_address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    primary_phone: req.body.primary_phone,
    secondary_phone: req.body.secondary_phone,
    fax: req.body.fax,
    email: req.body.email,
    agency_name: req.body.agency_name
  };
  // Save Case in the database
  Contact.create(contact)
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
  Contact.findAll({ where: condition })
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
  Contact.findByPk(id)
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
  Contact.update(req.body, {
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
  Contact.destroy({
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

