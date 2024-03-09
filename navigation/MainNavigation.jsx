import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import GenerateQuiz from "../screens/GenerateQuiz";
import { QuizzesProvider } from "../context/QuizzesProvider";
import Home from "../screens/Home";

const Tab = createBottomTabNavigator();

export default function BottomNavigationBarExample() {
  return (
    <QuizzesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={({ navigation, state, descriptors, insets }) => (
            <BottomNavigation.Bar
              navigationState={state}
              safeAreaInsets={insets}
              onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              }}
              renderIcon={({ route, focused, color }) =>
                descriptors[route.key].options.tabBarIcon?.({
                  focused,
                  color,
                  size: 24,
                }) || null
              }
              getLabelText={({ route }) => descriptors[route.key].route.name}
            />
          )}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => {
                return <Icon name="home" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="GenearteQuiz"
            component={GenerateQuiz}
            options={{
              tabBarIcon: ({ color, size }) => {
                return <Icon name="quiz" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => {
                return <Icon name="person" size={size} color={color} />;
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QuizzesProvider>
  );
}

BottomNavigationBarExample.title = "Bottom Navigation Bar";
