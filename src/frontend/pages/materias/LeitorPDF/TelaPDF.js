import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Pressable, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import UsuarioService from '../../../services/UsuarioService';
import * as Animatable from "react-native-animatable";
import ContainerMateria from "../../../components/containerMateria";
import MenuBar from "../../../components/MenuBar";

import Constants from "expo-constants";

export default function Atividade() {
    const navigation = useNavigation();
    const route = useRoute();
    const { arquivoUrl, atividadeId, titulo, tema, usuarioId = 1, } = route.params;

    const [paginaAtual, setPaginaAtual] = useState(1); 
    const [progresso, setProgresso] = useState(0);
    const [arquivoBase64, setArquivoBase64] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarPDF = async () => {
            try {
                if (!arquivoUrl) {
                    console.error("URL do PDF não fornecida!");
                    setLoading(false);
                    return;
                }

                if (Platform.OS === "web") {
                    setArquivoBase64(null);
                } else {
                    // Para mobile: baixar PDF como base64
                    const response = await fetch(arquivoUrl);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result.split(',')[1]; 
                        setArquivoBase64(base64data);
                        setLoading(false);
                    };
                    reader.readAsDataURL(blob);
                    return;
                }

                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar PDF: ", err);
                setLoading(false);
            }
        };

        carregarPDF();
    }, [arquivoUrl]);

    useEffect(() => {
        const marcarConcluida = async () => {
            if (!loading && usuarioId && atividadeId) {
                try {
                    await UsuarioService.atualizarProgresso(usuarioId, atividadeId, titulo, tema, 100);
                    setProgresso(100);
                } catch (err) {
                    console.error("Erro ao marcar atividade concluída: ", err);
                }
                
            }
        };

        marcarConcluida();
    }, [paginaAtual, loading]);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Carregando PDF...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Navbar superior */}
            <Animatable.View delay={300} animation={"fadeInDown"} style={styles.header}>
                {/* Botão Troféu à esquerda */}
                <Pressable style={styles.botao}>
                    <Image
                        source={require("../../../assets/trophy.png")}
                        style={{ height: "80%", width: "80%" }}
                    />
                </Pressable>

                <Image
                    source={require("../../../assets/Macawdemy_Letreiro.png")}
                    resizeMode="contain"
                    style={styles.imagehH1}
                ></Image>

                {/* Ícones à direita */}
                <View style={styles.rightIcons}>
                    {/* Aqui você pode adicionar outro ícone */}
                    <Pressable
                        style={styles.botao}
                        onPress={() => navigation.navigate("Perfil")}
                    >
                        <Image
                            source={require("../../../assets/user.png")}
                            style={{ height: "100%", width: "100%" }}
                        />
                        <View style={styles.userBadge}>
                            <Image
                                source={require("../../../assets/star.png")}
                                style={{ height: 20, width: 20 }}
                            />
                            <Text style={styles.userBadgeText}>12</Text>
                        </View>
                    </Pressable>
                </View>
            </Animatable.View>

            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 90, left: 20, zIndex: 1 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>{titulo}</Text>
            </View>

            {/* PDF */}
            <View style={{ flex: 1, paddingTop: 50 }}>
                {Platform.OS === "web" ? (
                    <iframe
                        src={arquivoUrl}
                        style={{ flex: 1, width: "100%", height: "100%" }}
                        title="PDF"
                    />
                ) : arquivoBase64 ? (
                    <WebView
                        source={{ uri: `data:application/pdf;base64,${arquivoBase64}` }}
                        style={{ flex: 1, width: Dimensions.get("window").width }}
                        scalesPageToFit={true}
                    />
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>PDF não disponível.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f2f6ff" },
    header: {
        width: "100%",
        height: 80,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 5,
    },
    rightIcons: { flexDirection: "row", alignItems: "center" },
    botao: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    userBadge: {
        position: "absolute",
        height: 20,
        width: 20,
        bottom: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    userBadgeText: {
        position: "absolute",
        fontWeight: "bold",
        color: "#FFF",
        fontSize: 8,
        top: 5,
        alignSelf: "center",
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: "#ddd",
        marginHorizontal: 15,
        marginTop: 45,
        marginLeft: 60,
        borderRadius: 3,
        marginVertical: 5,
    },
    progressBarFill: { height: 6, backgroundColor: "#4CAF50", borderRadius: 3 },
    btn: { backgroundColor: "#0c4499", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    btnText: { color: "#fff", fontWeight: "bold" },
    botaoVoltar: { position: "absolute", top: 90, left: 20 },
    imagehH1: { width: 220, height: 80, marginBottom: 10, },
});
