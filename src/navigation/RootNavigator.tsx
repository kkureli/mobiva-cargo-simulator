import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateStack from './CreateStack';
import ListStack from './ListStack';

export type RootTabParamList = {
  CreateTab: undefined;
  ListTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, lazy: true }}>
        <Tab.Screen
          name="CreateTab"
          component={CreateStack}
          options={{ title: 'Create' }}
        />
        <Tab.Screen
          name="ListTab"
          component={ListStack}
          options={{ title: 'List' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
