import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import UsuarioService from "../services/UsuarioService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopNavbar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        // Pega o ID do usuário diretamente do AsyncStorage
        const id = await UsuarioService.getUsuarioId();
        if (!id) return;

        // Busca os dados completos pelo backend (foto, cor, etc)
        const response = await UsuarioService.buscarUsuarioPorId(id);
        const backendUser = response.data;

        setUsuario(backendUser);

        // Salva no AsyncStorage para outras telas
        await AsyncStorage.setItem("usuario", JSON.stringify(backendUser));
      } catch (err) {
        console.error("Erro ao carregar usuário no TopNavbar:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", carregarUsuario);
    carregarUsuario();
    return unsubscribe;
  }, [navigation]);

  const getFotoSource = (foto) => {
    if (!foto) return require("../assets/user.png");
    if (typeof foto === "string") {
      if (
        foto.startsWith("data:image") || // Base64
        foto.startsWith("http") || // URL
        foto.startsWith("/") // Caminho local
      )
        return { uri: foto };
    }
    return require("../assets/user.png");
  };

  const foto = getFotoSource(usuario?.url_foto);
  const corAvatar = usuario?.cor || "#ffffffff";

  return (
    <View style={[styles.header, { height: 125, paddingTop: insets.top }]}>
      {/* Ícone esquerdo - Home */}
      <Pressable
        style={styles.iconButton}
        onPress={() => navigation.navigate("Principal")}
      >
        <Image
          source={require("../assets/macawdemy-logo-asa-levantada.png")}
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>

      {/* Ícone direito - Perfil */}
      <Pressable
        style={[
          styles.iconButton,
          {
            borderRadius: 50,
            alignItems: "center",
          },
        ]}
        onPress={() => navigation.navigate("PerfilUsuario")}
      >
        <Image
          source={foto}
          style={[styles.icon, { borderRadius: 50 }]}
          resizeMode="cover"
        />
        <View style={styles.badgeContainer}>
          <Image source={require("../assets/star.png")} style={styles.star} />
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
    elevation: 4,
    backgroundColor: "#eef9ffff",
  },
  iconButton: {
    height: 65,
    width: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: "90%",
    width: "90%",
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
