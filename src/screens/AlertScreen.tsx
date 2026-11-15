import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Clock, MapPin, Save } from 'lucide-react-native';
import { COLORS } from '../theme';
import { ReminderSettings } from '../types';

interface AlertScreenProps {
  reminder: ReminderSettings;
  onSaveReminder: (updated: ReminderSettings) => void;
}

export default function AlertScreen({
  reminder,
  onSaveReminder,
}: AlertScreenProps) {
  const [enabled, setEnabled] = useState(reminder.enabled);
  const [time, setTime] = useState(reminder.time);
  const [destination, setDestination] = useState(reminder.destination);

  const handleSave = () => {
    onSaveReminder({ enabled, time, destination });
    Alert.alert('บันทึกเรียบร้อย', 'อัปเดตการตั้งค่าแจ้งเตือนและสถานที่แล้ว');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>ตั้งค่าการแจ้งเตือนล่วงหน้า</Text>

      <View style={styles.card}>
        {/* สถานะ เปิด / ปิด */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.label}>สถานะการแจ้งเตือน</Text>
            <Text style={styles.subLabel}>
              {enabled ? 'เปิดใช้งานการเตือนก่อนออกจากบ้าน' : 'ปิดการแจ้งเตือนชั่วคราว'}
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#FFF"
          />
        </View>

        <View style={styles.divider} />

        {/* เวลาแจ้งเตือนล่วงหน้า */}
        <Text style={styles.label}>
          <Clock size={14} color={COLORS.primary} /> เวลาแจ้งเตือนล่วงหน้า
        </Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="เช่น 08:00"
          placeholderTextColor={COLORS.textMuted}
        />

        {/* บันทึกชื่อสถานที่ที่ต้องการไป */}
        <Text style={styles.label}>
          <MapPin size={14} color={COLORS.primary} /> สถานที่ที่ต้องการไป (ถ้ามี)
        </Text>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
          placeholder="เช่น มหาวิทยาลัย, ออฟฟิศ, คาเฟ่..."
          placeholderTextColor={COLORS.textMuted}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Save size={18} color="#FFF" />
          <Text style={styles.saveBtnText}>บันทึกการตั้งค่า</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  input: {
    backgroundColor: COLORS.bgMain,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});