import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateStack from './CreateStack';
import ListStack from './ListStack';
import CustomIcon, { CustomIconName } from '../ui/components/Icon';

export type RootTabParamList = {
  CreateTab: undefined;
  ListTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function renderTabBarIcon(
  routeName: keyof RootTabParamList,
  size: number,
  focused: boolean,
) {
  const icons = {
    CreateTab: 'PlusIcon',
    ListTab: 'ListIcon',
  };
  return (
    <CustomIcon
      name={icons[routeName] as CustomIconName}
      size={size}
      color={focused ? '#111827' : '#6b7280'}
    />
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          lazy: true,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb',
          },
          tabBarActiveTintColor: '#111827',
          tabBarInactiveTintColor: '#6b7280',
          tabBarIcon: ({ size, focused }) =>
            renderTabBarIcon(route.name, size, focused),
        })}
      >
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
