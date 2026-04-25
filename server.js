require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
// Defaults to Gmail - Make sure to use an App Password if using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

app.post('/api/book', async (req, res) => {
  const { name, email, phone, date, time, style, placement, idea } = req.body;

  if (!name || !phone || !email || !date) {
    return res.status(400).json({ error: 'Name, email, phone, and date are required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: `New Booking Request from ${name}`,
    text: `
You have a new booking request!

Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Date: ${date}
Preferred Time: ${time || 'Not specified'}
Tattoo Style: ${style || 'Not specified'}
Placement: ${placement || 'Not specified'}

Idea Description:
${idea || 'None provided'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Booking request sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send booking request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
