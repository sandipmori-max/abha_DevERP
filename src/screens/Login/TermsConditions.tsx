import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from './style';

interface TermsCardProps {
    title?: string;
    text: string;
    checked: boolean;
    onToggle: () => void;
}

const TermsConditions = ({
    title = "Terms & Conditions",
    text,
    checked,
    onToggle
}: TermsCardProps) => {
    return (
        <View style={styles.termsContainer}>

            <Text style={styles.termsTitle}>
                {title}
                <Text style={{ color: "red" }}>*</Text>
            </Text>

            <View style={styles.termsCard}>

                <View style={{ height: 220 }}>
                    <ScrollView>

                        <Text style={styles.termsText}>
                            {text}
                        </Text>

                    </ScrollView>
                </View>

                <View style={styles.termsFooter}>

                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={onToggle}>

                        <View
                            style={[
                                styles.checkbox,
                                checked && styles.checkboxActive
                            ]}>

                            {checked && (
                                <Text style={styles.checkmark}>
                                    ✓
                                </Text>
                            )}

                        </View>

                        <Text style={styles.agreeText}>
                            I agree
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity>

                        <Text style={styles.speakerIcon}>
                            🔊
                        </Text>

                    </TouchableOpacity>

                </View>

            </View>

        </View>

    )
}

export default TermsConditions
