const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const cron = require("node-cron");
const { Op } = require("sequelize");

const app = express();
const db = require("./app/models");
const Role = db.role;
global.__basedir = __dirname;
const DROP_AND_RESYNC = false;

let serverActive = true; // Flag to determine if the server is active

if (DROP_AND_RESYNC) {
  db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
  });
} else {
  db.sequelize.sync();
}

function initial() {
  Role.create({ id: 1, name: "User" });
  Role.create({ id: 2, name: "Moderator" });
  Role.create({ id: 3, name: "Admin" });
}

var corsOptions = { origin: "http://localhost:8081" };
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check if the server is active
function checkServerStatus(req, res, next) {
    if (!serverActive && !req.path.startsWith('/admin')) { // Allow /admin routes to bypass
        return res.status(503).json({ message: "Server is currently disabled by admin." });
    }
    next();
}

// Apply the checkServerStatus middleware globally, but make sure the /admin routes are excluded
app.use(checkServerStatus);

// Importing all your routes after applying the middleware
require('./app/routes/court.routes')(app);
require('./app/routes/request.routes')(app);
require('./app/routes/contact.routes')(app);
require('./app/routes/attorney.routes')(app);
require('./app/routes/firm.routes')(app);
require('./app/routes/agency.routes')(app);
require('./app/routes/case.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/file.routes')(app);

// Admin route to disable the server
app.post('/admin/disable', (req, res) => {
    serverActive = false;
    res.status(200).send("Server functionalities have been disabled.");
});

// Admin route to enable the server
app.post('/admin/enable', (req, res) => {
    serverActive = true;
    res.status(200).send("Server functionalities have been enabled.");
});

// Route to send mass emails manually
app.post('/send-mass-emails', (req, res) => {
    emailDailyReports();
    res.status(200).send("Mass emails have been sent successfully.");
});

// Function to send daily reports via email
function emailDailyReports() {
  const Case = db.case;
  const User = db.user;
  const today = new Date().toISOString().slice(0, 10);
  let emails = [];

  // Adjusted query with Sequelize operators
  Case.findAll({ where: { deadline: { [Op.gte]: today } } })
    .then(cases => {
      if (!cases.length) {
        console.log("No cases with upcoming deadlines.");
        return;
      }

      User.findAll({ where: { reports: 'Yes' } })
        .then(users => {
          if (!users.length) {
            console.log("No users opted for reports.");
            return;
          }

          emails = users.map(user => user.email);
          if (emails.length === 0) {
            console.log("No email recipients found.");
            return;
          }

          const emailContent = generateEmailHTML(cases);
          sendEmail(emails, emailContent);
        });
    })
    .catch(err => {
      console.error("Error fetching data: ", err);
    });
}

// Function to generate HTML content for the email
function generateEmailHTML(cases) {
  const style = 'style="border: 1px solid black; padding: 8px; border-collapse: collapse;"';
  let html = `<html><body><table ${style}><thead><tr><th ${style}>Case Name</th><th ${style}>Deadline</th><th ${style}>Document Type</th></tr></thead><tbody>`;

  cases.forEach(c => {
    html += `<tr><td ${style}>${c.case_name}</td><td ${style}>${c.deadline}</td><td ${style}>${c.document_type}</td></tr>`;
  });

  html += '</tbody></table></body></html>';
  return html;
}


// Function to send the email via SMTP2GO
function sendEmail(recipients, content) {
  const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 465,
    secure: true,
    auth: {
      user: 'irlireports',
      pass: 'dL7p6I7bN777bsaM'
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: 'markup@fairus.org',
    to: recipients.join(','),
    subject: 'Litigation Daily Report',
    html: content
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email: ", err);
    } else {
      console.log("Emails sent: ", info.response);
    }
  });
}

// Schedule email reports daily at 3:00 PM EST
cron.schedule('0 15 * * *', () => {
  if (serverActive) {
    emailDailyReports();
  }
}, {
  timezone: "America/New_York"
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(__basedir + "/uploads/");
});
