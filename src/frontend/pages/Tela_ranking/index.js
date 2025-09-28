import React from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Para a coroa
import MenuBar from "../../components/MenuBar";
// --- 1. Dados de Exemplo ---
const rankingData = [
  { id: 1, rank: 1, name: "Usuário TOP 1", xp: 950000, studyTime: "15:30" },
  { id: 2, rank: 2, name: "Usuário TOP 2", xp: 820000, studyTime: "14:15" },
  { id: 3, rank: 3, name: "Usuário TOP 3", xp: 750000, studyTime: "13:00" },
  { id: 4, rank: 4, name: "<Usuário>", xp: 600000, studyTime: "10:00" },
  { id: 5, rank: 5, name: "<Usuário>", xp: 550000, studyTime: "10:00" },
  { id: 6, rank: 6, name: "<Usuário>", xp: 500000, studyTime: "10:00" },
  { id: 7, rank: 7, name: "<Usuário>", xp: 450000, studyTime: "10:00" },
  { id: 8, rank: 8, name: "<Usuário>", xp: 400000, studyTime: "10:00" },
  { id: 9, rank: 9, name: "<Usuário>", xp: 350000, studyTime: "10:00" },
];

const topThree = rankingData.slice(0, 3);
const lowerRanking = rankingData.slice(3);

// --- 2. Componente de Item da Lista (4º em diante) ---
const RankingItem = ({ rank, name, xp, studyTime }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.rankText}>{rank}</Text>
    <View style={styles.profileIconSmall}>
      <Icon name="person" size={20} color="#3b82f6" />
    </View>
    <View style={styles.infoBlock}>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.detailText}>Xp: {xp.toLocaleString("pt-BR")}</Text>
    </View>
    <Text style={styles.studyTimeText}>Tempo de Estudo: {studyTime}</Text>
  </View>
);

// --- 3. Componente Top 3 em Destaque ---
const TopThreeDisplay = () => {
  // Organiza para a ordem da tela: 3º, 1º, 2º
  const third = topThree.find((u) => u.rank === 3);
  const first = topThree.find((u) => u.rank === 1);
  const second = topThree.find((u) => u.rank === 2);

  const TopThreeItem = ({ rank, isMain }) => {
    return (
      <View style={[styles.topThreeItem, isMain && styles.mainRankContainer]}>
        <View
          style={[
            styles.topThreeIconBackground,
            isMain ? styles.firstPlaceBg : styles.otherPlaceBg,
          ]}
        >
          {isMain && (
            <FontAwesome5
              name="crown"
              size={18}
              color="#FFD700"
              style={styles.crownIcon}
            />
          )}
          <Icon name="person" size={isMain ? 40 : 30} color="#fff" />
        </View>
        <Text style={styles.topThreeRank}>{rank}</Text>
      </View>
    );
  };

  return (
    <View style={styles.topThreeContainer}>
      {/* 3º Lugar */}
      {third && <TopThreeItem {...third} />}

      {/* 1º Lugar */}
      {first && <TopThreeItem {...first} isMain={true} />}

      {/* 2º Lugar */}
      {second && <TopThreeItem {...second} />}
    </View>
  );
};

// --- 4. Componente Principal da Tela ---
export default function RankingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1930" />

      {/* Cabeçalho Fixo */}
      <View delay={300} animation={"fadeInDown"} style={styles.header}>
        <Pressable
          style={styles.botao}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Image
            source={require("../../assets/trophy.png")}
            style={{ height: "80%", width: "80%" }}
          />
        </Pressable>
        <Pressable
          style={styles.botao}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Image
            source={require("../../assets/user.png")}
            style={{ height: "100%", width: "100%" }}
          />
          <View
            style={{
              position: "absolute",
              height: 20,
              width: 20,
              bottom: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/star.png")}
              style={{ height: 20, width: 20 }}
            />
            <Text
              style={{
                position: "absolute",
                fontWeight: "bold",
                color: "#FFF",
                alignSelf: "center",
                fontSize: 8,
                top: 5,
              }}
            >
              12
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Conteúdo Principal (Scrollable) */}
      <View style={styles.mainContent}>
        <Text style={styles.rankingTitle}></Text>

        {/* Top 3 */}
        <TopThreeDisplay />

        {/* Separador da lista */}
        <View style={styles.separator}>
          <Icon name="reorder-three-outline" size={30} color="#0a1930" />
        </View>

        {/* Lista do 4º em diante */}
        <ScrollView style={styles.listContainer}>
          {lowerRanking.map((item) => (
            <RankingItem key={item.id} {...item} />
          ))}
          {/* Linha adicional para o 10º */}
          <RankingItem
            rank={10}
            name={"<Usuário>"}
            xp={250000}
            studyTime={"10:00"}
          />
        </ScrollView>
      </View>

      {/* Menu Inferior Fixo */}
      <MenuBar />
    </SafeAreaView>
  );
}

// --- 5. Estilos ---
const BLUE_BG = "#0a1930";
const LIGHT_BLUE = "#3b82f6";
const WHITE = "#ffffff";
const OFF_WHITE = "#f3f4f6";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#338BE5",
  },

  // --- Header ---
  header: {
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
    height: 60,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    elevation: 5,
  },
  botao: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: "bold",
  },

  // --- Main Content ---
  mainContent: {
    flex: 1,
    backgroundColor: "white", // Fundo branco do card principal
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    marginHorizontal: 10, // Simula a margem do iPhone
    borderRadius: 15,
    marginBottom: 10,
  },
  rankingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: BLUE_BG,
  },

  // --- Top 3 Styles ---
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  topThreeItem: {
    alignItems: "center",
    width: "30%",
  },
  mainRankContainer: {
    marginTop: -20, // Move o primeiro lugar para cima
  },
  topThreeIconBackground: {
    borderRadius: 50,
    padding: 10,
    backgroundColor: LIGHT_BLUE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 5,
  },
  firstPlaceBg: {
    backgroundColor: BLUE_BG,
    padding: 15,
    borderWidth: 4,
    borderColor: "#FFD700", // Dourado
  },
  otherPlaceBg: {
    backgroundColor: LIGHT_BLUE,
    padding: 10,
  },
  crownIcon: {
    position: "absolute",
    top: -15,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  topThreeRank: {
    fontWeight: "bold",
    fontSize: 22,
    color: BLUE_BG,
  },

  // --- Separator ---
  separator: {
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: OFF_WHITE,
    marginHorizontal: 10,
  },

  // --- List Styles (4º em diante) ---
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: OFF_WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    width: 25, // Largura fixa para alinhamento
    textAlign: "center",
    color: BLUE_BG,
  },
  profileIconSmall: {
    borderRadius: 20,
    padding: 5,
    backgroundColor: WHITE,
    marginHorizontal: 10,
  },
  infoBlock: {
    flex: 1,
    marginLeft: 5,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: BLUE_BG,
  },
  detailText: {
    fontSize: 12,
    color: "#6b7280",
  },
  studyTimeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "right",
  },

  // --- Navigation Bar ---
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: BLUE_BG,
  },
  navItem: {
    padding: 5,
  },
});
