import React, { useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { encryptData } from '../../utils/encrypt';
import { useDispatch, useSelector } from 'react-redux';
import { getPayload, useRequestOtpMutation } from '../../redux/api/loginApi';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import { showToast } from '../../utils/toast';
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { getEnrollmentPayload, useEnrollmentRequestOtpMutation } from '../../redux/api/enrollmentApi';
import { getEmailVerificationLinkPayload, useRequestEmailVerificationLinkMutation } from '../../redux/api/emailVerificationLinkApi';
import { useEnrolSuggestionMutation } from '../../redux/api/enrolSuggestionApi';
import DLStepTwo from './DLStepTwo';
import { styles } from './style';
import RadioItem from './RadioItem';
import { formatLoginInput, getIsFormValid, getLoginKeyboardType, getLoginMaxLength, getLoginPlaceholder, isStrictIndianMobile, steps, stepsDL, validateForm } from '../../utils/helpers';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import DLStepOne from './DLStepOne';
import { getDlEnrollmentRequestOtpPayload, useDlEnrollmentRequestOtpMutation } from '../../redux/api/dlEnrollmentRequestOtpApi';
import ValidationErrorBottomSheet from './ValidationErrorBottomSheet';
import { LOGIN_TYPES } from '../../utils/constants';
import TermsConditions from './TermsConditions';
import AadhaarInput from './AadhaarInput';
import ValidationOptions from './ValidationOptions';
import { useLoginFlow } from './useLoginFlow';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch()

  const publicKey = useSelector(
    (state: any) => state.auth.publicKey
  );
  const { txnId } = useSelector((state: any) => state.abha);
  const { loginType, isFromRegister = false, isFromCreate = false, isFromMobileRegister = false, isFromForgotAbhaNumber = false, isFromForgotAbhaNumberWithType = false, } = route.params ?? {};

  const {
    stepOne, setStepOne, stepTwo, setStepTwo, stepThree, setStepThree, stepFour,
    stepOneDL, setStepOneDL, currentStep, setCurrentStep,
    currentStepDL, setCurrentStepDL,
    loginValue, setLoginValue,
    password, setPassword,
    showPassword, setShowPassword,
    validationMethod, setValidationMethod,
    otpMethod, setOtpMethod,
    isAgreed, setIsAgreed,
    captcha, captchaValue, setCaptchaValue,
    refreshCaptcha, selectedItem,
    abhaSuggestionList, setAbhaSuggestionList,
    showValidationSheet, setShowValidationSheet,
    validationErrors, setValidationErrors,
    stepTwoRef, handleSelect, handleSteps, handleOTPVerify,
    shouldShowTerms, termsText, validationConfig,
  } = useLoginFlow({
    loginType, isFromRegister, isFromCreate, isFromMobileRegister, isFromForgotAbhaNumber, isFromForgotAbhaNumberWithType,
  });

  const [requestOtp] = useRequestOtpMutation();
  const [enrollmentRequestOtp,] = useEnrollmentRequestOtpMutation();
  const [requestEmailVerificationLink,] = useRequestEmailVerificationLinkMutation();
  const [enrolSuggestion,] = useEnrolSuggestionMutation();
  const [dlEnrollmentRequestOtp,] = useDlEnrollmentRequestOtpMutation();

  const placeholder = useMemo(
    () => getLoginPlaceholder(loginType),
    [loginType]
  );

  const maxLength = useMemo(() => getLoginMaxLength(loginType),
    [loginType]
  )

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
            loginValue={loginValue}
            publicKey={publicKey}
            txnId={txnId}
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
            getEmailVerificationLinkPayload={getEmailVerificationLinkPayload}
            mobileNumer={stepTwo?.stepTwoMobileNumber}
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
            handleOTPVerify={handleOTPVerify}
          />
        </>;
      case 2:
        return <><DLStepTwo
          ref={stepTwoRef}
          mobileNumber={stepOneDL?.stepOneDLMobileNumber} /></>;
      case 3:
        return <></>
    }
  }

  const headerTitle = useMemo(() => {
    if (isFromForgotAbhaNumber) {
      return "Recover ABHA Number";
    }

    if (isFromRegister) {
      return loginType === LOGIN_TYPES.AADHAAR
        ? "Create ABHA Number Using Aadhaar"
        : "Create ABHA Number Using Driving Licence";
    }

    if (isFromCreate || isFromMobileRegister) {
      return loginType;
    }

    return "Welcome Back 👋";
  }, [
    loginType,
    isFromRegister,
    isFromCreate,
    isFromMobileRegister,
    isFromForgotAbhaNumber,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={{ marginVertical: 4 }}
          >
            <MaterialIcons
              name='arrow-back'
              size={20}
            />
          </TouchableOpacity>

          <Text style={[styles.welcome, isFromRegister && {
            fontSize: 18
          }]}>
            {headerTitle}
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
                        backgroundColor: '#f18b4c',
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
                        handleSteps()
                      }}
                      style={styles.nextButton}
                    >
                      <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>
                        {currentStep === 4 ? 'Create ABHA' : currentStep === 3 ?
                          stepThree.stepThreeMobileAuthDone ?
                            "Skip for now" : "Next" : 'Next'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </> :
                  <>
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

                    <View style={[styles.buttonContainer]}>
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
                            try {
                              dispatch(showLoader())
                              if (currentStepDL === 1) {
                                if (stepOneDL.stepOneDLMobileNumber === '' && !stepOneDL.stepOneDLMobileVerifying) {
                                  showToast('error', 'Please enter your mobile number.')
                                  return;
                                }
                                const isNumberValid = isStrictIndianMobile(`+91${stepOneDL.stepOneDLMobileNumber}`)
                                if (!isNumberValid) {
                                  showToast('error', 'Please enter a valid mobile number.')
                                  return;
                                }
                                if (!captchaValue) {
                                  showToast('error', 'Please enter the CAPTCHA.')
                                  return;
                                }
                                if (Number(captchaValue) !== captcha.answer) {
                                  showToast('error', 'Please enter a valid CAPTCHA.')
                                  return;
                                }
                                const encryptedMobile = encryptData(
                                  stepOneDL.stepOneDLMobileNumber,
                                  publicKey,
                                );
                                const payload =
                                  getDlEnrollmentRequestOtpPayload(
                                    encryptedMobile
                                  );

                                const response =
                                  await dlEnrollmentRequestOtp(
                                    payload
                                  ).unwrap();
                                showToast('success', response?.message)
                                setStepOneDL({
                                  ...stepOneDL,
                                  stepOneDLTitle: response?.message,
                                  stepOneDLMobileVerifying: true,
                                });
                              } else if (currentStepDL === 2) {
                                const result = stepTwoRef.current?.validateForm();
                                if (!result.isValid) {
                                  setValidationErrors(result.errors);
                                  setShowValidationSheet(true); // Bottom Sheet open
                                  return;
                                }
                                console.log(result.data);
                              }
                            } catch (error) {
                              showToast('error', `${error}`)
                              dispatch(hideLoader())
                            } finally {
                              dispatch(hideLoader())
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
                  {
                    loginType !== 'Aadhaar Number' ? <Text style={styles.cardTitle}>
                      Enter Details <Text style={{ color: 'red' }}>*</Text>
                    </Text> : <Text style={styles.cardTitle}>
                      Enter Aadhaar number <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                  }
                  <View style={[styles.inputContainer, loginType === 'Aadhaar Number' && {
                    backgroundColor: '#fff',
                    borderColor: '#fff'
                  }]}>
                    {(loginType === LOGIN_TYPES.MOBILE ||
                      loginType === 'Register with Mobile Number') && (
                        <Text style={styles.prefix}>+91</Text>
                      )}
                    {
                      loginType === 'Aadhaar Number' ?
                        <>
                          <AadhaarInput
                            value={loginValue}
                            onChange={setLoginValue}
                          />
                        </> : <>  <TextInput
                          value={loginValue}
                          onChangeText={text => {
                            setLoginValue(formatLoginInput(loginType, text))
                          }}
                          placeholder={placeholder}
                          maxLength={maxLength}
                          keyboardType={getLoginKeyboardType(loginType)}
                          style={styles.input}
                        /> </>
                    }

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
                          navigation.navigate("RegistrationAbha", {
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
                        setLoginValue(formatLoginInput(loginType, text))
                      }}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      keyboardType={getLoginKeyboardType(loginType)}
                      style={styles.input}
                    />

                  </View>
                </View>
              }
              {loginType === 'Forgot ABHA Number' && <ValidationOptions
                options={validationConfig[loginType] ?? []}
                value={validationMethod}
                onChange={(item) => {
                  setValidationMethod(item);
                  setOtpMethod("");
                }}
              />}
              {
                isFromForgotAbhaNumber && <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Enter Details <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    {(validationMethod === LOGIN_TYPES.MOBILE ||
                      validationMethod === 'Register with Mobile Number') && (
                        <Text style={styles.prefix}>+91</Text>
                      )}
                    <TextInput
                      value={loginValue}
                      onChangeText={text => {
                        setLoginValue(formatLoginInput(loginType, text))
                      }}
                      placeholder={validationMethod === LOGIN_TYPES.MOBILE ? 'Enter mobile number' : 'Enter aadhaar number'}
                      maxLength={maxLength}
                      keyboardType={getLoginKeyboardType(loginType)}
                      style={styles.input}
                    />

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
                      selected={otpMethod === 'Aadhaar OTP'}
                      onPress={() =>
                        setOtpMethod(
                          'Aadhaar OTP',
                        )
                      }
                    />
                    <RadioItem
                      title="Mobile OTP"
                      selected={otpMethod === 'Mobile OTP'}
                      onPress={() =>
                        setOtpMethod(
                          'Mobile OTP',
                        )
                      }
                    />
                  </View>
                )}

              {shouldShowTerms && (
                <TermsConditions
                  text={termsText}
                  checked={isAgreed}
                  onToggle={() => setIsAgreed(prev => !prev)}
                />
              )}

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
                      showToast('error', 'Please fill in all required fields correctly.');
                      return;
                    }
                    dispatch(showLoader());
                    if (isFromRegister) {
                      const encryptedValue = encryptData(loginValue, publicKey,);
                      const payloadPassed = getEnrollmentPayload(loginType, encryptedValue, txnId,);
                      const result = await enrollmentRequestOtp(payloadPassed).unwrap();
                      showToast(
                        "success",
                        result?.message || "OTP sent successfully"
                      );
                      setTimeout(() => {
                        navigation.replace('OtpVerification', {
                          loginType,
                          mobileNumber: loginValue,
                        });
                      }, 1000);
                    } else {

                      const encryptedValue = encryptData(loginValue, publicKey,);
                      const payloadPassed = getPayload(
                        loginType === 'Forgot ABHA Number' ? validationMethod : loginType,
                        encryptedValue,
                        txnId,
                      );
                      const result = await requestOtp(payloadPassed).unwrap();
                      showToast(
                        "success",
                        result?.message || "OTP sent successfully"
                      );
                      setTimeout(() => {
                        navigation.replace('OtpVerification', {
                          loginType,
                          mobileNumber: loginValue,
                          loginValue: loginValue,
                          txnId: txnId,
                          validationMethod: validationMethod,
                          result: result
                        });
                      }, 1000);
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

            
            </View></>
        }
        <ValidationErrorBottomSheet
          visible={showValidationSheet}
          errors={validationErrors}
          onClose={() => setShowValidationSheet(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;