// Full updated ProfileScreen in a single file
// NOTE: No extra npm package required.

import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const ProfileScreen = ({ route }: any) => {

  const proReduxData = useSelector(
    (state: any) => state.abha.activeUser
  );

  console.log('proReduxData', proReduxData)
  const profile = proReduxData?.ABHAProfile || {};

  const fullName = [
    profile?.firstName,
    profile?.middleName,
    profile?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >

         
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.firstName?.[0] || "A"}
            </Text>
          </View>

          <Text style={styles.name}>
            {fullName || "-"}
          </Text>

          <Text style={styles.abhaAddress}>
            {profile?.preferredAbhaAddress || "-"}
          </Text>

          {/* Floating Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>
                ABHA Number
              </Text>

              <Text
                numberOfLines={1}
                style={styles.statValue}
              >
                {profile?.ABHANumber || "-"}
              </Text>
            </View>

            <View style={{ width: '50%', flexDirection: 'row' }}>
              <View style={[styles.statCard, {
                width: 100
              }]}>
                <Text style={styles.statTitle}>
                  Status
                </Text>

                <Text
                  style={[
                    styles.statValue,
                    {
                      color: "#16A34A",
                    },
                  ]}
                >
                  ● {profile?.abhaStatus || "-"}
                </Text>
              </View>
              <View style={[styles.statCard, {
                width: 60,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
              }]}>
                <MaterialIcons
                  name='downloading'
                  size={30}
                />
              </View>
            </View>


          </View>
        </View>

        {/* ABHA */}
        <SectionCard ezstyle={{
          marginTop: 50
        }} title="ABHA Details">
          <InfoRow
            icon="🆔"
            label="ABHA Number"
            value={profile?.ABHANumber}
          />

          <InfoRow
            icon="🏥"
            label="ABHA Address"
            value={
              profile?.preferredAbhaAddress
            }
          />
        </SectionCard>

        {/* Personal */}
        <SectionCard title="Personal Information">
          <InfoRow
            icon="👤"
            label="Gender"
            value={profile?.gender}
          />

          <InfoRow
            icon="🎂"
            label="Date of Birth"
            value={profile?.dob}
          />

          <InfoRow
            icon="📱"
            label="Mobile"
            value={profile?.mobile}
          />

          <InfoRow
            icon="✉️"
            label="Email"
            value={profile?.email}
          />
        </SectionCard>

        {/* Address */}
        <SectionCard title="Location">
          <InfoRow
            icon="📍"
            label="State"
            value={profile?.stateName}
          />

          <InfoRow
            icon="🏙"
            label="District"
            value={profile?.districtName}
          />

          <InfoRow
            icon="🏠"
            label="Address"
            value={profile?.address}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const SectionCard = ({
  title,
  children,
  ezstyle
}: any) => {
  return (
    <View style={[styles.card, ezstyle]}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {children}
    </View>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: any) => {
  return (
    <View style={styles.infoRow}>
      <View style={styles.leftContainer}>
        <Text style={styles.icon}>
          {icon}
        </Text>

        <Text style={styles.label}>
          {label}
        </Text>
      </View>

      <Text
        numberOfLines={2}
        style={styles.value}
      >
        {value || "-"}
      </Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerCard: {
    backgroundColor: "#2563EB",
    paddingTop: 45,
    paddingBottom: 90,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#2563EB",
  },

  name: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 15,
  },

  abhaAddress: {
    color: "#EAF1FF",
    fontSize: 15,
    marginTop: 5,
  },

  statsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: -30,
  },

  statCard: {
    backgroundColor: "#FFF",
    width: 180,
    borderRadius: 8,
    padding: 8,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderWidth: 0.4,
    borderColor: '#ccc'

  },

  statTitle: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 8,
  },

  statValue: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 20,
    marginTop: 8,
    borderWidth: 0.4,
    borderColor: '#ccc'
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  label: {
    fontSize: 15,
    color: "#64748B",
  },

  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
});