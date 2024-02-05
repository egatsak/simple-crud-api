class FieldValidator {
  errors: string[] = [];

  constructor() {
    this.errors = [];
  }

  validateUsername(username: unknown) {
    if (typeof username !== 'string' || username.length === 0) {
      this.errors.push('Invalid username');
    }
  }

  validateAge(age: unknown) {
    if (typeof age !== 'number' || age < 0) {
      this.errors.push('Invalid age value');
    }
  }

  validateHobbies(hobbies: unknown) {
    if (
      !Array.isArray(hobbies) ||
      hobbies.some((item) => typeof item !== 'string')
    ) {
      this.errors.push('Invalid hobbies');
    }
  }

  validate(username: unknown, age: unknown, hobbies: unknown) {
    this.errors.length = 0;
    this.validateUsername(username);
    this.validateAge(age);
    this.validateHobbies(hobbies);
    return this.errors;
  }
}

export default new FieldValidator();
