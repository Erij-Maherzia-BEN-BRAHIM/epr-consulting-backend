# EPR Access Consulting - Backend Server

This is the backend server for handling contact form submissions from the EPR Access Consulting website.

## Features

- Receives contact form data via POST request
- Sends formatted emails directly to info@epraccess.com
- Uses Nodemailer with SMTP for reliable email delivery
- CORS enabled for frontend communication

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your email credentials:

**For Gmail:**

1. Go to https://myaccount.google.com/apppasswords
2. Generate a new "App Password"
3. Use your Gmail address and the generated app password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**For Outlook/Office 365:**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

**For other providers:**
Check your email provider's SMTP settings and update accordingly.

### 3. Run the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST /api/contact

Sends an email with the contact form data.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "subject": "Training Inquiry",
  "message": "I'm interested in your training programs",
  "trainingTab": "IT",
  "trainingOption": "Web Developer"
}
```

**Response:**

- 200: Email sent successfully
- 400: Missing required fields
- 500: Server error

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "Server is running"
}
```

## Production Deployment

For production, you can deploy this server to:

- **Heroku**: Simple deployment with git push
- **DigitalOcean**: VPS with full control
- **AWS EC2**: Scalable cloud solution
- **Vercel/Netlify**: Serverless functions (requires adaptation)
- **Railway**: Modern platform with easy setup

Make sure to:

1. Set environment variables on your hosting platform
2. Update CORS settings if needed
3. Use a process manager like PM2 for reliability
4. Set up SSL/HTTPS for secure communication

## Update Frontend

In your frontend `vite.config.ts`, add a proxy for development:

```typescript
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

For production, update the fetch URL in `Contact.tsx` to your deployed server URL:

```typescript
const response = await fetch("https://your-server-url.com/api/contact", {
  // ...
});
```

## Security Notes

- Never commit your `.env` file
- Use app-specific passwords for Gmail
- Enable 2FA on your email account
- Consider implementing rate limiting for production
- Add input validation and sanitization
- Use HTTPS in production

## Troubleshooting

**Gmail "Less secure app" error:**

- Don't use your regular Gmail password
- Generate and use an App Password instead

**Port already in use:**

- Change the PORT in `.env` file

**CORS errors:**

- Update the cors() configuration in index.js if needed

**Email not sending:**

- Check your SMTP credentials
- Verify your email provider allows SMTP
- Check spam folder for test emails
# epr-consulting-backend
