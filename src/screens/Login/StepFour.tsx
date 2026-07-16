import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from './style';

const StepFour = ({ stepFour, loginType, abhaSuggestionList, selectedItem, handleSelect,
  setValidationErrors,
  showValidationSheet
 }: any) => {
  return (
    <>
      <View style={{ marginHorizontal: 24 }}>
        <Text style={styles.cardTitle}>Create Your Unique ABHA Address</Text>
        <Text >ABHA (Ayushman Bharat Health Account) address is a unique username that allows you to share and access your health records digitally. It is similar to an email address, but it is only used for health records. </Text>
        <Text style={{ marginVertical: 8 }}>To create ABHA address, it should have Min - 8 characters, Max - 18 characters, special characters allowed - 1 dot (.) and/or 1 underscore (.).
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Enter Details <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <View style={styles.inputContainer}>

          <TextInput
            editable={false}
            value={stepFour.userName} 
            placeholder={'Select abha address'}
            keyboardType={'default'
            }
             placeholderTextColor="#999999"
            style={styles.input}
          />
          {
            <Text style={styles.hintText}>
              @abdm
            </Text>
          }

        </View>

        <FlatList
          data={abhaSuggestionList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected =
              selectedItem === item;

            return (
              <TouchableOpacity
                onPress={() =>
                  handleSelect(`${item}`)
                }
                style={{
                  padding: 12,
                  marginVertical: 5,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? "green"
                    : "#ccc",
                  borderRadius: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text>{item}</Text>

                {isSelected && (
                  <Text>✓</Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  )
}

export default StepFour

