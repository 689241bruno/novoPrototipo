import React, { useState, useEffect, use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import UsuarioService from '../../../services/UsuarioService';

export default function Atividade() {
    const navigation = useNavigation();
    const route = useRoute();
    const { arquivo, atividadeId, titulo, tema, usuarioId = 1 } = route.params;

    const [ paginaAtual, setPaginaAtual ] = useState(1); 
    const [ totalPaginas, setTotalPaginas ] = useState(1);
    const [ progresso, setProgresso ] = useState(0);

    useEffect(() => {
        atualizarProgresso();
    }, [paginaAtual, setPaginaAtual]);

    const atualizarProgresso = async () => {
        if (totalPaginas > 0) {
            const porcentagem = Math.round((paginaAtual / totalPaginas) * 100);
            setProgresso(porcentagem);
            
            try {
                await UsuarioService.atualizarProgresso(usuarioId, atividadeId, titulo, tema, porcentagem);
            } catch (err) {
                console.error("Erro ao salvar progresso: ", err);
            }
        }
    };

    const avancarPagina = () => {
        if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
    }

    const voltarPaginas = () => {
        if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
    }

    return (
        <View style={styles.container}>
            {/* Navbar superior */}
            <Animatable.View
                delay={300}
                animation={"fadeInDown"}
                style={styles.header}
            >
                <Pressable style={styles.botao}>
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
            </Animatable.View>

            <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navigation.navigate("Inicial")}
            >
                <Text style={{ textAlign: "center" }}>
                    <MaterialIcons name="arrow-back" size={40} color="black" />
                </Text>
            </TouchableOpacity>

            {/* Barra de progresso */}
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
            </View>

            {/* PDF */}
            <Pdf
                source={{ uri: arquivo, cache: true }}
                onLoadComplete={(numPages) => setTotalPaginas(numPages)}
                onPageChanged={(page) => setPaginaAtual(page)}
                style={styles.pdf}
            />

            {/* Botões de navegação */}
            <View style={styles.navBottom}>
                <TouchableOpacity style={styles.btn} onPress={voltarPagina}>
                <Text style={styles.btnText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={avancarPagina}>
                <Text style={styles.btnText}>Avançar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f2f6ff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        elevation: 4,
    },
    title: { fontSize: 18, fontWeight: "bold", marginLeft: 15 },
    progressBarBackground: {
        height: 6,
        backgroundColor: "#ddd",
        marginHorizontal: 15,
        borderRadius: 3,
    },
    progressBarFill: { height: 6, backgroundColor: "#4CAF50", borderRadius: 3 },
    pdf: { flex: 1, width: Dimensions.get("window").width },
    navBottom: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    btn: {
        backgroundColor: "#0c4499",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    btnText: { color: "#fff", fontWeight: "bold" },   
});