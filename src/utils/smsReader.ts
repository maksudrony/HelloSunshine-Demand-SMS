import SmsAndroid from 'react-native-get-sms-android';
import { SMSMessage } from '../types/index';
import { determineSmsType } from './smsLogic';

export const fetchDeviceSMS = async (): Promise<SMSMessage[]> => {
  return new Promise((resolve, reject) => {
    // We only want to read the inbox
    const filter = {
      box: 'inbox', 
      maxCount: 100, // Fetch the last 100 messages for performance
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: any) => {
        console.error('Failed to fetch SMS:', fail);
        reject(fail);
      },
      (count: number, smsList: string) => {
        try {
          const rawMessages = JSON.parse(smsList);
          
          const formattedMessages: SMSMessage[] = rawMessages.map((msg: any) => {
            // Convert Android timestamp (milliseconds) to readable date
            const dateObj = new Date(msg.date);
            const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            return {
              id: msg._id.toString(),
              sender: msg.address,
              body: msg.body,
              timestamp: formattedDate,
              type: determineSmsType(msg.body), // Your logic from Phase 1
            };
          });

          resolve(formattedMessages);
        } catch (error) {
          console.error('Error parsing SMS:', error);
          reject(error);
        }
      }
    );
  });
};