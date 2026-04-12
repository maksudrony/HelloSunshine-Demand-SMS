import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/index';
import SMSNotSyncedScreen from '@screens/SMSNotSyncedScreen';
import DashboardScreen from '@screens/DashboardScreen';
import SMSNotProcessedScreen from '@screens/SMSNotProcessedScreen';
import SMSReportScreen from '@screens/SMSReportScreen';

// Placeholder screens (will build these next)
import {View, Text, StyleSheet} from 'react-native';

const PlaceholderScreen = ({route}: any) => (
  <View style={styles.container}>
    <Text>{route.name} — Coming Soon</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="SMSNotSynced" component={SMSNotSyncedScreen} />
        <Stack.Screen name="SMSNotProcessed" component={SMSNotProcessedScreen} />
        <Stack.Screen name="SMSReport" component={SMSReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;