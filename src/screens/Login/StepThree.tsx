import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from './style';
import { showToast } from '../../utils/toast';
import { encryptData } from '../../utils/encrypt';
import { getEnrollmentPayload } from '../../redux/api/enrollmentApi';
import OtpInput from '../../Components/OtpInput';
import { isStrictIndianMobile, isValidEmail } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const StepThree = ({
  requestEmailVerificationLink,
  enrolSuggestion,
  setAbhaSuggestionList,
  setCurrentStep,
  stepThree,
  setStepThree,
  loginType,
  publicKey,
  txnId, enrollmentRequestOtp, getEmailVerificationLinkPayload,
  setValidationErrors,
  setShowValidationSheet,
mobileNumer }: any) => {
  const dispatch = useDispatch()

  return (
    <>
      {
        !stepThree.stepThreeMobileVerifyed ? <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                value={mobileNumer}
                onChangeText={text => {
                  let value = text.replace(/\D/g, '').slice(0, 10);;
                  setStepThree({
                    ...stepThree,
                    stepThreeMobile: value,
                  });
                }}
                 placeholderTextColor="#999999"
                placeholder={'Enter Mobile Number'}
                maxLength={10} 
                style={styles.input}
                editable={false}
              />
            </View>
            <Text style={{ marginVertical: 8 }}>
              • The Mobile number you have provided will be used for all the communications related to ABHA.
            </Text>
          </View>

          <View style={{
            alignContent: 'flex-end',
            alignItems: 'flex-end',
            marginBottom: 18, marginHorizontal: 24
          }}>
            <TouchableOpacity onPress={async () => {
              
              try {
                dispatch(showLoader());
                const encryptedValue =
                  encryptData(
                    mobileNumer,
                    publicKey
                  );

                const payload =
                  getEnrollmentPayload(
                    "Mobile Number",
                    encryptedValue,
                    txnId
                  );

                const result =
                  await enrollmentRequestOtp(
                    payload
                  ).unwrap();

                console.log(
                  "Mobile OTP Response =>",
                  result
                );

                setStepThree({
                  ...stepThree,
                  stepThreeMobileVerifyed: true,
                  mobileTitle: result?.message
                });
              } catch (error) {
                dispatch(hideLoader());
              } finally {
                dispatch(hideLoader());
              }

            }}>
              <Text style={{
                color: '#251d50',
                borderBottomWidth: 1,
                borderBottomColor: '#251d50',
              }}>Verify</Text>
            </TouchableOpacity>

          </View>
        </> : <>
          {
            !stepThree.stepThreeMobileAuthDone ? <>
              <OtpInput
                setOpt={(e) => {
                  setStepThree({
                    ...stepThree,
                    stepThreeMobileOTP: e,
                  });
                }}
                title='Confirm OTP'
                subTitle={stepThree.mobileTitle}
                handleOTPReSendCalled={async () => {
                  console.log("handleOTPReSendCalled")
                  try {
                    dispatch(showLoader());
                    const encryptedValue =
                      encryptData(
                        mobileNumer,
                        publicKey
                      );

                    const payload =
                      getEnrollmentPayload(
                        "Mobile Number",
                        encryptedValue,
                        txnId
                      );

                    const result =
                      await enrollmentRequestOtp(
                        payload
                      ).unwrap();

                    console.log(
                      "Mobile OTP Response =>",
                      result
                    );
                  } catch (error) {
                    dispatch(hideLoader());
                  } finally {
                    dispatch(hideLoader());
                  }

                }}
              />
            </> : <>

              {
                stepThree.stepThreeEmailOPTVerify ? <>
                  <OtpInput
                    setOpt={(e) => {
                      setStepThree({
                        ...stepThree,
                        stepThreeEmailOTP: e,
                      });
                    }}
                    title='Confirm OTP'
                    subTitle='OTP sent to Aadhaar mobile number ending with ******s8@gmail.com'
                    handleOTPReSendCalled={async () => {
                      try {
                        dispatch(showLoader())
                        const encryptedEmail =
                          encryptData(
                            stepThree.stepThreeEmail,
                            publicKey
                          );

                        const payload =
                          getEmailVerificationLinkPayload(
                            encryptedEmail
                          );

                        const result =
                          await requestEmailVerificationLink(
                            payload
                          ).unwrap();

                        console.log(
                          "EMAIL LINK RESULT =>",
                          result
                        );
                      } catch (error) {
                        dispatch(hideLoader())
                      }

                    }} />

                </> : <>

                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                      Email address
                    </Text>

                    <View style={styles.inputContainer}>
                      <TextInput
                        value={stepThree.stepThreeEmail}
                        onChangeText={text => {
                          let value = text;
                          setStepThree({
                            ...stepThree,
                            stepThreeEmail: value,
                          });
                        }}
                         placeholderTextColor="#999999"
                        placeholder={"Enter Email address"}
                        keyboardType="email-address"
                        style={styles.input}
                        onBlur={() => {
                           if (!isValidEmail(stepThree.stepThreeEmail)) { 
                          setValidationErrors(['Please enter a valid email address.'])
                          setShowValidationSheet(true)
                          return;
                        }
                        }}
                      />

                    </View> 
                    <View style={{
                                          marginVertical: 4,
                                          flexDirection: 'row'
                    
                                        }}>
                                          <MaterialIcons name='info-outline' color={'#869bea'} style={{ marginRight: 4 }} />
                                          <Text style={{
                                            color:'#869bea'
                                          }}>This Email address will be used for all communications related to ABHA.</Text>
                                        </View>
                  </View>

                  <View style={{
                    alignContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginVertical: 8, marginHorizontal: 24
                  }}>
                    <TouchableOpacity
                      onPress={async () => {
                        if (stepThree.stepThreeEmail.length === 0) { 
                          setValidationErrors(['Please enter your email address.'])
                          setShowValidationSheet(true)
                          return;
                        }
                        if (!isValidEmail(stepThree.stepThreeEmail)) { 
                          setValidationErrors(['Please enter a valid email address.'])
                          setShowValidationSheet(true)
                          return;
                        }
                        try {
                          dispatch(showLoader())
                          const encryptedEmail =
                            encryptData(
                              stepThree.stepThreeEmail,
                              publicKey
                            );

                          const payload =
                            getEmailVerificationLinkPayload(
                              encryptedEmail
                            );

                          const result =
                            await requestEmailVerificationLink(
                              payload
                            ).unwrap();

                          console.log(
                            "EMAIL LINK RESULT =>",
                            result
                          );
                          const response =
                            await enrolSuggestion({
                              txnId,
                            }).unwrap();
                          setAbhaSuggestionList(response.abhaAddressList)
                        } catch (error) {
                          dispatch(hideLoader())
                        } finally {
                           dispatch(hideLoader());
                        }
                        setCurrentStep(4)
                      }}
                    >
                      <Text style={{
                        color: '#251d50',
                        borderBottomWidth: 1,
                        borderBottomColor: '#251d50',
                      }}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
            </>
          }
        </>
      }
    </>
  )
}

export default StepThree

