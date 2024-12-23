import nodemailer from 'nodemailer';
<<<<<<< HEAD:frontend/utils/notification.ts
import { prisma } from '@/prisma/client';
=======
import { prisma } from '@/lib/prisma-client';
>>>>>>> 942a7b7 (updated):utils/notification.ts

// Function to send an email notification
export async function sendNotification(userId: string, title: string, message: string): Promise<void> {
  try {
    // Fetch user details like email (ensure your user schema has an email field)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new Error('User not found or email is missing');
    }

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your chosen email service
      auth: {
        user: process.env.EMAIL_USERNAME, // email username
        pass: process.env.EMAIL_PASSWORD, // email password (or app-specific password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: title,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email} with subject: "${title}"`);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Unable to send notification');
  }
}
