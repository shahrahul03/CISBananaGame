export const validateLoginForm = (email, password) => {
  const errors = {};
  if (!email) {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  return errors;
};

export const validateRegistrationForm = (
  email,
  password,
  name,
  address,
  contactNumber
) => {
  const errors = {};
  if (!name) {
    errors.registerName = "Name is required";
  }
  if (!email) {
    errors.registerEmail = "Email is required";
  }
  if (!password) {
    errors.registerPassword = "Password is required";
  }
  if (!address) {
    errors.registerAddress = "Address is required";
  }
  if (!contactNumber) {
    errors.registerContactNumber = "Contact number is required";
  }
  return errors;
};

export const validateForgotPasswordForm = (email) => {
  const errors = {};
  if (!email) {
    errors.forgotPasswordEmail = "Email is required";
  }
  return errors;
};
