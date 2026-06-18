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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { encryptData } from '../../utils/encrypt';
import { useDispatch, useSelector } from 'react-redux';
import { getPayload, useRequestOtpMutation } from '../../redux/api/loginApi';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import { showToast } from '../../utils/toast';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch()

  const loginType =
    route?.params?.loginType || 'Mobile Number';
  const publicKey = useSelector(
    (state: any) => state.auth.publicKey
  );
  const isFromRegister = route?.params?.isFromRegister || false
  const isFromCreate = route?.params?.isFromCreate || false
  const isFromMobileRegister = route?.params?.isFromMobileRegister || false
  const isFromForgotAbhaNumber = route?.params?.isFromForgotAbhaNumber || false
  const isFromForgotAbhaNumberWithType = route?.params?.isFromForgotAbhaNumberWithType || false

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

    if (loginType === 'Forgot ABHA Number' && !isFromForgotAbhaNumberWithType) {
      return (
        <View style={styles.card}>

          <RadioItem
            title="Aadhaar Number"
            selected={
              validationMethod ===
              'Aadhaar Number'
            }
            onPress={() =>
              setValidationMethod(
                'Aadhaar Number',
              )
            }
          />

          <RadioItem
            title="Mobile Number"
            selected={
              validationMethod ===
              'Mobile Number'
            }
            onPress={() =>
              setValidationMethod(
                'Mobile Number',
              )
            }
          />
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

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;

    const operators = ['+', '-', '×'];
    const operator =
      operators[Math.floor(Math.random() * operators.length)];

    let answer = 0;

    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
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
          <Text style={styles.welcome}>
            {
              isFromForgotAbhaNumber ? 'Forgot ABHA Number' : `${isFromRegister ? 'Register with ABHA number' : isFromCreate ? loginType : isFromMobileRegister ? loginType : 'Welcome Back 👋'}`
            }
          </Text>
        </View>

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
              isFromForgotAbhaNumber && !isFromForgotAbhaNumber && <Text style={styles.subtitle}>
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
                Enter Details
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
                Enter Details
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


              </View>

            </View>
          }

          {loginType === 'Forgot ABHA Number' && renderValidationOptions()}

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
                Terms & Conditions
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
                Terms & Conditions
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
            !isFromForgotAbhaNumberWithType && loginType === 'Create ABHA Number' && <View style={styles.termsContainer}>
              <Text style={styles.termsTitle}>
                Terms & Conditions
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

          <View style={{ marginHorizontal: 24, marginVertical: 12 }}>
            <View>
              <Text>Captcha</Text>
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
                {/* <MaterialIcons
                name="refresh"
                size={28}
                color="#1E40AF"
              /> */}
                <View style={{ height: 40, width: 40, backgroundColor: 'red' }} />
              </TouchableOpacity>
            </View>
          </View>


        </ScrollView>



        <View style={styles.bottomBar}>
          <TouchableOpacity
            // disabled={
            //   loginType === 'Aadhaar Number'
            //     ? (!isAgreed || loginValue.length !== 12)
            //     : loginType === 'Mobile Number'
            //       ? loginValue.length !== 10
            //       : false
            // }
            style={[
              styles.continueBtn,
              // (
              //   (loginType === 'Aadhaar Number' &&
              //     (!isAgreed || loginValue.length !== 12)) ||
              //   (loginType === 'Mobile Number' &&
              //     loginValue.length !== 10)
              // ) && {
              //   opacity: 0.5,
              // },
            ]}
            onPress={async () => {
              try {
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
                setValidationMethod('')
                const encryptedValue =
                  encryptData(
                    loginValue,
                    publicKey,
                  );
                const payloadPassed = getPayload(
                  loginType,
                  encryptedValue,
                  "",
                );
                await requestOtp(payloadPassed).unwrap();

                if (isFromForgotAbhaNumber) {
                  setTimeout(() => {
                    navigation.navigate("Login", {
                      loginType: validationMethod,
                      isFromRegister: false,
                      isFromCreate: false,
                      isFromMobileRegister: false,
                      isFromForgotAbhaNumber: true,
                      isFromForgotAbhaNumberWithType: true
                    })
                  })
                } else {
                  navigation.navigate('OtpVerification', {
                    loginType,
                    mobileNumber: loginValue,
                  });
                }
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    padding: 20,
  },
  back: {
    fontSize: 28,
    color: '#173D8F',
  },
  hero: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 30,
    fontWeight: '700',
    color: '#173D8F',
  },
  subtitle: {
    marginTop: 8,
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
    borderRadius: 12,
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
    marginVertical: 12,
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