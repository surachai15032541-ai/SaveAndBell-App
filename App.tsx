import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Home, Clock, History, LogOut } from 'lucide-react-native';

import { COLORS } from './src/theme';
import { Item, ActivityLog, ReminderSettings } from './src/types';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import AlertScreen from './src/screens/AlertScreen';
import LogsScreen from './src/screens/LogsScreen';

const DEFAULT_ITEMS: Item[] = [
  { id: '1', name: 'กุญแจบ้าน / คีย์การ์ด', checked: false, timeAdded: '07:30', essential: true },
  { id: '2', name: 'กระเป๋าสตางค์', checked: false, timeAdded: '07:30', essential: true },
  { id: '3', name: 'โทรศัพท์มือถือ', checked: true, timeAdded: '07:31', essential: true },
  { id: '4', name: 'หูฟังไร้สาย', checked: false, timeAdded: '07:35', essential: false },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'alert' | 'logs'>('home');

  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [reminder, setReminder] = useState<ReminderSettings>({
    enabled: true,
    time: '08:00',
    destination: 'มหาวิทยาลัย',
  });

  // โหลดข้อมูลเก่าจากเครื่องมือถือเมื่อเปิดแอป
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedItems = await AsyncStorage.getItem('@saveandbell_items');
        const savedLogs = await AsyncStorage.getItem('@saveandbell_logs');
        const savedReminder = await AsyncStorage.getItem('@saveandbell_reminder');
        if (savedItems) setItems(JSON.parse(savedItems));
        if (savedLogs) setLogs(JSON.parse(savedLogs));
        if (savedReminder) setReminder(JSON.parse(savedReminder));
      } catch (e) {
        console.log('โหลดข้อมูลไม่สำเร็จ', e);
      }
    };
    loadData();
  }, []);

  // บันทึกข้อมูลลงเครื่องอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    AsyncStorage.setItem('@saveandbell_items', JSON.stringify(items));
    AsyncStorage.setItem('@saveandbell_logs', JSON.stringify(logs));
    AsyncStorage.setItem('@saveandbell_reminder', JSON.stringify(reminder));
  }, [items, logs, reminder]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const addLog = (action: string, detail: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      detail,
      time: getCurrentTime(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // เพิ่มสิ่งของเข้าระบบพร้อมเวลา
  const handleAddItem = (name: string) => {
    const timeNow = getCurrentTime();
    const newItem: Item = {
      id: Date.now().toString(),
      name,
      checked: false,
      timeAdded: timeNow,
      essential: true,
    };
    setItems((prev) => [newItem, ...prev]);
    addLog('เพิ่มของเข้าระบบ', `เพิ่ม "${name}" เวลา ${timeNow}`);
  };

  // ติ๊กเช็ก / ยกเลิกเช็กสิ่งของ
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.checked;
          addLog(
            nextState ? 'เช็กของเรียบร้อย' : 'ยกเลิกการเช็ก',
            `รายการ: ${item.name}`
          );
          return { ...item, checked: nextState };
        }
        return item;
      })
    );
  };

  // ลบสิ่งของที่ไม่ใช้แล้ว
  const handleDeleteItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      addLog('ลบรายการออก', `ลบ "${target.name}" ออกจากรายการ`);
    }
  };

  // ปุ่ม Reset เช้าวันใหม่
  const handleResetDay = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
    addLog('Reset เช้าวันใหม่', 'รีเซ็ตสถานะสิ่งของทั้งหมดเพื่อเริ่มวันใหม่');
  };

  // บันทึกการตั้งค่าแจ้งเตือนและสถานที่
  const handleSaveReminder = (updated: ReminderSettings) => {
    setReminder(updated);
    addLog(
      'อัปเดตแจ้งเตือน',
      `สถานะ: ${updated.enabled ? 'เปิด' : 'ปิด'} | เวลา: ${updated.time} | สถานที่: ${updated.destination || '-'}`
    );
  };

  // หากยังไม่ล็อกอิน ให้แสดงหน้า AuthScreen
  if (!currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={(username) => {
          setCurrentUser(username);
          addLog('เข้าสู่ระบบ', `ผู้ใช้งาน: ${username}`);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content"  />

      {/* แถบหัวข้อด้านบน + ปุ่มออกจากระบบ */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Bell size={22} color={COLORS.primary} />
          <Text style={styles.brandTitle}>Save and Bell</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            addLog('ออกจากระบบ', `ผู้ใช้งาน: ${currentUser}`);
            setCurrentUser(null);
          }}
        >
          <Text style={styles.userText}>{currentUser}</Text>
          <LogOut size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      {/* พื้นที่แสดงเนื้อหาตามแท็บที่เลือก */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <HomeScreen
            items={items}
            reminder={reminder}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            onResetDay={handleResetDay}
          />
        )}
        {activeTab === 'alert' && (
          <AlertScreen
            reminder={reminder}
            onSaveReminder={handleSaveReminder}
          />
        )}
        {activeTab === 'logs' && <LogsScreen logs={logs} />}
      </View>

      {/* แถบเมนูนำทางด้านล่าง */}
      <View style={styles.bottomTab}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('home')}
        >
          <Home
            size={22}
            color={activeTab === 'home' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'home' && styles.tabLabelActive,
            ]}
          >
            เช็กของ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('alert')}
        >
          <Clock
            size={22}
            color={activeTab === 'alert' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'alert' && styles.tabLabelActive,
            ]}
          >
            แจ้งเตือน
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('logs')}
        >
          <History
            size={22}
            color={activeTab === 'logs' ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'logs' && styles.tabLabelActive,
            ]}
          >
            ประวัติ
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginLeft: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  userText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.danger,
    marginRight: 6,
  },
  content: {
    flex: 1,
  },
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});