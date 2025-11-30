import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const imagens = {
  PlanoEstudos: require("../assets/PlanoEstudos_Icon.png"),
  Flashcards: require("../assets/Flashcards_Icon.png"),
  Home: require("../assets/Home_Icon.png"),
  Desafios: require("../assets/Desafios_Icon.png"),
  Ranking: require("../assets/Ranking_Icon.png"),
};

export default function MenuBar() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.nav}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate("PlanoDeEstudos")}
          >
            <Image
              style={styles.icon}
              source={imagens.PlanoEstudos}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoMaior}
            onPress={() => navigation.navigate("Flashcard")}
          >
            <Image
              style={styles.iconMaior}
              source={imagens.Flashcards}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Botão central */}
        <View style={styles.sectionMeio}>
          <TouchableOpacity
            style={styles.botaoMeio}
            onPress={() => navigation.navigate("Principal")}
          >
            <Image
              style={styles.iconMeio}
              source={imagens.Home}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Lado direito */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.botaoMaior}
            onPress={() => navigation.navigate("Desafios")}
          >
            <Image
              style={styles.iconMaior}
              source={imagens.Desafios}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate("Ranking")}
          >
            <Image
              style={styles.icon}
              source={imagens.Ranking}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: "100%",
    backgroundColor: "#eef9ffff",
    position: "absolute",
    bottom: 0,
  },
  nav: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  section: {
    height: "100%",
    width: "33%",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    gap: 20,
  },
  sectionMeio: {
    height: 90,
    width: 90,
    borderRadius: 45,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#eef9ffff",
  },
  botao: {
    height: 55,
    width: 55,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoMaior: {
    height: 55,
    width: 55,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoMeio: {
    height: 70,
    width: 70,
    backgroundColor: "#eef9ffff",
    borderRadius: 35,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 40,
    width: 40,
  },
  iconMaior: {
    height: 50,
    width: 50,
  },
  iconMeio: {
    height: 50,
    width: 50,
  },
});
