import { KeyboardTypeOptions } from "react-native";
import { LOGIN_TYPES } from "./constants";


export const generateGUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateCaptcha = () => {
  let num1 = Math.floor(Math.random() * 9) + 1;
  let num2 = Math.floor(Math.random() * 9) + 1;

  const operators = ['+', '-', '×'];
  const operator =
    operators[Math.floor(Math.random() * operators.length)];

  let answer = 0;

  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;

    case '-':
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      answer = num1 - num2;
      break;

    case '×':
      answer = num1 * num2;
      break;
  }

  return {
    question: `${num1}${operator}${num2}=?`,
    answer,
  };
};

export const validateForm = (loginType, loginValue, captchaValue, captcha) => {
  if (!loginValue) {
    return 'Please enter your mobile number.';
  }

  if (loginType === 'Mobile Number' && !/^[6-9]\d{9}$/.test(loginValue)) {
    return 'Enter valid mobile number';
  }

  if (!captchaValue) {
    return 'Please enter the CAPTCHA.';
  }

  if (Number(captchaValue) !== Number(captcha.answer)) {
    return 'Invalid captcha';
  }

  return '';
};

export const formatAadhaar = (value: string) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 12);

  return cleaned
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d{4})(\d)/, '$1-$2-$3');
};

export const steps = [
  "Consent Collection",
  "Aadhaar Authentication",
  "Communication Details",
  "ABHA Address Creation"
]

export const stepsDL = [
  "Mobile Authentication",
  "Profile & Consent Collection",
  "Process Completion"
]

export const stepOneValidator = (stepOne, captchaValue, captcha) => {
  if (
    stepOne.aadhaarNumber.replace(/-/g, '').length !== 12
  ) {
    return false;
  }
  const termsRequired = true;
  if (termsRequired && !stepOne.termsAgree) {
    return false;
  }
  if (!captchaValue) {
    return false;
  }
  if (Number(captchaValue) !== captcha.answer) {
    return false;
  }
  return true;
};

export const formatAbhaNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 14);

  if (cleaned.length <= 2) return cleaned;

  if (cleaned.length <= 6)
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;

  if (cleaned.length <= 10)
    return `${cleaned.slice(0, 2)}-${cleaned.slice(
      2,
      6,
    )}-${cleaned.slice(6)}`;

  return `${cleaned.slice(0, 2)}-${cleaned.slice(
    2,
    6,
  )}-${cleaned.slice(6, 10)}-${cleaned.slice(10)}`;
};

export const stepTwoValidator = (stepTwo) => {
  if (
    stepTwo.stepTwoOTP === ''
  ) {
    return false;
  }
  if (
    stepTwo.stepTwoMobileNumber.replace(/-/g, '').length !== 10
  ) {
    return false;
  }
  return true;
};

export const getIsFormValid = (loginType, loginValue, isFromForgotAbhaNumber, isAgreed, captchaValue, captcha) => {

  if (!loginValue) {
    return false;
  }

  if (loginType === 'Mobile Number' && loginValue.length !== 10) {
    return false;
  }

  if (
    loginType === 'Aadhaar Number' &&
    loginValue.replace(/-/g, '').length !== 12
  ) {
    return false;
  }

  if (
    loginType === 'ABHA Number' ||
    loginType === 'Create ABHA Number'
  ) {
    const abhaLength = loginValue.replace(/-/g, '').length;

    if (abhaLength !== 14) {
      return false;
    }
  }

  if (loginType === 'ABHA Address') {
    if (!loginValue.includes('@')) {
      return false;
    }
  }

  const termsRequired =
    loginType === 'Aadhaar Number' ||
    loginType === 'Create ABHA Number' ||
    isFromForgotAbhaNumber;
  if (termsRequired && !isAgreed) {
    return false;
  }

  if (!captchaValue) {
    return false;
  }

  if (Number(captchaValue) !== captcha.answer) {
    return false;
  }

  return true;
};

export const getErrorMessage = (error: any) => {
  return (
    error?.error?.data[0]?.message ||
    error?.error?.authMethods ||
    error?.error?.mobile ||

    error?.error?.txnId ||
    error?.error?.description ||
    error?.error?.scope ||
    error?.error?.loginHint ||
    error?.error?.otpSystem ||
    error?.error?.loginId ||
    error?.error?.message ||

    error?.error?.data?.error?.authMethods ||
    error?.error?.data?.error?.mobile ||

    error?.error?.data?.error?.txnId ||
    error?.error?.data?.error?.description ||
    error?.error?.data?.error?.scope ||
    error?.error?.data?.error?.loginHint ||
    error?.error?.data?.error?.otpSystem ||
    error?.error?.data?.error?.loginId ||
    error?.error?.data?.error?.message ||

    error?.error?.data?.authMethods ||
    error?.error?.data?.mobile ||

    error?.error?.data?.txnId ||
    error?.error?.data?.description ||
    error?.error?.data?.scope ||
    error?.error?.data?.loginHint ||
    error?.error?.data?.otpSystem ||
    error?.error?.data?.loginId ||
    error?.error?.data?.message ||


    error?.error?.authMethods ||
    error?.error?.mobile ||

    error?.error?.txnId ||
    error?.error?.description ||
    error?.error?.scope ||
    error?.error?.loginHint ||
    error?.error?.otpSystem ||
    error?.error?.loginId ||
    error?.error?.message ||

    error?.authMethods ||
    error?.mobile ||

    error?.txnId ||
    error?.description ||
    error?.scope ||
    error?.loginHint ||
    error?.otpSystem ||
    error?.loginId ||
    error?.message ||
    'Something went wrong'
  );
};


//X-CM-ID
export const CLIENT_ID = 'SBXID_042942'
export const X_CM_ID = 'sbx'

export const GRANT_TYPE = 'client_credentials'
export const CLIENT_SECERET = '83784be3-e94e-4d03-b0c1-d63cf46a76f4'
export const BASE_URL_API = 'https://abhasbx.abdm.gov.in/abha/api/v3/'
export const BASE_URL_PUBLIC_API = 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/'

export const TERMS_ONE = `I hereby declare that I am voluntarily sharing my
                    Aadhaar Number and demographic information issued
                    by UIDAI with National Health Authority (NHA) for
                    the sole purpose of authentication and healthcare
                    services under ABDM.`

export const TERMS_TWO = `I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.
`

export const TERMS_FOUR = `I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.                    
`

export const TERMS_FIVE = `I, hereby declare that I am voluntarily sharing my identity information with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM (Ayushman Bharat Digital Mission) from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under.
                            I am aware that my personal identifiable information can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time.                  
                            `

export const TERMS_SIX = `I hereby declare that I am voluntarily sharing my
                    Aadhaar Number and demographic information issued
                    by UIDAI with National Health Authority (NHA) for
                    the sole purpose of authentication and healthcare
                    services under ABDM.`

export function isStrictIndianMobile(input: string): boolean {
  if (typeof input !== "string") return false;

  // 1. Basic cleanup (only outer spaces)
  const value = input.trim();

  // 2. Must match EXACT +91 format only
  const match = value.match(/^\+91(\d{10})$/);

  if (!match) return false;

  const number = match[1];

  // 3. Must be numeric (extra safety)
  if (!/^\d{10}$/.test(number)) return false;

  // 4. Must start with 6-9
  if (!/^[6-9]/.test(number)) return false;

  // 5. Reject obvious invalid patterns (all same digits)
  if (/^(\d)\1{9}$/.test(number)) return false;

  // 6. Reject sequential patterns (1234567890, 9876543210)
  const sequences = [
    "0123456789",
    "1234567890",
    "0987654321",
    "9876543210",
  ];
  if (sequences.includes(number)) return false;

  return true;
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;

  const value = email.trim().toLowerCase();

  // 1. Basic length check
  if (value.length < 5 || value.length > 254) return false;

  // 2. Must contain single @
  const atCount = (value.match(/@/g) || []).length;
  if (atCount !== 1) return false;

  const [local, domain] = value.split("@");

  if (!local || !domain) return false;

  // 3. Local part rules
  if (local.length > 64) return false;
  if (/^\./.test(local) || /\.$/.test(local)) return false;
  if (/\.\./.test(local)) return false;

  // Allowed characters check (strict but practical)
  if (!/^[a-z0-9._%+-]+$/.test(local)) return false;

  // 4. Domain rules
  if (domain.length > 253) return false;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) return false;

  if (domain.startsWith("-") || domain.endsWith("-")) return false;
  if (domain.includes("..")) return false;

  // 5. Reject IP-style domain (optional strict govt rule)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) return false;

  return true;
}

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: "Please fill in all required fields correctly.",

  OTP_REQUIRED: "Please enter OTP.",
  OTP_INVALID: "Please enter a valid OTP.",

  MOBILE_REQUIRED: "Please enter your mobile number.",
  MOBILE_INVALID: "Please enter a valid mobile number.",
  MOBILE_VERIFY: "Please verify your mobile number.",

  AADHAAR_REQUIRED: "Please enter your Aadhaar number.",
  AADHAAR_INVALID: "Please enter a valid Aadhaar number.",

  EMAIL_REQUIRED: "Please enter your email address.",
  EMAIL_INVALID: "Please enter a valid email address.",

  ABHA_ADDRESS_REQUIRED: "Please enter your ABHA address.",

  CAPTCHA_REQUIRED: "Please enter the CAPTCHA.",
  CAPTCHA_INVALID: "Please enter a valid CAPTCHA.",
} as const;

export const getLoginPlaceholder = (
  loginType: string
): string => {
  switch (loginType) {
    case "Mobile Number":
    case "Register with Mobile Number":
      return "Enter mobile number";

    case "Aadhaar Number":
      return "Enter aadhaar number";

    case "ABHA Address":
      return "Enter ABHA address";

    case "ABHA Number":
    case "Create ABHA Number":
      return "Enter ABHA number";

    default:
      return "Enter value";
  }
};

export const formatLoginInput = (
  loginType: string,
  text: string
) => {
  switch (loginType) {
    case "Mobile Number":
    case "Register with Mobile Number":
      return text.replace(/\D/g, "").slice(0, 10);

    case "Aadhaar Number":
      return formatAadhaar(text);

    case "ABHA Number":
    case "Create ABHA Number":
      return formatAbhaNumber(text);

    default:
      return text;
  }
};

export const getLoginKeyboardType = (
  loginType: string
): KeyboardTypeOptions => {
  const numberPadTypes = [
    "Mobile Number",
    "Register with Mobile Number",
    "Aadhaar Number",
    "ABHA Number",
    "Create ABHA Number",
  ];

  return numberPadTypes.includes(loginType)
    ? "number-pad"
    : "default";
};

export const getPayloadForProfile = (stepOne, stepTwo, stepThree, stepFour, responseProfile, abhaResult, txnId) => {
  const { status, ...restData } = responseProfile?.data || {};
  const { name, ...restNameData } = responseProfile?.data || {};
  const payload = {
    aadharNumber: stepOne?.aadhaarNumber,
    communicationMobile: stepTwo?.stepTwoMobileNumber,
    communicationEmail: stepThree?.stepThreeEmail,
    userName: stepFour?.userName,
    ...responseProfile,
    data: {
      ...restData,
      ...restNameData,
      abhaName: name,
      profileStatus: status,
    },
    isNew: abhaResult?.isNew,
    expiresIn: abhaResult?.tokens?.expiresIn,
    refreshExpiresIn: abhaResult?.tokens?.refreshExpiresIn,
    refreshToken: abhaResult?.tokens?.refreshToken,
    tokens: abhaResult?.tokens?.token,
    txnId: txnId
  };

  console.log("payload.data.authMethods.join------------------------------------------------", payload.data.authMethods.join(","))
 
   const payloadRow = {
        "patientabhaid": "",
        "abhanumber": payload.data.ABHANumber,
        "abhaname": payload.data.abhaName,
        "aadharnumber": payload.aadharNumber,
        "firstname": payload.data.firstName,
        "middlename": payload.data.middleName,
        "lastname": payload.data.lastName,
        "fullname": payload.data.name,
        "dob": `${payload.data.yearOfBirth}-${payload.data.monthOfBirth}-${payload.data.dayOfBirth}`,
        "yearofbirth": payload.data.yearOfBirth,
        "monthofbirth": payload.data.monthOfBirth,
        "dayofbirth": payload.data.dayOfBirth,
        "gender": payload.data.gender,
        "mobileno": payload.data.mobile,
        "communicationmobile": payload.communicationMobile,
        "communicationemail": payload.communicationEmail,

        "address": payload.data.address,
        "statename": payload.data.stateName,
        "statecode": payload.data.stateCode,
        "districtname": payload.data.districtName,
        "districtcode": payload.data.districtCode,

        "subdistrictname": payload.data.subdistrictName,
        "pincode": payload.data.pincode,
        
        "message": "",
        "txnid": payload.txnId,
        
        "token": payload.tokens,
        "tokenexpiresin": payload.expiresIn,
        "refreshtoken": payload.refreshToken,
        "refreshexpiresin": payload.refreshExpiresIn,
        
        "preferredabhaaddress": payload.data.preferredAbhaAddress,
      
        "photo": payload.data.photo,
        "profilephoto": `profilephoto.jpeg;data:image/jpeg;base64,${payload.data.profilePhoto}`,
        "kycphoto": `kycphoto.jpeg;data:image/jpeg;base64,${payload.data.kycphoto}`,

        "localizedname": payload.data.localizedDetails.name,
        "localizedgender": payload.data.localizedDetails.gender,
        "localizedtownname": payload.data.localizedDetails.townName,
        "localizeddistrictname": payload.data.localizedDetails.districtName,
        "localizedvillagename": payload.data.localizedDetails.villageName,
        "localizedstatename": payload.data.localizedDetails.stateName,
        "phraddress": payload.data.phraddress,
        "authmethods": payload.data.authMethods.join(","),
        "tags": payload.data.tags,
        "rawresponse":"",
        "localizedlabels": payload.data.localizedDetails.localizedLabels,
        "registrationsource": "",
        "profilestatus": payload.data.profileStatus,
        "abhatype": payload.data.abhatype,
        "abhastatus": payload.data.status,
        "verificationtype": payload.data.verificationType,
        "verificationstatus": payload.data.verificationStatus,
        "iskycverified": payload.data.kycVerified,
        "isnew": payload.isNew,
        "date": payload?.data?.createdDate,
        "cdt": new Date()
      }
  return payloadRow
}

export const getLoginMaxLength = (loginType: string) => {
  switch (loginType) {
    case LOGIN_TYPES.AADHAAR:
      return 14;

    case LOGIN_TYPES.ABHA_NUMBER:
    case LOGIN_TYPES.CREATE_ABHA:
      return 17;

    case LOGIN_TYPES.MOBILE:
      return 10;

    default:
      return 100;
  }
}