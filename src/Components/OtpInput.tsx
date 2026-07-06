import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  Animated,
} from 'react-native';

const OtpInput = ({
  title,
  subTitle,
  setOpt,
  handleOTPReSendCalled
}: any) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] =
    useState(60);

  const inputRef =
    useRef<TextInput>(null);

  const blinkAnim =
    useRef(
      new Animated.Value(1),
    ).current;

  useEffect(() => {
    const keyboardShow =
      Keyboard.addListener(
        'keyboardDidShow',
        () => {
          console.log(
            'Keyboard Open',
          );
        },
      );

    const keyboardHide =
      Keyboard.addListener(
        'keyboardDidHide',
        () => {
          console.log(
            'Keyboard Close',
          );
        },
      );

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

    return () =>
      clearTimeout(timeout);
  }, []);

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

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval =
      setInterval(() => {
        setTimer(
          prev => prev - 1,
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [timer]);

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
    setOpt?.(value);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={{
          marginHorizontal: 24,
        }}
      >
        <Text style={styles.title}>
          {title}
        </Text>

        <Text
          style={styles.subtitle}
        >
          {subTitle}
        </Text>
      </View>

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

      {/* OTP BOXES */}

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
                        '#251d50',
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

      {/* TIMER */}

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
          disabled={timer > 0}
          onPress={() =>{
            handleResend()
            handleOTPReSendCalled()
          }
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
  );
};

export default OtpInput;

const styles =
  StyleSheet.create({
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#173D8F',
      marginTop: 25,
    },

    subtitle: {
      fontSize: 15,
      color: '#666',
      marginTop: 10,
    },

    hiddenInput: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1,
    },

    otpContainer: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      marginTop: 14,
      marginHorizontal: 25,
    },

    otpBox: {
      width: 50,
      height: 60,
      borderRadius: 8,
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

    cursor: {
      width: 2,
      height: 28,
      backgroundColor:
        '#173D8F',
      borderRadius: 2,
    },

    timerContainer: {
      marginTop: 12,
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
      color: '#251d50',
    },
  });