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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { encryptData } from '../../utils/encrypt';
import { useDispatch, useSelector } from 'react-redux';
import { getPayload, useRequestOtpMutation } from '../../redux/api/loginApi';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import { showToast } from '../../utils/toast';
import MaterialIcons from "@react-native-vector-icons/material-icons";
import OtpInput from '../../Components/OtpInput';

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


  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateCaptcha = () => {
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


  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaValue, setCaptchaValue] = useState('');

  const getIsFormValid = () => {
    console.log('--------------------');
    console.log('loginType =>', loginType);
    console.log('loginValue =>', loginValue);
    console.log('isAgreed =>', isAgreed);
    console.log('captchaValue =>', captchaValue);
    console.log('captcha.answer =>', captcha);

    if (!loginValue) {
      console.log('❌ loginValue empty');
      return false;
    }

    console.log('✅ loginValue valid');

    if (loginType === 'Mobile Number' && loginValue.length !== 10) {
      console.log(
        '❌ Mobile validation failed',
        'length =',
        loginValue.length,
      );
      return false;
    }

    if (loginType === 'Mobile Number') {
      console.log('✅ Mobile validation passed');
    }

    if (
      loginType === 'Aadhaar Number' &&
      loginValue.replace(/-/g, '').length !== 12
    ) {
      console.log(
        '❌ Aadhaar validation failed',
        loginValue.replace(/-/g, '').length,
      );
      return false;
    }

    if (loginType === 'Aadhaar Number') {
      console.log('✅ Aadhaar validation passed');
    }

    if (
      loginType === 'ABHA Number' ||
      loginType === 'Create ABHA Number'
    ) {
      const abhaLength = loginValue.replace(/-/g, '').length;

      console.log('ABHA Length =>', abhaLength);

      if (abhaLength !== 14) {
        console.log('❌ ABHA validation failed');
        return false;
      }

      console.log('✅ ABHA validation passed');
    }

    if (loginType === 'ABHA Address') {
      console.log(
        'ABHA Address contains @ =>',
        loginValue.includes('@'),
      );

      if (!loginValue.includes('@')) {
        console.log('❌ ABHA Address validation failed');
        return false;
      }

      console.log('✅ ABHA Address validation passed');
    }

    const termsRequired =
      loginType === 'Aadhaar Number' ||
      loginType === 'Create ABHA Number' ||
      isFromForgotAbhaNumber;

    console.log('termsRequired =>', termsRequired);

    if (termsRequired && !isAgreed) {
      console.log('❌ Terms not accepted');
      return false;
    }

    console.log('✅ Terms validation passed');

    if (!captchaValue) {
      console.log('❌ Captcha empty');
      return false;
    }

    console.log('✅ Captcha value entered');

    console.log(
      'captcha compare =>',
      Number(captchaValue),
      captcha.answer,
    );

    if (Number(captchaValue) !== captcha.answer) {
      console.log('❌ Captcha validation failed');
      return false;
    }

    console.log('✅ Captcha validation passed');
    console.log('🎉 FORM VALID');

    return true;
  };
  const validateForm = () => {
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

  const [requestOtp, { isLoading }] =
    useRequestOtpMutation();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);
  const [validationMethod, setValidationMethod] =
    useState('');
  const [otpMethod, setOtpMethod] =
    useState('');

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

  const isFormValid = getIsFormValid();

  console.log("isFormValid", isFormValid)

  const RadioItem = ({
    title,
    selected,
    onPress,
  }: any) => (
    <TouchableOpacity
      style={styles.radioRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.radioOuter,
          selected &&
          styles.radioOuterActive,
        ]}
      >
        {selected && (
          <View style={styles.radioInner} />
        )}
      </View>

      <Text style={styles.radioText}>
        {title}
      </Text>
    </TouchableOpacity>
  );

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

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);

    return cleaned
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d{4})(\d)/, '$1-$2-$3');
  };


  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaValue('');
  };
  const validateCaptcha = () => {
    return Number(captchaValue) === captcha.answer;
  };
  const formatAbhaNumber = (value: string) => {
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

  const maxLength =
    loginType === 'Aadhaar Number'
      ? 14 // 1234-5678-9012
      : loginType === 'ABHA Number' ||
        loginType === 'Create ABHA Number'
        ? 17 // 12-3456-7890-1234
        : loginType === 'Mobile Number'
          ? 10
          : 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <>
          <View style={[styles.typeChip,]}>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Text style={styles.typeText}>
                Step 1
              </Text>
              <Text style={styles.typeText}>
                Consent Collection
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <View style={styles.inputContainer}>

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


            </View>
            {/* <Text>
                    Please ensure that mobile number is linked with Aadhaar as it will be required for OTP authentication.
                    If you do not have a mobile number linked, visit the nearest ABDM participating facility and seek assistance.
                  </Text> */}


          </View>
          <View style={[styles.termsContainer, { marginTop: 0 }]}>
            <Text style={styles.termsTitle}>
              Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <View style={styles.termsCard}>
              <View style={{ height: 100, marginVertical: 8 }}>
                <ScrollView>
                  <Text style={styles.termsText}>
                    I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.
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

          <Text style={[styles.cardTitle, { marginHorizontal: 20 }]}>
            Authentication type <Text style={{ color: 'red' }}>*</Text>
          </Text>
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
                title="Aadhaar OTP"
                selected={
                  validationMethod ===
                  'Aadhaar OTP'
                }
                onPress={() => {
                  setLoginValue("")
                  refreshCaptcha()
                  setCaptchaValue("")
                  Keyboard.dismiss()
                  setValidationMethod(
                    'Aadhaar OTP',
                  )
                }

                }
              />
            </View>
            <View style={{
              width: '50%'

            }}>
              <RadioItem
                title="Face Auth"
                selected={
                  validationMethod ===
                  'Face Auth'
                }
                onPress={() => {
                  setLoginValue("")
                  refreshCaptcha()
                  setCaptchaValue("")
                  Keyboard.dismiss()
                  setValidationMethod(
                    'Face Auth',
                  )
                }

                }
              />
            </View>
          </View>

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


        </>;

      case 2:
        return <>
          <View style={[styles.typeChip,]}>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Text style={styles.typeText}>
                Step 2
              </Text>
              <Text style={styles.typeText}>
                Aadhaar Authentication
              </Text>
            </View>
          </View>

          <OtpInput />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                value={loginValue}
                onChangeText={text => {
                  let value = text.replace(/\D/g, '').slice(0, 10);;
                  setLoginValue(value);
                }}
                placeholder={'Enter Mobile Number'}
                maxLength={10}
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

            </View>
            <Text style={{ marginVertical: 8 }}>
              • This mobile number will be used for all the communications related to ABHA.
            </Text>


          </View>


        </>;

      case 3:
        return <>
          <View style={[styles.typeChip,]}>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Text style={styles.typeText}>
                Step 3
              </Text>
              <Text style={styles.typeText}>
                Communication Details
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                value={loginValue}
                onChangeText={text => {
                  let value = text.replace(/\D/g, '').slice(0, 10);;
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

            </View>
            <Text style={{ marginVertical: 8 }}>
              • The Mobile number you have provided will be used for all the communications related to ABHA.
            </Text>


          </View>

          <TouchableOpacity

            style={[[
              styles.continueBtn,
              {
                marginHorizontal: 24
              }
            ]]}

          >
            <Text style={styles.continueText}>
              Verify
            </Text>
          </TouchableOpacity>

          <View style={{
            alignContent: 'flex-end',
            alignItems: 'flex-end',
            marginVertical: 8, marginHorizontal: 24
          }}>
            <Text style={{
              color: '#D96A27',
              borderBottomWidth: 1,
              borderBottomColor: '#D96A27',
            }}>Skip for now</Text>
          </View>
          <OtpInput />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                value={loginValue}
                onChangeText={text => {
                  let value = text.replace(/\D/g, '').slice(0, 10);;
                  setLoginValue(value);
                }}
                placeholder={"Enter Email address"}
                keyboardType="email-address"
                style={styles.input}
              />

            </View>
            <Text style={{ marginVertical: 8 }}>
              • This Email address will be used for all communications related to ABHA.
            </Text>


          </View>

          <View style={{
            alignContent: 'flex-end',
            alignItems: 'flex-end',
            marginVertical: 8, marginHorizontal: 24
          }}>
            <Text style={{
              color: '#D96A27',
              borderBottomWidth: 1,
              borderBottomColor: '#D96A27',
            }}>Skip for now</Text>
          </View>


          <TouchableOpacity

            style={[[
              styles.continueBtn,
              {
                marginHorizontal: 24
              }
            ]]}

          >
            <Text style={styles.continueText}>
              Verify
            </Text>
          </TouchableOpacity>

          <OtpInput />

        </>;

      case 4:
        return <>
          <View style={[styles.typeChip,]}>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Text style={styles.typeText}>
                Step 4
              </Text>
              <Text style={styles.typeText}>
                ABHA Address Creation
              </Text>
            </View>
          </View>
          <View style={{ marginHorizontal: 24 }}>
            <Text style={styles.cardTitle}>Create Your Unique ABHA Address</Text>
            <Text >ABHA (Ayushman Bharat Health Account) address is a unique username that allows you to share and access your health records digitally. It is similar to an email address, but it is only used for health records. </Text>
            <Text style={{ marginVertical: 8 }}>To create ABHA address, it should have Min - 8 characters, Max - 18 characters, special characters allowed - 1 dot (.) and/or 1 underscore (.).
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <View style={styles.inputContainer}>

              <TextInput
                value={loginValue}
                onChangeText={text => {
                  let value = text;
                  setLoginValue(value);
                }}
                placeholder={'Enter abha address'}
                maxLength={14}
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
                <Text style={styles.hintText}>
                  @abdm
                </Text>
              }

            </View>

          </View>

        </>;

      default:
        return null;
    }
  };

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
              <ScrollView style={{ flex: 0.8, padding: 0 }}>

                {renderStep()}
              </ScrollView>
              <View style={styles.buttonContainer}>
                {
                  currentStep !== 1 ? <TouchableOpacity
                    onPress={prevStep}
                    style={styles.backButton}
                  >
                    <Text>Back</Text>
                  </TouchableOpacity> : <View style={{ width: 10 }}>
                  </View>
                }


                <TouchableOpacity
                  onPress={() => {
                    nextStep()
                  }}
                  style={styles.nextButton}
                >
                  <Text style={{ color: '#FFF' }}>
                    {currentStep === 4 ? 'Create ABHA' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


          </> : <>  <ScrollView
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
                      const payload = {
                        loginType,
                        loginValue,
                        password,
                        validationMethod,
                        otpMethod,
                        isAgreed,
                        isFromRegister,
                        isFromCreate,
                        isFromMobileRegister,
                        isFromForgotAbhaNumber,
                        isFromForgotAbhaNumberWithType,
                      };

                      console.log(
                        "Form Data =>",
                        JSON.stringify(payload, null, 2)
                      );
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
                    I hereby declare that I am voluntarily sharing my
                    Aadhaar Number and demographic information issued
                    by UIDAI with National Health Authority (NHA) for
                    the sole purpose of authentication and healthcare
                    services under ABDM.
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
                        I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.
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
                          I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.                    </Text>
                          : <Text style={styles.termsText}>
                            I, hereby declare that I am voluntarily sharing my identity information with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM (Ayushman Bharat Digital Mission) from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under.
                            I am aware that my personal identifiable information can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time.                   </Text>

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
                    I hereby declare that I am voluntarily sharing my
                    Aadhaar Number and demographic information issued
                    by UIDAI with National Health Authority (NHA) for
                    the sole purpose of authentication and healthcare
                    services under ABDM.
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
                disabled={!getIsFormValid()}
                style={[
                  styles.continueBtn,
                  !getIsFormValid() && {
                    opacity: 0.5
                  }
                ]}
                onPress={async () => {
                  try {
                    const error = validateForm();

                    if (error) {
                      showToast('error', error);
                      return;
                    }

                    if (!getIsFormValid()) {

                      showToast('error', 'Please fill all fields correctly');
                      return;
                    }
                    dispatch(showLoader());

                    const payload = {
                      loginType,
                      loginValue,
                      password,
                      validationMethod,
                      otpMethod,
                      isAgreed,
                      isFromRegister,
                      isFromCreate,
                      isFromMobileRegister,
                      isFromForgotAbhaNumber,
                      isFromForgotAbhaNumberWithType,
                    };

                    console.log(
                      "Form Data =>",
                      JSON.stringify(payload, null, 2)
                    );
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
                    await requestOtp(payloadPassed).unwrap();
                    navigation.navigate('OtpVerification', {
                      loginType,
                      mobileNumber: loginValue,
                    });
                  } catch (error) {
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


                  <Text style={styles.footerText}>
                    {
                      isFromCreate ? `Don't have an Aadhaar number?` : `Don't have an ABHA number?`
                    }
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      const payload = {
                        loginType,
                        loginValue,
                        password,
                        validationMethod,
                        otpMethod,
                        isAgreed,
                        isFromRegister,
                        isFromCreate,
                        isFromMobileRegister,
                        isFromForgotAbhaNumber,
                        isFromForgotAbhaNumberWithType,
                      };
                      console.log(
                        "Form Data ====>- ......... ====>- ",
                        JSON.stringify(payload, null, 2)
                      );
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
                        {isFromCreate ? 'Click here' : "Create Now"}
                      </Text>
                      {isFromCreate && <Text> to register via mobile</Text>}
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

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  stepItem: {
    flex: 1,
    alignItems: 'center',
  },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeCircle: {
    backgroundColor: '#4F6EDB',
  },

  stepNumber: {
    color: '#999',
    fontWeight: '600',
  },

  activeNumber: {
    color: '#FFF',
  },

  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },

  activeLabel: {
    color: '#000',
    fontWeight: '600',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 24
  },

  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
  },

  nextButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#D96A27',
    borderRadius: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  captchaInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginHorizontal: 12,
  },
  captchaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',

  },

  captchaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },

  captchaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  captchaBox: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  captchaText: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1,
  },

  answerInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  iconButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 10,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 8
  },
  back: {
    fontSize: 28,
    color: '#173D8F',
  },
  hero: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  welcome: {
    fontSize: 30,
    fontWeight: '700',
    color: '#173D8F',
  },
  subtitle: {
    color: '#666',
  },
  typeChip: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#173D8F',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  typeText: {
    color: '#fff',
    fontWeight: '600',
  },
  forgotText: {
    color: '#D96A27',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#D96A27',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D96A27',
  },
  radioText: {
    marginLeft: 12,
    fontSize: 16,
  },
  bottomBar: {
    backgroundColor: '#fff',
    padding: 16,
  },
  continueBtn: {
    height: 46,
    backgroundColor: '#D96A27',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  faceAuthCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },

  faceEmoji: {
    fontSize: 42,
  },

  faceText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#173D8F',
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: '#555',
    fontSize: 10,
  },

  createNow: {
    marginLeft: 6,
    color: '#D96A27',
    fontSize: 10,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  hintText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 8,
  },
  termsContainer: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12
  },

  termsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },

  termsCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },

  termsText: {
    padding: 18,
    fontSize: 14,
    lineHeight: 24,
    color: '#555',
  },

  termsFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#173D8F',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#173D8F',
  },

  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  agreeText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  speakerIcon: {
    fontSize: 22,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },

  eyeIcon: {
    fontSize: 20,
  },
});