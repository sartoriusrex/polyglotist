export function validateEmail(emailString = '') {
  // I trust Tyler Mcginnis's interpretation of email validation here:
  // https://tylermcginnis.com/validate-email-address-javascript/

  let error = '';
  const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailString);

  if (!test) {
    error = 'Invalid Email.';
  }

  return error;
}

export function validateUsername(usernameString = '') {
  let error = '';
  const stringLength = usernameString.length;

  if (stringLength < 8 || stringLength > 16) {
    error = 'Username must be at least 8 -- but no longer than 16 -- characters long.';
  }

  return error;
}

export function validatePassword(passwordString = '', passwordStringSecond = '', userNameString = '') {
  let error = '';
  const stringLength = passwordString.length;

  if (stringLength < 8 || stringLength > 30) {
    error = error.concat('Password must be between 8 and 30 characters long.\n');
  }
  if (passwordString === userNameString) {
    error = error.concat('Password and Username MUST be different.\n');
  }
  if (passwordString !== passwordStringSecond) {
    error = error.concat('Your passwords are not the same.\n');
  }

  const numbers = /[0-9]/;

  if (!numbers.test(passwordString)) {
    error = error.concat('Password must have at least one number in it.\n');
  }

  return error;
}

export function validateForm(email, username, password, passwordVerified) {
  const errorsObject = {};

  const usernameErrors = validateUsername(username);
  const emailError = validateEmail(email);
  const passwordErrors = validatePassword(password, passwordVerified, username);

  if (usernameErrors.length > 0) {
    errorsObject.usernameErrors = usernameErrors;
  }
  if (emailError.length > 0) {
    errorsObject.emailError = emailError;
  }
  if (passwordErrors.length > 0) {
    errorsObject.passwordErrors = passwordErrors;
  }

  return errorsObject;
}
