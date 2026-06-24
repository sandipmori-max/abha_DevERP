import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OtpInput from '../../Components/OtpInput';
import { styles } from './style';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const DLStepOne = ({
  refreshCaptcha,
  handleOTPVerify,
  stepOneDL,
  setStepOneDL,
  loginType,
  captcha,
  captchaValue,
  setCaptchaValue }: any) => {
  return (
    <>
      {
        stepOneDL.stepOneDLMobileVerifying ?
          <>
            <OtpInput
              setOpt={(e) => {
                setStepOneDL({
                  ...stepOneDL,
                  stepOneDLOTP: e,
                });
              }}
              title='Confirm OTP'
              subTitle={stepOneDL.stepOneDLTitle} />
            <View style={{
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              marginBottom: 18, marginHorizontal: 24
            }}>
              <TouchableOpacity onPress={handleOTPVerify}>
                <Text style={{
                  color: '#D96A27',
                  borderBottomWidth: 1,
                  borderBottomColor: '#D96A27',
                }}>Verify</Text>
              </TouchableOpacity>
            </View>
          </>
          : <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Enter Details <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.prefix}>+91</Text>
                <TextInput
                  value={stepOneDL.stepOneDLMobileNumber}
                  onChangeText={text => {
                    let value = text.replace(/\D/g, '').slice(0, 10);;
                    setStepOneDL({
                      ...stepOneDL,
                      stepOneDLMobileNumber: value,
                    });
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
          </>
      }
    </>
  )
}

export default DLStepOne

