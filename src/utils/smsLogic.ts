import { SMSType } from '../types/index';

export const determineSmsType = (body: string): SMSType => {
  // Convert to uppercase to handle "dlv", "DLV", "Dpv", etc. safely
  const normalizedBody = body.trim().toUpperCase();
  
  if (normalizedBody.startsWith('DPZ')) {
        return 'Deposit';
    }
  if (normalizedBody.startsWith('DLV')) {
    return 'Delivery';
    }
  return 'Invalid';
};