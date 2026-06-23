import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { styles } from './style';
import OtpInput from '../../Components/OtpInput';

const StepTwo = ({setStepTwo, stepTwo, loginType}: any) => {
  return (
    <>
   
   <OtpInput
            setOpt={(e) => {
              setStepTwo({
                ...stepTwo,
                stepTwoOTP: e,
              });
            }}
            title='Confirm OTP'
            subTitle={stepTwo.stepTwoTitle} />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Enter Details <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                value={stepTwo.stepTwoMobileNumber}
                onChangeText={text => {
                  let value = text.replace(/\D/g, '').slice(0, 10);;
                  setStepTwo({
                    ...stepTwo,
                    stepTwoMobileNumber: value,
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
            <Text style={{ marginVertical: 8 }}>
              • This mobile number will be used for all the communications related to ABHA.
            </Text>
          </View>
           </>
  )
}

export default StepTwo
 