// src/components/TopNavbar.js
import React from "react";
import { View, Image, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TopNavbar() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Ícone esquerdo - Conquests */}
      <Pressable
        style={styles.iconButton}
        onPress={() => navigation.navigate("Conquistas")}
      >
        <Image
          source={require("../assets/Conquests_Icon.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>

      {/* Logo central */}
      <Image
        source={require("../assets/Macawdemy_Letreiro.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Ícone direito - Perfil */}
      <Pressable
        style={styles.iconButton}
        onPress={() => navigation.navigate("PerfilUsuario")}
      >
        <Image
          source={require("../assets/user.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        {/* Badge de XP / Estrela */}
        <View style={styles.badgeContainer}>
          <Image
            source={require("../assets/star.png")}
            style={styles.star}
          />
          <Text style={styles.badgeText}>12</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    elevation: 4,
  },
  iconButton: {
    height: 65,
    width: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: "80%",
    width: "80%",
  },
  logo: {
    width: 220,
    height: 90,
  },
  badgeContainer: {
    position: "absolute",
    height: 30,
    width: 30,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    height: 25,
    width: 25,
  },
  badgeText: {
    position: "absolute",
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 12,
    top: 8,
    alignSelf: "center",
  },
});
