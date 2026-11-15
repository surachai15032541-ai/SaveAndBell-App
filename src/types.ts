// โครงสร้างข้อมูลของสิ่งของแต่ละชิ้น
export interface Item {
  id: string;
  name: string;
  checked: boolean;
  timeAdded: string;
  essential: boolean;
}

// โครงสร้างข้อมูลประวัติการใช้งานระบบ
export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  time: string;
}

// โครงสร้างข้อมูลการตั้งค่าแจ้งเตือนก่อนออกจากบ้าน
export interface ReminderSettings {
  enabled: boolean;
  time: string;
  destination: string;
}