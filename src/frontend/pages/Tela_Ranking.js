import React, { useState, useEffect } from "react";

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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MenuBar from "../components/MenuBar";
import TopNavbar from "../components/TopNavbar";

const API_URL = "https://api-tcc-9lha.onrender.com/alunos/ranking-geral";

const RankingItem = ({ rank, name, xp, studyTime, photoUrl }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.rankText}>{rank}</Text>
    {photoUrl ? (
      <Image source={{ uri: photoUrl }} style={styles.profileImageSmall} />
    ) : (
      <View style={styles.profileIconSmall}>
        <Icon name="person" size={20} color="#3b82f6" />{" "}
      </View>
    )}
    <View style={styles.infoBlock}>
      <Text style={styles.nameText}>{name}</Text>

      <Text style={styles.detailText}>
        Xp: {xp ? xp.toLocaleString("pt-BR") : "0"}
      </Text>
    </View>
    <Text style={styles.studyTimeText}>
      Tempo de Estudo: {studyTime || "00:00"}
    </Text>
  </View>
);

const TopThreeDisplay = ({ topThreeData }) => {
  const first = topThreeData.find((u) => u.rank === 1);
  const second = topThreeData.find((u) => u.rank === 2);
  const third = topThreeData.find((u) => u.rank === 3);

  const displayOrder = [third, first, second];

  const TopThreeItem = ({ rank, name, xp, studyTime, photoUrl }) => {
    const isMain = rank === 1;

    return (
      <View style={[styles.topThreeItem, isMain && styles.mainRankContainer]}>
        <View
          style={[
            styles.topThreeIconBackground,
            isMain ? styles.firstPlaceBg : styles.otherPlaceBg,
          ]}
        >
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={
                isMain ? styles.profileImageBig : styles.profileImageMedium
              }
              resizeMode="cover"
            />
          ) : (
            <Icon name="person" size={isMain ? 40 : 30} color="#fff" />
          )}
          <Text style={styles.topThreeRank}>{rank}°</Text>
          <Text style={styles.topThreeName}>{name}</Text>
          <Text style={styles.topThreeDetail}>
            XP: {xp ? xp.toLocaleString("pt-BR") : 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.topThreeContainer}>
      {displayOrder.map((user, index) =>
        user ? (
          <TopThreeItem key={user.rank} {...user} />
        ) : (
          <View key={index} style={styles.topThreeItemPlaceholder} />
        )
      )}
    </View>
  );
};

export default function RankingScreen() {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();

      let currentRank = 1;
      let previousXp = -1;
      let tiedUsersCount = 0;

      const formattedData = data.map((item, index) => {
        const currentXp = parseInt(item.xp, 10);

        if (currentXp !== previousXp) {
          currentRank = index + 1;
          tiedUsersCount = 0;
        } else {
          tiedUsersCount++;
        }

        previousXp = currentXp;

        return {
          id: item.id,
          rank: currentRank - tiedUsersCount,
          name: item.nome,
          xp: currentXp,
          studyTime: item.studyTime || "00:00",

          photoUrl: item.url_foto,
        };
      });

      setRankingData(formattedData);
    } catch (error) {
      console.error("Falha ao buscar o ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const topThree = rankingData.slice(0, 3);
  const lowerRanking = rankingData.slice(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNavbar />
      <StatusBar barStyle="light-content" backgroundColor="#0a1930" />

      <View style={styles.mainContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando Ranking...</Text>
          </View>
        ) : (
          <>
            <TopThreeDisplay topThreeData={topThree} />

            <View style={styles.separator}>
              <Icon name="reorder-three-outline" size={30} color="#0a1930" />
            </View>

            <ScrollView style={styles.listContainer}>
              {lowerRanking.length > 0 ? (
                lowerRanking.map((item) => (
                  <RankingItem key={item.id} {...item} />
                ))
              ) : (
                <Text style={styles.emptyListText}>
                  Nenhum outro aluno encontrado no ranking.
                </Text>
              )}
            </ScrollView>
          </>
        )}
      </View>

      <MenuBar />
    </SafeAreaView>
  );
}

const BLUE_BG = "#0a1930";
const LIGHT_BLUE = "#3b82f6";
const WHITE = "#ffffff";
const OFF_WHITE = "#f3f4f6";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b4e91ff",
    justifyContent: "space-between",
  },

  mainContent: {
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 45,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  profileIconSmall: {
    padding: 5,
    backgroundColor: WHITE,
    marginHorizontal: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  profileImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    color: BLUE_BG,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#6b7280",
  },

  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  topThreeItem: {
    alignItems: "center",
    width: "30%",
  },
  topThreeItemPlaceholder: {
    width: "30%",
  },
  mainRankContainer: {
    marginTop: -10,
  },
  topThreeIconBackground: {
    backgroundColor: LIGHT_BLUE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 5,
    padding: 2,
  },
  firstPlaceBg: {
    borderRadius: 40,
    backgroundColor: "white",
    padding: 7,
  },
  otherPlaceBg: {
    borderRadius: 35,
    backgroundColor: "white",
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
  topThreeName: {
    fontSize: 14,
    fontWeight: "600",
    color: BLUE_BG,
    textAlign: "center",
    marginTop: 2,
  },
  topThreeDetail: {
    fontSize: 10,
    color: "#6b7280",
  },

  separator: {
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: OFF_WHITE,
    marginHorizontal: 10,
  },

  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: OFF_WHITE,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    width: 25,
    textAlign: "center",
    color: BLUE_BG,
  },
  profileIconSmall: {
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
  profileImageBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#ffe23dff",
  },
  profileImageMedium: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#bdbdbdff",
  },
});
