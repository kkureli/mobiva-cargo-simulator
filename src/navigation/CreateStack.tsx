import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreen from '../screens/CreateScreen';

export type CreateStackParamList = {
  Create: undefined;
};

const Stack = createNativeStackNavigator<CreateStackParamList>();

export default function CreateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Create" component={CreateScreen} />
    </Stack.Navigator>
  );
}
