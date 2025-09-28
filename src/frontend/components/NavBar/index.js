// Arquivo: src/navigation/MainTabNavigator.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Usando ícones de exemplo (você pode trocar pelos seus!)

// 1. Importe suas telas
import TelaPerfil from "../../pages/Tela_perfil_usuario";
import TelaRanking from "../../pages/Tela_ranking";

// Cria o hook do Tab Navigator
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Principal" // Define a tela principal como a rota inicial
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Lógica para definir os ícones
            if (route.name === "Principal") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Perfil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Ranking") {
              iconName = focused ? "trophy" : "trophy-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // Estilização da Navbar
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            height: 60,
            paddingBottom: 5,
          },
          headerShown: false, // Oculta o cabeçalho de cada tela
        })}
      >
        {/* 2. Definição das Telas na Navbar */}
        <Tab.Screen name="Principal" component={TelaPrincipal} />
        <Tab.Screen name="Ranking" component={TelaRanking} />
        <Tab.Screen name="Perfil" component={TelaPerfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabNavigator;
