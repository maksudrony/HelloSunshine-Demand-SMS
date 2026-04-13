import axios from 'axios';

// IMPORTANT: Replace 192.168.1.X with your actual IPv4 address!
const API_BASE_URL = 'http://10.0.2.2:5284/api/SmsSync'; 

// Updated Interface Name to match your new Oracle Table: SUNSHINE_MOBILE_SMS_202604
export interface SunshineMobileSms_202604 {
  SMS_FROM_MOBILE: string;
  SMS_TEXT: string;
  SMS_ID: number;
  SMS_DEVICE_DATE: string; // Format MUST be: "MM/DD/YYYY HH24:MI:SS"
  READ_FLAG: string;       
  LICENCE_NO: string;      
  APP_VERSION: string;     
}

// Updated function to use the new interface
export const syncSmsToDatabase = async (smsList: SunshineMobileSms_202604[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sync`, smsList, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, 
    });

    return response.data; 

  } catch (error: any) {
    if (error.response) {
      console.error('The .NET API rejected the request:', error.response.data);
    } else if (error.request) {
      console.error('The app could not reach the PC. Check the IP address and Windows Firewall.');
    }
    return { success: false, Message: "Failed to connect to the server." };
  }
};