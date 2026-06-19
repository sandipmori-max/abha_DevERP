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
} from 'react-native';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';


const OtpInput = () => {


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
    
      const handleResend = () => {
        setTimer(60);
    
        // Resend OTP API Call
      };
    
      const handleVerify = () => {
        if (otp.length !== 6) {
          return;
        }
    
        console.log('OTP:', otp);
    
        // Verify OTP API
      };
    

  return (
     <ScrollView
             keyboardShouldPersistTaps="handled"
             contentContainerStyle={{
               paddingBottom: 14,
             }}
             showsVerticalScrollIndicator={
               false
             }
           >
             {/* Illustration */}
   
             {/* <View style={styles.iconWrap}>
               <Text style={styles.lockIcon}>
                 🔐
               </Text>
             </View> */}
   
             {/* Title */}
   
           <View style={{marginHorizontal: 24}}>
              <Text style={styles.title}>
               Verify Your Identity
             </Text>
   
             <Text
               style={styles.subtitle}
             >
               OTP sent to mobile number
             </Text>
   
             <Text
               style={styles.mobile}
             >
               {maskNumber(
                 '8796543210',
               )}
             </Text>
   
           </View>
             
   
             {/* Hidden Input */}
   
             <TextInput
               ref={inputRef}
               value={otp}
               onChangeText={text => {
                 const numeric =
                   text.replace(
                     /[^0-9]/g,
                     '',
                   );
   
                 if (
                   numeric.length <= 6
                 ) {
                   setOtp(numeric);
                 }
               }}
               keyboardType="number-pad"
               maxLength={6}
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
                   index => (
                     <View
                       key={index}
                       style={
                         styles.otpBox
                       }
                     >
                       <Text
                         style={
                           styles.otpText
                         }
                       >
                         {otp[index] ||
                           ''}
                       </Text>
                     </View>
                   ),
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
  )
}

export default OtpInput

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F7F8FC',
    },

    header: {
      height: 65,
      backgroundColor:
        '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor:
        '#ECECEC',
    },

    backButton: {
      width: 40,
      justifyContent:
        'center',
    },

    backIcon: {
      fontSize: 30,
      color: '#173D8F',
      fontWeight: '700',
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

    mobile: {
      fontSize: 18,
      fontWeight: '700', 
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
      position: 'absolute',
      opacity: 0,
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