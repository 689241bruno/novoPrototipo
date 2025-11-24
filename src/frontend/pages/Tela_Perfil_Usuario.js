import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    TextInput,
    Platform, 
    Alert,
    Animated, 
    Easing,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Slider from "@react-native-community/slider";
import * as Animatable from "react-native-animatable";
import ColorPicker from "react-native-wheel-color-picker";
import * as ImagePicker from "expo-image-picker";
import { BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import Config from "../assets/Config_Icon.png"
import UsuarioService from "../services/UsuarioService";
import AlunoService from "../services/AlunoService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AnimatedBarChart = ({ data, width, height }) => {
    const animatedValues = useRef(
        data.datasets[0].data.map(() => new Animated.Value(0))
    ).current;

    const [currentValues, setCurrentValues] = useState(
        data.datasets[0].data.map(() => 0)
    );

    useEffect(() => {
        // Cria animações
        const animations = data.datasets[0].data.map((value, index) =>
        Animated.timing(animatedValues[index], {
            toValue: value,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        })
        );

        // Começa todas juntas
        Animated.stagger(100, animations).start();

        // Intervalo para atualizar os dados do gráfico durante a animação
        const interval = setInterval(() => {
        setCurrentValues(animatedValues.map(v => parseFloat(v.__getValue().toFixed(1))));
        }, 50); // atualiza a cada 50ms

        // Limpa depois
        const totalDuration = 1200 + data.datasets[0].data.length * 100;
        const timeout = setTimeout(() => {
        clearInterval(interval);
        setCurrentValues(data.datasets[0].data); // garante o valor final
        }, totalDuration);

        return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        };
    }, [data]);

    const animatedData = {
        labels: data.labels,
        datasets: [
        {
            data: currentValues,
            colors: currentValues.map((value) => () => getBarColor(value)),
        },
        ],
    };

    const chartConfigAnimated = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        barPercentage: 0.6,
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
            data={animatedData}
            width={width}
            height={height}
            chartConfig={chartConfigAnimated}
            verticalLabelRotation={0}
            fromZero
            showValuesOnTopOfBars
            withCustomBarColorFromData={true}
            flatColor={true}
            style={{ borderRadius: 15 }}
        />
        </ScrollView>
    );
};

const getBarColor = (value) => {
    if (value <= 2) return "#f8b0b0"; // vermelho pastel
    if (value <= 4) return "#f8c88c"; // laranja pastel
    if (value <= 6) return "#fae79d"; // amarelo pastel
    if (value <= 8) return "#b4e2a7"; // verde pastel
    return "#a9c8f8"; // azul pastel
};

export default function PerfilScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [novoNome, setNovoNome] = useState("");
    const [novaCor, setNovaCor] = useState("#0b4e91");
    const [novaFoto, setNovaFoto] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [activeSession, setActiveSession] = useState("atividades");

    const [modalConquistasVisivel, setModalConquistasVisivel] = useState(false);
    const [conquistas, setConquistas] = useState([]);

    // Carrega os dados do usuário logado e do aluno
    useEffect(() => {
        async function carregarDados() {
            try {
                // 1️⃣ Pega usuário salvo localmente
                const userData = await AsyncStorage.getItem("usuario");
                const parsedUser = userData ? JSON.parse(userData) : null;

                if (!parsedUser?.id) {
                    console.warn("Nenhum usuário encontrado no AsyncStorage.");
                    setLoading(false);
                    return;
                }

                // 2️⃣ Busca o usuário atualizado no backend
                const responseUsuario = await UsuarioService.buscarUsuarioPorId(parsedUser.id);
                const backendUser = responseUsuario.data;

                setUsuario(backendUser);
                setNovoNome(backendUser.nome);
                setNovaCor(backendUser.cor || "#64a7ff");
                setNovaFoto(backendUser.foto || null);

                await AsyncStorage.setItem("usuario", JSON.stringify(backendUser));

                // 3️⃣ Busca dados do aluno vinculado
                const responseAluno = await AlunoService.buscarAlunoPorId(parsedUser.id);
                if (responseAluno?.data) {
                    setAluno(responseAluno.data);

                    // 4️⃣ Busca conquistas de exemplo
                    const conquistasTeste = [
                        { id: 1, nome: "Primeiro Desafio", imagem: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
                        { id: 2, nome: "Aprendiz Dedicado", imagem: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
                    ];
                    setConquistas(conquistasTeste);
                }
            } catch (error) {
                console.error("❌ Erro ao carregar dados do perfil:", error);
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    const getFotoSource = (foto) => {
        if (!foto) return null;
        return foto.startsWith("data:image") || foto.startsWith("http")
            ? { uri: foto }
            : null;
    };

    const salvarEdicao = async () => {
        try {
            let fotoBase64 = novaFoto;

            // Se a foto for um caminho local (Android/iOS), converte pra Base64
            if (novaFoto && !novaFoto.startsWith("data:image")) {
                const response = await fetch(novaFoto);
                const blob = await response.blob();

                const reader = new FileReader();
                fotoBase64 = await new Promise((resolve, reject) => {
                reader.onerror = reject;
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
                });
            }

            // Envia para o backend
            const dados = {
                nome: novoNome,
                cor: novaCor,
                foto: fotoBase64,
            };
            console.log("Enviando dados:", {
                id: usuario.id,
                nome: novoNome,
                cor: novaCor,
                foto: fotoBase64
            });

            await UsuarioService.editarUsuario({
                id: usuario.id,
                nome: novoNome,
                cor: novaCor,
                foto: fotoBase64
            });

            // Atualiza localmente
            const atualizado = { ...usuario, nome: novoNome, cor: novaCor, foto: fotoBase64 };
            await AsyncStorage.setItem("usuario", JSON.stringify(atualizado));
            setUsuario(atualizado);
            setEditando(false);

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar edição:", err);
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0b4e91" />
                <Text style={{ color: "#0b4e91", marginTop: 10 }}>Carregando perfil...</Text>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: "#0b4e91" }}>Nenhum usuário logado.</Text>
            </View>
        );
    }

    const { width } = Dimensions.get("window");
    const cardWidth = width * 0.9;

    const chartWidth = width * 0.70;

    const notasAtividades = {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [{ data: [1, 8, 4, 6, 5, 8, 7, 9, 8, 7, 9, 10] }],
    };

    const notasSimulados = {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [{ data: [3, 7, 8, 7, 6, 10, 8, 9, 7, 8, 9, 10] }],
    };

    const notasRedacoes = {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [{ data: [8, 8, 2, 8, 4, 10, 9, 10, 9, 8, 9, 10] }],
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(11,78,145, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
    };

    const SessionButton = ({ sessionKey, label }) => (
        <TouchableOpacity
            style={{
                flex: 1,
                paddingVertical: 10,
                marginHorizontal: 5,
                backgroundColor: activeSession === sessionKey ? "#0b4e91" : "#ccc",
                borderRadius: 10,
                alignItems: "center",
            }}
            onPress={() => setActiveSession(sessionKey)}
        >
            <Text style={{ color: activeSession === sessionKey ? "#fff" : "#333", fontWeight: "bold" }}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <Animatable.View delay={300} animation="fadeInDown" style={styles.header}>
                <TopNavbar />
            </Animatable.View>

            {/* Conteúdo principal */}
            <Animatable.View delay={300} animation="fadeInUp" style={styles.whiteContainer}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Avatar, Nome e Edição */}
                    <View style={[styles.profileHeader, { backgroundColor: usuario.cor || "#9ac7ecff" }]}>
                        <TouchableOpacity onPress={() => setEditando(true)} style={styles.avatarContainerWrapper}>
                            <View style={styles.avatarOuterCircle}>
                                {console.log("🧠 URI da foto:", usuario.foto)}
                                {usuario.foto ? (
                                    <Image
                                        source={getFotoSource(usuario.foto)}
                                        style={styles.avatarImage}
                                        onError={(e) => console.log("❌ Erro ao carregar imagem:", e.nativeEvent.error)}
                                    />
                                ) : (
                                    <>
                                        <View style={styles.avatarNoPhotoBackground} />
                                        <Icon name="person" size={80} color="#fff" style={styles.avatarIconOverlay} />
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.editIconTop} onPress={() => setEditando(true)}>
                            <Icon name="create-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Nome e Email abaixo da faixa */}
                    <View style={{ alignItems: "center", marginTop: 70 }}>
                        <Text style={styles.nameText}>{usuario.nome}</Text>
                        <Text style={styles.emailText}>{usuario.email}</Text>
                    </View>

                    {/* Estatísticas */}
                    <View style={[styles.card, { width: cardWidth }]}>
                        <Text style={styles.sectionTitle}>Estatísticas</Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>Ranking:</Text> {aluno ? `#${aluno.ranking}` : "Carregando..."}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>XP:</Text> {aluno ? aluno.xp.toLocaleString() : "Carregando..."}
                        </Text>
                    </View>

                    {/* Conquistas */}
                    <View style={[styles.card, { width: cardWidth }]}>
                        <Text style={styles.sectionTitle}>Conquistas</Text>
                        <View style={styles.achievementsIcons}>
                            <TouchableOpacity style={styles.achievementIconContainer}>
                                <FontAwesome5 name="trophy" size={35} color="#FFD700" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.achievementIconContainer}>
                                <Icon name="star" size={40} color="#00FFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.achievementIconContainer}>
                                <Icon name="bar-chart" size={35} color="#3b82f6" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.achievementIconContainer}
                                onPress={() => setModalConquistasVisivel(true)}
                            >
                                <Text style={styles.moreAchievements}>...</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Gráficos de notas */}
                    <View style={[styles.card, { width: cardWidth }]}>
                        <Text style={styles.sectionTitle}>Notas</Text>

                        {/* Botões de sessão */}
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                            <SessionButton sessionKey="atividades" label="Atividades" />
                            <SessionButton sessionKey="simulados" label="Simulados" />
                            <SessionButton sessionKey="redacoes" label="Redações" />
                        </View>

                        {/* Gráficos */}
                        {activeSession === "atividades" && (
                            <AnimatedBarChart data={notasAtividades} width={notasAtividades.labels.length * 60} height={200} />
                        )}

                        {activeSession === "simulados" && (
                            <AnimatedBarChart data={notasSimulados} width={notasSimulados.labels.length * 60} height={200} />
                        )}

                        {activeSession === "redacoes" && (
                            <AnimatedBarChart data={notasRedacoes} width={notasRedacoes.labels.length * 60} height={200} />
                        )}
                    </View>

                    {/* Ações */}
                    <View style={[styles.card, { width: cardWidth }]}>
                        <Text style={styles.sectionTitle}>Ações</Text>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => navigation.navigate("Configuracoes")}
                        >
                            <Icon name="cog" size={22} color="#0b4e91" />
                            <Text style={styles.menuText}>Configurações</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => navigation.navigate("Ajuda")}
                        >
                            <Icon name="help-circle" size={22} color="#0b4e91" />
                            <Text style={styles.menuText}>Ajuda (FAQ)</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </Animatable.View>

            {/* Menu inferior fixo */}
            <View style={styles.menuBarContainer}>
                <MenuBar />
            </View>

            {/* Modal de Edição */}
            <Modal visible={editando} animationType="slide" transparent={false}>
                <SafeAreaView style={[styles.modalFullScreen, { backgroundColor: "#fff" }]}>
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <Text style={styles.modalTitle}>Editar Perfil</Text>

                        {/* Faixa colorida com avatar central e ícone de cor */}
                        <View style={[styles.colorBar, { backgroundColor: novaCor }]}>
                            {/* Ícone de selecionar cor no canto superior direito */}
                            <TouchableOpacity
                                style={styles.colorIcon}
                                onPress={() => setShowColorPicker(true)}
                            >
                            <Icon name="color-palette" size={26} color="#ffffffff" />
                            </TouchableOpacity>

                            {/* Avatar clicável para selecionar imagem */}
                            <TouchableOpacity
                                onPress={async () => {
                                    if (Platform.OS === "web") {
                                        const input = document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/*";
                                        input.onchange = (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => setNovaFoto(event.target.result);
                                                reader.readAsDataURL(file);
                                            }
                                        };
                                        input.click();
                                        return;
                                    }

                                    // mobile
                                    const result = await DocumentPicker.getDocumentAsync({
                                        type: "image/*",
                                    });

                                    if (result.type !== "cancel") {
                                        setNovaFoto(result.uri);
                                    }
                                }}
                            >
                                {novaFoto ? (
                                    <Image source={{ uri: novaFoto }} style={styles.avatarImageLarge} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Icon name="person" size={90} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Nome */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={novoNome}
                            onChangeText={setNovoNome}
                        />

                        {/* Modal interno para seletor de cor */}
                        <Modal visible={showColorPicker} transparent animationType="fade">
                            <View style={styles.modalCont2}>
                                <View style={{alignItems: "center", justifyContent: "center"}}>
                                    <Animatable.View animation="zoomIn" duration={400}>
                                        <ColorPicker
                                            color={novaCor}
                                            onColorChangeComplete={(color) => setNovaCor(color)}
                                            thumbSize={40}
                                            sliderSize={30}
                                            noSnap={true}
                                            row={false}
                                            swatches={false}
                                            style={{ width: 300, height: 300 }} // define explicitamente
                                        />
                                    </Animatable.View>
                                    <TouchableOpacity
                                        style={[styles.cancelButton, { marginTop: 10 }]}
                                        onPress={() => setShowColorPicker(false)}
                                    >
                                        <Text style={styles.cancelText}>Fechar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* Botões de ação */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                                onPress={() => setEditando(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "#0b4e91" }]}
                                onPress={salvarEdicao}
                            >
                                <Text style={styles.modalButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Modal de Conquistas */}
            <Modal
                visible={modalConquistasVisivel}
                animationType="slide"
                transparent
                onRequestClose={() => setModalConquistasVisivel(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Suas Conquistas</Text>

                        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
                            {conquistas.length > 0 ? (
                            conquistas.map((item) => (
                                <View key={item.id} style={styles.conquistaItem}>
                                <Image source={{ uri: item.imagem }} style={styles.conquistaImagem} />
                                <Text style={styles.conquistaNome}>{item.nome}</Text>
                                </View>
                            ))
                            ) : (
                            <Text style={{ color: "#777" }}>Nenhuma conquista disponível.</Text>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: "#0b4e91", marginTop: 15 }]}
                            onPress={() => setModalConquistasVisivel(false)}
                        >
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0b4e91" },
    header: { backgroundColor: "#fff", elevation: 4, marginBottom: 10 },
    whiteContainer: { flex: 1, margin: 20, backgroundColor: "#ececec", borderRadius: 15, paddingVertical: 18, paddingHorizontal: 10,},
    scrollContainer: { alignItems: "center", paddingBottom: 100, },
    avatarBlock: { alignItems: "center", marginBottom: 20 },
    avatarContainer: { width: 110, height: 110, borderRadius: 55, justifyContent: "center", alignItems: "center", marginBottom: 10, position: "relative",},
    avatarImage: { width: "100%", height: "100%", borderRadius: 55, },
    editIcon: { position: "absolute", bottom: 5, right: 5, backgroundColor: "rgba(0,0,0,0.3)", padding: 6, borderRadius: 20, },
    nameText: { fontSize: 22, fontWeight: "bold", color: "#0b4e91", },
    emailText: { fontSize: 16, color: "#555",},
    card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginVertical: 10, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0b4e91", marginBottom: 10, },
    infoText: { fontSize: 16, color: "#333", marginBottom: 5, },
    label: { fontWeight: "bold", color: "#0b4e91" },
    achievementsIcons: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 10, },
    achievementIconContainer: { width: 60, height: 60, borderRadius: 10, backgroundColor: "#f9f9f9", justifyContent: "center", alignItems: "center", },
    moreAchievements: { fontSize: 28, fontWeight: "bold", color: "#777",},
    menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, },
    menuText: { fontSize: 16, color: "#0b4e91", marginLeft: 10,},
    menuBarContainer: { position: "absolute", bottom: 0, left: 0, right: 0, height: 70, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#ccc", elevation: 10, },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", },
    modalContainer: { backgroundColor: "#fff", width: "85%", borderRadius: 20, padding: 20, elevation: 8, },
    modalTitle: { fontSize: 20, fontWeight: "bold", color: "#0b4e91", textAlign: "center", marginBottom: 15, },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10, },
    modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, },
    modalButton: { flex: 1, marginHorizontal: 5, padding: 12, borderRadius: 10, alignItems: "center", },
    modalButtonText: { color: "#fff", fontWeight: "bold" },
    modalFullScreen: { flex: 1, justifyContent: "center", },
    colorBar: { height: 160, justifyContent: "center", alignItems: "center", borderRadius: 15, marginBottom: 20,},
    colorIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 20, },
    modalCont2: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", },
    pickerContainer: { backgroundColor: "#fff", borderRadius: 20, padding: 15, alignItems: "center", justifyContent: "center", },
    cancelButton: { backgroundColor: "#ddd", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, marginTop: 10, },
    cancelText: { color: "#333", fontSize: 16, },
    avatarImageLarge: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#fff", },
    avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff", },
    colorButton: { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 20, alignItems: "center", },
    colorButtonText: { color: "#fff", fontWeight: "bold", },
    colorPickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", },
    colorPickerContainer: { width: "85%", height: 350, backgroundColor: "#fff", borderRadius: 15, padding: 15, },
    profileHeader: { width: "100%", height: 150, justifyContent: "flex-end", alignItems: "center", position: "relative", borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: "visible", paddingBottom: 55, },
    avatarContainerWrapper: { position: "absolute", bottom: -55, zIndex: 5, },
    avatarOuterCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#9ac7ecff", justifyContent: "center", alignItems: "center", elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 3 }, },
    avatarNoPhotoBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 55, },
    avatarIconOverlay: { position: "absolute", alignSelf: "center", },
    editIconTop: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(0,0,0,0.3)", padding: 6, borderRadius: 20, },
    conquistaItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: 10, padding: 10, marginVertical: 5, width: "90%", },
    conquistaImagem: { width: 50, height: 50, marginRight: 15, },
    conquistaNome: { fontSize: 16, color: "#0b4e91", fontWeight: "bold", },
});