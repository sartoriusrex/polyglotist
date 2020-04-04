export function validateEmail(emailString) {
  // I trust Tyler Mcginnis's interpretation of email validation here:
  // https://tylermcginnis.com/validate-email-address-javascript/

  const error = [];
  const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailString);

  if (!test) {
    error.push('Invalid Email.');
  }

  return error;
}

export function validateUsername(usernameString) {
  const errors = [];
  const stringLength = usernameString.length;

  if (stringLength < 8 || stringLength > 16) {
    errors.push('Username must be at least 8 -- but no longer than 16 -- characters long.');
  }

  return errors;
}

export function validatePassword(passwordString, passwordStringSecond, userNameString) {
  const errors = [];
  const stringLength = passwordString.length;

  if (stringLength < 8 || stringLength > 30) {
    errors.push('Password must be between 8 and 30 characters long.');
  }
  if (passwordString === userNameString) {
    errors.push('Password and Username MUST be different.');
  }
  if (passwordString !== passwordStringSecond) {
    errors.push('Your passwords are not the same');
  }

  const numbers = /[0-9]/;
  if (!numbers.test(passwordString)) {
    errors.push('Password must have at least one number in it.');
  }

  return errors;
}
