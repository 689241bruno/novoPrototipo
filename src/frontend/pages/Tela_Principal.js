import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import ContainerMateria from "../components/ContainerMateria";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import MenuBar from "../components/MenuBar";
import TopNavbar from "../components/TopNavbar";
import UsuarioService from "../services/UsuarioService";
import MaterialService from '../services/MaterialService';
import Constants from "expo-constants";

const statusBarHeight = Constants.statusBarHeight;

export default function Home() {
  const navigation = useNavigation();
  const [usuarioId, setUsuarioId] = useState(null);
  const [progressoPorMateria, setProgressoPorMateria] = useState({});
  const [loading, setLoading] = useState(true);

  const materiasMap = {
    Linguagens: "Linguagens",
    Matematica: "Matemática",
    Matemática: "Matemática",
    "Ciências da Natureza": "Ciências da Natureza",
    "Ciencias da Natureza": "Ciências da Natureza",
    "Ciências Humanas": "Ciências Humanas",
    "Ciencias Humanas": "Ciências Humanas",
  };

  const calcularProgressoPorMateria = (materiaNome, materiais, progressoUsuario) => {
    materiais = Array.isArray(materiais) ? materiais : [];
    progressoUsuario = Array.isArray(progressoUsuario) ? progressoUsuario : [];

    const materiaPadronizada = materiasMap[materiaNome] || materiaNome;

    const totalAtividades = materiais.filter(
      m => String(m.materia).normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
           String(materiaPadronizada).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    ).length;

    const concluidas = progressoUsuario.filter(
      p => String(p.materia).normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
           String(materiaPadronizada).normalize("NFD").replace(/[\u0300-\u036f]/g, "") &&
           (p.concluida === 1 || p.concluida === true || p.status === "concluida")
    ).length;

    const progresso = totalAtividades > 0 ? concluidas / totalAtividades : 0;

    return Math.min(Math.round(progresso * 100) / 100, 1);
  };

  const fetchProgresso = async () => {
    setLoading(true);
    try {
      const email = await UsuarioService.getLoggedInUserEmail();
      const responseTipo = await UsuarioService.verificarTipo(email);
      const id = responseTipo?.data?.id;
      if (!id) return;
      setUsuarioId(id);

      const progressoData = await MaterialService.listarProgressoUsuario(id);
      const progressoMateria = {};

      await Promise.all(
        Object.keys(materiasMap).map(async materia => {
          const materiaisMateria = (await MaterialService.listarMaterias(materiasMap[materia], id)).data;
          progressoMateria[materia] = calcularProgressoPorMateria(materia, materiaisMateria, progressoData.data);
        })
      );

      setProgressoPorMateria(progressoMateria);
    } catch (err) {
      console.error("Erro ao buscar progresso do usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      fetchProgresso();
    }, [])
  );

  return (
    <SafeAreaView style={styles.conatiner}>
      <Animatable.View delay={300} animation={"fadeInDown"} style={styles.header}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0b4e91ff" }}>
          <TopNavbar />
        </SafeAreaView>
      </Animatable.View>

      <ScrollView style={styles.main}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <>
            <Pressable onPress={() => navigation.navigate("Linguagens", { materia: "Linguagens" })}>
              <ContainerMateria
                titulo="Linguagens"
                nomeImage="Linguagens"
                progress={progressoPorMateria["Linguagens"] || 0}
                delayanim={400}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Matematica", { materia: "Matematica" })}>
              <ContainerMateria
                titulo="Matemática"
                nomeImage="Matemática"
                progress={progressoPorMateria["Matemática"] || 0}
                delayanim={480}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("CienciasNatureza", { materia: "CienciasNatureza" })}>
              <ContainerMateria
                titulo="Ciências da Natureza"
                nomeImage="CiênciasdaNatureza"
                progress={progressoPorMateria["Ciências da Natureza"] || 0}
                delayanim={560}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("CienciasHumanas", { materia: "CienciasHumanas" })}>
              <ContainerMateria
                titulo="Ciências Humanas"
                nomeImage="CiênciasHumanas"
                progress={progressoPorMateria["Ciências da Humanas"] || 0}
                delayanim={640}
              />
            </Pressable>
            <ContainerMateria titulo="Redação" progress={0.4} nomeImage="Redação" />
            <View style={styles.footer}></View>
          </>
        )}
      </ScrollView>

      <MenuBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conatiner: { flex: 1, backgroundColor: "#338BE5" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 5, backgroundColor: "#fff", elevation: 4, marginBottom: 10 },
  main: { padding: 30, paddingTop: 30, marginBottom: 60, display: "flex", flexDirection: "column" },
  footer: { height: 90 },
});
