import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestSMSPermission = async (): Promise<boolean> => {
  // iOS doesn't have this specific SMS access, so we secure it for Android only
  if (Platform.OS !== 'android') return false; 

  try {
    Alert.alert('Debugging', 'Permission function triggered!');

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission Needed',
        message: 'HelloSunshine needs access to read your SMS to sync delivery and deposit data to the database.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Permission Request Error:', err);
    return false;
  }
};