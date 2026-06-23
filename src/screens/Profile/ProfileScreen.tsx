import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ProfileScreen = ({
  route,
}: any) => {
  const profile =
    route?.params?.profile;

  const fullName = [
    profile?.firstName,
    profile?.middleName,
    profile?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER CARD */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.firstName?.[0] ||
              "A"}
          </Text>
        </View>

        <Text style={styles.name}>
          {fullName}
        </Text>

        <Text style={styles.abhaAddress}>
          {
            profile?.preferredAbhaAddress
          }
        </Text>

        <View style={styles.statusBadge}>
          <Text
            style={
              styles.statusText
            }
          >
            {
              profile?.abhaStatus
            }
          </Text>
        </View>
      </View>

      {/* ABHA INFO */}
      <SectionCard
        title="ABHA Details"
      >
        <InfoRow
          label="ABHA Number"
          value={
            profile?.ABHANumber
          }
        />

        <InfoRow
          label="ABHA Address"
          value={
            profile?.preferredAbhaAddress
          }
        />
      </SectionCard>

      {/* PERSONAL INFO */}
      <SectionCard
        title="Personal Information"
      >
        <InfoRow
          label="Gender"
          value={
            profile?.gender
          }
        />

        <InfoRow
          label="Date of Birth"
          value={profile?.dob}
        />

        <InfoRow
          label="Mobile"
          value={
            profile?.mobile
          }
        />

        <InfoRow
          label="Email"
          value={
            profile?.email
          }
        />
      </SectionCard>

      {/* ADDRESS */}
      <SectionCard
        title="Location"
      >
        <InfoRow
          label="State"
          value={
            profile?.stateName
          }
        />

        <InfoRow
          label="District"
          value={
            profile?.districtName
          }
        />

        <InfoRow
          label="Address"
          value={
            profile?.address
          }
        />
      </SectionCard>
    </ScrollView>
  );
};

const SectionCard = ({
  title,
  children,
}: any) => (
  <View style={styles.card}>
    <Text
      style={styles.sectionTitle}
    >
      {title}
    </Text>
    {children}
  </View>
);

const InfoRow = ({
  label,
  value,
}: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>
      {label}
    </Text>

    <Text style={styles.value}>
      {value || "-"}
    </Text>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      "#F5F7FB",
  },

  headerCard: {
    backgroundColor:
      "#2563EB",
    margin: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor:
      "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "700",
  },

  name: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },

  abhaAddress: {
    color:
      "rgba(255,255,255,0.85)",
    marginTop: 6,
    fontSize: 14,
  },

  statusBadge: {
    backgroundColor:
      "#10B981",
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
  },

  statusText: {
    color: "#FFF",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111827",
  },

  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor:
      "#F1F5F9",
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
});