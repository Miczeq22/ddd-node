import { MailerService, SendMailPayload } from './mailer.service';
import { Transporter, createTransport } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export class MailerServiceMailhogImpl implements MailerService {
  private transporter: Transporter;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = createTransport({
      host: process.env.MAILHOG_HOST,
      port: Number(process.env.SMTP_PORT),
    });

    const layoutTemplate = fs.readFileSync(
      path.join(__dirname, 'templates', 'template.hbs'),
      'utf-8',
    );

    handlebars.registerPartial('layout', layoutTemplate);
  }

  public async sendMail({ template: templateName, from, to, payload, subject }: SendMailPayload) {
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, 'templates', `${templateName}.hbs`),
      'utf-8',
    );

    const template = handlebars.compile(emailTemplateSource);

    const htmlToSend = template(payload);

    await this.transporter.sendMail({
      to,
      subject,
      html: htmlToSend,
      from: from ?? process.env.SERVICE_MAIL,
    });
  }

  public getEmailConfirmationURL(confirmationToken: string) {
    return `${process.env.PROTOCOL}://${process.env.HOST}${
      process.env.NODE_ENV === 'production' ? '' : `:${process.env.PORT}`
    }/confirm-account?token=${confirmationToken}`;
  }
}
