import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  RotateCcw,
  BellRing,
  MapPin,
} from 'lucide-react-native';
import { COLORS } from '../theme';
import { Item, ReminderSettings } from '../types';

interface HomeScreenProps {
  items: Item[];
  reminder: ReminderSettings;
  onAddItem: (name: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onResetDay: () => void;
}

export default function HomeScreen({
  items,
  reminder,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onResetDay,
}: HomeScreenProps) {
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = () => {
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim());
    setNewItemName('');
  };

  // ฟังก์ชันจำลองการแจ้งเตือนก่อนออกจากบ้าน
  const handleCheckBeforeLeaving = () => {
    const forgottenItems = items.filter((item) => !item.checked);
    const placeText = reminder.destination
      ? `\n📍 จุดหมาย: ${reminder.destination}`
      : '';

    if (forgottenItems.length === 0) {
      Alert.alert(
        '🔔 Save and Bell: พร้อมออกเดินทาง!',
        `เยี่ยมมาก! คุณเช็กของครบทุกชิ้นแล้ว${placeText}`
      );
    } else {
      const missingList = forgottenItems.map((i) => `• ${i.name}`).join('\n');
      Alert.alert(
        `⚠️ เดี๋ยวก่อน! คุณลืมของ ${forgottenItems.length} อย่าง`,
        `รายการที่ยังไม่ได้หยิบ:\n${missingList}${placeText}`
      );
    }
  };

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <View style={styles.container}>
      {/* การ์ดสรุปสถานะและสถานที่ */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTitle}>ความพร้อมวันนี้</Text>
          <Text style={styles.summaryCount}>
            {checkedCount} / {items.length} ชิ้น
          </Text>
        </View>
        {reminder.destination ? (
          <View style={styles.placeBadge}>
            <MapPin size={14} color={COLORS.primary} />
            <Text style={styles.placeText}>ไปที่: {reminder.destination}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.bellTestBtn}
          onPress={handleCheckBeforeLeaving}
        >
          <BellRing size={18} color="#FFF" />
          <Text style={styles.bellTestText}>เช็กความพร้อมก่อนออกจากบ้าน</Text>
        </TouchableOpacity>
      </View>

      {/* ช่องเพิ่มสิ่งของเข้าระบบ */}
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="เพิ่มของที่ต้องพก (เช่น สายชาร์จ, บัตรนักศึกษา)..."
          placeholderTextColor={COLORS.textMuted}
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Plus size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* หัวข้อรายการ + ปุ่ม Reset เช้าวันใหม่ */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>รายการของใช้จำเป็น</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetDay}>
          <RotateCcw size={14} color={COLORS.primary} />
          <Text style={styles.resetText}>Reset เช้าวันใหม่</Text>
        </TouchableOpacity>
      </View>

      {/* รายการสิ่งของ */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemLeft}
              onPress={() => onToggleItem(item.id)}
            >
              {item.checked ? (
                <CheckSquare size={24} color={COLORS.success} />
              ) : (
                <Square size={24} color={COLORS.secondary} />
              )}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={[
                    styles.itemName,
                    item.checked && styles.itemNameChecked,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={styles.itemTime}>
                  บันทึกเข้า: {item.timeAdded}
                </Text>
              </View>
            </TouchableOpacity>

            {/* ปุ่มลบของที่ไม่ใช้แล้ว */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDeleteItem(item.id)}
            >
              <Trash2 size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  summaryCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  placeText: {
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  bellTestBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  bellTestText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 8,
  },
  addRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },
  addBtn: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 46,
    borderRadius: 12,
    marginLeft: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  itemCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: COLORS.dangerBg,
    borderRadius: 8,
  },
});