class FieldValidator {
  errors: string[] = [];

  constructor() {
    this.errors = [];
  }

  validateUsername(username: any) {
    if (typeof username !== 'string' || username.length === 0) {
      this.errors.push('Invalid username');
    }
  }

  validateAge(age: any) {
    if (typeof age !== 'number' || age < 0) {
      this.errors.push('Invalid age value');
    }
  }

  validateHobbies(hobbies: any) {
    if (
      !Array.isArray(hobbies) ||
      hobbies.some((item) => typeof item !== 'string')
    ) {
      this.errors.push('Invalid hobbies');
    }
  }

  validate(username: any, age: any, hobbies: any) {
    this.errors.length = 0;
    this.validateUsername(username);
    this.validateAge(age);
    this.validateHobbies(hobbies);
    return this.errors;
  }
}

export default new FieldValidator();
