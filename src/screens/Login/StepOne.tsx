import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { styles } from './style';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const StepOne = ({
    captcha,
    captchaValue,
    stepOne,
    setStepOne,
    loginType,
    validationMethod,
    setLoginValue,
    refreshCaptcha,
    setCaptchaValue,
    setValidationMethod }: any) => {

    const [showAadhaar, setShowAadhaar] = useState(false);
    const input1Ref = useRef<TextInput>(null);
    const input2Ref = useRef<TextInput>(null);
    const input3Ref = useRef<TextInput>(null);
    const [focusedInput, setFocusedInput] = useState<
        "part1" | "part2" | "part3" | null
    >(null);

    const getBorderColor = (key: "part1" | "part2" | "part3") => {
        if (errors[key]) {
            return "#EF4444"; // Red
        }

        if (aadhaar[key].length === 4) {
            return "#22C55E"; // Green
        }

        if (focusedInput === key) {
            return "#2563EB"; // Blue
        }

        return "#D1D5DB"; // Gray
    };

    const [errors, setErrors] = useState({
        part1: false,
        part2: false,
        part3: false,
    });

    const [aadhaar, setAadhaar] = useState({
        part1: "",
        part2: "",
        part3: "",
    });

    const updateAadhaar = (
        part1: string,
        part2: string,
        part3: string,
    ) => {
        const aadhaarNumber = part1 + part2 + part3;

        setStepOne(prev => ({
            ...prev,
            aadhaarNumber,
        }));
    };

    return (
        <>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>
                    Enter Aadhaar number <Text style={{ color: 'red' }}>*</Text>
                </Text>
                <View style={styles.aadhaarContainer}>
                    <TextInput
                        ref={input1Ref}
                        style={[
                            styles.box,
                            {
                                borderColor: getBorderColor("part1"),
                            },
                        ]}
                        selection={aadhaar.part1.length === 0 ? { start: 0, end: 0 } : undefined}
                        onFocus={() => setFocusedInput("part1")}

                        keyboardType="number-pad"
                        placeholder='0000'
                        textAlign="center"
                         placeholderTextColor="#999999"
                        contextMenuHidden
                        caretHidden={false}
                        maxLength={4}
                        value={aadhaar.part1}
                        secureTextEntry={!showAadhaar}
                        onChangeText={(text) => {
                            const value = text.replace(/\D/g, "");
                            setAadhaar(prev => {
                                const updated = { ...prev, part1: value };
                                updateAadhaar(
                                    updated.part1,
                                    updated.part2,
                                    updated.part3,
                                );
                                return updated;
                            });

                            if (value.length === 4) {
                                input2Ref.current?.focus();
                            }
                        }}
                        onBlur={() => {
                            setFocusedInput(null);

                            setErrors(prev => ({
                                ...prev,
                                part1: aadhaar.part1.length > 0 && aadhaar.part1.length < 4,
                            }));
                        }}
                    />
                    <View style={{
                        height: 1,
                        width: 4,
                        backgroundColor: '#ccc',
                        marginHorizontal: 4
                    }}></View>
                    <TextInput
                        ref={input2Ref}
                        style={[
                            styles.box,
                            {
                                borderColor: getBorderColor("part2"),
                            },
                        ]}
                        onFocus={() => setFocusedInput("part2")}
                        onBlur={() => {
                            setFocusedInput(null);

                            setErrors(prev => ({
                                ...prev,
                                part2: aadhaar.part2.length > 0 && aadhaar.part2.length < 4,
                            }));
                        }}
                        keyboardType="number-pad"
                        placeholder='0000'
                         placeholderTextColor="#999999"
                        maxLength={4}
                        textAlign="center"
                        contextMenuHidden
                        caretHidden={false}
                        selection={aadhaar.part2.length === 0 ? { start: 0, end: 0 } : undefined}
                        value={aadhaar.part2}
                        onKeyPress={({ nativeEvent }) => {
                            if (
                                nativeEvent.key === "Backspace" &&
                                aadhaar.part2.length === 0
                            ) {
                                input1Ref.current?.focus();
                            }
                        }}
                        secureTextEntry={!showAadhaar}
                        onChangeText={(text) => {
                            const value = text.replace(/\D/g, "");
                            setAadhaar(prev => {
                                const updated = { ...prev, part2: value };
                                updateAadhaar(
                                    updated.part1,
                                    updated.part2,
                                    updated.part3,
                                );

                                return updated;
                            });
                            if (value.length === 4) {
                                input3Ref.current?.focus();
                            }
                        }}
                    />
                    <View style={{
                        height: 1,
                        width: 4,
                        backgroundColor: '#ccc',
                        marginHorizontal: 4
                    }}></View>

                    <TextInput
                        ref={input3Ref}
                        style={[
                            styles.box,
                            {
                                borderColor: getBorderColor("part3"),
                            },
                        ]}
                        textAlign="center"
                         placeholderTextColor="#999999"
                        contextMenuHidden
                        caretHidden={false}
                        onFocus={() => setFocusedInput("part3")}
                        onBlur={() => {
                            setFocusedInput(null);

                            setErrors(prev => ({
                                ...prev,
                                part3: aadhaar.part3.length > 0 && aadhaar.part3.length < 4,
                            }));
                        }}
                        keyboardType="number-pad"
                        maxLength={4}
                        placeholder='0000'
                        selection={aadhaar.part3.length === 0 ? { start: 0, end: 0 } : undefined}
                        value={aadhaar.part3}
                        onKeyPress={({ nativeEvent }) => {
                            if (
                                nativeEvent.key === "Backspace" &&
                                aadhaar.part3.length === 0
                            ) {
                                input2Ref.current?.focus();
                            }
                        }}
                        onChangeText={(text) => {
                            const value = text.replace(/\D/g, "");
                            setAadhaar(prev => {
                                const updated = { ...prev, part3: value };
                                updateAadhaar(
                                    updated.part1,
                                    updated.part2,
                                    updated.part3,
                                );
                                return updated;
                            });

                        }}
                        secureTextEntry={!showAadhaar}
                    />

                    <View style={{ padding: 4, marginHorizontal: 6 }}>
                        <TouchableOpacity
                            onPress={() => setShowAadhaar(prev => !prev)}
                        >
                            <MaterialIcons
                                name={showAadhaar ? "visibility-off" : "visibility"}
                                size={22}
                                color="#555"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                                      marginVertical: 8,
                                      flexDirection: 'row'
                
                                    }}>
                                      <MaterialIcons name='info-outline' color={'#869bea'} style={{ marginRight: 4 }} />
                                      <Text style={{
                                        color:'#869bea'
                                      }}>Please ensure that mobile number is linked with Aadhaar as it will be required for OTP authentication.</Text>
                                    </View>
            </View>
            <View style={[styles.termsContainer, { marginTop: 0 }]}>
                <Text style={styles.termsTitle}>
                    Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
                </Text>

                <View style={styles.termsCard}>
                    <View style={{ height: stepOne.termsAgree ? 30 : 220, marginVertical: 8 }}>
                        <ScrollView 
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled">
                            <Text style={styles.termsText}>
                                I, hereby declare that I am voluntarily sharing my Aadhaar number and demographic information issued by UIDAI, with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under. I authorize NHA to use my Aadhaar number for performing Aadhaar based authentication with UIDAI as per the provisions of the Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of “Yes” with NHA upon successful authentication. I have been duly informed about the option of using other IDs apart from Aadhaar; however, I consciously choose to use Aadhaar number for the purpose of availing benefits across the NDHE. I am aware that my personal identifiable information excluding Aadhaar number / VID number can be used and shared for purposes as mentioned above. I reserve the right to revoke the given consent at any point of time as per provisions of Aadhaar Act and Regulations.
                            </Text>
                        </ScrollView>
                    </View>
                    <View style={styles.termsFooter}>
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => {
                                setStepOne({
                                    ...stepOne,
                                    termsAgree: !stepOne.termsAgree,
                                });
                            }}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    stepOne.termsAgree && styles.checkboxActive,
                                ]}
                            >
                                {stepOne.termsAgree && (
                                    <Text style={styles.checkmark}>
                                        ✓
                                    </Text>
                                )}
                            </View>

                            <Text style={styles.agreeText}>
                                I agree
                            </Text>
                        </TouchableOpacity>


                    </View>
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
                         placeholderTextColor="#999999"
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
    )
}

export default StepOne

