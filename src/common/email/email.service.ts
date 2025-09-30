import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
// import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    // private i18nService: I18nService, // Временно отключен
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMagicLink(email: string, magicLink: string, language: string = 'en'): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Magic Link - Mystical Astro', // Временный заголовок
      html: await this.generateMagicLinkHTML(magicLink, language),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Magic link sent to ${email} (${language})`);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(
    email: string,
    firstName?: string,
    language: string = 'en',
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Welcome to Mystical Astro!', // Временный заголовок
      html: await this.generateWelcomeHTML(firstName, language),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email} (${language})`);
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
    }
  }

  async sendDailyDigest(
    email: string,
    userData: any,
    recommendations: any,
    language: string = 'en',
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Your Daily Astro Digest', // Временный заголовок
      html: await this.generateDailyDigestHTML(userData, recommendations, language),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Daily digest sent to ${email} (${language})`);
    } catch (error) {
      console.error('❌ Error sending daily digest:', error);
    }
  }

  private async generateMagicLinkHTML(magicLink: string, language: string): Promise<string> {
    const t = (key: string) => 'common.' + key; // Временное отключение перевода
    console.log(language);
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">🔮 Mystical Astro</h2>
        <p>${await t('hello')}!</p>
        <p>${await t('magic_link_message')}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}" 
             style="background-color: #6b46c1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            ${await t('login_to_account')}
          </a>
        </div>
        <p>${await t('or_copy_link')}</p>
        <p style="word-break: break-all; color: #6b46c1;">${magicLink}</p>
        <p><strong>${await t('link_valid_15_min')}</strong></p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          ${await t('if_not_requested')}
        </p>
      </div>
    `;
  }

  private async generateWelcomeHTML(firstName?: string, _language: string = 'en'): Promise<string> {
    const t = (key: string) => 'common.' + key; // Временное отключение перевода

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">🔮 ${await t('welcome')}</h2>
        <p>${await t('hello')}${firstName ? `, ${firstName}` : ''}!</p>
        <p>${await t('welcome_message')}</p>
        <p>${await t('now_you_can')}</p>
        <ul>
          <li>${await t('personal_rituals')}</li>
          <li>${await t('moon_phases')}</li>
          <li>${await t('daily_stones')}</li>
          <li>${await t('tea_recipes')}</li>
          <li>${await t('astro_journal')}</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.configService.get('APP_URL')}/dashboard" 
             style="background-color: #6b46c1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            ${await t('go_to_app')}
          </a>
        </div>
        <p>${await t('best_regards')}<br>${await t('team')}</p>
      </div>
    `;
  }

  private async generateDailyDigestHTML(
    userData: any,
    recommendations: any,
    language: string = 'en',
  ): Promise<string> {
    const t = (key: string) => 'common.' + key; // Временное отключение перевода
    console.log(language);
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6b46c1;">🌙 ${await t('daily_digest_subject')}</h2>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('energy_level')}</h3>
          <p>${userData.energyLevel || 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('moon_phase')}</h3>
          <p>${userData.moonPhase || 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('ritual_recommendation')}</h3>
          <p>${recommendations.ritual || 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('stone_recommendation')}</h3>
          <p>${recommendations.stone || 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('tea_recommendation')}</h3>
          <p>${recommendations.tea || 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('energy_tip')}</h3>
          <p>${recommendations.energyTip || 'N/A'}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3>${await t('astro_path')}</h3>
          <p>${recommendations.astroPath || 'N/A'}</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          ${await t('best_regards')}<br>${await t('team')}
        </p>
      </div>
    `;
  }
}
