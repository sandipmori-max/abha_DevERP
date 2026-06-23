export const generateGUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getErrorMessage = (error: any) => {
  return (
    error?.error?.description ||
    error?.error?.scope ||
    error?.error?.loginHint ||
    error?.error?.otpSystem ||
    error?.error?.loginId ||
    error?.error?.message ||

    error?.error?.data?.error?.description ||
    error?.error?.data?.error?.scope ||
    error?.error?.data?.error?.loginHint ||
    error?.error?.data?.error?.otpSystem ||
    error?.error?.data?.error?.loginId ||

    error?.error?.data?.error?.message ||

    error?.error?.data?.description ||
    error?.error?.data?.scope ||
    error?.error?.data?.loginHint ||
    error?.error?.data?.otpSystem ||
    error?.error?.data?.loginId ||

    error?.error?.data?.message ||


    error?.error?.description ||
    error?.error?.scope ||
    error?.error?.loginHint ||
    error?.error?.otpSystem ||
    error?.error?.loginId ||


    error?.error?.message ||
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