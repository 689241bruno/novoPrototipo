import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const imagens = {
  PlanoEstudos: require("../../assets/PlanoEstudos_Icon.png"),
  Flashcards: require("../../assets/Flashcards_Icon.png"),
  Home: require("../../assets/Home_Icon.png"),
  Ranking: require("../../assets/Ranking_Icon.png"),
  Config: require("../../assets/Config_Icon.png"),
};

export default function MenuBar() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {/* Lado esquerdo */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.botao}
            onPress={() => navigation.navigate("PlanoEstudos")}
          >
            <Image
              style={styles.icon}
              source={imagens.PlanoEstudos}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao}
            onPress={() => navigation.navigate("Flashcards")}
          >
            <Image
              style={styles.icon}
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
            style={styles.botao}
            onPress={() => navigation.navigate("Ranking")}
          >
            <Image
              style={styles.icon}
              source={imagens.Ranking}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao}
            onPress={() => navigation.navigate("Config")}
          >
            <Image
              style={styles.icon}
              source={imagens.Config}
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
    height: 90,
    width: "100%",
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    elevation: 5,
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
    justifyContent: "center",
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
    backgroundColor: "#FFF",
    elevation: 5,
  },
  botao: {
    height: 55,
    width: 55,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoMeio: {
    height: 70,
    width: 70,
    backgroundColor: "#f1f1f1ff",
    borderRadius: 35,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 40,
    width: 40,
  },
  iconMeio: {
    height: 50,
    width: 50,
  },
});
