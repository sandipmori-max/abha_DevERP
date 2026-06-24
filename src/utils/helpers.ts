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
    return 'Please enter mobile number';
  }

  if (loginType === 'Mobile Number' && !/^[6-9]\d{9}$/.test(loginValue)) {
    return 'Enter valid mobile number';
  }

  if (!captchaValue) {
    return 'Please enter captcha';
  }

  if (Number(captchaValue) !== Number(captcha.answer)) {
    return 'Invalid captcha';
  }

  return '';
};

export  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);

    return cleaned
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d{4})(\d)/, '$1-$2-$3');
  };

 export   const steps = [
     "Consent Collection",
     "Aadhaar Authentication",
     "Communication Details",
     "ABHA Address Creation"
   ]
 
 export  const stepsDL = [
     "Mobile Authentication",
     "Profile & Consent Collection",
     "Process Completion"
   ] 

export   const stepOneValidator = (stepOne, captchaValue, captcha) => {
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

  export   const formatAbhaNumber = (value: string) => {
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

export  const stepTwoValidator = (stepTwo) => {
    if (
      stepTwo.stepTwoOTP !== ''
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

export const getIsFormValid = (loginType , loginValue ,isFromForgotAbhaNumber, isAgreed , captchaValue, captcha) => {

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