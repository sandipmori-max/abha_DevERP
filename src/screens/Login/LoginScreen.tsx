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

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const loginType =
    route?.params?.loginType || 'Mobile Number';

  const isFromRegister = route?.params?.isFromRegister || false
  const isFromCreate = route?.params?.isFromCreate || false
  const isFromMobileRegister = route?.params?.isFromMobileRegister || false


  console.log("isFromRegister", isFromRegister)
  console.log("isFromCreate", isFromCreate)

  console.log("isFromMobileRegister", isFromMobileRegister)

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
      case 'Aadhar Number':
        return 'Enter aadhaar number';
      case 'ABHA Address':
        return 'Enter ABHA address';
      case 'ABHA Number':
        return 'Enter ABHA number';
      case 'Create ABHA Number':
        return 'Enter ABHA number';
      case 'Register with Mobile Number':
        return 'Enter mobile number'
      default:
        return 'Enter value';
    }
  }, [loginType]);

  const maxLength = useMemo(() => {
    switch (loginType) {
      case 'Mobile Number':
        return 10;

      case 'Aadhar Number':
        return 12;

      default:
        return undefined;
    }
  }, [loginType]);

  const canContinue = useMemo(() => {
    switch (loginType) {
      case 'Mobile Number':
        return /^[6-9]\d{9}$/.test(loginValue);

      case 'Aadhar Number':
        return /^\d{12}$/.test(loginValue) && isAgreed;

      case 'ABHA Address':
        return loginValue.trim().length > 0;

      case 'ABHA Number':
        return loginValue.trim().length > 0;

      default:
        return false;
    }
  }, [loginType, loginValue, isAgreed]);

  const isValidInput = useMemo(() => {
    switch (loginType) {
      case 'Mobile Number':
        return /^[6-9]\d{9}$/.test(loginValue);

      case 'Aadhar Number':
        return /^\d{12}$/.test(loginValue);

      case 'ABHA Address':
        return loginValue.trim().length > 0;

      case 'ABHA Number':
        return loginValue.trim().length > 0;

      default:
        return false;
    }
  }, [loginType, loginValue]);

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

    if (loginType === 'Aadhar Number') {
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

    return null;
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
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 140,
          }}
        >


          <View style={styles.hero}>
            <Text style={styles.welcome}>
              {isFromRegister ? 'Register with ABHA number' : isFromCreate ? loginType : isFromMobileRegister ? loginType : 'Welcome Back 👋'}
            </Text>
            {
             !isFromMobileRegister && !isFromCreate && !isFromRegister && <Text style={styles.subtitle}>
                Sign in securely to access
                your ABHA health records
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
                   !isFromMobileRegister && !isFromCreate && <View style={styles.typeChip}>
                      <Text style={styles.typeText}>
                        {loginType}
                      </Text>
                    </View>
                  }
                </>

            }

            {
              !isFromRegister && loginType === 'ABHA Number' && <Text style={styles.forgotText}>
                Forgot ABHA number?
              </Text>
            }

          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={loginValue}
                onChangeText={text => {
                  const value =
                    loginType === 'Mobile Number' ||
                      loginType === 'Aadhar Number'
                      ? text.replace(/[^0-9]/g, '')
                      : text;

                  setLoginValue(value);
                }}
                placeholder={placeholder}
                maxLength={maxLength}
                keyboardType={
                  loginType === 'Mobile Number' ||
                    loginType === 'Aadhar Number'
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
              isFromRegister && loginType === 'ABHA Number' && <Text style={[styles.forgotText, {
                alignSelf: 'flex-end',
                marginTop: 10
              }]}>
                Forgot ABHA number?
              </Text>
            }

          </View>

          {renderValidationOptions()}

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
            loginType === 'Aadhar Number' && <View style={styles.termsContainer}>
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
            loginType === 'Create ABHA Number' && <View style={styles.termsContainer}>
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

        </ScrollView>



        <View style={styles.bottomBar}>
          <TouchableOpacity
            disabled={
              loginType === 'Aadhar Number'
                ? (!isAgreed || loginValue.length !== 12)
                : loginType === 'Mobile Number'
                  ? loginValue.length !== 10
                  : false
            }
            style={[
              styles.continueBtn,
              (
                (loginType === 'Aadhar Number' &&
                  (!isAgreed || loginValue.length !== 12)) ||
                (loginType === 'Mobile Number' &&
                  loginValue.length !== 10)
              ) && {
                opacity: 0.5,
              },
            ]}
            onPress={() => {
              navigation.navigate('OtpVerification', {
                loginType,
                mobileNumber: loginValue,
              });
            }}
          >
            <Text style={styles.continueText}>
              {isFromCreate ? "Next" : "Continue"}
            </Text>
          </TouchableOpacity>

          { 
          loginType !== 'Register with Mobile Number' &&
          <View style={styles.footer}>


              <Text style={styles.footerText}>
                {
                  isFromCreate ? `Don't have an Aadhar number?` : `Don't have an ABHA number?`
                }
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setTimeout(() => {
                    navigation.navigate("Login", {
                      loginType: isFromCreate ? 'Register with Mobile Number' :  'Create ABHA Number',
                      isFromRegister: false,
                      isFromCreate: isFromCreate ? false : true,
                      isFromMobileRegister:  true
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
    fontSize: 15,
  },

  createNow: {
    marginLeft: 6,
    color: '#D96A27',
    fontSize: 15,
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