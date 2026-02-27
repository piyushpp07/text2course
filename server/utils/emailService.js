import nodemailer from 'nodemailer';

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'piyushpar7@gmail.com', // fallback from memory if no env
        pass: process.env.EMAIL_PASS, // App password needed
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'piyushpar7@gmail.com',
      to: email,
      subject: 'text2learn - Your OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #647DEE;">text2learn verification</h2>
          <p>Thank you for signing up for text2learn! Here is your One-Time Password to complete registration:</p>
          <div style="font-size: 32px; font-weight: bold; background: #f3f4f6; padding: 10px; display: inline-block; border-radius: 8px; letter-spacing: 2px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] OTP sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR]', error.message);
    return false;
  }
};

export default sendOtpEmail;
