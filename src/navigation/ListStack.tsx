import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from '../screens/ListScreen';
import DetailScreen from '../screens/DetailScreen';

export type ListStackParamList = {
  List: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<ListStackParamList>();

export default function ListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}
