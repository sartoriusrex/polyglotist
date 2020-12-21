export function validateEmail(
  emailString = '',
  errors: {
    emailError: string[];
    usernameError: string[];
    passwordError: string[];
  }
) {
  // I trust Tyler Mcginnis's interpretation of email validation here:
  // https://tylermcginnis.com/validate-email-address-javascript/
  const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailString);
  const emailErrors = errors.emailError;

  if (!test) {
    emailErrors.push('Invalid Email.');
    errors.emailError = Array.from(new Set(emailErrors));
  } else {
    errors.emailError = [];
  }

  return errors;
}

export function validateUsername(
  usernameString = '',
  errors: {
    emailError: string[];
    usernameError: string[];
    passwordError: string[];
  }
) {
  const stringLength = usernameString.length;
  const test = /^[a-z0-9]+$/i.test(usernameString);
  let usernameErrors = errors.usernameError;

  if (stringLength < 8 || stringLength > 16) {
    usernameErrors.push(
      'Username must be at least 8 -- but no longer than 16 -- characters long.'
    );
  } else {
    usernameErrors = usernameErrors.filter(
      (err: string) =>
        err !==
        'Username must be at least 8 -- but no longer than 16 -- characters long.'
    );
  }

  if (!test) {
    usernameErrors.push('Username must contain only letters or numbers.');
  } else {
    usernameErrors = usernameErrors.filter(
      (err: string) => err !== 'Username must contain only letters or numbers.'
    );
  }

  errors.usernameError = Array.from(new Set(usernameErrors));

  return errors;
}

export function validatePassword(
  passwordString = '',
  errors: {
    emailError: string[];
    usernameError: string[];
    passwordError: string[];
  },
  userNameString = ''
) {
  const stringLength = passwordString.length;
  let passwordErrors = errors.passwordError;

  if (stringLength < 8 || stringLength > 30) {
    passwordErrors.push('Password must be between 8 and 30 characters long.');
  } else {
    passwordErrors = passwordErrors.filter(
      (err: string) =>
        err !== 'Password must be between 8 and 30 characters long.'
    );
  }

  if (passwordString === userNameString) {
    passwordErrors.push('Password and Username MUST be different.');
  } else {
    passwordErrors = passwordErrors.filter(
      (err: string) => err !== 'Password and Username MUST be different.'
    );
  }

  const numbers = /[0-9]/;

  if (!numbers.test(passwordString)) {
    passwordErrors.push('Password must have at least one number in it.');
  } else {
    passwordErrors = passwordErrors.filter(
      (err: string) => err !== 'Password must have at least one number in it.'
    );
  }

  errors.passwordError = Array.from(new Set(passwordErrors));

  return errors;
}

export function verifyPassword(
  passwordString = '',
  errors: {
    emailError: string[];
    usernameError: string[];
    passwordError: string[];
    verifyPassword: string[];
  },
  secondPasswordString = ''
) {
  const verifyPasswordErrors = errors.verifyPassword;

  if (passwordString !== secondPasswordString) {
    verifyPasswordErrors.push('Your passwords are not the same.');
    errors.verifyPassword = Array.from(new Set(verifyPasswordErrors));
  } else {
    errors.verifyPassword = [];
  }

  return errors;
}
