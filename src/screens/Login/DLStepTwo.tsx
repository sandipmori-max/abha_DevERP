import React, {
  useRef, useState, forwardRef,
  useImperativeHandle,
} from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  NativeModules,

} from "react-native";
import RadioItem from "./RadioItem";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from "react-native-image-picker";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import RNFS from "react-native-fs";



const { DocumentScanner } = NativeModules;

const launchScannerAsync = (options: any) => {
  return new Promise<any>((resolve, reject) => {
    if (!DocumentScanner) {
      reject(new Error("DocumentScanner module not linked"));
      return;
    }

    try {
      DocumentScanner.launchScanner(options, (result: any) => {
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const DLStepTwo = forwardRef((props: any, ref) => {
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [errors, setErrors] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [tempDate, setTempDate] =
    useState(new Date());

  console.log("showDatePicker", showDatePicker)
  const [dob, setDob] = useState("");
  const formatDate = (date: Date) => {
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const year =
      date.getFullYear();

    return `${day}-${month}-${year}`;
  };
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

  const pendingCameraAction = useRef(false);

  const requestPermission = async (
    type: "camera" | "gallery",
  ): Promise<boolean> => {
    try {
      let permission;

      if (type === "gallery") {
        return true;
      }
      if (type === "camera") {
        permission =
          Platform.OS === "ios"
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;
      } else {
        // Gallery / Photos
        if (Platform.OS === "ios") {
          permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
        }

      }

      let result = await check(permission);

      if (result === RESULTS.GRANTED) return true;

      if (result === RESULTS.DENIED) {
        result = await request(permission);
        if (result === RESULTS.GRANTED) return true;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        Alert.alert('Errrorrorororororororor')

        if (type === "camera") pendingCameraAction.current = true;
        return false;
      }

      return result === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  const openImagePicker = (
    onSuccess: (
      asset: Asset
    ) => void
  ) => {
    Alert.alert(
      "Select Image",
      "Choose image source",
      [
        {
          text: "Camera",
          onPress: () => {
            launchCamera(
              {
                mediaType: "photo",
                quality: 0.8,
                includeBase64: true,
                saveToPhotos: true,
              },
              response => {
                if (
                  response.didCancel
                )
                  return;

                if (
                  response.assets?.[0]
                ) {
                  onSuccess(
                    response
                      .assets[0]
                  );
                }
              }
            );
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: "photo",
                quality: 0.8,
                includeBase64: true,
                selectionLimit: 1,
              },
              response => {
                if (
                  response.didCancel
                )
                  return;

                if (
                  response.assets?.[0]
                ) {
                  onSuccess(
                    response
                      .assets[0]
                  );
                }
              }
            );
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

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



  const validateForm = () => {
    const validationErrors: string[] = [];

    const requiredFields = [
      {
        key: "documentId",
        label: "Driving Licence Number",
      },
      {
        key: "firstName",
        label: "First Name",
      },
      {
        key: "lastName",
        label: "Last Name",
      },
      {
        key: "dob",
        label: "Date of Birth",
      },
      {
        key: "gender",
        label: "Gender",
      },
      {
        key: "frontSidePhoto",
        label: "Front Side Photo",
      },
      {
        key: "backSidePhoto",
        label: "Back Side Photo",
      },
      {
        key: "address",
        label: "Address",
      },
      {
        key: "pinCode",
        label: "Pin Code",
      },
      {
        key: "state",
        label: "State",
      },
      {
        key: "district",
        label: "District",
      },
    ];

    requiredFields.forEach(field => {
      const value = formData[field.key as keyof typeof formData];

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {
        validationErrors.push(`${field.label} is required.`);
      }
    });

    if (!isAgreed) {
      validationErrors.push(
        "Please accept the Terms & Conditions."
      );
    }

    setErrors(validationErrors);

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
      data: formData,
    };
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

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
            label="Mobile number"
            value={
              '+91 8154877969'
            }
            keyboardType='number-pad'
            isDisabled={true}
          />

          <Input
            label="Driving licence number"
            value={
              formData.documentId
            }
            subLabel={'*'}
            onChangeText={text =>
              updateField(
                "documentId",
                text
              )
            }
            keyboardType='number-pad'
          />

          <Input
            label="First name"
            value={
              formData.firstName
            }
            subLabel={'*'}
            onChangeText={text =>
              updateField(
                "firstName",
                text
              )
            }
          />

          <Input
            label="Middle name"
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
            label="Last name"
            subLabel={'*'}
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

          {/* <Input
            label="DOB (DD-MM-YYYY)"
            value={formData.dob}
            onChangeText={text =>
              updateField(
                "dob",
                text
              )
            }
          /> */}
          <Text style={styles.fieldLabel}>
            DOB (DD-MM-YYYY) <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowDatePicker(true)
            }}
          >
            <TextInput
              value={dob}
              editable={false}
              pointerEvents="none"
              placeholder="Select DOB"
              style={styles.input}
            />
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>
            Gender <Text style={{ color: 'red' }}>*</Text>
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
            title="Front side photo"
            image={
              formData.frontSidePhoto
            }
            onPress={async () => {
              const hasPermission = await requestPermission("camera");

              if (!hasPermission) {
                return;
              }
              const result = await launchScannerAsync({
                quality: 0.8,
                includeExif: true,
                includeBase64: true,
                includeLocationExif: false,
              });

              if (result?.didCancel) {
                return;
              }

              if (result?.error) {
                Alert.alert("Error", result?.errorMessage || "Scan failed");
                return;
              }

              if (result?.images?.length > 0) {
                const processed = result.images.map((img: any) => ({
                  ...img,
                  base64: img.base64 || null,
                }));

                setCacheBuster(Date.now());
                const base64Data = await RNFS.readFile(
                  processed[0].uri,
                  "base64",
                );
                setCacheBuster(Date.now());
                updateField(
                  "frontSidePhoto",
                  base64Data
                );

              } else {
              }


            }}

          />

          <UploadBox
            title="Back side photo"
            image={
              formData.backSidePhoto
            }
            onPress={async () => {
              const hasPermission = await requestPermission("camera");

              if (!hasPermission) {
                return;
              }
              const result = await launchScannerAsync({
                quality: 0.8,
                includeExif: true,
                includeBase64: true,
                includeLocationExif: false,
              });

              if (result?.didCancel) {
                return;
              }

              if (result?.error) {
                Alert.alert("Error", result?.errorMessage || "Scan failed");
                return;
              }

              if (result?.images?.length > 0) {
                const processed = result.images.map((img: any) => ({
                  ...img,
                  base64: img.base64 || null,
                }));


                setCacheBuster(Date.now());
                const base64Data = await RNFS.readFile(
                  processed[0].uri,
                  "base64",
                );
                setCacheBuster(Date.now());
                updateField(
                  "backSidePhoto",
                  base64Data
                );


              } else {
              }


            }}
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
            Address <Text style={{ color: 'red' }}>*</Text>
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
            label="Pin code"
            value={
              formData.pinCode
            }
            keyboardType='number-pad'
            onChangeText={text =>
              updateField(
                "pinCode",
                text
              )
            }
            subLabel={'*'}
          />
          <Input
            label="State"
            value={
              formData.state
            }
            subLabel={'*'}
            isDisabled={true}
          />

          <Input
            label="District"
            value={
              formData.district
            }
            subLabel={'*'}
            isDisabled={true}
          />

        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>
            Terms & Conditions <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <View style={styles.termsCard}>
            <ScrollView>
              <Text style={styles.termsText}>
              I, hereby declare that I am voluntarily sharing my identity information with National Health Authority (NHA) for the sole purpose of creation of ABHA number. I understand that my ABHA number can be used and shared for purposes as may be notified by ABDM (Ayushman Bharat Digital Mission) from time to time including provision of healthcare services. Further, I am aware that my personal identifiable information (Name, Address, Age, Date of Birth, Gender and Photograph) may be made available to the entities working in the National Digital Health Ecosystem (NDHE) which inter alia includes stakeholders and entities such as healthcare professionals (e.g. doctors), facilities (e.g. hospitals, laboratories) and data fiduciaries (e.g. health programmes), which are registered with or linked to the Ayushman Bharat Digital Mission (ABDM), and various processes there under.
            </Text>
            </ScrollView>

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

              
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() =>
            setShowDatePicker(false)
          }
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.bottomSheet}
          >
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>
              Select Date of Birth
            </Text>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(
                event,
                selectedDate
              ) => {
                if (selectedDate) {
                  setTempDate(
                    selectedDate
                  );
                }
              }}
            />

            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setShowDatePicker(false)
                }
              >
                <Text
                  style={
                    styles.cancelBtnText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => {
                  const formatted =
                    formatDate(tempDate);

                  setDob(formatted);

                  updateField(
                    "dob",
                    formatted
                  );

                  setShowDatePicker(false);
                }}
              >
                <Text
                  style={
                    styles.doneBtnText
                  }
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

const Input = ({
  label,
  subLabel,
  value,
  onChangeText,
  keyboardType = "default",
  isDisabled = false
}: any) => (
  <>
    <Text
      style={styles.fieldLabel}
    >
      {label} {subLabel && <Text style={{ color: 'red', fontWeight: '700' }}>*</Text>}
    </Text>

    <TextInput
      value={value}
      keyboardType={
        keyboardType
      }
      placeholder={
        `Enter ${label}`
      }
      onChangeText={(text) => {
        if (
          keyboardType === "number-pad" ||
          keyboardType === "numeric" ||
          keyboardType === "decimal-pad"
        ) {
          // Sirf digits allow
          const numbersOnly = text.replace(/[^0-9]/g, "");
          onChangeText?.(numbersOnly);
        } else {
          onChangeText?.(text);
        }
      }}
      style={[styles.input, isDisabled && {
        backgroundColor: '#f0f0f0'
      }]}
    />
  </>
);

const UploadBox = ({
  title,
  image,
  onPress
}: any) => (
  <>
    <Text
      style={
        styles.uploadTitle
      }
    >
      {title}  <Text style={{ color: 'red', fontWeight: '700' }}>*</Text>
    </Text>
    <TouchableOpacity
      onPress={onPress}
      style={[styles.uploadBox, !image && {
        height: 100
      }]}
    >
      {image ? (
        <>
          <Image

            source={{
              uri: `data:image/jpeg;base64,${image}`,
            }}
            resizeMode='contain'
            style={styles.preview}

          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.editButton}
          >
            <Text style={styles.editIcon}>
              ✏️
            </Text>
          </TouchableOpacity>
        </>

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
              styles.uploadSubTitle
            }
          >
            Tap to upload
          </Text>
        </>
      )}
    </TouchableOpacity>
  </>

);
export default DLStepTwo;

const styles =
  StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor:
        "#F5F7FB",
    },
    editButton: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: "#201f1f",
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
    },

    editIcon: {
      fontSize: 10,
    },

    preview: {
      width: "100%",
      height: 220,
      borderRadius: 6,
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
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor:
        "rgba(0,0,0,0.4)",
    },

    bottomSheet: {
      backgroundColor: "#FFF",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
    },

    header: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#EEE",
    },

    title: {
      fontSize: 16,
      fontWeight: "600",
    },

    cancel: {
      color: "#64748B",
      fontSize: 15,
    },

    done: {
      color: "#251d50",
      fontSize: 15,
      fontWeight: "600",
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
      backgroundColor: "#FFF",
      borderRadius: 4,
      padding: 12,
      marginBottom: 16,
      elevation: 2,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 4,
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
        "#251d50",
      borderColor:
        "#251d50",
    },

    genderText: {
      fontWeight: "600",
    },

    genderTextSelected: {
      color: "#FFF",
    },

    uploadBox: {
      height: 200,
      borderRadius: 6,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: "#CBD5E1",
      justifyContent:
        "center",
      alignItems: "center",
      marginBottom: 2,
    },

    uploadIcon: {
      fontSize: 30,
    },

    uploadTitle: {
      fontWeight: "600",
      marginVertical: 8,
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
        "#251d50",
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
      borderRadius: 8,
      marginHorizontal: 4,
      justifyContent: "center",
      alignItems: "center",
    },

    genderCardSelected: {
      backgroundColor: "#EEF4FF",
      borderColor: "#251d50",
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
      color: "#251d50",
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
      maxHeight: 220
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
    modalOverlay: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    },

    bottomSheet: {
      backgroundColor: "#FFF",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingTop: 12,
      paddingHorizontal: 20,
      paddingBottom: 30,
    },

    sheetHandle: {
      width: 48,
      height: 5,
      borderRadius: 10,
      backgroundColor: "#D1D5DB",
      alignSelf: "center",
      marginBottom: 20,
    },

    sheetTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
      textAlign: "center",
      marginBottom: 10,
    },

    footerButtons: {
      flexDirection: "row",
      marginTop: 10,
    },

    cancelBtn: {
      flex: 1,
      height: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },

    doneBtn: {
      flex: 1,
      height: 50,
      borderRadius: 12,
      backgroundColor: "#251d50",
      justifyContent: "center",
      alignItems: "center",
    },

    cancelBtnText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#6B7280",
    },

    doneBtnText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#FFF",
    },
    errorContainer: {
      backgroundColor: "#FFF3F3",
      borderWidth: 1,
      borderColor: "#F5B5B5",
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
    },

    errorTitle: {
      color: "#B91C1C",
      fontWeight: "700",
      fontSize: 15,
      marginBottom: 8,
    },

    errorText: {
      color: "#DC2626",
      fontSize: 14,
      marginBottom: 4,
    },
  });
