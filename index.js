const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: smtpPort === 465, // true for port 465, false for other ports (587, 25, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, subject, message, trainingTab, trainingOption } = req.body;

  // Log received data
  console.log('Received contact form submission:', { name, email, phone, subject });

  // Validate required fields
  if (!name || !email || !phone || !subject || !message) {
    console.error('Validation failed:', { name, email, phone, subject, message });
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  // Verify SMTP configuration
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('SMTP credentials not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        </div>

        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Training Interest</h3>
          <p><strong>Category:</strong> ${trainingTab || 'Not specified'}</p>
          <p><strong>Training:</strong> ${trainingOption || 'Not specified'}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Subject</h3>
          <p>${subject}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from the EPR Access Consulting contact form.
        </p>
      </div>
    `,
    replyTo: email,
  };

  try {
    console.log('Attempting to send email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', process.env.EMAIL_USER);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
