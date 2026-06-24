import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RadioItem from "./RadioItem";
import { TERMS_ONE } from "../../utils/helpers";

const DLStepTwo = ({
  navigation,
}: any) => {
  const [formData, setFormData] =
    useState({
      documentId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      frontSidePhoto: "",
      backSidePhoto: "",
      address: "",
      state: "",
      district: "",
      pinCode: "",
    });

  const updateField = (
    key: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  const [isAgreed, setIsAgreed] = useState(false);

  const onSubmit = () => {
    if (
      !formData.documentId ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.gender
    ) {
      Alert.alert(
        "Validation",
        "Please fill all mandatory fields"
      );
      return;
    }

    console.log(
      "DL Payload =>",
      formData
    );

    // navigation.navigate(...)
  };

  return (
    <View style={styles.main}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.container
        }
      >

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>
            ℹ️
          </Text>

          <View style={{ flex: 1 }}>
            <Text
              style={styles.infoTitle}
            >
              Driving License Verification
            </Text>

            <Text
              style={styles.infoText}
            >
              Ensure all details match
              your Driving License.
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            Personal Details
          </Text>

          <Input
            label="Mobile Number"
            value={
              '8154877969'
            }
          />

          <Input
            label="Driving Licence number"
            value={
              formData.documentId
            }
            onChangeText={text =>
              updateField(
                "documentId",
                text
              )
            }
          />

          <Input
            label="First Name"
            value={
              formData.firstName
            }
            onChangeText={text =>
              updateField(
                "firstName",
                text
              )
            }
          />

          <Input
            label="Middle Name"
            value={
              formData.middleName
            }
            onChangeText={text =>
              updateField(
                "middleName",
                text
              )
            }
          />

          <Input
            label="Last Name"
            value={
              formData.lastName
            }
            onChangeText={text =>
              updateField(
                "lastName",
                text
              )
            }
          />

          <Input
            label="DOB (DD-MM-YYYY)"
            value={formData.dob}
            onChangeText={text =>
              updateField(
                "dob",
                text
              )
            }
          />

          <Text style={styles.fieldLabel}>
            Gender
          </Text>

          <View style={styles.genderContainer}>
            {[
              {
                label: "Male",
                value: "M",
                icon: "👨",
              },
              {
                label: "Female",
                value: "F",
                icon: "👩",
              },
              {
                label: "Other",
                value: "O",
                icon: "⚧️",
              },
            ].map(item => {
              const isSelected =
                formData.gender ===
                item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.8}
                  style={[
                    styles.genderCard,
                    isSelected &&
                    styles.genderCardSelected,
                  ]}
                  onPress={() =>
                    updateField(
                      "gender",
                      item.value
                    )
                  }
                >
                  <Text
                    style={
                      styles.genderIcon
                    }
                  >
                    {item.icon}
                  </Text>

                  <Text
                    style={[
                      styles.genderLabel,
                      isSelected &&
                      styles.genderLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            DL Photos
          </Text>

          <UploadBox
            title="Front Side Photo"
            image={
              formData.frontSidePhoto
            }
          />

          <UploadBox
            title="Back Side Photo"
            image={
              formData.backSidePhoto
            }
          />
        </View>
        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            Address Details
          </Text>

          <Text
            style={
              styles.fieldLabel
            }
          >
            Address
          </Text>

          <TextInput
            multiline
            value={
              formData.address
            }
            onChangeText={text =>
              updateField(
                "address",
                text
              )
            }
            style={
              styles.addressInput
            }
          />
          <Input
            label="Pin Code"
            value={
              formData.pinCode
            }
            keyboardType="number-pad"
            onChangeText={text =>
              updateField(
                "pinCode",
                text
              )
            }
          />
          <Input
            label="State"
            value={
              formData.state
            }
          />

          <Input
            label="District"
            value={
              formData.district
            }
          />


        </View>
        <RadioItem
          title="I hereby declare that I have not created another ABHA number to the best of my knowledge"
          selected=''
          onPress={() => { }}
        />

        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>
            Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <View style={styles.termsCard}>
            <Text style={styles.termsText}>
              I hereby declare that I am voluntarily sharing my
                    Aadhaar Number and demographic information issued
                    by UIDAI with National Health Authority (NHA) for
                    the sole purpose of authentication and healthcare
                    services under ABDM.
            </Text>

            <View style={styles.termsFooter}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsAgreed(!isAgreed)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isAgreed && styles.checkboxActive,
                  ]}
                >
                  {isAgreed && (
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
      </ScrollView>
    </View>
  );
};

const Input = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
}: any) => (
  <>
    <Text
      style={styles.fieldLabel}
    >
      {label}
    </Text>

    <TextInput
      value={value}
      keyboardType={
        keyboardType
      }
      placeholder={
        `Enter ${label}`
      }
      onChangeText={
        onChangeText
      }
      style={styles.input}
    />
  </>
);

const UploadBox = ({
  title,
  image,
}: any) => (
  <TouchableOpacity
    style={styles.uploadBox}
  >
    {image ? (
      <Image
        source={{
          uri: `data:image/jpeg;base64,${image}`,
        }}
        style={styles.preview}
      />
    ) : (
      <>
        <Text
          style={
            styles.uploadIcon
          }
        >
          📷
        </Text>

        <Text
          style={
            styles.uploadTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.uploadSubTitle
          }
        >
          Tap to upload
        </Text>
      </>
    )}
  </TouchableOpacity>
);

export default DLStepTwo;

const styles =
  StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor:
        "#F5F7FB",
    },
    agreeText: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '600',
      color: '#222',
    },

    speakerIcon: {
      fontSize: 22,
    },
    infoBanner: {
      flexDirection: "row",
      backgroundColor:
        "#FFF8F3",
      borderWidth: 1,
      borderColor: "#F5D0B5",
      borderRadius: 4,
      padding: 14,
      marginBottom: 16,
    },

    infoIcon: {
      fontSize: 20,
      marginRight: 10,
    },

    infoTitle: {
      fontWeight: "700",
      color: "#8A4B20",
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#173D8F',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },

    checkboxActive: {
      backgroundColor: '#173D8F',
    },

    checkmark: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
    },


    infoText: {
      marginTop: 4,
      color: "#A16207",
      fontSize: 12,
    },
    container: {
      padding: 6,
      paddingHorizontal: 16,
      paddingBottom: 120,
    },

    header: {
      marginBottom: 20,
    },

    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
    },

    headerSubTitle: {
      marginTop: 6,
      color: "#64748B",
      fontSize: 14,
    },

    card: {
      backgroundColor:
        "#FFF",
      borderRadius: 4,
      padding: 12,
      marginBottom: 16,
      elevation: 2,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 15,
    },

    fieldLabel: {
      fontSize: 13,
      color: "#64748B",
      marginBottom: 6,
      marginTop: 8,
    },

    input: {
      height: 44,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 4,
      paddingHorizontal: 14,
    },

    addressInput: {
      minHeight: 100,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 12,
      padding: 14,
      textAlignVertical:
        "top",
      backgroundColor:
        "#FAFAFA",
    },

    genderContainer: {
      flexDirection: "row",
    },

    genderButton: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#CBD5E1",
      justifyContent:
        "center",
      alignItems: "center",
      marginRight: 8,
    },

    genderSelected: {
      backgroundColor:
        "#D96A27",
      borderColor:
        "#D96A27",
    },

    genderText: {
      fontWeight: "600",
    },

    genderTextSelected: {
      color: "#FFF",
    },

    uploadBox: {
      height: 100,
      borderRadius: 6,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: "#CBD5E1",
      justifyContent:
        "center",
      alignItems: "center",
      marginBottom: 12,
    },

    uploadIcon: {
      fontSize: 30,
    },

    uploadTitle: {
      fontWeight: "600",
      marginTop: 8,
    },

    uploadSubTitle: {
      color: "#64748B",
      marginTop: 4,
    },

    preview: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
    },

    button: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 20,
      height: 46,
      borderRadius: 6,
      backgroundColor:
        "#D96A27",
      justifyContent:
        "center",
      alignItems: "center",
    },

    buttonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "700",
    },



    genderCard: {
      flex: 1,
      height: 90,
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#E2E8F0",
      borderRadius: 18,
      marginHorizontal: 4,
      justifyContent: "center",
      alignItems: "center",
    },

    genderCardSelected: {
      backgroundColor: "#EEF4FF",
      borderColor: "#D96A27",
      borderWidth: 2,
    },

    genderIcon: {
      fontSize: 28,
    },

    genderLabel: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: "600",
      color: "#64748B",
    },

    genderLabelSelected: {
      color: "#D96A27",
    },
    termsContainer: { 
      marginTop: 8,
      marginBottom: 12
    },

    termsTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: '#222',
    },

    termsCard: {
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderColor: '#E5E5E5',
      overflow: 'hidden',
    },

    termsText: {
      padding: 18,
      fontSize: 14,
      lineHeight: 24,
      color: '#555',
    },

    termsFooter: {
      borderTopWidth: 1,
      borderTopColor: '#EEE',
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });