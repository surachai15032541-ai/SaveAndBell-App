import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS } from '../theme';

interface AuthScreenProps {
  onLoginSuccess: (username: string) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // จัดเก็บรายชื่อผู้ใช้ที่สมัครในเครื่อง
  const [users, setUsers] = useState<Record<string, string>>({
    demo: '1234',
  });

  const handleSubmit = () => {
    setErrorMsg('');
    const cleanUser = username.trim();

    if (!cleanUser || !password.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    if (isRegister) {
      if (users[cleanUser]) {
        setErrorMsg('ชื่อผู้ใช้นี้มีในระบบแล้ว กรุณาใช้ชื่ออื่น');
        return;
      }
      setUsers({ ...users, [cleanUser]: password });
      onLoginSuccess(cleanUser);
    } else {
      if (users[cleanUser] === password) {
        onLoginSuccess(cleanUser);
      } else {
        setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ทดลองใช้ demo / 1234)');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoBox}>
        <Bell size={44} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Save and Bell</Text>
      <Text style={styles.subtitle}>บันทึกของสำคัญ พร้อมเสียงเตือนก่อนออกจากบ้าน</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>
          {isRegister ? 'สมัครสมาชิกใหม่' : 'เข้าสู่ระบบ'}
        </Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <Text style={styles.label}>ชื่อผู้ใช้ (Username)</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกชื่อผู้ใช้..."
          placeholderTextColor={COLORS.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>รหัสผ่าน (Password)</Text>
        <TextInput
          style={styles.input}
          placeholder="กรอกรหัสผ่าน..."
          placeholderTextColor={COLORS.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
          <Text style={styles.primaryBtnText}>
            {isRegister ? 'สมัครสมาชิกและเข้าใช้งาน' : 'เข้าสู่ระบบ'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => {
            setIsRegister(!isRegister);
            setErrorMsg('');
          }}
        >
          <Text style={styles.switchBtnText}>
            {isRegister
              ? 'มีบัญชีอยู่แล้ว? กลับไปเข้าสู่ระบบ'
              : 'ยังไม่มีบัญชี? สมัครสมาชิกที่นี่'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
    justifyContent: 'center',
    padding: 24,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    backgroundColor: COLORS.dangerBg,
    color: COLORS.danger,
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.bgMain,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});