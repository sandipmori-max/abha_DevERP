import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Header from "../Components/Header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import CustomBottomSheet from "./Profile/CustomBottomSheet";
import RNPrint from 'react-native-print';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const DetailsScreen = ({ route }: any) => {
  const { item } = route.params || {};
  const [open, setOpen] = useState(false);

  const DetailRow = ({
    label,
    value,
    valueColor
  }: {
    label: string;
    value: any;
    valueColor?: string
  }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor && {
        color: valueColor
      }]}>{value || "-"}</Text>
    </View>
  );

  const downloadPDF = async (url) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/sample.pdf`;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise;

    if (result.statusCode === 200) {
      return filePath;
    }

    throw new Error('Download failed');
  };

  const sharePDF = async (filePath) => {
    try {
      await Share.open({
        title: 'Share ABHA Card',
        url: `file://${filePath}`,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const printPdfFromUrl = async () => {
    try {
      const pdfPath = await downloadPDF(
        'https://pdfobject.com/pdf/sample.pdf',
      );

      await RNPrint.print({
        filePath: pdfPath,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Header title="ABHA Details" isMenu={false} isSearch={false} isShare={true} handleShare={() => {
          setOpen(true)

        }} />

        {/* Profile */}
        <View style={styles.profileCard}>
          {/* Top Row */}
          <View style={styles.topRow}>
            {item?.profilePhoto ? (
              <Image
                source={{
                  uri: `${item.profilePhoto}`,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {item?.firstName?.charAt(0)}
                  {item?.lastName?.charAt(0)}
                </Text>
              </View>
            )}

            <View style={styles.userInfo}>
              <Text style={styles.name}>{item?.name}</Text>
              <Text style={styles.address}>
                {item?.preferredAbhaAddress}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item?.status === "ACTIVE"
                      ? "#DCFCE7"
                      : "#FEE2E2",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      item?.status === "ACTIVE"
                        ? "#16A34A"
                        : "#DC2626",
                  },
                ]}
              />

            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* ABHA Number */}
          <View style={styles.numberCard}>
            <Text style={styles.numberLabel}>ABHA NUMBER</Text>

            <Text style={styles.number}>
              {item?.ABHANumber}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Digital Health Identity
            </Text>

            <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <MaterialIcons
                size={16}
                name='approval' />
              <Text style={styles.footerCheck}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.cardTitle}>
          <Text style={styles.cardText}>
            Personal Information
          </Text>
          <MaterialIcons
            name='person'
            size={18}
            color={'#ccc'}
          />

        </View>


        <View style={styles.card}>

          <DetailRow
            label="First Name"
            value={item?.firstName}
          />

          <DetailRow
            label="Middle Name"
            value={item?.middleName}
          />

          <DetailRow
            label="Last Name"
            value={item?.lastName}
          />

          <DetailRow
            label="Gender"
            value={
              item?.gender === "M"
                ? "Male"
                : item?.gender === "F"
                  ? "Female"
                  : item?.gender
            }
          />

          <DetailRow
            label="DOB"
            value={item?.dob}
          />

          <DetailRow
            label="Mobile"
            value={item?.mobile}
          />
        </View>

        {/* Address */}
        <View style={styles.cardTitle}>
          <Text style={styles.cardText}>
            Address
          </Text>
          <MaterialIcons
            name='location-on'
            size={18}
            color={'#ccc'}
          />

        </View>


        <View style={styles.card}>

          <DetailRow
            label="Address"
            value={item?.address}
          />

          <DetailRow
            label="District"
            value={item?.districtName}
          />

          <DetailRow
            label="State"
            value={item?.stateName}
          />
        </View>

        {/* Verification */}
        <View style={styles.cardTitle}>
          <Text style={styles.cardText}>
            Verification
          </Text>
          <MaterialIcons
            name='numbers'
            size={18}
            color={'#ccc'}
          />

        </View>


        <View style={styles.card}>


          <DetailRow
            label="Verification"
            value={item?.verificationStatus}
          />

          <DetailRow
            label="Type"
            value={item?.verificationType}
          />

          <DetailRow
            label="KYC Verified"
            value={
              item?.kycVerified ? "Yes" : "No"
            }
            valueColor={item?.kycVerified ? 'black' : 'red'}
          />

          <DetailRow
            label="Created"
            value={item?.createdDate}
          />
        </View>

        {/* Authentication */}
        <View style={styles.cardTitle}>
          <Text style={styles.cardText}>
            Authentication Methods
          </Text>
          <MaterialIcons
            name='login'
            size={18}
            color={'#ccc'}
          />

        </View>


        <View style={styles.card}>


          {item?.authMethods?.length ? (
            item.authMethods.map(
              (method: string, index: number) => (
                <View
                  key={index}
                  style={styles.methodChip}
                >
                  <Text style={styles.methodText}>
                    {method}
                  </Text>
                </View>
              )
            )
          ) : (
            <Text style={styles.empty}>
              No authentication methods
            </Text>
          )}
        </View>

        <View style={{ height: 30 }} />

        {
          open && <CustomBottomSheet
            visible={open}
            title="Share & Print ABHA Card"
            onClose={() => setOpen(false)}
          >
            <View style={styles.qrCard}>
              <Image
                source={{ uri: 'https://wordpresscmsprodstor.blob.core.windows.net/wp-cms/2022/03/2-1.webp' }}
                style={styles.qrImage}
                resizeMode="contain"
              />

              <Text style={styles.qrInfo}>
                The client's ABHA has been created successfully. You can now view the ABHA details and download the ABHA card.
              </Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.shareBtn}
                activeOpacity={0.8}
                onPress={async () => {
                  const pdfPath = await downloadPDF('https://pdfobject.com/pdf/sample.pdf');
                  await sharePDF(pdfPath);
                }}
              >
                <MaterialIcons
                  name='share'
                  size={20}
                  color="#FFF"
                />

                <Text style={styles.shareText}>
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadBtn}
                activeOpacity={0.8}
                onPress={printPdfFromUrl}
              >
                <MaterialIcons
                  name='print'
                  size={20}
                  color={'#FF6B35'}
                />

                <Text style={styles.downloadText}>
                  Print
                </Text>
              </TouchableOpacity>
            </View>
          </CustomBottomSheet>
        }
      </ScrollView>


    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },



  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 15,
  },

  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  abhaNo: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },

  abhaAddress: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 14,
  },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 18,
    elevation: 2,
  },

  cardTitle: {
    padding: 8,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center'
  },

  cardText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#251d50",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  label: {
    color: "#6B7280",
    fontSize: 15,
    flex: 1,
  },

  value: {
    flex: 1.3,
    textAlign: "right",
    color: "#111827",
    fontWeight: "600",
    fontSize: 15,
  },

  methodChip: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  methodText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  empty: {
    color: "#999",
    textAlign: "center",
    paddingVertical: 10,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 20,

  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },




  userInfo: {
    flex: 1,
    marginLeft: 16,
  },

  address: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },



  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },



  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },

  numberCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
  },

  numberLabel: {
    fontSize: 12,
    color: "#64748B",
    letterSpacing: 1.5,
    marginBottom: 8,
    fontWeight: "600",
  },

  number: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 1,
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    color: "#64748B",
    fontSize: 14,
  },

  footerCheck: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 14,
  },
  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
  },

  qrImage: {
    width: Dimensions.get('screen').width - 20,
    height: 200,
  },

  qrInfo: {
    marginTop: 18,
    textAlign: "center",
    color: "#64748B",
  },

  actionContainer: {
    flexDirection: "row",
    marginTop: 28,
    justifyContent: "space-between",
  },

  shareBtn: {
    flex: 1,
    height: 42,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  downloadBtn: {
    flex: 1,
    height: 42,
    marginLeft: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B35",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#FFFFFF",
  },

  shareText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8
  },

  downloadText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8
  },
});