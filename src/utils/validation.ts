// ================================
// Company Code Validation
// ================================

export const validateCompanyCode = (value = "") => {
  const companyCode = value.trim().toUpperCase();

  if (!companyCode) {
    return "Company code is required.";
  }

  if (companyCode.length < 3) {
    return "Company code must contain at least 3 characters.";
  }

  if (companyCode.length > 15) {
    return "Company code cannot exceed 15 characters.";
  }

  const regex = /^[A-Z0-9_-]+$/;

  if (!regex.test(companyCode)) {
    return "Only letters, numbers, _ and - are allowed.";
  }

  return "";
};

// ================================
// Username Validation
// ================================

export const validateUsername = (value = "") => {
  const username = value.trim();

  if (!username) {
    return "Username is required.";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (username.length > 50) {
    return "Username cannot exceed 50 characters.";
  }

  // const regex = /^[a-zA-Z0-9._@-]+$/;

  // if (!regex.test(username)) {
  //   return "Invalid username.";
  // }

  return "";
};

// ================================
// Password Validation
// ================================

export const validatePassword = (value = "") => {
  if (!value) {
    return "Password is required.";
  }

  // if (value.length < 8) {
  //   return "Password must be at least 8 characters.";
  // }

  // if (value.length > 32) {
  //   return "Password cannot exceed 32 characters.";
  // }

  // if (!/[A-Z]/.test(value)) {
  //   return "Include at least one uppercase letter.";
  // }

  // if (!/[a-z]/.test(value)) {
  //   return "Include at least one lowercase letter.";
  // }

  // if (!/[0-9]/.test(value)) {
  //   return "Include at least one number.";
  // }

  // if (!/[!@#$%^&*()_\-+=.?]/.test(value)) {
  //   return "Include at least one special character.";
  // }

  return "";
};

// ================================
// Email Validation
// ================================

export const validateEmail = (email = "") => {
  const value = email.trim();

  if (!value) {
    return "Email is required.";
  }

  const regex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!regex.test(value)) {
    return "Invalid email address.";
  }

  return "";
};

// ================================
// Mobile Validation
// ================================

export const validateMobile = (mobile = "") => {
  const value = mobile.trim();

  if (!value) {
    return "Mobile number is required.";
  }

  if (!/^[6-9]\d{9}$/.test(value)) {
    return "Invalid mobile number.";
  }

  return "";
};

// ================================
// Required Field
// ================================

export const validateRequired = (
  value = "",
  field = "Field"
) => {
  if (!value.trim()) {
    return `${field} is required.`;
  }

  return "";
};

// ================================
// Min Length
// ================================

export const validateMinLength = (
  value = "",
  length = 1
) => {
  if (value.length < length) {
    return `Minimum ${length} characters required.`;
  }

  return "";
};

// ================================
// Max Length
// ================================

export const validateMaxLength = (
  value = "",
  length = 50
) => {
  if (value.length > length) {
    return `Maximum ${length} characters allowed.`;
  }

  return "";
};

// ================================
// Numeric Validation
// ================================

export const validateNumber = (value = "") => {
  if (!/^[0-9]+$/.test(value)) {
    return "Only numbers are allowed.";
  }

  return "";
};

// ================================
// Alpha Validation
// ================================

export const validateAlphabet = (value = "") => {
  if (!/^[A-Za-z ]+$/.test(value)) {
    return "Only alphabets are allowed.";
  }

  return "";
};

// ================================
// Alpha Numeric Validation
// ================================

export const validateAlphaNumeric = (
  value = ""
) => {
  if (!/^[A-Za-z0-9]+$/.test(value)) {
    return "Only letters and numbers are allowed.";
  }

  return "";
};