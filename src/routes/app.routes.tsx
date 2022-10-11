import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native';
const { Navigator, Screen } = createBottomTabNavigator();

import { useTheme } from 'styled-components';
import { MaterialIcons } from '@expo/vector-icons'
import Dashboard from '../screens/Dashboard'
import Register from '../screens/Register'

export function AppRoutes() {

    const theme = useTheme()

    return (
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarLabelPosition: 'beside-icon',
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                }
            }}>
            <Screen
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons name='format-list-bulleted' size={size} color={color} />
                    )
                }}
                name='Listagem'
                component={Dashboard}
            />

            <Screen
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons name='attach-money' size={size} color={color} />
                    )
                }}
                name='Cadastrar'
                component={Register}
            />

            <Screen
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons name='pie-chart' size={size} color={color} />
                    )
                }}
                name='Resumo'
                component={Register}
            />
        </Navigator >
    )
}