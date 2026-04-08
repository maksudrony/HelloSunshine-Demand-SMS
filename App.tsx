import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import './global.css';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#E8531F" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;