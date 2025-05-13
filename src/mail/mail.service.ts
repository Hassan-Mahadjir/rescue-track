import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/main/user.entity';

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
      subject: 'Password Reset Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background-color: #4a90e2; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset Request</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; margin-bottom: 20px;">
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Please use the following verification code to proceed:</p>
            
            <div style="background-color: #ffffff; border: 2px solid #4a90e2; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #4a90e2; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${resetCode}</p>
            </div>
            
            <p style="color: #2c3e50; font-size: 14px; line-height: 1.5;">This code will expire in 5 minutes. If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 20px;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendWaitListEmail(to: string) {
    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'Welcome to Our Waitlist',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background-color: #4a90e2; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Our Waitlist</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; margin-bottom: 20px;">
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.5;">Thank you for your interest in our service. We're excited to have you join our community!</p>
            
            <div style="background-color: #ffffff; border: 2px solid #4a90e2; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.5; margin: 0;">We appreciate your patience as we work to onboard new users. Our team is dedicated to ensuring the best experience for all our users, and we will notify you as soon as we are ready to welcome you aboard.</p>
            </div>
            
            <p style="color: #2c3e50; font-size: 14px; line-height: 1.5;">We'll keep you updated on our progress and notify you as soon as your account is ready for activation.</p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 20px;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendApprovalEmail(to: string) {
    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'Organization Approval Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background-color: #4a90e2; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Organization Approved!</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; margin-bottom: 20px;">
            <p style="color: #2c3e50; font-size: 16px; line-height: 1.5;">Great news! Your organization has been approved and is now ready to use our platform.</p>
            
            <div style="background-color: #ffffff; border: 2px solid #4a90e2; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">Next Steps:</h2>
              <ul style="color: #2c3e50; font-size: 16px; line-height: 1.5; padding-left: 20px;">
                <li>Invite your staff members to join the platform</li>
                <li>Set up your organization's profile</li>
                <li>Begin utilizing our platform's features</li>
              </ul>
            </div>
            
            <p style="color: #2c3e50; font-size: 14px; line-height: 1.5;">If you have any questions or need assistance, our support team is here to help.</p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 20px;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderEmailToSupplier(to: string, order: Order, user: User) {
    const orderItemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${item.medication ? item.medication.name : item.equipment.name}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${item.medication ? 'Medication' : 'Equipment'}</td>
      </tr>
    `,
      )
      .join('');

    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'New Order Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px; background-color: #ffffff;">
          <div style="background-color: #4a90e2; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Order Received</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; margin-bottom: 20px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">Order Details</h2>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Order ID:</strong> ${order.id}</p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Order Date:</strong> ${order.createdAt.toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Status:</strong> ${order.status}</p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Notes:</strong> ${order.notes}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">Order Creator Details</h2>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Name:</strong> ${user.profile?.firstName} ${user.profile?.lastName}</p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Email:</strong> ${user.email}</p>
              <p style="margin: 8px 0;"><strong style="color: #4a90e2;">Hospital:</strong> ${user.hospital?.name}</p>
            </div>

            <div>
              <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #4a90e2;">
                    <th style="padding: 12px; color: white; text-align: left;">Item Name</th>
                    <th style="padding: 12px; color: white; text-align: center;">Quantity</th>
                    <th style="padding: 12px; color: white; text-align: left;">Type</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>
            </div>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 20px;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderEmailToAdmin(to: string, order: Order) {
    const orderItemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${item.medication ? item.medication.name : item.equipment.name}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border: 1px solid #dee2e6;">${item.medication ? 'Medication' : 'Equipment'}</td>
      </tr>
    `,
      )
      .join('');

    const mailOptions = {
      from: process.env.GOOGLE_MAIL_USER,
      to: to,
      subject: 'New Order Placed - Admin Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background-color: #2c3e50; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Order Notification</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; margin-bottom: 20px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">Order Details</h2>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Order ID:</strong> ${order.id}</p>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Order Date:</strong> ${order.createdAt.toLocaleString()}</p>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Status:</strong> ${order.status}</p>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Notes:</strong> ${order.notes}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">Supplier Details</h2>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Name:</strong> ${order.supplier?.name}</p>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Email:</strong> ${order.supplier?.email}</p>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Phone:</strong> ${order.supplier?.phone || 'N/A'}</p>
              <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Address:</strong> ${order.supplier?.address || 'N/A'}</p>
            </div>

            <div>
              <h2 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: #2c3e50;">
                    <th style="padding: 12px; color: white; text-align: left;">Item Name</th>
                    <th style="padding: 12px; color: white; text-align: center;">Quantity</th>
                    <th style="padding: 12px; color: white; text-align: left;">Type</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>
            </div>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 20px;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
