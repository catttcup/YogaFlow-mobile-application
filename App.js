import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MainExercises from './components/MainExercises';
import Music from './components/Music';
import Account from './components/Account';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        {/* Добавляем верхнюю полоску */}
        <View style={styles.topBar} />
        
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'rgb(93, 74, 57)',
            tabBarStyle: {
              backgroundColor: 'rgb(234, 216, 192)',
            },
          }}
        >
          
          <Tab.Screen
            name="Music"
            component={Music}
            options={{
              tabBarLabel: 'Музыка',
              tabBarIcon: ({ color, size }) => (
                <View style={{ width: size, height: size }}>
                  <Text style={{ color, fontSize: size }}></Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="MainExercises"
            component={MainExercises}
            options={{
              tabBarLabel: 'Упражнения',
              tabBarIcon: ({ color, size }) => (
                <View style={{ width: size, height: size }}>
                  <Text style={{ color, fontSize: size }}></Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Account"
            component={Account}
            options={{
              tabBarLabel: 'Аккаунт',
              tabBarIcon: ({ color, size }) => (
                <View style={{ width: size, height: size }}>
                  <Text style={{ color, fontSize: size }}></Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: '5%',
    backgroundColor: 'rgb(234, 216, 192)',
    width: '100%',
  },
});


