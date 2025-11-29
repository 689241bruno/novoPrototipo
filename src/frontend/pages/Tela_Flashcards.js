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
import * as Animatable from "react-native-animatable";
import MenuBar from "../components/MenuBar";
import TopNavbar from "../components/TopNavbar";

export default function FlashcardsScreen({ navigation }) {
  const materias = [
    {
      nome: "Linguagens",
      icone: require("../assets/pilha-de-livros.png"),
      descricao: "Português, Literatura, Inglês e Artes.",
    },
    {
      nome: "Exatas",
      icone: require("../assets/matematica.png"),
      descricao: "Álgebra, Geometria, Estatística e Funções.",
    },
    {
      nome: "Ciências da Natureza",
      icone: require("../assets/ambiental.png"),
      descricao: "Física, Química e Biologia.",
    },
    {
      nome: "Ciências Humanas",
      icone: require("../assets/livro-de-historia.png"),
      descricao: "História, Geografia, Filosofia e Sociologia.",
    },
  ];

  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.85;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNavbar />

      {/* Container branco centralizado */}
      <Animatable.View
        delay={300}
        animation="fadeInUp"
        style={styles.whiteContainer}
      >
        <Text style={styles.title}>Escolha uma matéria</Text>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {materias.map((item, index) => (
            <Animatable.View
              key={index}
              delay={index * 100}
              animation="fadeInUp"
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.card, { width: cardWidth }]}
                onPress={() =>
                  navigation.navigate("FlashcardsMateria", {
                    materia: item.nome,
                  })
                }
              >
                <View style={styles.imageContainer}>
                  <Image source={item.icone} style={styles.icone} />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.texto}>{item.nome}</Text>
                  <Text style={styles.descricao}>{item.descricao}</Text>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>
      </Animatable.View>

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
    justifyContent: "space-between",
  },

  whiteContainer: {
    height: "80%",
    margin: 20,
    backgroundColor: "#ececec",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "700",
    color: "#0b4e91",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    padding: 14,
    margin: 10,
    height: 180,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  icone: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  texto: {
    fontWeight: "700",
    color: "#0b4e91",
    fontSize: 22,
    marginBottom: 6,
  },
  descricao: {
    color: "#4b5863",
    fontSize: 18,
  },
  menuBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    elevation: 10,
  },
});
