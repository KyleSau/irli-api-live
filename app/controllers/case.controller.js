const db = require("../models");
const Case = db.case;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.case_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const lawsuit = {
    case_name: req.body.case_name,
    case_id: req.body.case_id,
    courts: req.body.courts,
    description: req.body.description,
    staff_member: req.body.staff_member,
    next_steps: req.body.next_steps,
    documents: req.body.documents,
    lead_counsel: req.body.lead_counsel,
    status: req.body.status,
    document_type: req.body.document_type,
    deadline: req.body.deadline,
    last_updated: req.body.last_updated //probably just handle this here
  };
  // Save Case in the database
  Case.create(lawsuit)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the case."
      });
    });
};

exports.findAll = (req, res) => {
  const case_name = req.query.case_name;
  var condition = case_name ? { case_name: { [Op.like]: `%${case_name}%` } } : null;
  Case.findAll({ where: condition })
    .then(data => {
      //console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    });
};

exports.getEvents = (req, res) => {
  const case_name = req.query.case_name;
  var condition = case_name ? { case_name: { [Op.like]: `%${case_name}%` } } : null;

  Case.findAll({ where: condition })
    .then(data => {

      var events = [];
      for (const element of data) {
        var event = new Object();

        event.id = element.id;
        event.title = element.case_name;


        var date = new Date(element.deadline);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);

        event.start = date;
        event.end = date;
        events.push(event);
      }
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Case.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find case with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving case with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Case.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "case was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update case with id=${id}. Maybe case was not found or req.body is empty!`
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
  Case.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "case was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete case with id=${id}. Maybe case was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete case with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Case.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} case were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all case."
      });
    });
};

exports.findAllActive = (req, res) => {
  Case.findAll({ where: { status: "Active" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    });
};

exports.findAllArchived = (req, res) => {
  Case.findAll({ where: { status: "Archived" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    });
};

exports.findAllProspective = (req, res) => {
  Case.findAll({ where: { status: "Prospective" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cases."
      });
    });
};