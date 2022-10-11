
import { ThemeProvider } from 'styled-components'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme';
import { Text, View } from 'react-native';
import React from 'react';
import Register from './src/screens/Register';

import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './src/routes/app.routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });


  if (!fontsLoaded) {
    return <View><Text>Carregando</Text></View>
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <View style={{ backgroundColor: '#eee', flex: 1 }}>
          <AppRoutes />
        </View>
      </NavigationContainer>
    </ThemeProvider >
  );
}


