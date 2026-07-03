import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import ProfileScreen from "../screens/Profile/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";
import { useNavigation } from "@react-navigation/native";
import { ABHA_ICON } from "../assets";
import EnrollmentInfoModal from "../screens/Login/EnrollmentInfoModal";

const { width, height } = Dimensions.get('window');

const BottomTabNavigator = () => {
    const navigation = useNavigation();
    const [bottomSheetType, setBottomSheetType] = useState('');
    const [showInfoModal, setShowInfoModal] = useState(false);
    const sheetProgress = useRef(
        new Animated.Value(0),
    ).current;
    const [showLoginSheet, setShowLoginSheet] = useState(false);
    const sheetTranslateY =
        sheetProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [400, 0],
        });

    const openSheet = () => {
        setSelectedLoginType("")
        setShowLoginSheet(true);

        sheetProgress.setValue(0);

        Animated.timing(sheetProgress, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeSheet = () => {
        setShowLoginSheet(false);

    };

    const loginOptions = [
        'Mobile Number',
        'Aadhaar Number',
        'ABHA Number',
        // 'ABHA Address'
    ];

    const registerOptions = [
        'Aadhaar Number',
        // 'Driving Licence',
    ];
    const sheetAnim = useRef(new Animated.Value(400)).current;
    const optionList = bottomSheetType === 'Login' ? loginOptions : registerOptions;
    const [selectedLoginType, setSelectedLoginType] = useState();
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                gesture.dy > 5,

            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    sheetAnim.setValue(gesture.dy);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 120) {
                    closeSheet();
                } else {
                    Animated.spring(sheetAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;
    const renderIcon = (routeName: string, selectedTab: string) => {
        let icon = "";

        switch (routeName) {
            case "Profile":
                icon = "person";
                break;

            case "Details":
                icon = "settings";
                break;
        }

        return (
            <MaterialIcons
                name={icon}
                size={28}
                color={
                    selectedTab === routeName
                        ? "#D96A27"
                        : "#94A3B8"
                }
            />
        );
    };

    return (

        <>
            <CurvedBottomBar.Navigator
                type="DOWN"
                height={60}
                circleWidth={60}
                bgColor="#ccc"
                initialRouteName="Profile"
                borderTopLeftRight
                screenOptions={{
                    headerShown: false,
                }}
                renderCircle={() => (
                    <Animated.View style={styles.circle}>
                        <TouchableOpacity
                            onPress={() => {
                                openSheet();
                            }}
                            style={styles.fab}>
                            <MaterialIcons
                                name="add"
                                size={28}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                tabBar={({ routeName, selectedTab, navigate }: any) => (
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => navigate(routeName)}
                    >
                        {renderIcon(routeName, selectedTab)}
                    </TouchableOpacity>
                )}
            >
                <CurvedBottomBar.Screen
                    name="Profile"
                    position="LEFT"
                    component={ProfileScreen}
                />

                <CurvedBottomBar.Screen
                    name="Details"
                    position="RIGHT"
                    component={DetailsScreen}
                />
            </CurvedBottomBar.Navigator>
            {showLoginSheet && (
                <Modal
                    transparent
                    visible={showLoginSheet}
                    animationType="none"
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.backdrop}
                        onPress={closeSheet}
                    />

                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.bottomSheet,
                            {
                                transform: [
                                    {
                                        translateY: sheetTranslateY,
                                    },
                                ],
                            },
                            bottomSheetType !== 'Login' && {
                                height: '26%'
                            }
                        ]}
                    >

                        <View style={styles.logo}>
                            <Image
                                source={ABHA_ICON.ABHA_LOGO}
                                style={{ height: 60, width: 80, alignSelf: 'center' }}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ height: 14 }} />
                        <Text style={styles.sheetTitle}>
                            {bottomSheetType === 'Login' ? 'Login To Your ABHA' : 'Create ABHA number using'}
                        </Text>

                        <Text style={{
                            color: 'gray',
                            marginBottom: 12
                        }}>
                            {
                                bottomSheetType === 'Login' ? 'Select a login method to access your ABHA account.' : 'Please choose one of the below option to start with the creation of your ABHA'
                            }
                        </Text>

                        {optionList.map(item => {
                            const selected =
                                selectedLoginType === item;

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.optionRow,
                                        selected &&
                                        styles.selectedOption,
                                    ]}
                                    onPress={() => {
                                        setSelectedLoginType(item)
                                        if (item === 'Driving Licence') {
                                            setShowLoginSheet(false)
                                            setShowInfoModal(true)
                                            return;
                                        }
                                        setTimeout(() => {
                                            setShowLoginSheet(false)
                                            navigation.navigate("RegistrationAbha", {
                                                loginType: item,
                                                isFromRegister: bottomSheetType === 'Login' ? false : true
                                            })
                                        })
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.radioOuter,
                                            selected &&
                                            styles.radioOuterActive,
                                        ]}
                                    >
                                        {selected && (
                                            <View
                                                style={styles.radioInner}
                                            />
                                        )}
                                    </View>

                                    <Text
                                        style={styles.optionText}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}


                    </Animated.View>
                </Modal>
            )}

            {
                showInfoModal && <EnrollmentInfoModal
                    visible={showInfoModal}
                    onClose={() => {
                        setShowInfoModal(false)
                        setTimeout(() => {
                            setShowLoginSheet(false)
                            navigation.navigate("RegistrationAbha", {
                                loginType: 'Driving Licence',
                                isFromRegister: true
                            })
                        })
                    }

                    }
                />
            }
        </>

    );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    circle: {
        width: 65,
        height: 65,
        borderRadius: 33,
        justifyContent: "center",
        alignItems: "center",
        bottom: 30,
    },

    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#D96A27",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        backgroundColor: 'white',
        top: -30,
        position: 'absolute',
        height: 100, width: 100, alignSelf: 'center',
        borderRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: '#173D8F',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconText: {
        fontSize: 18,
        color: '#173D8F',
        fontWeight: '600',
    },

    languageText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },

    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
    },

    image: {
        width: width * 0.8,
        height: height * 0.3,
        marginBottom: 40,
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#173D8F',
        marginBottom: 15,
        textAlign: 'center',
    },

    description: {
        fontSize: 18,
        lineHeight: 28,
        color: '#333',
        textAlign: 'center',
    },

    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 35,
    },

    dot: {
        width: 16,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#173D8F',
        marginHorizontal: 4,
        marginLeft: 8
    },

    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 30,
    },

    registerBtn: {
        height: 48,
        borderWidth: 2,
        borderColor: '#D96A27',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginBtn: {
        height: 48,
        backgroundColor: '#D96A27',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },

    registerText: {
        color: '#D96A27',
        fontSize: 18,
        fontWeight: '600',
    },

    loginText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },

    ///
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        height: '36%',
        width: '94%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        marginHorizontal: 12
    },

    dragHandle: {
        width: 50,
        height: 5,
        backgroundColor: '#DDD',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 20,
    },

    sheetTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },

    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EEE',
    },

    selectedOption: {
        borderColor: '#D96A27',
        backgroundColor: '#FFF7F2',
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioOuterActive: {
        borderColor: '#D96A27',
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D96A27',
    },

    optionText: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '500',
    },

    bottomInfo: {
        marginTop: 'auto',
    },

    infoText: {
        textAlign: 'center',
        color: '#555',
    },
    loginBtnText: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    createBtn: {
        marginTop: 4,
        height: 48,
        backgroundColor: '#D96A27',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    createBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});