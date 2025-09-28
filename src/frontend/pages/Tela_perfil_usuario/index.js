import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

// --- 1. Dados de Exemplo ---
const userData = {
  name: "Seu Nome",
  xp: 150000,
  ranking: 12,
  bestGrade: "9.5/10",
  lastActivity: "12/09/2025",
  memberSince: "01/01/2024",
};

// --- 2. Componente de Conteúdo do Perfil ---
export default function ProfileContent() {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
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
      <View style={styles.mainContent}>
        {/* Bloco do Avatar e Nome */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={70} color="#fff" />
          </View>
          <Text style={styles.nameText}>{"<Nome>"}</Text>
        </View>

        {/* Bloco de Estatísticas */}
        <View style={styles.statsBlock}>
          <Text style={styles.statText}>
            <Text style={styles.statLabel}>XP:</Text>{" "}
            {userData.xp.toLocaleString("pt-BR")}
          </Text>
          <Text style={styles.statText}>
            <Text style={styles.statLabel}>Ranking:</Text>{" "}
            {userData.ranking.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.statText}>
            <Text style={styles.statLabel}>Melhor Nota:</Text>{" "}
            {userData.bestGrade}
          </Text>
          <Text style={styles.statText}>
            <Text style={styles.statLabel}>Última Atividade:</Text>{" "}
            {userData.lastActivity}
          </Text>
        </View>

        {/* Conquistas (Achievements) */}
        <View style={styles.achievementsBlock}>
          <Text style={styles.statLabel}>Conquistas:</Text>
          <View style={styles.achievementsIcons}>
            {/* Taça/Troféu */}
            <TouchableOpacity style={styles.achievementIconContainer}>
              <FontAwesome5 name="trophy" size={35} color="#FFD700" />
            </TouchableOpacity>
            {/* Estrela */}
            <TouchableOpacity style={styles.achievementIconContainer}>
              <Icon name="star" size={45} color="#00FFFF" />
            </TouchableOpacity>
            {/* Gráfico */}
            <TouchableOpacity style={styles.achievementIconContainer}>
              <Icon name="bar-chart" size={35} color="#3b82f6" />
            </TouchableOpacity>
            {/* Placeholder/Mais */}
            <TouchableOpacity style={styles.achievementIconContainer}>
              <Text style={styles.moreAchievements}>...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informação de Membro Desde */}
        <View style={styles.memberSinceBlock}>
          <Text style={styles.memberSinceText}>
            <Text style={styles.statLabel}>Por aqui desde:</Text>{" "}
            {userData.memberSince}
          </Text>
        </View>

        {/* Menu de Configurações/Ajuda */}
        <View style={styles.settingsMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon
              name="cog"
              size={20}
              color="#3b82f6"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon
              name="help-circle"
              size={20}
              color="#3b82f6"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Ajuda (FAQ)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// --- 3. Estilos ---
const BLUE_BG = "#0a1930";
const DARK_BLUE = "#10203e";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: 20,
    marginBottom: 150,
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
  // O scrollContent serve como o fundo azul escuro que envolve o "card" branco
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#338BE5",
    paddingTop: 30,
  },

  // --- Card Branco Principal ---
  mainContent: {
    backgroundColor: WHITE,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 0,
    marginBottom: 30, // Espaço antes da barra de navegação inferior
    // Sombra simples (opcional)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // --- Avatar Block ---
  avatarBlock: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DARK_BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50, // Move para cima para simular sobreposição
    borderWidth: 5,
    borderColor: WHITE,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: DARK_BLUE,
    marginTop: 5,
  },

  // --- Stats Block ---
  statsBlock: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 15,
  },
  statText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  statLabel: {
    fontWeight: "bold",
    color: DARK_BLUE,
  },

  // --- Achievements Block ---
  achievementsBlock: {
    marginBottom: 15,
  },
  achievementsIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-around", // Distribui os ícones
    paddingHorizontal: 20,
  },
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  moreAchievements: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 5,
  },

  // --- Member Since Block ---
  memberSinceBlock: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 15,
    alignItems: "center",
  },
  memberSinceText: {
    fontSize: 14,
    color: "#444",
  },

  // --- Settings Menu ---
  settingsMenu: {
    paddingVertical: 10,
    borderTopWidth: 1, // Simula a linha divisória vertical
    borderTopColor: "#eee",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuIcon: {
    marginRight: 10,
    width: 20,
  },
  menuText: {
    fontSize: 16,
    color: DARK_BLUE,
  },
});
