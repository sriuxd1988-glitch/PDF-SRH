import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Configure authenticator options
authenticator.options = {
  window: 1, // allow 1 step before/after for slight clock drift
  step: 30,  // 30 second step
};

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function generateTotpKeyUri(email: string, secret: string, issuer: string = 'SimplifyPDF Admin'): string {
  return authenticator.keyuri(email, issuer, secret);
}

export async function generateQrCodeDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTotpToken(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
                 Math.random().toString(36).substring(2, 6).toUpperCase();
    codes.push(code);
  }
  return codes;
}
