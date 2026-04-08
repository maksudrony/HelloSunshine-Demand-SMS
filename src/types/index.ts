// ─── SMS Data Models ───────────────────────────────────────────
export type SMSType = 'Deposit' | 'Delivery' | 'Invalid';

export interface SMSMessage {
  id: string; // Unique ID from device inbox
  sender: string; // Phone number
  body: string; // Full text
  timestamp: string; // ISO Date string or formatted time
  type: SMSType; 
}

// ─── SMS Stats (read from device inbox) ───────────────────────
export interface SMSReceivedStats {
  depositSMS: number;
  deliverySMS: number;
  invalidSMS: number;
  totalSMS: number;
}

// ─── Data Process Stats (local calculation + API sync) ────────
export interface DataProcessStats {
  pending: number;
  process: number;
  invalid: number;
  totalProcess: number;
}

// ─── Dashboard combined state ──────────────────────────────────
export interface DashboardStats {
  smsReceived: SMSReceivedStats;
  dataProcess: DataProcessStats;
}

// ─── Licence & Network Status ──────────────────────────────────
export interface AppStatus {
  isWifiConnected: boolean;
  isLicenceVerified: boolean;
  statusMessage: string;
}

// ─── SMS Service State ─────────────────────────────────────────
export interface SMSServiceState {
  isEnabled: boolean;
}

// ─── Navigation Types ──────────────────────────────────────────
export type RootStackParamList = {
  Dashboard: undefined;
  SMSNotSynced: undefined;
  SMSNotProcessed: undefined;
  SMSReport: undefined;
};