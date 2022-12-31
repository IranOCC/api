export class Subject {
  private appName = process.env.APP_NAME;
  welcomeRegistration(): string {
    return `به ${this.appName} خوش آمدید`;
  }
  emailVerification(): string {
    return `${this.appName} - تایید ایمیل`;
  }
}
