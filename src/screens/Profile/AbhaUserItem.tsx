import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { showToast } from "../../utils/toast";


const AbhaUserItem = ({ item, onPress }: any) => {
    const initials = `${item.firstName?.[0] ?? ""}${item.lastName?.[0] ?? ""}`;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => {
                onPress(item)
            }}
        >
            {/* Header */}
            <View style={styles.header}>
                {true ? (
                    <Image
                        source={{
                            uri: `${item.image}`,
                        }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                )}



                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                    </Text>

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    item.status === "ACTIVE"
                                        ? "#DCFCE7"
                                        : "#FEE2E2",
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.dot,
                                {
                                    backgroundColor:
                                        item.status === "ACTIVE"
                                            ? "#22C55E"
                                            : "#EF4444",
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color:
                                        item.status === "ACTIVE"
                                            ? "#15803D"
                                            : "#B91C1C",
                                },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ABHA Number */}
            <View style={styles.row}>
                <MaterialIcons
                    name='numbers'
                    size={18}
                    color="#251d50"
                />
                <Text style={styles.label}>ABHA</Text>
                <Text style={styles.value}>
                    {item.number}
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        Clipboard.setString(item.number);
                        showToast('success', 'ABHA Number copied successfully')
                    }}
                >
                    <MaterialIcons
                        name='copy-all'
                        size={18}
                        color="#251d50"
                    />
                </TouchableOpacity>
            </View>



            {/* ABHA Address */}
            <View style={styles.row}>
                <MaterialIcons
                    name='person'
                    size={18}
                    color="#251d50"
                />
                <Text
                    style={styles.value}
                    numberOfLines={1}
                >
                    {item.address}
                </Text>
            </View>



            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <MaterialIcons
                        name='calendar-month'
                        size={16}
                        color="#6B7280"
                    />
                    <Text style={styles.footerText}>
                        {item?.date}
                    </Text>
                </View>

                <View style={styles.footerItem}>
                    <MaterialIcons
                        name={
                            item.qty === "M"
                                ? "male"
                                : "female"
                        }
                        size={16}
                        color="#6B7280"
                    />
                    <Text style={styles.footerText}>
                        {item.qty === "M"
                            ? "Male"
                            : "Female"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default AbhaUserItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: "#edf2fb",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        resizeMode: 'cover',
        borderWidth: 0.4
    },

    avatarText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },

    name: {
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },

    statusBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 1,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    statusText: {
        fontSize: 10,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    label: {
        marginLeft: 8,
        fontWeight: "600",
        color: "#374151",
        marginRight: 6,
    },

    value: {
        flex: 1,
        marginLeft: 8,
        color: "#4B5563",
        fontSize: 14,
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        marginTop: 2,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    footerItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    footerText: {
        marginLeft: 6,
        color: "#6B7280",
        fontWeight: "500",
    },
});