import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_MAIL_USER,
        pass: process.env.GOOGLE_MAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetCode: string) {
    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'Verfication Code',
      html: `<p>This is your code<br><strong>${resetCode}</strong></p>`,
    };
    // console.log(this.configService.get('GOOGLE_MAIL_PASSWORD'));
    await this.transporter.sendMail(mailOptions);
  }

  async sendWaitListEmail(to: string) {
    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'Waitlist',
      html: `<p>Thank you for your interest in our service. We appreciate your patience as we work to onboard new users. We will notify you as soon as we are ready to welcome you aboard.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendApprovalEmail(to: string) {
    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'Approval',
      html: `<p>Your organization has been approved. You may now invite your staff and begin utilizing our platform's features.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
