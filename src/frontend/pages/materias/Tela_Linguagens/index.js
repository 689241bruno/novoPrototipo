import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, LayoutAnimation, UIManager, Platform, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import UsuarioService from "../../../services/UsuarioService";
import { MaterialIcons } from "@expo/vector-icons";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TelaLinguagens() {
    const route = useRoute();
    const navigation = useNavigation();
    const { materia } = route.params || { materia: "Linguagens" };
    const [materiais, setMateriais] = useState([]);
    const [expandedMaterias, setExpandedMaterias] = useState({});
    const [expandedThemes, setExpandedThemes] = useState({});

    const usuarioId = 1;

    useEffect(() => {
        fetchMateriais();
    }, []);

    const fetchMateriais = async () => {
        try {
            const response = await UsuarioService.listarMaterias(materia, usuarioId);
            setMateriais(response?.data || []);
        } catch (err) {
            console.error("Erro ao buscar materiais: ", err);
        }
    };

    const toggleMateria = (titulo) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedMaterias(prev => ({ ...prev, [titulo]: !prev[titulo] }));
    };

    const toggleTheme = (tema) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedThemes(prev => ({ ...prev, [tema]: !prev[tema] }));
    };

    const materiasAgrupadas = materiais.reduce((acc, item) => {
        if (!acc[item.titulo]) acc[item.titulo] = {};
        if (!acc[item.titulo][item.tema]) acc[item.titulo][item.tema] = [];
        acc[item.titulo][item.tema].push(item);
        return acc;
    }, {});

    const calcularProgresso = (atividades) => {
        if (!atividades || atividades.length === 0) return 0;
        const total = atividades.reduce((sum, item) => sum + (item.progresso || 0), 0);
        return Math.round(total / atividades.length);
    };

    const marcarAtividadeConcluida = async (item) => {
        try {
            await UsuarioService.atualizarProgresso(usuarioId, item.id, item.titulo, item.tema, 100);
            fetchMateriais();
        } catch (err) {
            console.error("Erro ao atualizar progresso: ", err);
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View delay={300} animation={"fadeInDown"} style={styles.header}>
                <Pressable style={styles.botaoVoltar} onPress={() => navigation.navigate("Principal")}>
                    <MaterialIcons name="arrow-back" size={30} color="black" />
                </Pressable>

                <Text style={styles.title}>{materia}</Text>

                <Pressable style={styles.botao} onPress={() => navigation.navigate("Perfil")}>
                    <Image source={require("../../../assets/user.png")} style={{ height: "100%", width: "100%" }} />
                    <View style={styles.userBadge}>
                        <Image source={require("../../../assets/star.png")} style={{ height: 20, width: 20 }} />
                        <Text style={styles.userBadgeText}>12</Text>
                    </View>
                </Pressable>
            </Animatable.View>

            <ScrollView>
                {Object.keys(materiasAgrupadas).length === 0 ? (
                    <Text style={styles.emptyText}>Nenhum material disponível</Text>
                ) : 
                    Object.keys(materiasAgrupadas).map((materiaTitulo) => {
                        const temas = materiasAgrupadas[materiaTitulo];
                        const todasAtividades = Object.values(temas).flat();
                        const progressoMateria = calcularProgresso(todasAtividades);

                        return (
                            <View key={materiaTitulo} style={styles.temaContainer}>
                                {/* Matéria */}
                                <TouchableOpacity
                                    style={[styles.temaHeader, progressoMateria === 100 && styles.cardConcluida]}
                                    onPress={() => toggleMateria(materiaTitulo)}
                                >
                                    <Text style={[styles.materiaTitulo, progressoMateria === 100 && styles.textoConcluido]}>
                                        {materiaTitulo}
                                    </Text>
                                    <MaterialIcons
                                        name={expandedMaterias[materiaTitulo] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color="black"
                                    />
                                </TouchableOpacity>

                                <View style={styles.progressContainer}>
                                    <Text style={styles.progressText}>{progressoMateria}%</Text>
                                    <View style={styles.progressBarBackground}>
                                        <View style={[styles.progressBarFill, { width: `${progressoMateria}%` }]} />
                                    </View>
                                </View>

                                {expandedMaterias[materiaTitulo] &&
                                    Object.keys(temas).map((tema) => {
                                        const atividadesTema = temas[tema];
                                        const progressoTema = calcularProgresso(atividadesTema);

                                        return (
                                            <View key={tema} style={{ marginLeft: 10 }}>
                                                {/* Tema */}
                                                <TouchableOpacity
                                                    style={[styles.temaHeader, progressoTema === 100 && styles.cardConcluida]}
                                                    onPress={() => toggleTheme(tema)}
                                                >
                                                    <Text style={[styles.temaTitulo, progressoTema === 100 && styles.textoConcluido]}>
                                                        {tema}
                                                    </Text>
                                                    <MaterialIcons
                                                        name={expandedThemes[tema] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                        size={24}
                                                        color="black"
                                                    />
                                                </TouchableOpacity>

                                                {expandedThemes[tema] && (
                                                    <View style={styles.progressContainer}>
                                                        <Text style={styles.progressText}>{progressoTema}%</Text>
                                                        <View style={styles.progressBarBackground}>
                                                            <View style={[styles.progressBarFill, { width: `${progressoTema}%` }]} />
                                                        </View>
                                                    </View>
                                                )}

                                                {/* Atividades */}
                                                {expandedThemes[tema] &&
                                                    atividadesTema.map((item, index) => {
                                                        const concluida = item.progresso === 100;
                                                        return (
                                                            <View key={item.id} style={{ flexDirection: "row" }}>
                                                                <View style={styles.timeline}>
                                                                    <View style={styles.timelineDot} />
                                                                    {index < atividadesTema.length - 1 && <View style={styles.timelineLine} />}
                                                                </View>

                                                                <TouchableOpacity
                                                                    style={[styles.cardActivity, concluida && styles.cardConcluida]}
                                                                    onPress={() => navigation.navigate("TelaPDF", { url: item.arquivo })}
                                                                    onLongPress={() => marcarAtividadeConcluida(item)}
                                                                >
                                                                    <Text style={[styles.arquivo, concluida && styles.textoConcluido]}>
                                                                        {item.arquivo}
                                                                    </Text>

                                                                    <View style={styles.progressContainer}>
                                                                        <Text style={styles.progressText}>{item.progresso}%</Text>
                                                                        <View style={styles.progressBarBackground}>
                                                                            <View style={[styles.progressBarFill, { width: `${item.progresso}%` }]} />
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    })}
                                            </View>
                                        );
                                    })}
                            </View>
                        );
                    })
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f2f6ff" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 15, backgroundColor: "#fff", borderRadius: 10, elevation: 4, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: "bold", color: "#0c4499", textAlign: "center", flex: 1, marginTop: 10, marginBottom: 10 },
    botaoVoltar: { position: "absolute", left: 10, top: 15 },
    botao: { height: 40, width: 40, justifyContent: "center", alignItems: "center" },
    userBadge: { position: "absolute", height: 20, width: 20, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" },
    userBadgeText: { position: "absolute", fontWeight: "bold", color: "#FFF", fontSize: 8, top: 5, alignSelf: "center" },
    emptyText: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 20 },
    temaContainer: { marginBottom: 10, backgroundColor: "#fff", borderRadius: 12, padding: 10 },
    temaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 5 },
    temaTitulo: { fontSize: 18, fontWeight: "bold", color: "#333" },
    materiaTitulo: { fontSize: 20, fontWeight: "bold", color: "#0c4499", marginBottom: 5 },
    cardActivity: { backgroundColor: "#f0f4ff", borderRadius: 8, padding: 10, marginBottom: 10, flex: 1 },
    arquivo: { fontSize: 14, color: "#555", marginBottom: 5 },
    progressBarBackground: { height: 6, backgroundColor: "#ddd", borderRadius: 3, marginTop: 5, marginBottom: 10, flex: 1 },
    progressBarFill: { height: 6, backgroundColor: "#4CAF50", borderRadius: 3 },
    timeline: { width: 20, alignItems: "center" },
    timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#252525ff", marginVertical: 4 },
    timelineLine: { flex: 1, width: 2, backgroundColor: "#252525ff" },
    progressContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
    progressText: { marginRight: 8, fontSize: 12, fontWeight: "bold", color: "#333" },
    cardConcluida: { backgroundColor: "#C8E6C9" },
    textoConcluido: { color: "#2E7D32", fontWeight: "bold" },
});
