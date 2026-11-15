import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { History } from 'lucide-react-native';
import { COLORS } from '../theme';
import { ActivityLog } from '../types';

interface LogsScreenProps {
  logs: ActivityLog[];
}

export default function LogsScreen({ logs }: LogsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>ประวัติการใช้งานระบบ</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>ยังไม่มีประวัติการใช้งาน</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <View style={styles.iconBox}>
              <History size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.actionText}>{item.action}</Text>
              <Text style={styles.detailText}>{item.detail}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 40,
  },
  logCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 4,
  },
});