// App.js
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainExercises from './components/MainExercises';
import Music from './components/Music';
import Account from './components/Account';
import YogaEkb from './components/YogaEkb';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.5;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export default function App() {
  const navigationRef = useRef(null);

  // Состояние модального окна
  const [modalVisible, setModalVisible] = useState(false);

  // Показываем модалку при старте
  useEffect(() => {
    setModalVisible(true);
  }, []);

  // Отслеживаем текущее имя роута
  const [currentRouteName, setCurrentRouteName] = useState();

  // Для анимации сайд-меню
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [menuOpen, setMenuOpen] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);

  // Запускаем анимацию при изменении состояния меню
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: menuOpen ? 0 : -MENU_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(v => !v);

  // При выборе пункта "Йога Екатеринбург" сначала анимируем закрытие меню, затем переходим на экран
  const menuItems = [
    {
      label: 'Йога Екатеринбург',
      onPress: () => {
        Animated.timing(translateX, {
          toValue: -MENU_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Сбрасываем состояние открытия меню после завершения анимации
          setMenuOpen(false);
          // Навигация выполняется после завершения анимации закрытия меню
          navigationRef.current?.navigate('YogaEkb');
        });
      },
    },
    {
      label: 'Настройки',
      onPress: () => {
        console.log('Открыть настройки');
        toggleMenu();
      },
    },
  ];

  const Tabs = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgb(93, 74, 57)',
        tabBarStyle: { backgroundColor: 'rgb(234, 216, 192)' },
      }}
    >
      <Tab.Screen
        name="Music"
        component={Music}
        options={{ tabBarLabel: 'Музыка', tabBarIcon: () => <View /> }}
      />
      <Tab.Screen
        name="MainExercises"
        component={MainExercises}
        options={{ tabBarLabel: 'Упражнения', tabBarIcon: () => <View /> }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{ tabBarLabel: 'Аккаунт', tabBarIcon: () => <View /> }}
      />
    </Tab.Navigator>
  );

  const isYogaScreen = currentRouteName === 'YogaEkb';

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const route = navigationRef.current.getCurrentRoute();
        setCurrentRouteName(route.name);
      }}
      onStateChange={() => {
        const route = navigationRef.current.getCurrentRoute();
        setCurrentRouteName(route.name);
      }}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#EAD8C0" />

        {/* Собственный TopBar и SideMenu отображаются, если мы не на экране YogaEkb */}
        {!isYogaScreen && (
          <>
            <View
              style={[styles.topBar, { paddingTop: STATUS_BAR_HEIGHT }]}
              onLayout={e => setTopBarHeight(e.nativeEvent.layout.height)}
            >
              <TouchableOpacity onPress={toggleMenu} style={styles.burgerButton}>
                <View style={styles.burgerIcon}>
                  <View style={styles.bar} />
                  <View style={styles.bar} />
                  <View style={styles.bar} />
                </View>
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.sideMenu,
                {
                  top: topBarHeight,
                  height: SCREEN_HEIGHT - topBarHeight,
                  transform: [{ translateX }],
                },
              ]}
            >
              {menuItems.map((item, idx) => (
                <Pressable key={idx} onPress={item.onPress} style={styles.menuItem}>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </Animated.View>
          </>
        )}

        {/* Стек навигации */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />

          <Stack.Screen
            name="YogaEkb"
            component={YogaEkb}
            options={{
              headerShown: true,
              title: 'Йога Екатеринбург',
              headerStyle: {
                backgroundColor: 'rgb(234, 216, 192)',
                height: 80,
              },
              headerTintColor: 'rgb(93, 74, 57)',
              headerLeftContainerStyle: {
                paddingTop: 12,
                paddingLeft: 8,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                paddingTop: 12,
              },
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>

        {/* Модальное уведомление безопасности */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Уведомление о безопасности</Text>
              <Text style={styles.modalBody}>
                Ыаы я текст, напишите меня
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Понятно</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    backgroundColor: 'rgb(234, 216, 192)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 20,
  },
  burgerButton: { padding: 8 },
  burgerIcon: { justifyContent: 'center' },
  bar: {
    width: 24,
    height: 3,
    backgroundColor: 'rgb(93, 74, 57)',
    borderRadius: 2,
    marginVertical: 2,
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: 'rgba(229, 211, 186, 0.9)',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderColor: 'rgba(93, 74, 57, 0.9)',
    borderWidth: 1,
    paddingTop: 16,
    zIndex: 10,
  },
  menuItem: { paddingVertical: 16, paddingHorizontal: 20 },
  menuItemText: { fontSize: 16, color: 'rgb(93, 74, 57)' },

  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'rgb(93, 74, 57)',
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 20,
    color: 'rgb(93, 74, 57)',
  },
  modalButton: {
    backgroundColor: 'rgb(234, 216, 192)',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'rgb(93, 74, 57)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});