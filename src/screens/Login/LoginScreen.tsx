import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { encryptData } from '../../utils/encrypt';
import { useDispatch, useSelector } from 'react-redux';
import { getPayload, useRequestOtpMutation } from '../../redux/api/loginApi';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import { showToast } from '../../utils/toast';
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { getEnrollmentPayload, useEnrollmentRequestOtpMutation } from '../../redux/api/enrollmentApi';
import { getEnrolByAadhaarPayload, useEnrolByAadhaarMutation } from '../../redux/api/enrolByAadhaarApi';
import { getAuthByAbdmPayload, useAuthByAbdmMutation } from '../../redux/api/authByAbdmApi';
import { getEmailVerificationLinkPayload, useRequestEmailVerificationLinkMutation } from '../../redux/api/emailVerificationLinkApi';
import { useEnrolSuggestionMutation } from '../../redux/api/enrolSuggestionApi';
import { getEnrolAbhaAddressPayload, useEnrolAbhaAddressMutation } from '../../redux/api/enrolAbhaAddressApi';
import { useLazyProfileAccountQuery } from '../../redux/api/profileAccountApi';
import DLStepTwo from './DLStepTwo';
import { styles } from './style';
import RadioItem from './RadioItem';
import { formatAadhaar, formatAbhaNumber, generateCaptcha, getIsFormValid, stepOneValidator, steps, stepsDL, stepTwoValidator, TERMS_FIVE, TERMS_FOUR, TERMS_ONE, TERMS_SIX, TERMS_TWO, validateForm } from '../../utils/helpers';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import DLStepOne from './DLStepOne';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch()

  const loginType =
    route?.params?.loginType || 'Mobile Number';
  const publicKey = useSelector(
    (state: any) => state.auth.publicKey
  );
  const txnId = useSelector(
    (state: any) => state.abha.txnId
  );
  const isFromRegister = route?.params?.isFromRegister || false
  const isFromCreate = route?.params?.isFromCreate || false
  const isFromMobileRegister = route?.params?.isFromMobileRegister || false
  const isFromForgotAbhaNumber = route?.params?.isFromForgotAbhaNumber || false
  const isFromForgotAbhaNumberWithType = route?.params?.isFromForgotAbhaNumberWithType || false
  const [errorMessage, setErrorMessage] = useState('');

  const [stepOne, setStepOne] = useState<any>({
    aadhaarNumber: '',
    termsAgree: false,
    authType: "",
    captchaValid: false,
    passedForVarification: false,
    setOneDone: false,
  })

  const [stepTwo, setStepTwo] = useState<any>({
    stepTwoTitle: "",
    stepTwoOTP: '',
    stepTwoMobileNumber: "",
    setTwoDone: false,
  })

  const [stepThree, setStepThree] = useState<any>({
    stepThreeMobile: '',
    stepThreeMobileVerifyed: false,
    stepThreeMobileOTP: "",
    stepThreeMobileAuthDone: false,

    stepThreeEmail: "",
    stepThreeEmailOTP: "",
    stepThreeEmailVarifying: false,
    stepThreeEmailOPTVerify: false,
    stepThreeEmailVarifyDone: false
  })


  const [stepFour, setStepFour] = useState<any>({
    userName: ""
  })

  const [stepOneDL, setStepOneDL] = useState<any>({
    stepOneDLTitle: "",
    stepOneDLOTP: '',
    stepOneDLMobileNumber: "",
    stepOneDLMobileVerifying: false,
    stepOneDLDone: false,
  })

  const [currentStep, setCurrentStep] = useState(1);
  const [currentStepDL, setCurrentStepDL] = useState(1);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaValue, setCaptchaValue] = useState('');

  const [requestOtp] = useRequestOtpMutation();
  const [enrollmentRequestOtp,] = useEnrollmentRequestOtpMutation();
  const [enrolByAadhaar,] = useEnrolByAadhaarMutation();
  const [authByAbdm,] = useAuthByAbdmMutation();
  const [requestEmailVerificationLink,] = useRequestEmailVerificationLinkMutation();
  const [enrolSuggestion,] = useEnrolSuggestionMutation();
  const [enrolAbhaAddress,] = useEnrolAbhaAddressMutation();
  const [getProfileAccount,] = useLazyProfileAccountQuery();

  const [abhaSuggestionList, setAbhaSuggestionList] = useState([]);
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationMethod, setValidationMethod] = useState('');
  const [otpMethod, setOtpMethod] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const placeholder = useMemo(() => {
    switch (loginType) {
      case 'Mobile Number':
        return 'Enter mobile number';
      case 'Aadhaar Number':
        return 'Enter aadhaar number';
      case 'Aadhaar Number':
        return 'Enter aadhaar number';
      case 'ABHA Address':
        return 'Enter ABHA address';
      case 'ABHA Number':
        return 'Enter ABHA number';
      case 'Create ABHA Number':
        return 'Enter ABHA number';
      case 'Register with Mobile Number':
        return 'Enter mobile number';
      default:
        return 'Enter value';
    }
  }, [loginType]);

  const renderValidationOptions = () => {
    if (loginType === 'Mobile Number') {
      return null;
    }

    if (loginType === 'Aadhaar Number' && !isFromForgotAbhaNumberWithType) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Verification Method
          </Text>

          <RadioItem
            title="Aadhaar OTP"
            selected={
              validationMethod ===
              'Aadhaar OTP'
            }
            onPress={() =>
              setValidationMethod(
                'Aadhaar OTP',
              )
            }
          />

          <RadioItem
            title="Face Auth"
            selected={
              validationMethod ===
              'Face Auth'
            }
            onPress={() =>
              setValidationMethod(
                'Face Auth',
              )
            }
          />
        </View>
      );
    }

    if (loginType === 'ABHA Address') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Verification Method
          </Text>

          <RadioItem
            title="Password"
            selected={
              validationMethod ===
              'Password'
            }
            onPress={() => {
              setValidationMethod(
                'Password',
              );
              setOtpMethod('');
            }}
          />

          <RadioItem
            title="OTP"
            selected={
              validationMethod === 'OTP'
            }
            onPress={() => {
              setValidationMethod('OTP');
              setOtpMethod('');
            }}
          />

          <RadioItem
            title="Face Auth"
            selected={
              validationMethod ===
              'Face Auth'
            }
            onPress={() =>
              setValidationMethod(
                'Face Auth',
              )
            }
          />
        </View>
      );
    }

    if (loginType === 'ABHA Number') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Verification Method
          </Text>

          <RadioItem
            title="Aadhaar OTP"
            selected={
              validationMethod ===
              'Aadhaar OTP'
            }
            onPress={() =>
              setValidationMethod(
                'Aadhaar OTP',
              )
            }
          />

          <RadioItem
            title="Mobile OTP"
            selected={
              validationMethod ===
              'Mobile OTP'
            }
            onPress={() =>
              setValidationMethod(
                'Mobile OTP',
              )
            }
          />
          {
            !isFromRegister && <RadioItem
              title="Face Auth"
              selected={
                validationMethod ===
                'Face Auth'
              }
              onPress={() =>
                setValidationMethod(
                  'Face Auth',
                )
              }
            />
          }

        </View>
      );
    }

    if (loginType === 'Forgot ABHA Number' && isFromForgotAbhaNumber) {
      return (
        <View style={[styles.card, {
          flexDirection: 'row', padding: 4,
          marginHorizontal: 14,
          alignContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 14
        }]}>
          <View style={{
            width: '50%'
          }}>
            <RadioItem
              title="Aadhaar Number"
              selected={
                validationMethod ===
                'Aadhaar Number'
              }
              onPress={() => {
                setLoginValue("")
                refreshCaptcha()
                setCaptchaValue("")
                Keyboard.dismiss()
                setValidationMethod(
                  'Aadhaar Number',
                )
              }

              }
            />
          </View>
          <View style={{
            width: '50%'

          }}>
            <RadioItem
              title="Mobile Number"
              selected={
                validationMethod ===
                'Mobile Number'
              }
              onPress={() => {
                setLoginValue("")
                refreshCaptcha()
                setCaptchaValue("")
                Keyboard.dismiss()
                setValidationMethod(
                  'Mobile Number',
                )
              }

              }
            />
          </View>
        </View>
      );
    }
    return null;
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaValue('');
  };

  const maxLength =
    loginType === 'Aadhaar Number' ? 14 // 1234-5678-9012
      : loginType === 'ABHA Number' || loginType === 'Create ABHA Number' ? 17 // 12-3456-7890-1234
        : loginType === 'Mobile Number' ? 10
          : 100;

  const [selectedItem, setSelectedItem] =
    useState<string | null>(null);

  const handleSelect = (
    item: string
  ) => {
    setSelectedItem((prev) =>
      prev === item ? null : item
    );
    setStepFour({
      ...stepFour,
      userName: item,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <>
          <StepOne
            captcha={captcha}
            captchaValue={captchaValue}
            stepOne={stepOne}
            setStepOne={setStepOne}
            loginType={loginType}
            validationMethod={validationMethod}
            setLoginValue={setLoginValue}
            refreshCaptcha={refreshCaptcha}
            setCaptchaValue={setCaptchaValue}
            setValidationMethod={setValidationMethod}
          />
        </>;
      case 2:
        return <>
          <StepTwo
            setStepTwo={setStepTwo}
            stepTwo={stepTwo}
            loginType={loginType}
          />
        </>;

      case 3:
        return <>
          <StepThree
            requestEmailVerificationLink={requestEmailVerificationLink}
            enrolSuggestion={enrolSuggestion}
            setAbhaSuggestionList={setAbhaSuggestionList}
            setCurrentStep={setCurrentStep}
            stepThree={stepThree}
            setStepThree={setStepThree}
            loginType={loginType}
            publicKey={publicKey}
            txnId={txnId}
            enrollmentRequestOtp={enrollmentRequestOtp}
            getEmailVerificationLinkPayload={getEmailVerificationLinkPayload
            }
          />
        </>
      case 4:
        return <>
          <StepFour
            stepFour={stepFour}
            loginType={loginType}
            abhaSuggestionList={abhaSuggestionList}
            selectedItem={selectedItem}
            handleSelect={handleSelect}
          />
        </>;
      default:
        return null;
    }
  };

  const renderDLStep = () => {
    switch (currentStepDL) {
      case 1:
        return <>
          <DLStepOne
            refreshCaptcha={refreshCaptcha}
            stepOneDL={stepOneDL}
            setStepOneDL={setStepOneDL}
            setCurrentStepDL={setCurrentStepDL}
            loginType={loginType}
            captcha={captcha}
            captchaValue={captchaValue}
            setCaptchaValue={setCaptchaValue}
          />
        </>;
      case 2:
        return <><DLStepTwo /></>;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text style={styles.back}>
              ←
            </Text>

          </TouchableOpacity>
          <Text style={[styles.welcome, isFromRegister && {
            fontSize: 18
          }]}>
            {
              isFromForgotAbhaNumber ? 'Recover ABHA Number' : `${isFromRegister ?

                loginType === 'Aadhaar Number' ? 'Create ABHA Number Using Aadhaar' : 'Create ABHA Number Using Driving Licence' : isFromCreate ? loginType : isFromMobileRegister ? loginType : 'Welcome Back 👋'}`
            }
          </Text>
        </View>
        {
          isFromRegister ? <>
            <View style={{ height: '85%' }}>
              {
                loginType === 'Aadhaar Number' ? <>
                  <View style={styles.stepContainer}>
                    {steps.map((item, index) => {
                      const stepNumber = index + 1;
                      const isActive = currentStep >= stepNumber;
                      return (
                        <React.Fragment key={index}>
                          <TouchableOpacity
                            style={styles.stepItem}
                            disabled
                          >
                            <View
                              style={[
                                styles.circle,
                                isActive && styles.activeCircle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.circleText,
                                  isActive && styles.activeCircleText,
                                ]}
                              >
                                {stepNumber}
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.stepLabel,
                                isActive && styles.activeStepLabel,
                              ]}
                            >
                              Step {stepNumber}
                            </Text>
                          </TouchableOpacity>
                          {index < steps.length - 1 && (
                            <View
                              style={[
                                styles.line,
                                currentStep > stepNumber && styles.activeLine,
                              ]}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 0.8, padding: 0 }}>
                    {renderStep()}
                  </ScrollView>
                  <View style={[styles.buttonContainer, {
                  }]}>
                    <View style={[
                      {
                        backgroundColor: '#173D8F',
                        borderRadius: 4,
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        padding: 10
                      }
                    ]}>
                      <Text style={styles.typeText}>
                        {steps[currentStep - 1]}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          dispatch(showLoader());
                          if (currentStep === 1) {
                            //step 1
                            const validate = stepOneValidator(stepOne, captchaValue, captcha);
                            console.log("validate +++++ ++ + + +++++ ", validate)
                            if (!validate) {
                              showToast('error', "Please fill all fields correctly")
                              return;
                            }
                            setStepOne({
                              ...stepOne,
                              passedForVarification: !stepOne.passedForVarification,
                            });
                            const encryptedValue =
                              encryptData(
                                loginValue,
                                publicKey,
                              );
                            const payloadPassed = getEnrollmentPayload(
                              loginType,
                              encryptedValue,
                              txnId,
                            );
                            const result = await enrollmentRequestOtp(payloadPassed).unwrap();
                            console.log("result ------+++++++++++++-------- ", result)
                            setStepTwo({
                              ...stepTwo,
                              stepTwoTitle: result?.message,
                            });
                            setCurrentStep(2)

                          } else if (currentStep === 2) {
                            //step 2
                            const validate = stepTwoValidator(stepTwo);
                            if (!validate) {
                              showToast('error', "Please fill all fields correctly")
                              return;
                            }
                            const encryptedValue =
                              encryptData(
                                stepTwo.stepTwoOTP,
                                publicKey,
                              );
                            const payloadPassed = getEnrolByAadhaarPayload(
                              txnId,
                              encryptedValue,
                              stepTwo.stepTwoMobileNumber,
                            );
                            const result = await enrolByAadhaar(payloadPassed).unwrap();
                            console.log("result ------+++++++++++++-------- ", result)
                            if (result?.isNew && stepTwo.stepTwoMobileNumber === result?.ABHAProfile?.mobile) {
                              const responseProfile =
                                await getProfileAccount();
                              console.log(responseProfile);
                              navigation.navigate("Profile", {
                                profile: responseProfile.data,
                              });
                            } else {
                              setCurrentStep(3)
                            }
                          } else if (currentStep === 3) {
                            //step 3
                            if (!stepThree.stepThreeMobileAuthDone && stepThree.stepThreeMobileVerifyed) {
                              const encryptedOtp =
                                encryptData(
                                  stepThree.stepThreeMobileOTP,
                                  publicKey
                                );
                              const payload =
                                getAuthByAbdmPayload(
                                  txnId,
                                  encryptedOtp
                                );
                              const result =
                                await authByAbdm(
                                  payload
                                ).unwrap();
                              console.log(
                                "AUTH BY ABDM RESULT =>",
                                result
                              );
                              if (result?.authResult === 'success') {
                                setStepThree({
                                  ...stepThree,
                                  stepThreeMobileAuthDone: true,
                                });
                              }
                              return;
                            }
                            if (stepThree.stepThreeMobileAuthDone && !stepThree.stepThreeEmailVarifying) {
                              setStepThree({
                                ...stepThree,
                                stepThreeEmailVarifying: true,
                              });
                              return;
                            }
                            if (stepThree.stepThreeMobileAuthDone && stepThree.stepThreeEmailVarifying && !stepThree.stepThreeEmailVarifyDone) {
                              showToast('error', "Please varify email")
                              return;
                            }
                            showToast('error', "Please verify mobile")
                          } else if (currentStep === 4) {
                            //step 4
                            if (!stepFour.userName && stepFour.userName === '') {
                              showToast('error', "Please fill abha address")
                              return;
                            }
                            const response =
                              await enrolAbhaAddress(
                                getEnrolAbhaAddressPayload(
                                  txnId,
                                  stepFour.userName,
                                  1
                                )
                              ).unwrap();
                            const responseProfile =
                              await getProfileAccount();
                            console.log(responseProfile);
                            navigation.navigate("Profile", {
                              profile: responseProfile.data,
                            });
                          }
                        } catch (error) {
                          console.log("--------------------", error)
                          dispatch(hideLoader());
                        } finally {
                          dispatch(hideLoader());
                        }
                      }}
                      style={styles.nextButton}
                    >
                      <Text style={{ color: '#FFF' }}>
                        {currentStep === 4 ? 'Create ABHA' : currentStep === 3 ?
                          stepThree.stepThreeMobileAuthDone ?
                            "Skip for now" : "Next" : 'Next'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </> : <>
                  <View style={styles.stepContainer}>
                    {stepsDL.map((item, index) => {
                      const stepNumber = index + 1;
                      const isActive = currentStepDL >= stepNumber;
                      return (
                        <React.Fragment key={index}>
                          <TouchableOpacity
                            style={styles.stepItem}
                            disabled
                          >
                            <View
                              style={[
                                styles.circle,
                                isActive && styles.activeCircle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.circleText,
                                  isActive && styles.activeCircleText,
                                ]}
                              >
                                {stepNumber}
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.stepLabel,
                                isActive && styles.activeStepLabel,
                              ]}
                            >
                              Step {stepNumber}
                            </Text>
                          </TouchableOpacity>

                          {index < stepsDL.length - 1 && (
                            <View
                              style={[
                                styles.line,
                                currentStep > stepNumber && styles.activeLine,
                              ]}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}

                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 0.8, padding: 0 }}>
                    {renderDLStep()}
                  </ScrollView>

                  <View style={[styles.buttonContainer, {

                  }]}>
                    <View style={[
                      {
                        backgroundColor: '#173D8F',
                        borderRadius: 4,
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        padding: 10
                      }
                    ]}>
                      <Text style={styles.typeText}>
                        {stepsDL[currentStepDL - 1]}
                      </Text>
                    </View>

                    {
                      !stepOneDL.stepOneDLMobileVerifying && <TouchableOpacity
                        onPress={async () => {
                          if (currentStepDL === 1) {
                            if (stepOneDL.stepOneDLMobileNumber === '' && !stepOneDL.stepOneDLMobileVerifying) {
                              showToast('error', 'Please fill mobile number')
                              return;
                            }
                            setStepOneDL({
                              ...stepOneDL,
                              stepOneDLMobileVerifying: true,
                            });
                          } else {

                          }
                        }}
                        style={styles.nextButton}
                      >
                        <Text style={{ color: '#FFF' }}>
                          {'Next'}
                        </Text>
                      </TouchableOpacity>
                    }
                  </View>
                </>
              }
            </View>
          </> : <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 140,
              }}
            >
              <View style={styles.hero}>
                {
                  !isFromForgotAbhaNumber && !isFromMobileRegister && !isFromCreate && !isFromRegister && <Text style={styles.subtitle}>
                    Sign in securely to access
                    your ABHA health records
                  </Text>
                }
                {
                  isFromForgotAbhaNumber && <Text style={styles.subtitle}>
                    You can recover your ABHA number using Aadhaar number or registered mobile number. Recovery using any of the following methods requires filling out your basic details and access to your linked mobile.
                  </Text>
                }
              </View>
              <View style={{
                width: '94%',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                {
                  isFromRegister ? <View style={{ marginVertical: 1 }}></View> :
                    <>
                      {
                        !isFromForgotAbhaNumber && !isFromMobileRegister && !isFromCreate && <View style={styles.typeChip}>
                          <Text style={styles.typeText}>
                            {loginType}
                          </Text>
                        </View>
                      }
                    </>
                }
              </View>
              {
                !isFromForgotAbhaNumber && <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Enter Details <Text style={{ color: 'red' }}>*</Text>
                  </Text>

                  <View style={styles.inputContainer}>
                    {(loginType === 'Mobile Number' ||
                      loginType === 'Register with Mobile Number') && (
                        <Text style={styles.prefix}>+91</Text>
                      )}
                    <TextInput
                      value={loginValue}
                      onChangeText={text => {
                        let value = text;

                        switch (loginType) {
                          case 'Mobile Number':
                          case 'Register with Mobile Number':
                            value = text.replace(/\D/g, '').slice(0, 10);
                            break;

                          case 'Aadhaar Number':
                            value = formatAadhaar(text);
                            break;

                          case 'ABHA Number':
                          case 'Create ABHA Number':
                            value = formatAbhaNumber(text);
                            break;

                          default:
                            break;
                        }
                        setLoginValue(value);
                      }}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      keyboardType={
                        [
                          'Mobile Number',
                          'Register with Mobile Number',
                          'Aadhaar Number',
                          'ABHA Number',
                          'Create ABHA Number',
                        ].includes(loginType)
                          ? 'number-pad'
                          : 'default'
                      }
                      style={styles.input}
                    />
                    {
                      loginType === 'ABHA Address' && <Text style={styles.hintText}>
                        @abdm
                      </Text>
                    }
                  </View>
                  {
                    <TouchableOpacity
                      onPress={() => {
                        setValidationMethod('')
                        setTimeout(() => {
                          setValidationMethod('Aadhaar Number')
                          setLoginValue("")
                          setCaptchaValue("")
                          refreshCaptcha()
                          setIsAgreed(false)
                          Keyboard.dismiss()
                          navigation.navigate("Login", {
                            loginType: 'Forgot ABHA Number',
                            isFromRegister: false,
                            isFromCreate: false,
                            isFromMobileRegister: false,
                            isFromForgotAbhaNumber: true
                          })
                        })
                      }}>
                      <Text style={[styles.forgotText, {
                        alignSelf: 'flex-end',
                        marginTop: 10
                      }]}>
                        Forgot ABHA number?
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              }
              {
                isFromForgotAbhaNumberWithType && <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Enter Details <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      value={loginValue}
                      onChangeText={text => {
                        const value =
                          loginType === 'Mobile Number' ||
                            loginType === 'Aadhaar Number'
                            ? text.replace(/[^0-9]/g, '')
                            : text;
                        setLoginValue(value);
                      }}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      keyboardType={
                        loginType === 'Mobile Number' ||
                          loginType === 'Aadhaar Number'
                          ? 'number-pad'
                          : 'default'
                      }
                      style={styles.input}
                    />
                    {!!errorMessage && (
                      <Text style={{
                        color: 'red'
                      }}>
                        {errorMessage}
                      </Text>
                    )}
                  </View>
                </View>
              }
              {loginType === 'Forgot ABHA Number' && renderValidationOptions()}
              {
                isFromForgotAbhaNumber && <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Enter Details <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    {(validationMethod === 'Mobile Number' ||
                      validationMethod === 'Register with Mobile Number') && (
                        <Text style={styles.prefix}>+91</Text>
                      )}
                    <TextInput
                      value={loginValue}
                      onChangeText={text => {
                        let value = text;
                        switch (validationMethod) {
                          case 'Mobile Number':
                          case 'Register with Mobile Number':
                            value = text.replace(/\D/g, '').slice(0, 10);
                            break;
                          case 'Aadhaar Number':
                            value = formatAadhaar(text);
                            break;
                          case 'ABHA Number':
                          case 'Create ABHA Number':
                            value = formatAbhaNumber(text);
                            break;
                          default:
                            break;
                        }
                        setLoginValue(value);
                      }}
                      placeholder={validationMethod === 'Mobile Number' ? 'Enter mobile number' : 'Enter aadhaar number'}
                      maxLength={maxLength}
                      keyboardType={
                        validationMethod === 'Mobile Number' ||
                          validationMethod === 'Aadhaar Number'
                          ? 'number-pad'
                          : 'default'
                      }
                      style={styles.input}
                    />
                    {!!errorMessage && (
                      <Text style={{
                        color: 'red'
                      }}>
                        {errorMessage}
                      </Text>
                    )}
                  </View>
                </View>
              }

              {validationMethod === 'Password' && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Password
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter Password"
                      style={styles.passwordInput}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowPassword(
                          !showPassword,
                        )
                      }
                    >
                      <Text style={styles.eyeIcon}>
                        {showPassword
                          ? '🙈'
                          : '👁️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {validationMethod === 'Face Auth' && (
                <View style={styles.faceAuthCard}>
                  <Text style={styles.faceEmoji}>
                    😊
                  </Text>

                  <Text style={styles.faceText}>
                    Face Authentication will be used
                    for verification
                  </Text>
                </View>
              )}
              {validationMethod ===
                'OTP' && (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                      Validate Using
                    </Text>

                    <RadioItem
                      title="Aadhaar OTP"
                      selected={
                        otpMethod ===
                        'Aadhaar OTP'
                      }
                      onPress={() =>
                        setOtpMethod(
                          'Aadhaar OTP',
                        )
                      }
                    />
                    <RadioItem
                      title="Mobile OTP"
                      selected={
                        otpMethod ===
                        'Mobile OTP'
                      }
                      onPress={() =>
                        setOtpMethod(
                          'Mobile OTP',
                        )
                      }
                    />
                  </View>
                )}
              {
                isFromForgotAbhaNumberWithType && <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>
                    Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
                  </Text>

                  <View style={styles.termsCard}>
                    <Text style={styles.termsText}>
                      {TERMS_ONE}
                    </Text>

                    <View style={styles.termsFooter}>
                      <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setIsAgreed(!isAgreed)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isAgreed && styles.checkboxActive,
                          ]}
                        >
                          {isAgreed && (
                            <Text style={styles.checkmark}>
                              ✓
                            </Text>
                          )}
                        </View>

                        <Text style={styles.agreeText}>
                          I agree
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text style={styles.speakerIcon}>
                          🔊
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }
              {
                !isFromForgotAbhaNumberWithType && loginType === 'Aadhaar Number' && <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>
                    Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
                  </Text>

                  <View style={styles.termsCard}>
                    <View style={{ height: 140, marginVertical: 8 }}>
                      <ScrollView>
                        <Text style={styles.termsText}>
                          {TERMS_TWO}
                        </Text>
                      </ScrollView>
                    </View>


                    <View style={styles.termsFooter}>
                      <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setIsAgreed(!isAgreed)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isAgreed && styles.checkboxActive,
                          ]}
                        >
                          {isAgreed && (
                            <Text style={styles.checkmark}>
                              ✓
                            </Text>
                          )}
                        </View>

                        <Text style={styles.agreeText}>
                          I agree
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text style={styles.speakerIcon}>
                          🔊
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }


              {
                isFromForgotAbhaNumber && <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>
                    Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
                  </Text>

                  <View style={styles.termsCard}>
                    <View style={{ height: 140, marginVertical: 8 }}>
                      <ScrollView>
                        {
                          validationMethod === 'Aadhaar Number' ? <Text style={styles.termsText}>
                            {
                              TERMS_FOUR
                            }
                          </Text>
                            : <Text style={styles.termsText}>
                              {
                                TERMS_FIVE
                              }
                            </Text>

                        }
                      </ScrollView>
                    </View>


                    <View style={styles.termsFooter}>
                      <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setIsAgreed(!isAgreed)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isAgreed && styles.checkboxActive,
                          ]}
                        >
                          {isAgreed && (
                            <Text style={styles.checkmark}>
                              ✓
                            </Text>
                          )}
                        </View>

                        <Text style={styles.agreeText}>
                          I agree
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text style={styles.speakerIcon}>
                          🔊
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }

              {
                !isFromForgotAbhaNumberWithType && loginType === 'Create ABHA Number' && <View style={styles.termsContainer}>
                  <Text style={styles.termsTitle}>
                    Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
                  </Text>

                  <View style={styles.termsCard}>
                    <Text style={styles.termsText}>
                      {
                        TERMS_SIX
                      }
                    </Text>

                    <View style={styles.termsFooter}>
                      <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setIsAgreed(!isAgreed)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isAgreed && styles.checkboxActive,
                          ]}
                        >
                          {isAgreed && (
                            <Text style={styles.checkmark}>
                              ✓
                            </Text>
                          )}
                        </View>

                        <Text style={styles.agreeText}>
                          I agree
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text style={styles.speakerIcon}>
                          🔊
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }
              <View style={{ marginHorizontal: 24, marginVertical: 2, backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                <View>
                  <Text style={styles.cardTitle}>Captcha <Text style={{ color: 'red' }}>*</Text></Text>
                </View>
                <View style={styles.captchaContainer}>

                  <Text style={styles.captchaText}>
                    {captcha.question}
                  </Text>

                  <TextInput
                    placeholder="Enter answer"
                    keyboardType="number-pad"
                    value={captchaValue}
                    onChangeText={setCaptchaValue}
                    style={styles.captchaInput}
                  />

                  <TouchableOpacity onPress={refreshCaptcha}>
                    <MaterialIcons
                      name="loop"
                      size={28}
                      color="#1E40AF"
                    />

                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <View style={styles.bottomBar}>
              <TouchableOpacity
                disabled={!getIsFormValid(loginType, loginValue, isFromForgotAbhaNumber, isAgreed, captchaValue, captcha)}
                style={[
                  styles.continueBtn,
                  !getIsFormValid(loginType, loginValue, isFromForgotAbhaNumber, isAgreed, captchaValue, captcha) && {
                    opacity: 0.5
                  }
                ]}
                onPress={async () => {
                  try {
                    const error = validateForm(loginType, loginValue, captchaValue, captcha);
                    if (error) {
                      showToast('error', error);
                      return;
                    }
                    if (!getIsFormValid(loginType, loginValue, isFromForgotAbhaNumber, isAgreed, captchaValue, captcha)) {
                      showToast('error', 'Please fill all fields correctly');
                      return;
                    }
                    dispatch(showLoader());
                    if (isFromRegister) {
                      const encryptedValue =
                        encryptData(
                          loginValue,
                          publicKey,
                        );
                      const payloadPassed = getEnrollmentPayload(
                        loginType,
                        encryptedValue,
                        txnId,
                      );
                      const result = await enrollmentRequestOtp(payloadPassed).unwrap();
                      console.log("result ------+++++++++++++-------- ", result)
                      navigation.navigate('OtpVerification', {
                        loginType,
                        mobileNumber: loginValue,
                      });
                    } else {

                      const encryptedValue =
                        encryptData(
                          loginValue,
                          publicKey,
                        );
                      const payloadPassed = getPayload(
                        loginType === 'Forgot ABHA Number' ? validationMethod : loginType,
                        encryptedValue,
                        txnId,
                      );
                      const result = await requestOtp(payloadPassed).unwrap();
                      console.log("result -------------- ", result)
                      navigation.navigate('OtpVerification', {
                        loginType,
                        mobileNumber: loginValue,
                      });
                    }

                  } catch (error) {
                    console.log("error -------------- ", error)
                    dispatch(hideLoader());
                  } finally {
                    dispatch(hideLoader());
                  }

                }}
              >
                <Text style={styles.continueText}>
                  {isFromCreate ? "Next" : "Continue"}
                </Text>
              </TouchableOpacity>

              {
                !isFromForgotAbhaNumber && loginType !== 'Register with Mobile Number' &&
                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={() => {
                      setValidationMethod('')
                      setLoginValue('')
                      setCaptchaValue("")
                      refreshCaptcha()
                      setIsAgreed(false)
                      Keyboard.dismiss()
                      setTimeout(() => {
                        navigation.navigate("Login", {
                          loginType: isFromCreate ? 'Register with Mobile Number' : 'Create ABHA Number',
                          isFromRegister: false,
                          isFromCreate: isFromCreate ? false : true,
                          isFromMobileRegister: true
                        })
                      })
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.createNow}>
                        Retrieve your Enrolment number
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            </View></>
        }
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;