export function validateEmail(emailString = '', errors) {
  // I trust Tyler Mcginnis's interpretation of email validation here:
  // https://tylermcginnis.com/validate-email-address-javascript/

  const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailString);

  if (!test) {
    errors.push('Invalid Email.');
  } else {
    errors = errors.filter( err => err !== 'Invalid Email.')
  }

  return errors;
}

export function validateUsername(usernameString = '', errors) {
  const stringLength = usernameString.length;

  if (stringLength < 8 || stringLength > 16) {
    errors.push('Username must be at least 8 -- but no longer than 16 -- characters long.');
  } else {
    errors = errors.filter( err => err !== 'Username must be at least 8 -- but no longer than 16 -- characters long.' );
  }

  return errors;
}

export function validatePassword(passwordString = '', errors, userNameString = '') {
  const stringLength = passwordString.length;

  if (stringLength < 8 || stringLength > 30) {
    errors.push('Password must be between 8 and 30 characters long.');
  } else {
    errors = errors.filter( err => err !== 'Password must be between 8 and 30 characters long.');
  }

  if (passwordString === userNameString) {
    errors.push('Password and Username MUST be different.');
  } else {
    errors = errors.filter( err => err !== 'Password and Username MUST be different.');
  }

  const numbers = /[0-9]/;

  if (!numbers.test(passwordString)) {
    errors.push('Password must have at least one number in it.');
  } else {
    errors = errors.filter( err => err !== 'Password must have at least one number in it.');
  }

  return errors;
}

export function verifyPassword(passwordString = '', errors, secondPasswordString = '') {
  if (passwordString !== secondPasswordString) {
    errors.push('Your passwords are not the same.');
  } else {
    errors = errors.filter( err => err !== 'Your passwords are not the same.');
  }

  return errors;
}
