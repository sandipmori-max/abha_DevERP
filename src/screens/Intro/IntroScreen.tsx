import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Animated,
    Image,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    PanResponder,
    Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const DATA = [
    {
        id: '1',
        title: 'Easy Access',
        description:
            'All your health records, including lab reports, prescriptions and certificates are at your fingertips!',
        image:
            'https://cdn-icons-png.flaticon.com/512/2966/2966486.png',
    },
    {
        id: '2',
        title: 'Secure Records',
        description:
            'Store all your medical records securely and access them anytime.',
        image:
            'https://cdn-icons-png.flaticon.com/512/3064/3064197.png',
    },
    {
        id: '3',
        title: 'Easy Sharing',
        description:
            'Share your records instantly with healthcare professionals.',
        image:
            'https://cdn-icons-png.flaticon.com/512/942/942748.png',
    },
    {
        id: '4',
        title: 'Digital Health',
        description:
            'Manage your complete healthcare journey digitally.',
        image:
            'https://cdn-icons-png.flaticon.com/512/2785/2785819.png',
    },
];

const Slide = ({ item, index, scrollX }: any) => {
    const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [50, 0, 50],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.slide}>
            <Animated.Image
                source={{ uri: item.image }}
                resizeMode="contain"
                style={[
                    styles.image,
                    {
                        opacity,
                        transform: [{ scale }],
                    },
                ]}
            />

            <Animated.View
                style={{
                    opacity,
                    transform: [{ translateY }],
                }}
            >
                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.description}>
                    {item.description}
                </Text>
            </Animated.View>
        </View>
    );
};

export default function IntroScreen() {
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;

    const registerAnim = useRef(
        new Animated.Value(250),
    ).current;

    const loginAnim = useRef(
        new Animated.Value(-250),
    ).current;

    const [showLoginSheet, setShowLoginSheet] = useState(false);
    const [selectedLoginType, setSelectedLoginType] = useState();

    const sheetAnim = useRef(new Animated.Value(400)).current;

    const sheetProgress = useRef(
        new Animated.Value(0),
    ).current;

    const loginScale =
        sheetProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.85],
        });

    const loginOpacity =
        sheetProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });

    const sheetTranslateY =
        sheetProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [400, 0],
        });

    const openSheet = () => {
        setShowLoginSheet(true);
        setSelectedLoginType("");
        Animated.spring(sheetProgress, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    };

    const closeSheet = () => {
        Animated.timing(sheetProgress, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setSelectedLoginType("");
            setShowLoginSheet(false);
        });
    };
    const loginOptions = [
        'Aadhar Number',
        'Mobile Number',
        'ABHA Address',
        'ABHA Number',
    ];


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
    useEffect(() => {
        Animated.parallel([
            Animated.spring(registerAnim, {
                toValue: 0,
                friction: 7,
                tension: 60,
                useNativeDriver: true,
            }),

            Animated.spring(loginAnim, {
                toValue: 0,
                friction: 7,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content"
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.iconText}>⌲</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.languageText}>
                        English
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Slider */}
            <Animated.FlatList
                data={DATA}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <Slide
                        item={item}
                        index={index}
                        scrollX={scrollX}
                    />
                )}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX,
                                },
                            },
                        },
                    ],
                    {
                        useNativeDriver: false,
                    },
                )}
                scrollEventThrottle={16}
            />

            {/* Pagination */}
            <View style={styles.pagination}>
                {DATA.map((_, i) => {
                    const inputRange = [
                        (i - 1) * width,
                        i * width,
                        (i + 1) * width,
                    ];

                    const scaleX = scrollX.interpolate({
                        inputRange,
                        outputRange: [1, 2.2, 1],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={i}
                            style={[
                                styles.dot,
                                {
                                    opacity,
                                    transform: [{ scaleX }],
                                },
                            ]}
                        />
                    );
                })}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <Animated.View
                    style={{
                        flex: 1,
                        marginRight: 10,
                        transform: [
                            {
                                translateX: registerAnim,
                            },
                        ],
                    }}
                >
                    <TouchableOpacity
                        style={styles.registerBtn}
                    >
                        <Text style={styles.registerText}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={{
                        flex: 1,
                        opacity: loginOpacity,
                        transform: [{ scale: loginScale }],
                    }}
                >
                    <TouchableOpacity
                        onPress={openSheet}

                        style={styles.loginBtn}
                    >
                        <Text style={styles.loginText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

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
                        ]}
                    >
                        <View style={styles.dragHandle} />

                        <Text style={styles.sheetTitle}>
                            Login Using
                        </Text>

                        {loginOptions.map(item => {
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
                                    onPress={() =>
                                       {
                                         setSelectedLoginType(item)
                                        setTimeout(() => {
                                            setShowLoginSheet(false)
                                          navigation.navigate("Login")
                                        })
                                       }
                                    }
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

                        <View style={styles.bottomInfo}>
                            <Text style={styles.infoText}>
                                Don't have an ABHA number?
                            </Text>

                            <TouchableOpacity
                                style={styles.createBtn}
                            >
                                <Text
                                    style={styles.createBtnText}
                                >
                                    Create Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Modal>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        height: 55,
        borderWidth: 2,
        borderColor: '#D96A27',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginBtn: {
        height: 55,
        backgroundColor: '#D96A27',
        borderRadius: 8,
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
        width: '100%',
        height: '55%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
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
        marginBottom: 20,
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
        borderRadius: 11,
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
        marginBottom: 12,
        color: '#555',
    },

    createBtn: {
        height: 50,
        backgroundColor: '#D96A27',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    createBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});