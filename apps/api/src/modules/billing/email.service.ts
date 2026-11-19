import { Injectable, Logger } from '@nestjs/common';

export interface WelcomeEmailData {
  to: string;
  name?: string;
  billingCycle: 'monthly' | 'yearly';
  amount: string;
  currency: string;
}

export interface ReceiptEmailData {
  to: string;
  name?: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  date: string;
  pdfUrl?: string;
}

export interface DunningEmailData {
  to: string;
  name?: string;
  invoiceNumber?: string;
  retryDate?: string;
  updatePaymentUrl: string;
}

@Injectable()
export class BillingEmailService {
  private readonly logger = new Logger(BillingEmailService.name);
  private readonly resendApiKey = process.env.RESEND_API_KEY;
  private readonly senderEmail = process.env.EMAIL_FROM || 'billing@simplifypdf.com';

  /**
   * 1. Welcome Pro Member Email with Quick-Start Guide
   */
  async sendWelcomeProEmail(data: WelcomeEmailData): Promise<boolean> {
    const subject = '🎉 Welcome to SimplifyPDF PRO — 2GB & VIP Batch Mode Unlocked!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F7; margin: 0; padding: 24px; color: #11141D; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #DDDDE4; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { text-align: center; margin-bottom: 28px; }
          .logo { font-size: 24px; font-weight: 900; color: #864FFE; letter-spacing: -0.5px; }
          .badge { display: inline-block; background-color: #C6F56F; color: #11141D; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 999px; margin-top: 8px; text-transform: uppercase; }
          h1 { font-size: 24px; font-weight: 800; color: #11141D; margin: 16px 0 8px; }
          p { font-size: 15px; line-height: 1.6; color: #4A4A52; }
          .perk-box { background-color: #FAF9F7; border: 1px solid #E6E6EC; border-radius: 14px; padding: 18px; margin: 20px 0; }
          .perk-title { font-weight: 700; font-size: 14px; color: #864FFE; margin-bottom: 8px; }
          .perk-list { margin: 0; padding-left: 20px; font-size: 14px; color: #2A2A30; }
          .perk-list li { margin-bottom: 6px; }
          .cta-btn { display: inline-block; background-color: #864FFE; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 999px; margin: 20px 0; text-align: center; }
          .footer { font-size: 12px; color: #8E8E98; text-align: center; margin-top: 32px; border-top: 1px solid #E6E6EC; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SimplifyPDF</div>
            <div class="badge">PRO ACTIVATED</div>
          </div>
          <h1>Welcome to the Pro Tier, ${data.name || 'Friend'}!</h1>
          <p>Your subscription is active at <strong>${data.amount} ${data.currency}</strong> (${data.billingCycle}). Your account limits have been instantly upgraded across all SimplifyPDF services:</p>
          
          <div class="perk-box">
            <div class="perk-title">⚡ Your New Pro Superpowers:</div>
            <ul class="perk-list">
              <li><strong>2,048 MB (2 GB) File Limit:</strong> Process massive PDF books, CAD blueprints, and high-DPI scans.</li>
              <li><strong>Batch ZIP Studio:</strong> Process up to 100 documents simultaneously with 1-click ZIP download.</li>
              <li><strong>24-Hour Vault Retention:</strong> Files stay available for 24 hours with instant manual shred option.</li>
              <li><strong>VIP Priority Worker Stream:</strong> Skip wait queues with dedicated worker allocations.</li>
              <li><strong>500 OCR Pages / Month:</strong> High-accuracy multi-lingual text extraction & searchable PDF creation.</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="https://simplifypdf.com/batch" class="cta-btn">Launch Pro Workspace &rarr;</a>
          </div>

          <p style="font-size: 13px; color: #71717A;">
            Need help or custom integrations? Reply directly to this email to reach our priority support engineering desk.
          </p>

          <div class="footer">
            &copy; 2026 SimplifyPDF Inc. All rights reserved. &bull; Enterprise-grade, zero-AGPL PDF Processing.
          </div>
        </div>
      </body>
      </html>
    `;

    return this.deliverEmail(data.to, subject, html);
  }

  /**
   * 2. Payment Receipt / Tax Invoice Email
   */
  async sendInvoiceReceiptEmail(data: ReceiptEmailData): Promise<boolean> {
    const subject = `Tax Invoice & Receipt for SimplifyPDF (${data.invoiceNumber})`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F7; margin: 0; padding: 24px; color: #11141D; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #DDDDE4; padding: 36px; }
          .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .receipt-table th { text-align: left; padding: 10px; border-bottom: 2px solid #E6E6EC; font-size: 12px; color: #71717A; text-transform: uppercase; }
          .receipt-table td { padding: 12px 10px; border-bottom: 1px solid #E6E6EC; font-size: 14px; }
          .total-row { font-weight: 800; font-size: 16px; color: #11141D; }
          .status-paid { display: inline-block; background-color: #DCFCE7; color: #15803D; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 6px; }
          .btn-receipt { display: inline-block; background-color: #1A1A1C; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 999px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E6E6EC; padding-bottom: 16px;">
            <div style="font-size: 20px; font-weight: 900; color: #864FFE;">SimplifyPDF</div>
            <span class="status-paid">PAID</span>
          </div>

          <h2 style="font-size: 20px; font-weight: 800; margin: 24px 0 8px;">Payment Receipt</h2>
          <p style="font-size: 14px; color: #71717A; margin: 0;">Invoice Number: <strong>${data.invoiceNumber}</strong> &bull; Date: ${data.date}</p>

          <table class="receipt-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SimplifyPDF Pro Membership</td>
                <td style="text-align: right;">${data.amount} ${data.currency}</td>
              </tr>
              <tr class="total-row">
                <td>Total Charged</td>
                <td style="text-align: right;">${data.amount} ${data.currency}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.pdfUrl || 'https://simplifypdf.com/billing'}" class="btn-receipt">Download Official PDF Invoice</a>
          </div>

          <p style="font-size: 12px; color: #8E8E98; line-height: 1.5;">
            GST / VAT Information: SimplifyPDF Inc. All applicable taxes included. For invoice modification or tax ID details, visit your billing dashboard.
          </p>
        </div>
      </body>
      </html>
    `;

    return this.deliverEmail(data.to, subject, html);
  }

  /**
   * 3. Payment Failed / Dunning Grace Period Email
   */
  async sendPaymentFailedEmail(data: DunningEmailData): Promise<boolean> {
    const subject = '⚠️ Action Required: Payment failed for your SimplifyPDF Pro subscription';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F7; margin: 0; padding: 24px; color: #11141D; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #FECDD3; padding: 36px; }
          .alert-banner { background-color: #FFF1F2; border: 1px solid #FDA4AF; border-radius: 12px; padding: 16px; margin: 16px 0; color: #9F1239; font-size: 14px; }
          .cta-update { display: inline-block; background-color: #E11D48; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 999px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="font-size: 20px; font-weight: 900; color: #864FFE; margin-bottom: 12px;">SimplifyPDF</div>
          <h2 style="font-size: 20px; font-weight: 800; color: #9F1239; margin: 0 0 12px;">Payment Authorization Failed</h2>
          
          <div class="alert-banner">
            <strong>Grace Period Active:</strong> We were unable to process your recent renewal payment. Your 2GB limit and Pro tools remain active for the next <strong>3 days</strong> while our automated dunning engine retries.
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #4A4A52;">
            To ensure uninterrupted access to your 100-file batch ZIP queues and 24-hour file vault, please update your payment method or approve the authorization prompt from your bank / UPI provider.
          </p>

          <div style="text-align: center;">
            <a href="${data.updatePaymentUrl}" class="cta-update">Update Payment Method &rarr;</a>
          </div>

          <p style="font-size: 12px; color: #8E8E98; margin-top: 24px;">
            Next automatic retry scheduled for: <strong>${data.retryDate || 'Tomorrow morning'}</strong>. If you intend to cancel, no further action is required.
          </p>
        </div>
      </body>
      </html>
    `;

    return this.deliverEmail(data.to, subject, html);
  }

  /**
   * Universal Resend API dispatcher with safe mock fallback
   */
  private async deliverEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.resendApiKey) {
      this.logger.log(`[BillingEmailService:MOCK] Simulated email to: ${to} | Subject: "${subject}"`);
      return true;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.resendApiKey}`,
        },
        body: JSON.stringify({
          from: this.senderEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Resend API delivery error: ${response.status} - ${errorText}`);
        return false;
      }

      const resData = await response.json();
      this.logger.log(`Resend email delivered successfully. ID: ${resData.id}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      return false;
    }
  }
}
