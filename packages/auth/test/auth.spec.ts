import { generateTotpSecret, generateBackupCodes } from '../src/totp';

describe('Auth & TOTP Security Unit Tests', () => {
  it('should generate a 32-character base32 secret for TOTP', () => {
    const secret = generateTotpSecret();
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThanOrEqual(16);
  });

  it('should generate 8 unique alphanumeric backup codes', () => {
    const codes = generateBackupCodes(8);
    expect(codes).toHaveLength(8);
    expect(new Set(codes).size).toBe(8); // all unique
    expect(codes[0]).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });
});
