import React, { useRef, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Keyboard,
    Alert,
} from "react-native";
import { validateCompanyCode, validatePassword, validateUsername } from "../../utils/validation";
import styles from "./styles";
import CustomInput from "../../Components/CustomInput";
import { getLinkPayload, useGetLinkMutation } from "../../redux/api/getLinkApi";
import { useDispatch } from "react-redux";
import { setActiveUser, setDevERPBaseUrl } from "../../redux/slices/abhaSlice";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { getSetAppIdPayload, useSetAppIdMutation } from "../../redux/api/setAppIdApi";
import { showToast } from "../../utils/toast";


const DrLogin = ({ navigation }: any) => {

    const dispatch = useDispatch();

    const [getLink,] =
        useGetLinkMutation();
    const [setAppId,] =
        useSetAppIdMutation();
    const usernameRef = useRef("");
    const passwordRef = useRef("");

    const [companyCode, setCompanyCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        companyCode: "",
        username: "",
        password: "",
    });

    const [touched, setTouched] = useState({
        companyCode: false,
        username: false,
        password: false,
    });

    const validateForm = () => {
        const companyError = validateCompanyCode(companyCode);
        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);

        setErrors({
            companyCode: companyError,
            username: usernameError,
            password: passwordError,
        });

        return !companyError && !usernameError && !passwordError;
    };

    const handleLogin = async () => {
        dispatch(showLoader());
        Keyboard.dismiss();

        setTouched({
            companyCode: true,
            username: true,
            password: true,
        });

        if (!validateForm()) return;

        try {
            setLoading(true);

            const response = await getLink(
                getLinkPayload(companyCode)
            ).unwrap();

            const appData = JSON.parse(response.d);
            console.log("Response =>", appData);
            console.log("URL =>", appData.link);
            let updatedLink = "";

            if (Platform.OS === "android") {
                updatedLink = appData.link.replace(/^https:/, "http:")
            } else {
                updatedLink = appData.link
            }
            dispatch(setDevERPBaseUrl(`${updatedLink}msp_api.aspx`));

            const res = await setAppId(
                getSetAppIdPayload(
                    username,
                    password,
                    "",
                    "",
                    ""
                )
            ).unwrap();

            console.log("Response =>+++++++++++++++++++", res);
            if (res?.success == 1) {
                showToast('success', 'Login successfully.');
                dispatch(setActiveUser(res))
                
            } else {
                showToast('error', res?.message || 'Something went wrong. Please try again later.');
            }
            dispatch(hideLoader());

        } catch (e) {
            dispatch(hideLoader());
        } finally {
            dispatch(hideLoader());
            setLoading(false);
        }
    };

    const isValidCompany =
        companyCode.length > 0 &&
        !validateCompanyCode(companyCode);

    const isValidUsername =
        username.length > 0 &&
        !validateUsername(username);

    const isValidPassword =
        password.length > 0 &&
        !validatePassword(password);

    const loginEnabled =
        isValidCompany &&
        isValidUsername &&
        isValidPassword &&
        !loading;

    return (
        <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scroll}
                >
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>🏥</Text>

                        <Text style={styles.title}>
                            Welcome Back
                        </Text>

                        <Text style={styles.subtitle}>
                            Login to continue
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <CustomInput
                            label="Company Code"
                            placeholder="Enter Company Code"
                            value={companyCode}
                            autoCapitalize="characters"
                            maxLength={15}
                            returnKeyType="next"
                            onChangeText={(text) => {
                                setCompanyCode(
                                    text
                                        .toUpperCase()
                                        .replace(/\s/g, "")
                                );

                                if (touched.companyCode)
                                    setErrors({
                                        ...errors,
                                        companyCode:
                                            validateCompanyCode(text),
                                    });
                            }}
                            onBlur={() => {
                                setTouched({
                                    ...touched,
                                    companyCode: true,
                                });

                                setErrors({
                                    ...errors,
                                    companyCode:
                                        validateCompanyCode(
                                            companyCode
                                        ),
                                });
                            }}
                            onSubmitEditing={() =>
                                usernameRef.current.focus()
                            }
                            error={
                                touched.companyCode
                                    ? errors.companyCode
                                    : ""
                            }
                            success={isValidCompany}
                        />

                        <CustomInput
                            ref={usernameRef}
                            label="Username"
                            placeholder="Enter Username"
                            value={username}
                            returnKeyType="next"
                            onChangeText={(text) => {
                                setUsername(text);

                                if (touched.username)
                                    setErrors({
                                        ...errors,
                                        username:
                                            validateUsername(text),
                                    });
                            }}
                            onBlur={() => {
                                setTouched({
                                    ...touched,
                                    username: true,
                                });

                                setErrors({
                                    ...errors,
                                    username:
                                        validateUsername(
                                            username
                                        ),
                                });
                            }}
                            onSubmitEditing={() =>
                                passwordRef.current.focus()
                            }
                            error={
                                touched.username
                                    ? errors.username
                                    : ""
                            }
                            success={isValidUsername}
                        />

                        <CustomInput
                            ref={passwordRef}
                            label="Password"
                            placeholder="Enter Password"
                            value={password}
                            secure
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                            onChangeText={(text) => {
                                setPassword(text);

                                if (touched.password)
                                    setErrors({
                                        ...errors,
                                        password:
                                            validatePassword(text),
                                    });
                            }}
                            onBlur={() => {
                                setTouched({
                                    ...touched,
                                    password: true,
                                });

                                setErrors({
                                    ...errors,
                                    password:
                                        validatePassword(
                                            password
                                        ),
                                });
                            }}
                            error={
                                touched.password
                                    ? errors.password
                                    : ""
                            }
                            success={isValidPassword}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={!loginEnabled}
                        style={[
                            styles.loginButton,
                            !loginEnabled &&
                            styles.loginDisabled,
                        ]}
                        onPress={handleLogin}
                    >
                        {loading ? (
                            <ActivityIndicator
                                color="#fff"
                            />
                        ) : (
                            <Text
                                style={styles.loginText}
                            >
                                LOGIN
                            </Text>
                        )}
                    </TouchableOpacity>


                </ScrollView>
            </KeyboardAvoidingView>
    );
};

export default DrLogin;