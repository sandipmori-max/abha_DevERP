import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Animated,
} from 'react-native';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { getLoginVerifyPayload, useLoginVerifyMutation } from '../../redux/api/loginVerifyApi';
import { useDispatch, useSelector } from 'react-redux';
import { encryptData } from '../../utils/encrypt';
import { getPayload, useRequestOtpMutation } from '../../redux/api/loginApi';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import { showToast } from '../../utils/toast';
import { getLoginVerifyUserPayload, useLoginVerifyUserMutation } from '../../redux/api/loginVerifyUserApi';
import { useLazyProfileAccountQuery } from '../../redux/api/profileAccountApi';
import { setActiveUser } from '../../redux/slices/abhaSlice';

const OtpVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch()

  const route = useRoute<any>();
  const publicKey = useSelector(
    (state: any) => state.auth.publicKey
  );

  const txnId = useSelector(
    (state: any) => state.abha.txnId
  );
  const [loginVerify, { isLoading }] =
    useLoginVerifyMutation();
  const [requestOtp] = useRequestOtpMutation
    ();
  const [
    loginVerifyUser,
  ] = useLoginVerifyUserMutation();

  const [getProfileAccount,] = useLazyProfileAccountQuery();

  const {
    loginType = '',
    loginValue = '',
    validationMethod = '',
    result
  } = route.params || {};

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const maskNumber = (number: string) => {
    if (!number) {
      return '******0000';
    }

    return `******${number.slice(-4)}`;
  };

  const handleResend = async () => {

    try {
      dispatch(showLoader());
      setTimer(60);
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
      showToast(
        "success",
        result?.message || "OTP sent successfully"
      );
      const payload =
        getLoginVerifyUserPayload(
          result?.accounts[0]?.ABHANumber,
          result?.txnId
        );

      const response =
        await loginVerifyUser(
          payload
        ).unwrap();

      console.log(response);

      const responseProfile =
        await getProfileAccount();
      console.log('responseProfile ', responseProfile);
      dispatch(setActiveUser(responseProfile?.data));
      // navigation.replace("Main");

    } catch (e) {
      console.log("Error in resend otp", e)
      dispatch(hideLoader());
    } finally {
      dispatch(hideLoader());
    }


  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      showToast(
        "error",
        "Please enter a valid 6-digit OTP"
      );
      return;
    }
    try {
      dispatch(showLoader());
      console.log('OTP:', otp);
      const encryptedValue =
        encryptData(
          otp,
          publicKey,
        );

      const payload =
        getLoginVerifyPayload(
          loginType,
          txnId,
          encryptedValue
        );

      console.log("payload + ++ + + ++ + ", payload)

      const response =
        await loginVerify(payload).unwrap();

      console.log("response + + ++ + + + + ++ ", response)
      if (response?.authResult === 'success') {
        showToast(
          "success",
          response?.message || "Verification successful"
        );

        const payload =
          getLoginVerifyUserPayload(
            response?.accounts[0]?.ABHANumber,
            response?.txnId
          );

        const response1 =
          await loginVerifyUser(
            payload
          ).unwrap();

        console.log('response1+++++++++++++', response1);

        const responseProfile =
          await getProfileAccount();
        console.log('responseProfile ', responseProfile?.data);
         dispatch(setActiveUser(responseProfile?.data))
        // navigation.replace("Main");

        // navigation.navigate('Home');
      } else {
        showToast(
          "error",
          response?.message || "Invalid OTP"
        );
      }
    }
    catch (e) {
      console.log("Error in handleVerify", e)
      dispatch(hideLoader());
    } finally {
      dispatch(hideLoader());
    }

  };
  const blinkAnim =
    useRef(
      new Animated.Value(1),
    ).current;

  useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('Keyboard Open');
      },
    );

    const hideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('Keyboard Close');
      },
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  const handleChangeOtp = (
    text: string,
  ) => {
    const numeric =
      text.replace(
        /[^0-9]/g,
        '',
      );

    const value =
      numeric.slice(0, 6);

    setOtp(value);
  };

  useEffect(() => {
    if (otp.length >= 6) {
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(
          blinkAnim,
          {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          },
        ),
        Animated.timing(
          blinkAnim,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          },
        ),
      ]),
    ).start();
  }, [otp.length]);
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
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={styles.backButton}
          >
            <MaterialIcons
              name="arrow-back"
              style={styles.backIcon}
              size={20}
              color="#173D8F"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            OTP Verification
          </Text>

          <View
            style={{ width: 40 }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: 30,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Illustration */}

          <View style={styles.iconWrap}>
            <Text style={styles.lockIcon}>
              🔐
            </Text>
          </View>

          {/* Title */}

          <Text style={styles.title}>
            Verify Your Identity
          </Text>

          <Text
            style={styles.subtitle}
          >
            {result?.message || 'Please enter the OTP sent to your registered mobile number.'}
          </Text>





          {/* Hidden Input */}

          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={
              handleChangeOtp
            }
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            caretHidden
            contextMenuHidden={
              false
            }
            style={
              styles.hiddenInput
            }
          />

          {/* OTP Boxes */}

          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              inputRef.current?.focus()
            }
          >
            <View
              style={
                styles.otpContainer
              }
            >
              {[0, 1, 2, 3, 4, 5].map(
                index => {
                  const isActive =
                    otp.length ===
                    index;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.otpBox,
                        isActive && {
                          borderColor:
                            '#D96A27',
                        },
                      ]}
                    >
                      {otp[index] ? (
                        <Text
                          style={
                            styles.otpText
                          }
                        >
                          {
                            otp[
                            index
                            ]
                          }
                        </Text>
                      ) : isActive &&
                        otp.length <
                        6 ? (
                        <Animated.View
                          style={[
                            styles.cursor,
                            {
                              opacity:
                                blinkAnim,
                            },
                          ]}
                        />
                      ) : null}
                    </View>
                  );
                },
              )}
            </View>
          </TouchableOpacity>

          {/* Timer */}

          <View
            style={
              styles.timerContainer
            }
          >
            <Text
              style={
                styles.timerText
              }
            >
              Resend in:{' '}
              {timer}s
            </Text>

            <TouchableOpacity
              disabled={
                timer > 0
              }
              onPress={
                handleResend
              }
            >
              <Text
                style={[
                  styles.resendText,
                  timer > 0 && {
                    opacity: 0.4,
                  },
                ]}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Button */}

        <View
          style={
            styles.bottomBar
          }
        >
          <TouchableOpacity
            disabled={
              otp.length !== 6
            }
            onPress={
              handleVerify
            }
            style={[
              styles.verifyBtn,
              otp.length !== 6 && {
                opacity: 0.5,
              },
            ]}
          >
            <Text
              style={
                styles.verifyText
              }
            >
              Verify OTP
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F7F8FC',
    },

    cursor: {
      width: 2,
      height: 28,
      backgroundColor:
        '#173D8F',
      borderRadius: 2,
    },
    header: {
      height: 65,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      paddingHorizontal: 15,
    },

    backButton: {
      width: 40,
      justifyContent:
        'center',
    },

    backIcon: {
      color: '#173D8F',
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#173D8F',
    },

    iconWrap: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor:
        '#E9EEFF',
      alignSelf: 'center',
      justifyContent:
        'center',
      alignItems: 'center',
      marginTop: 20,
    },

    lockIcon: {
      fontSize: 50,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#173D8F',
      textAlign: 'center',
      marginTop: 25,
    },

    subtitle: {
      fontSize: 15,
      color: '#666',
      textAlign: 'center',
      marginTop: 10,
    },

    mobile: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 6,
      color: '#222',
    },

    typeChip: {
      alignSelf: 'center',
      marginTop: 18,
      backgroundColor:
        '#173D8F',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    typeText: {
      color: '#FFF',
      fontWeight: '600',
    },

    hiddenInput: {
      width: 1,
      height: 1,
    },

    otpContainer: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      marginTop: 40,
      marginHorizontal: 25,
    },

    otpBox: {
      width: 50,
      height: 60,
      borderRadius: 6,
      backgroundColor:
        '#FFF',
      borderWidth: 2,
      borderColor: '#173D8F',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    otpText: {
      fontSize: 24,
      fontWeight: '700',
      color: '#222',
    },

    timerContainer: {
      marginTop: 30,
      paddingHorizontal: 25,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    timerText: {
      fontSize: 15,
      color: '#666',
    },

    resendText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#D96A27',
    },

    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      borderTopWidth: 1,
      borderTopColor:
        '#ECECEC',
    },

    verifyBtn: {
      height: 48,
      borderRadius: 8,
      backgroundColor:
        '#D96A27',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    verifyText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '700',
    },
  });