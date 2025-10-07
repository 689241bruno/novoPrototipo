import React from "react";
import MainTabNavigator from "../../components/NavBar";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import * as Progress from "react-native-progress";
import ContainerMateria from "../../components/containerMateria";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import MenuBar from "../../components/MenuBar";

import Constants from "expo-constants";

const statusBarHeight = Constants.statusBarHeight;

export default function Home() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.conatiner}>
      <Animatable.View
        delay={300}
        animation={"fadeInDown"}
        style={styles.header}
      >
        <Pressable style={styles.botao}>
          <Image
            source={require("../../assets/Conquests_Icon.png")}
            style={{ height: 50, width: 50, marginLeft: 10 }}
          />
        </Pressable>
        <Image source={require("../../assets/Macawdemy_Letreiro.png")} resizeMode="contain" style={styles.imagehH1} />
        <View style={styles.rightIcons}>
          <Pressable style={styles.botao} onPress={() => navigation.navigate("Perfil")}>
            <Image source={require("../../assets/user.png")} style={{ height: "100%", width: "100%" }} />
            <View style={styles.userBadge}>
              <Image source={require("../../assets/star.png")} style={{ height: 20, width: 20 }} />
              <Text style={styles.userBadgeText}>12</Text>
            </View>
          </Pressable>
        </View>
      </Animatable.View>

      <ScrollView style={styles.main}>
        <Pressable
          onPress={() =>
            navigation.navigate("Linguagens", { materia: "Linguagens" })
          }
        >
          <ContainerMateria
            titulo="Linguagens"
            progress={0.7}
            nomeImage="Linguagens"
            delayanim={400}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("Matematica", { materia: "Matematica" })
          }
        >
          <ContainerMateria
            titulo="Matemática"
            progress={0.5}
            nomeImage="Matemática"
            delayanim={480}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("CienciasNatureza", { materia: "CienciasNatureza" })
          }
        >
          <ContainerMateria
            titulo="Ciências da Natureza"
            progress={0.1}
            nomeImage="CiênciasdaNatureza"
            delayanim={560}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("CienciasHumanas", { materia: "CienciasHumanas" })
          }
        >
          <ContainerMateria
            titulo="Ciências Humanas"
            progress={0.8}
            nomeImage="CiênciasHumanas"
            delayanim={640}
          />
        </Pressable>
        <ContainerMateria titulo="Redação" progress={0.4} nomeImage="Redação" />
        <View style={styles.footer}></View>
      </ScrollView>

      <MenuBar></MenuBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: "#338BE5",
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 5, backgroundColor: "#fff", elevation: 4, marginBottom: 10 },
  botao: { height: 40, width: 40, justifyContent: "center", alignItems: "center" },
  section: {
    width: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "red",
  },
  main: {
    padding: 30,
    paddingTop: 30,
    marginBottom: 60,
    display: "flex",
    flexDirection: "column",
  },

  containerMateria: {
    height: 210,
    width: "100%",
    alignSelf: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "gray",
    marginBottom: 30,
    display: "flex",
    flexDirection: "column",
  },
  tituloMateria: {
    fontSize: 24,
    fontWeight: "bold",
  },
  secaoPrincipal: {
    width: "100%",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: "65%",
    borderBottomWidth: 2,
    borderColor: "gray",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  secaoUm: {
    width: "70%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
  secaoDois: {
    width: "30%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageMateria: {
    height: "80%",
    width: "80%",
    backgroundColor: "#696969",
    borderRadius: 14,
  },
  descricaoMateria: {
    marginTop: 10,
    color: "#696969",
  },
  secaoSecundaria: {
    height: "35%",
    width: "100%",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 15,
  },
  botaoTreinar: {
    height: "50%",
    width: "25%",
    backgroundColor: "gray",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  footer: {
    height: 90,
  },
  imagehH1: { width: 220, height: 80, marginBottom: 10 },
});
