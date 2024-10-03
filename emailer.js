const nodemailer = require('nodemailer');

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

// Function to send the email via SMTP
function sendEmail(recipients, content) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
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

module.exports = {
  generateEmailHTML,
  sendEmail
};
