import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreen from '../screens/CreateScreen';
import ListScreen from '../screens/ListScreen';
import DetailScreen from '../screens/DetailScreen';

export type RootStackParamList = {
  Create: undefined;
  List: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Create">
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
