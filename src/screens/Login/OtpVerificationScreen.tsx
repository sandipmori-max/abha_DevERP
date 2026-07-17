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
import { useSavePageMutation } from '../../redux/api/savePageApi';
import { useLazyProfileQrCodeQuery } from '../../redux/api/qrCodeApi';
import { useLazyProfileAbhaCardQuery } from '../../redux/api/abhaCardApi';
import { useAbhaAddressRequestOtpMutation } from '../../redux/api/abhaAddressLoginApi';
import { useAbhaAddressVerifyOtpMutation } from '../../redux/api/abhaAddressVerifyApi';
import { useLazyAbhaProfileQuery } from '../../redux/api/profileByTokenApi';

const OtpVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch()

  const [savePage] =
    useSavePageMutation();

  const [getQrCode] =
    useLazyProfileQrCodeQuery();

  const [getAbhaCard] =
    useLazyProfileAbhaCardQuery();
  const [
    abhaAddressRequestOtp
  ] = useAbhaAddressRequestOtpMutation();

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
  const [
    getAbhaProfile,
  ] = useLazyAbhaProfileQuery();
  const activeUser = useSelector(
    (state: any) => state.abha.activeUser
  );
  const {
    loginType = '',
    loginValue = '',
    validationMethod = '',
    result,
    payload,
    otpMethod
  } = route?.params || {};

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const [
    verifyAbhaOtp
  ] = useAbhaAddressVerifyOtpMutation();

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


  const handleResend = async () => {
    if (resendCount >= 2) {
      return;
    }

    setResendCount(prev => prev + 1);
    if (loginType === 'ABHA Address') {
      try {
        const result = await abhaAddressRequestOtp(payload).unwrap();

        console.log("result+++++++++++++++", result)
        showToast(
          "success",
          result?.message || "OTP sent successfully"
        );

        if (otpMethod === 'Aadhaar OTP') {
          const encryptedOtp =
            encryptData(
              loginValue,
              publicKey,
            );
          const res = await verifyAbhaOtp({
            scope: [
              "abha-address-login",
              "aadhaar-verify"
            ],
            authData: {
              authMethods: [
                "otp"
              ],
              otp: {
                txnId: txnId,
                otpValue:
                  encryptedOtp
              }
            }
          }).unwrap();

          console.log("resssssss", res)
        } else if (otpMethod === 'Mobile OTP') {
          const encryptedOtp =
            encryptData(
              loginValue,
              publicKey,
            );
          const res = await verifyAbhaOtp({
            scope: [
              "abha-address-login",
              "mobile-verify"
            ],
            authData: {
              authMethods: [
                "otp"
              ],
              otp: {
                txnId: txnId,
                otpValue:
                  encryptedOtp
              }
            }
          }).unwrap();
          console.log("resssssss + + ++ + + + ++ + + + + + + + +", res)
        }
        dispatch(hideLoader());
      } catch (error) {
        dispatch(hideLoader());
      }
      return;
    }
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

      const res =
        await getProfileAccount();
      console.log('res ', res);
      // navigation.goBack();

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

    if (loginType === 'ABHA Address') {
      try {

        if (otpMethod === 'Aadhaar OTP') {
          const encryptedOtp =
            encryptData(
              loginValue,
              publicKey,
            );
          const response = await verifyAbhaOtp({
            scope: [
              "abha-address-login",
              "aadhaar-verify"
            ],
            authData: {
              authMethods: [
                "otp"
              ],
              otp: {
                txnId: txnId,
                otpValue:
                  encryptedOtp
              }
            }
          }).unwrap();

          console.log("responseresponseresponseresponseresponse", response)

          if (response?.authResult === 'success') {
            showToast(
              "success",
              response?.message || "Verification successful"
            );

            const responseProfile: any =
              await getAbhaProfile({
                json_web_token: response?.tokens?.token,
              }).unwrap();

            const res = responseProfile;

            console.log("responseProfileresponseProfileresponseProfileresponseProfile", responseProfile)
            const payloadRow = {
              "patientabhaid": "",
              "abhanumber": res?.abhaNumber,
              "abhaname": res?.abhaAddress || res?.name,
              "aadharnumber": res?.aadharNumber,
              "firstname": res?.firstName,
              "middlename": res?.middleName,
              "lastname": res?.lastName,
              "fullname": res?.name,
              "dob": `${res?.yearOfBirth}-${res?.monthOfBirth}-${res?.dayOfBirth}`,
              "yearofbirth": res?.yearOfBirth,
              "monthofbirth": res?.monthOfBirth,
              "dayofbirth": res?.dayOfBirth,
              "gender": res?.gender,
              "mobileno": res?.mobile,
              "address": res?.address,
              "statename": res?.stateName,
              "statecode": res?.stateCode,
              "districtname": res?.districtName,
              "districtcode": res?.districtCode,
              "subdistrictname": res?.subdistrictName,
              "pincode": res?.pincode,
              "preferredabhaaddress": res?.preferredAbhaAddress,
              "photo": res?.photo,
              "profilephoto": `profilephoto.jpeg;data:image/jpeg;base64,${res?.profilePhoto}`,
              "kycphoto": `kycphoto.jpeg;data:image/jpeg;base64,${res?.kycphoto}`,
              "localizedname": res?.localizedDetails?.name,
              "localizedgender": res?.localizedDetails?.gender,
              "localizedtownname": res?.localizedDetails?.townName,
              "localizeddistrictname": res?.localizedDetails?.districtName,
              "localizedvillagename": res?.localizedDetails?.villageName,
              "localizedstatename": res?.localizedDetails?.stateName,
              "phraddress": res?.phraddress,
              "authmethods": res?.authMethods?.join(","),
              "tags": res?.tags,
              "localizedlabels": res?.localizedDetails?.localizedLabels,
              "registrationsource": "",
              "profilestatus": res?.profileStatus,
              "abhatype": res?.abhatype,
              "abhastatus": res?.status,
              "verificationtype": res?.verificationType,
              "verificationstatus": res?.verificationStatus,
              "iskycverified": res?.kycVerified,
              "isnew": "false",
              "cdt": new Date()

            }

            const resQRCode = await getQrCode();
            const resABHACard = await getAbhaCard();

            if (payloadRow) {
              payloadRow.qrCode = `qrCode.jpeg;data:image/jpeg;base64,${resQRCode?.data?.qrCode}`;
              payloadRow.abhaCard = `abhaCard.jpeg;data:image/jpeg;base64,${resABHACard?.data?.card}`;
            }

            const payloadData = {
              token: activeUser?.token,
              page: "PatientABHAProfile",
              data: JSON.stringify(payloadRow),
            };

            console.log("payloadData-----------", payloadData)


            const resAbha = await savePage(payloadData).unwrap();
            if (resAbha?.success !== '0' || resAbha?.success !== 0) {
              showToast(
                "success",
                resAbha?.message
              );
              navigation.goBack();
            }

          } else {
            showToast(
              "error",
              response?.message || "Invalid OTP"
            );
          }

        } else if (otpMethod === 'Mobile OTP') {
          const encryptedOtp =
            encryptData(
              loginValue,
              publicKey,
            );
          const response = await verifyAbhaOtp({
            scope: [
              "abha-address-login",
              "mobile-verify"
            ],
            authData: {
              authMethods: [
                "otp"
              ],
              otp: {
                txnId: txnId,
                otpValue:
                  encryptedOtp
              }
            }
          }).unwrap();

          if (response?.authResult === 'success') {
            showToast(
              "success",
              response?.message || "Verification successful"
            );

            const responseProfile: any =
              await getAbhaProfile({
                json_web_token: response?.tokens?.token,
              }).unwrap();

            const res = responseProfile;

            const payloadRow = {
              "patientabhaid": "",
              "abhanumber": res?.abhaNumber,
              "abhaname": res?.abhaAddress || res?.name,
              "aadharnumber": res?.aadharNumber,
              "firstname": res?.firstName,
              "middlename": res?.middleName,
              "lastname": res?.lastName,
              "fullname": res?.name,
              "dob": `${res?.yearOfBirth}-${res?.monthOfBirth}-${res?.dayOfBirth}`,
              "yearofbirth": res?.yearOfBirth,
              "monthofbirth": res?.monthOfBirth,
              "dayofbirth": res?.dayOfBirth,
              "gender": res?.gender,
              "mobileno": res?.mobile,
              "address": res?.address,
              "statename": res?.stateName,
              "statecode": res?.stateCode,
              "districtname": res?.districtName,
              "districtcode": res?.districtCode,
              "subdistrictname": res?.subdistrictName,
              "pincode": res?.pincode,
              "preferredabhaaddress": res?.preferredAbhaAddress,
              "photo": res?.photo,
              "profilephoto": `profilephoto.jpeg;data:image/jpeg;base64,${res?.profilePhoto}`,
              "kycphoto": `kycphoto.jpeg;data:image/jpeg;base64,${res?.kycphoto}`,
              "localizedname": res?.localizedDetails?.name,
              "localizedgender": res?.localizedDetails?.gender,
              "localizedtownname": res?.localizedDetails?.townName,
              "localizeddistrictname": res?.localizedDetails?.districtName,
              "localizedvillagename": res?.localizedDetails?.villageName,
              "localizedstatename": res?.localizedDetails?.stateName,
              "phraddress": res?.phraddress,
              "authmethods": res?.authMethods?.join(","),
              "tags": res?.tags,
              "localizedlabels": res?.localizedDetails?.localizedLabels,
              "registrationsource": "",
              "profilestatus": res?.profileStatus,
              "abhatype": res?.abhatype,
              "abhastatus": res?.status,
              "verificationtype": res?.verificationType,
              "verificationstatus": res?.verificationStatus,
              "iskycverified": res?.kycVerified,
              "isnew": "false",
              "cdt": new Date()

            }

            const resQRCode = await getQrCode();
            const resABHACard = await getAbhaCard();

            if (payloadRow) {
              payloadRow.qrCode = `qrCode.jpeg;data:image/jpeg;base64,${resQRCode?.data?.qrCode}`;
              payloadRow.abhaCard = `abhaCard.jpeg;data:image/jpeg;base64,${resABHACard?.data?.card}`;
            }

            const payloadData = {
              token: activeUser?.token,
              page: "PatientABHAProfile",
              data: JSON.stringify(payloadRow),
            };
            const resAbha = await savePage(payloadData).unwrap();
            if (resAbha?.success !== '0' || resAbha?.success !== 0) {
              showToast(
                "success",
                resAbha?.message
              );
              navigation.goBack();
            }


          } else {
            showToast(
              "error",
              response?.message || "Invalid OTP"
            );
          }
        }
        dispatch(hideLoader());
      } catch (error) {
        dispatch(hideLoader());
      }
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

        const responseProfile: any =
          await getProfileAccount();

        const res = responseProfile?.data;

        const payloadRow = {
          "patientabhaid": "",
          "abhanumber": res?.ABHANumber,
          "abhaname": res?.abhaName || res?.name,
          "aadharnumber": res?.aadharNumber,
          "firstname": res?.firstName,
          "middlename": res?.middleName,
          "lastname": res?.lastName,
          "fullname": res?.name,
          "dob": `${res?.yearOfBirth}-${res?.monthOfBirth}-${res?.dayOfBirth}`,
          "yearofbirth": res?.yearOfBirth,
          "monthofbirth": res?.monthOfBirth,
          "dayofbirth": res?.dayOfBirth,
          "gender": res?.gender,
          "mobileno": res?.mobile,
          "address": res?.address,
          "statename": res?.stateName,
          "statecode": res?.stateCode,
          "districtname": res?.districtName,
          "districtcode": res?.districtCode,
          "subdistrictname": res?.subdistrictName,
          "pincode": res?.pincode,
          "preferredabhaaddress": res?.preferredAbhaAddress,
          "photo": res?.photo,
          "profilephoto": `profilephoto.jpeg;data:image/jpeg;base64,${res?.profilePhoto}`,
          "kycphoto": `kycphoto.jpeg;data:image/jpeg;base64,${res?.kycphoto}`,
          "localizedname": res?.localizedDetails?.name,
          "localizedgender": res?.localizedDetails?.gender,
          "localizedtownname": res?.localizedDetails?.townName,
          "localizeddistrictname": res?.localizedDetails?.districtName,
          "localizedvillagename": res?.localizedDetails?.villageName,
          "localizedstatename": res?.localizedDetails?.stateName,
          "phraddress": res?.phraddress,
          "authmethods": res?.authMethods?.join(","),
          "tags": res?.tags,
          "localizedlabels": res?.localizedDetails?.localizedLabels,
          "registrationsource": "",
          "profilestatus": res?.profileStatus,
          "abhatype": res?.abhatype,
          "abhastatus": res?.status,
          "verificationtype": res?.verificationType,
          "verificationstatus": res?.verificationStatus,
          "iskycverified": res?.kycVerified,
          "isnew": "false",
          "cdt": new Date()

        }


        console.log("payloadData", payloadData)

        const resQRCode = await getQrCode();
        const resABHACard = await getAbhaCard();

        if (payloadRow) {
          payloadRow.qrCode = `qrCode.jpeg;data:image/jpeg;base64,${resQRCode?.data?.qrCode}`;
          payloadRow.abhaCard = `abhaCard.jpeg;data:image/jpeg;base64,${resABHACard?.data?.card}`;
        }
        const payloadData = {
          token: activeUser?.token,
          page: "PatientABHAProfile",
          data: JSON.stringify(payloadRow),
        };
        const resAbha = await savePage(payloadData).unwrap();
        if (resAbha?.success !== '0' || resAbha?.success !== 0) {
          showToast(
            "success",
            resAbha?.message
          );
          navigation.goBack();
        }


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
      setTimeout(() => {
        navigation.goBack();
      }, 200)
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

        <View
        
        >
          {/* Illustration */}

          

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
             placeholderTextColor="#999999"
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
                timer > 0 ||
                resendCount >= 2
              }
              onPress={
                handleResend
              }
            >
              <Text
                style={[
                  styles.resendText,
                  (timer > 0 || resendCount >= 2) && {
                    opacity: 0.4,
                  }
                ]}
              >
                {resendCount >= 2
                  ? 'Resend limit reached'
                  : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
      color: '#251d50',
    },

    bottomBar: { 
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      top: 10,
      borderTopWidth: 1,
      borderTopColor:
        '#ECECEC',
    },

    verifyBtn: {
      height: 48,
      borderRadius: 8,
      backgroundColor:
        '#d67031',
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