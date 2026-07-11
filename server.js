require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const emailUser = (process.env.EMAIL_USER || '').trim();
const emailAppPassword = (process.env.EMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
const emailReceiver = (process.env.EMAIL_RECEIVER || '').trim() || emailUser;

if (!emailUser || !emailAppPassword) {
  console.warn('Email is not fully configured. Set EMAIL_USER and EMAIL_APP_PASSWORD in .env.');
}

// Nodemailer transporter setup
// Defaults to Gmail - Make sure to use an App Password if using Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailAppPassword,
  },
});


app.post('/api/book', async (req, res) => {
  const { name, email, phone, date, time, style, placement, idea, dob, location, bookingDate, tattooType, message } = req.body;

  const finalPhone = phone;
  const finalDate = bookingDate || date;
  const finalStyle = tattooType || style || 'Not specified';
  const finalMessage = message || idea || 'None provided';
  const finalLocation = location || 'Coimbatore';
  const finalDob = dob || 'Not specified';

  if (!name || !finalPhone || !email || !finalDate) {
    return res.status(400).json({ error: 'Name, email, phone, and booking date are required.' });
  }

  const mailOptions = {
    from: `"Harsha Tattoo Studio" <${emailUser}>`,
    to: emailReceiver,
    subject: `New Booking Request from ${name} (${finalLocation})`,
    text: `
You have a new booking request!

Name: ${name}
Email: ${email}
Phone: ${finalPhone}
Shop Location: ${finalLocation}
Date of Birth: ${finalDob}
Appointment Date: ${finalDate}
Preferred Tattoo Type: ${finalStyle}

Message / Idea Description:
${finalMessage}
    `,
  };

  const clientMailOptions = {
    from: `"Harsha Tattoo Studio" <${emailUser}>`,
    to: email,
    subject: `Booking Request Received - Harsha Tattoo Studio`,
    text: `Hi ${name},

Thank you for reaching out to Harsha Tattoo Studio!

We have received your booking request for ${finalDate} at our ${finalLocation} location. Our team will review your details and call you at ${finalPhone} within 24 hours to confirm your appointment.

Here is a summary of your request:
- Date: ${finalDate}
- Location: ${finalLocation}
- Tattoo Style: ${finalStyle}
- Message: ${finalMessage}

We look forward to creating your next masterpiece!

Best regards,
Harsha Tattoo Studio
090251 60201
    `,
  };

  try {
    // Send to Studio Owner
    await transporter.sendMail(mailOptions);

    // Send auto-reply to the Client
    await transporter.sendMail(clientMailOptions);

    console.log('Emails sent successfully for booking:', name);
    res.status(200).json({ message: 'Booking request sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send booking request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP verification failed:', error.message);
      return;
    }
    if (success) {
      console.log('SMTP server is ready to send emails.');
    }
  });
});

module.exports = app;
