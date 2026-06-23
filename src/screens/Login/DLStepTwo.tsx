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
      

        <View style={styles.card}>
          <Text
            style={styles.sectionTitle}
          >
            Personal Details
          </Text>

          <Input
            label="DL Number"
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
            label="State"
            value={
              formData.state
            }
            onChangeText={text =>
              updateField(
                "state",
                text
              )
            }
          />

          <Input
            label="District"
            value={
              formData.district
            }
            onChangeText={text =>
              updateField(
                "district",
                text
              )
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
      height: 140,
      borderRadius: 16,
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
  });