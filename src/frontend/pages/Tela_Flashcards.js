import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import MenuBar from "../components/MenuBar";
import TopNavbar from "../components/TopNavbar";

export default function FlashcardsScreen({ navigation }) {
  const materias = [
    { nome: "Linguagens", icone: require("../assets/pilha-de-livros.png") },
    { nome: "Matemática", icone: require("../assets/matematica.png") },
    { nome: "Ciências", icone: require("../assets/ambiental.png") },
    { nome: "Humanas", icone: require("../assets/livro-de-historia.png") },
  ];

  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.45; // 45% da largura da tela para ficar responsivo

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar superior */}
      <View style={styles.navbarContainer}>
        <TopNavbar />
      </View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {materias.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: cardWidth, height: cardWidth }]}
              onPress={() =>
                navigation.navigate("FlashcardsMateria", { materia: item.nome })
              }
            >
              <Image source={item.icone} style={styles.icone} />
              <Text style={styles.texto}>{item.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Menu inferior fixo */}
      <View style={styles.menuBarContainer}>
        <MenuBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b4e91ff",
  },
  navbarContainer: {
    backgroundColor: "#0b4e91ff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20, 
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  icone: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
  texto: {
    fontWeight: "bold",
    color: "#2f3640",
    fontSize: 25,
    textAlign: "center",
  },
  menuBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    zIndex: 1000,
    elevation: 10,
  },
});
