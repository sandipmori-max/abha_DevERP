import { useMemo, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { encryptData } from "../../utils/encrypt";
import {
    formatLoginInput,
    generateCaptcha,
    getPayloadForProfile,
    isStrictIndianMobile,
    stepOneValidator,
    stepTwoValidator,
    TERMS_ONE,
    TERMS_TWO,
    TERMS_FOUR,
    TERMS_FIVE,
} from "../../utils/helpers";

import { LOGIN_TYPES, VALIDATION_METHODS } from "../../utils/constants";
import { isValidAadhaar } from "../../utils/aadhaarValidator";

import { showToast } from "../../utils/toast";

import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";

import {
    useRequestOtpMutation,
    getPayload,
} from "../../redux/api/loginApi";

import {
    useEnrollmentRequestOtpMutation,
    getEnrollmentPayload,
} from "../../redux/api/enrollmentApi";

import {
    useEnrolByAadhaarMutation,
    getEnrolByAadhaarPayload,
} from "../../redux/api/enrolByAadhaarApi";

import {
    useAuthByAbdmMutation,
    getAuthByAbdmPayload,
} from "../../redux/api/authByAbdmApi";

import {
    useRequestEmailVerificationLinkMutation,
    getEmailVerificationLinkPayload,
} from "../../redux/api/emailVerificationLinkApi";

import {
    useEnrolSuggestionMutation,
} from "../../redux/api/enrolSuggestionApi";

import {
    useEnrolAbhaAddressMutation,
    getEnrolAbhaAddressPayload,
} from "../../redux/api/enrolAbhaAddressApi";

import {
    useLazyProfileAccountQuery,
} from "../../redux/api/profileAccountApi";

import {
    useDlEnrollmentRequestOtpMutation,
    getDlEnrollmentRequestOtpPayload,
} from "../../redux/api/dlEnrollmentRequestOtpApi";

import {
    useSavePageMutation,
} from "../../redux/api/savePageApi";

import {
    useLazyProfileQrCodeQuery,
} from "../../redux/api/qrCodeApi";

import {
    useLazyProfileAbhaCardQuery,
} from "../../redux/api/abhaCardApi";

interface UseLoginFlowProps {
    loginType: string;
    isFromRegister?: boolean;
    isFromCreate?: boolean;
    isFromMobileRegister?: boolean;
    isFromForgotAbhaNumber?: boolean;
    isFromForgotAbhaNumberWithType?: boolean;
}

export const useLoginFlow = ({
    loginType,
    isFromRegister = false,
    isFromCreate = false,
    isFromMobileRegister = false,
    isFromForgotAbhaNumber = false,
    isFromForgotAbhaNumberWithType = false,
}: UseLoginFlowProps) => {

    const dispatch = useDispatch();

    const publicKey = useSelector(
        (state: any) => state.auth.publicKey
    );

    const {
        activeUser: proReduxData,
        txnId,
    } = useSelector((state: any) => state.abha);

    const stepTwoRef = useRef<any>(null);

    const [requestOtp] =
        useRequestOtpMutation();

    const [enrollmentRequestOtp] =
        useEnrollmentRequestOtpMutation();

    const [enrolByAadhaar] =
        useEnrolByAadhaarMutation();

    const [authByAbdm] =
        useAuthByAbdmMutation();

    const [requestEmailVerificationLink] =
        useRequestEmailVerificationLinkMutation();

    const [enrolSuggestion] =
        useEnrolSuggestionMutation();

    const [enrolAbhaAddress] =
        useEnrolAbhaAddressMutation();

    const [getProfileAccount] =
        useLazyProfileAccountQuery();

    const [dlEnrollmentRequestOtp] =
        useDlEnrollmentRequestOtpMutation();

    const [savePage] =
        useSavePageMutation();

    const [getQrCode] =
        useLazyProfileQrCodeQuery();

    const [getAbhaCard] =
        useLazyProfileAbhaCardQuery();

    const [stepOne, setStepOne] = useState({
        aadhaarNumber: "",
        termsAgree: false,
        authType: "",
        captchaValid: false,
        passedForVarification: false,
        setOneDone: false,
    });

    const [stepTwo, setStepTwo] = useState({
        stepTwoTitle: "",
        stepTwoOTP: "",
        stepTwoMobileNumber: "",
        setTwoDone: false,
    });

    const [stepThree, setStepThree] = useState({
        stepThreeMobile: "",
        stepThreeMobileVerifyed: false,
        stepThreeMobileOTP: "",
        stepThreeMobileAuthDone: false,
        stepThreeEmail: "",
        stepThreeEmailOTP: "",
        stepThreeEmailVarifying: false,
        stepThreeEmailOPTVerify: false,
        stepThreeEmailVarifyDone: false,
    });

    const [stepFour, setStepFour] = useState({
        userName: "",
    });

    const [stepOneDL, setStepOneDL] =
        useState({
            stepOneDLTitle: "",
            stepOneDLOTP: "",
            stepOneDLMobileNumber: "",
            stepOneDLMobileVerifying: false,
            stepOneDLDone: false,
        });

    const [currentStep, setCurrentStep] =
        useState(1);

    const [currentStepDL, setCurrentStepDL] =
        useState(1);

    const [captcha, setCaptcha] =
        useState(generateCaptcha());

    const [captchaValue, setCaptchaValue] =
        useState("");

    const [loginValue, setLoginValue] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [validationMethod, setValidationMethod] =
        useState("");

    const [otpMethod, setOtpMethod] =
        useState("");

    const [isAgreed, setIsAgreed] =
        useState(false);

    const [selectedItem, setSelectedItem] =
        useState<string | null>(null);

    const [abhaSuggestionList, setAbhaSuggestionList] =
        useState<any[]>([]);

    const [abhaResult, setAbhaResult] =
        useState<any>();

    const [showValidationSheet, setShowValidationSheet] =
        useState(false);

    const [validationErrors, setValidationErrors] =
        useState<string[]>([]);

    // ===========================
    // Helpers
    // ===========================

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setCaptchaValue("");
    };

    const validationConfig = useMemo(
        () => ({
            [LOGIN_TYPES.AADHAAR]: [
                VALIDATION_METHODS.AADHAAR_OTP,
                VALIDATION_METHODS.FACE_AUTH,
            ],

            [LOGIN_TYPES.ABHA_NUMBER]: [
                VALIDATION_METHODS.AADHAAR_OTP,
                VALIDATION_METHODS.MOBILE_OTP,
                ...(isFromRegister
                    ? []
                    : [VALIDATION_METHODS.FACE_AUTH]),
            ],

            [LOGIN_TYPES.ABHA_ADDRESS]: [
                VALIDATION_METHODS.PASSWORD,
                VALIDATION_METHODS.OTP,
                VALIDATION_METHODS.FACE_AUTH,
            ],

            [LOGIN_TYPES.FORGOT_ABHA_NUMBER]: [
                VALIDATION_METHODS.AADHAAR,
                VALIDATION_METHODS.MOBILE,
            ],
        }),
        [isFromRegister]
    );

    const shouldShowTerms = useMemo(() => {
        return (
            isFromForgotAbhaNumber ||
            isFromForgotAbhaNumberWithType ||
            loginType === LOGIN_TYPES.AADHAAR ||
            loginType === LOGIN_TYPES.CREATE_ABHA
        );
    }, [
        loginType,
        isFromForgotAbhaNumber,
        isFromForgotAbhaNumberWithType,
    ]);

    const termsText = useMemo(() => {
        if (isFromForgotAbhaNumber) {
            return validationMethod ===
                VALIDATION_METHODS.AADHAAR
                ? TERMS_FOUR
                : TERMS_FIVE;
        }

        switch (loginType) {
            case LOGIN_TYPES.AADHAAR:
                return TERMS_TWO;

            case LOGIN_TYPES.CREATE_ABHA:
                return TERMS_ONE;

            default:
                return "";
        }
    }, [
        loginType,
        validationMethod,
        isFromForgotAbhaNumber,
    ]);

    const handleSelect = (item: string) => {
        setSelectedItem((prev) =>
            prev === item ? null : item
        );

        setStepFour((prev) => ({
            ...prev,
            userName: item,
        }));
    };
    // ===========================
    // OTP Verify (DL Flow)
    // ===========================

    const handleOTPVerify = async () => {
        if (
            stepOneDL.stepOneDLOTP === "" ||
            stepOneDL.stepOneDLOTP.length < 6
        ) {
            showToast("error", "Please enter OTP.");
            return;
        }

        const encryptedOtp = encryptData(
            stepOneDL.stepOneDLOTP,
            publicKey
        );

        const payload = getAuthByAbdmPayload(
            txnId,
            encryptedOtp
        );

        const result = await authByAbdm(payload).unwrap();

        if (result?.authResult === "success") {
            setStepOneDL((prev) => ({
                ...prev,
                stepOneDLMobileVerifying: false,
            }));

            setCurrentStepDL(2);
        }
    };

    // ===========================
    // Save Profile
    // ===========================

    const handleProfile = async (
        responseProfile: any
    ) => {
        const payloadRow = getPayloadForProfile(
            stepOne,
            stepTwo,
            stepThree,
            stepFour,
            responseProfile,
            abhaResult,
            txnId
        );

        const payloadData = {
            token: proReduxData?.token,
            page: "PatientABHAProfile",
            data: JSON.stringify(payloadRow),
        };

        await savePage(payloadData).unwrap();

        await getQrCode();

        await getAbhaCard();

        showToast(
            "success",
            "Record inserted successfully..."
        );
    };
    // ===========================
    // Step 1
    // ===========================

    const handleStepOne = async () => {
        const validate = stepOneValidator(
            stepOne,
            captchaValue,
            captcha
        );

        if (!validate) {
            showToast(
                "error",
                "Please fill in all required fields correctly."
            );
            return;
        }

        if (!isValidAadhaar(stepOne.aadhaarNumber)) {
            showToast(
                "error",
                "Please enter a valid Aadhaar number."
            );
            return;
        }

        setStepOne((prev) => ({
            ...prev,
            passedForVarification: true,
        }));

        if (!publicKey) {
            showToast(
                "error",
                "Public key not found. Please try again later."
            );
            return;
        }

        const encryptedValue = encryptData(
            loginValue,
            publicKey
        );

        const payload = getEnrollmentPayload(
            loginType,
            encryptedValue,
            ""
        );

        const result =
            await enrollmentRequestOtp(payload).unwrap();

        setStepTwo((prev) => ({
            ...prev,
            stepTwoTitle: result?.message,
        }));

        setCurrentStep(2);
    };

    // ===========================
    // Step 2
    // ===========================

    const handleStepTwo = async () => {
        dispatch(showLoader());

        try {
            const validate = stepTwoValidator(stepTwo);

            if (!validate) {
                showToast(
                    "error",
                    "Please fill in all required fields correctly."
                );
                return;
            }

            if (
                !isStrictIndianMobile(
                    `+91${stepTwo.stepTwoMobileNumber}`
                )
            ) {
                showToast(
                    "error",
                    "Please enter a valid mobile number."
                );
                return;
            }

            const encryptedOtp = encryptData(
                stepTwo.stepTwoOTP,
                publicKey
            );

            const payload = getEnrolByAadhaarPayload(
                txnId,
                encryptedOtp,
                stepTwo.stepTwoMobileNumber
            );

            const result =
                await enrolByAadhaar(payload).unwrap();

            setAbhaResult(result);

            if (
                result?.isNew &&
                result?.ABHAProfile?.mobile ===
                stepTwo.stepTwoMobileNumber
            ) {
                const responseProfile =
                    await getProfileAccount();

                await handleProfile(responseProfile);
                return;
            }

            setCurrentStep(3);
        } finally {
            dispatch(hideLoader());
        }
    };
    // ===========================
    // Step 3
    // ===========================

    const handleStepThree = async () => {
        if (
            !stepThree.stepThreeMobileAuthDone &&
            stepThree.stepThreeMobileVerifyed
        ) {
            if (
                !stepThree.stepThreeMobileOTP ||
                stepThree.stepThreeMobileOTP.length < 6
            ) {
                showToast(
                    "error",
                    "Please enter a valid OTP."
                );
                return;
            }

            const encryptedOtp = encryptData(
                stepThree.stepThreeMobileOTP,
                publicKey
            );

            const payload = getAuthByAbdmPayload(
                txnId,
                encryptedOtp
            );

            const result = await authByAbdm(payload).unwrap();

            if (result?.authResult === "success") {
                setStepThree((prev) => ({
                    ...prev,
                    stepThreeMobileAuthDone: true,
                }));
            }

            return;
        }

        if (
            stepThree.stepThreeMobileAuthDone &&
            !stepThree.stepThreeEmailVarifying
        ) {
            setStepThree((prev) => ({
                ...prev,
                stepThreeEmailVarifying: true,
            }));

            return;
        }

        if (
            stepThree.stepThreeMobileAuthDone &&
            stepThree.stepThreeEmailVarifying &&
            !stepThree.stepThreeEmailVarifyDone
        ) {
            const response = await enrolSuggestion({
                txnId,
            }).unwrap();

            setAbhaSuggestionList(
                response.abhaAddressList
            );

            setCurrentStep(4);

            return;
        }

        showToast(
            "error",
            "Please verify your mobile number."
        );
    };

    // ===========================
    // Step 4
    // ===========================

    const handleStepFour = async () => {
        if (!stepFour.userName) {
            showToast(
                "error",
                "Please enter your ABHA address."
            );
            return;
        }

        await enrolAbhaAddress(
            getEnrolAbhaAddressPayload(
                txnId,
                stepFour.userName,
                1
            )
        ).unwrap();

        const responseProfile =
            await getProfileAccount();

        await handleProfile(responseProfile);
    };

    // ===========================
    // Step Handlers
    // ===========================

    const STEP_HANDLERS: Record<number, () => Promise<void>> = {
        1: handleStepOne,
        2: handleStepTwo,
        3: handleStepThree,
        4: handleStepFour,
    };

    const handleSteps = async () => {
        dispatch(showLoader());

        try {
            await STEP_HANDLERS[currentStep]?.();
        } catch (error) {
            console.log("Login Flow Error:", error);
        } finally {
            dispatch(hideLoader());
        }
    };

    return {
        // Step 1
        stepOne,
        setStepOne,

        // Step 2
        stepTwo,
        setStepTwo,

        // Step 3
        stepThree,
        setStepThree,

        // Step 4
        stepFour,
        setStepFour,

        // DL Flow
        stepOneDL,
        setStepOneDL,

        // Current Steps
        currentStep,
        setCurrentStep,

        currentStepDL,
        setCurrentStepDL,

        // Login
        loginValue,
        setLoginValue,

        password,
        setPassword,

        showPassword,
        setShowPassword,

        // Validation
        validationMethod,
        setValidationMethod,

        otpMethod,
        setOtpMethod,

        validationConfig,

        // Terms
        isAgreed,
        setIsAgreed,

        shouldShowTerms,
        termsText,

        // Captcha
        captcha,
        captchaValue,
        setCaptchaValue,
        refreshCaptcha,

        // ABHA
        abhaSuggestionList,
        setAbhaSuggestionList,

        abhaResult,
        setAbhaResult,

        selectedItem,
        setSelectedItem,

        // Bottom Sheet
        showValidationSheet,
        setShowValidationSheet,

        validationErrors,
        setValidationErrors,

        // Ref
        stepTwoRef,

        // APIs (if UI still needs them)
        requestOtp,
        enrollmentRequestOtp,
        enrolByAadhaar,
        authByAbdm,
        requestEmailVerificationLink,
        enrolSuggestion,
        enrolAbhaAddress,
        getProfileAccount,
        dlEnrollmentRequestOtp,
        savePage,
        getQrCode,
        getAbhaCard,

        // Helpers
        handleSelect,
        handleOTPVerify,

        // Step Handlers
        handleStepOne,
        handleStepTwo,
        handleStepThree,
        handleStepFour,
        handleSteps,

        // Redux values
        publicKey,
        txnId,
        proReduxData,

        // Utils
        dispatch,
        Keyboard,
        formatLoginInput,
        getPayload,
        getEnrollmentPayload,
        getEnrolByAadhaarPayload,
        getAuthByAbdmPayload,
        getEmailVerificationLinkPayload,
        getEnrolAbhaAddressPayload,
        getDlEnrollmentRequestOtpPayload,
    };

};