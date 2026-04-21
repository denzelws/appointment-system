export class AuthRules {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  static isTokenExpired(expiresAt: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return expiresAt < now;
  }
}
