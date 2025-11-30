import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import DropDownPicker from "react-native-dropdown-picker";
import UsuarioService from "../services/UsuarioService";
import AlunoService from "../services/AlunoService";
import ProfessorService from "../services/ProfessorService";
import MaterialService from "../services/MaterialService";
import MenuBar from "../components/MenuBar";
import TopNavbar from "../components/TopNavbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Habilita animação de layout no Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TelaMateria() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { materia } = route.params || { materia: "Linguagens" };
  const [isProfessor, setIsProfessor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  const [materiais, setMateriais] = useState([]);
  const [expandedMaterias, setExpandedMaterias] = useState({});
  const [expandedThemes, setExpandedThemes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState("");
  const [subtema, setSubtema] = useState("");
  const [progressoUsuario, setProgressoUsuario] = useState([]);
  const [xpGanho, setXpGanho] = useState(0);

  const [modalEnvioVisible, setModalEnvioVisible] = useState(false);
  const [modalXpVisible, setModalXpVisible] = useState(false);

  const [open, setOpen] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState(materia);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState([
    { label: "Linguagens", value: "Linguagens" },
    { label: "Matemática", value: "Matematica" },
    { label: "Ciências da Natureza", value: "Ciencias da Natureza" },
    { label: "Ciências Humanas", value: "Ciencias Humanas" },
  ]);

  const [modoEdicao, setModoEdicao] = useState(null); // guarda id do material sendo editado
  const [modoExclusao, setModoExclusao] = useState(false);
  const [selecionadosEdicao, setSelecionadosEdicao] = useState({});
  const [selecionadosExcluir, setSelecionadosExcluir] = useState({});
  const [confirmarExclusaoAtivo, setConfirmarExclusaoAtivo] = useState(false);
  const [modalEdiçãoVisible, setModalEdicaoVisible] = useState(false);

  const animScale = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);

  const screenHeight = Dimensions.get("window").height;
  const minContainerHeight = screenHeight * 0.75;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const email = await UsuarioService.getLoggedInUserEmail();
        const responseCheck = await UsuarioService.checkUser(email);
        const usuarioCheck = responseCheck.data;
        if (!usuarioCheck.existe) return;

        const responseTipo = await UsuarioService.verificarTipo(email);
        const tipoUsuario = responseTipo.data;
        setIsProfessor(tipoUsuario.is_professor === 1);
        setIsAdmin(tipoUsuario.is_admin === 1);

        const usuarioId = tipoUsuario?.id;
        setUsuarioId(usuarioId);

        const response = await MaterialService.listarMaterias(
          materiaSelecionada,
          usuarioId
        );
        setMateriais(response?.data || []);

        const responseProgresso = await MaterialService.listarProgressoUsuario(
          usuarioId
        );
        const progressoData = normalizarProgresso(responseProgresso.data);
        setProgressoUsuario(progressoData);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário ou materiais:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // pequeno delay pra suavizar
      }
    };

    fetchUserData();
  }, [materiaSelecionada]);

  useFocusEffect(
    React.useCallback(() => {
      const verificarXpPendente = async (progressoAtualizado) => {
        const xpData = await AsyncStorage.getItem("xpPendente");
        if (xpData) {
          const { atividadeId, xp } = JSON.parse(xpData);

          if (
            progressoAtualizado.some(
              (p) => p.atividade_id === atividadeId && p.concluida === 1
            )
          ) {
            animScale.setValue(0);
            animOpacity.setValue(0);

            setXpGanho(xp);
            setModalXpVisible(true);
            setTimeout(() => animarModal(), 50);

            await AsyncStorage.removeItem("xpPendente");
          }
        }
      };

      const atualizarProgresso = async () => {
        if (!usuarioId) return;

        try {
          const responseProgresso =
            await MaterialService.listarProgressoUsuario(usuarioId);
          const progressoData = normalizarProgresso(responseProgresso.data);
          setProgressoUsuario(progressoData);
          console.log("Progresso atualizado ao focar na tela:", progressoData);

          verificarXpPendente(progressoData);
        } catch (err) {
          console.error("Erro ao atualizar progresso ao focar na tela:", err);
        }
      };

      atualizarProgresso();
    }, [usuarioId])
  );

  const fetchMateriais = async () => {
    try {
      const response = await MaterialService.listarMaterias(
        materiaSelecionada,
        usuarioId
      );
      setMateriais(response?.data || []);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
    }
  };

  const toggleTheme = (temaKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedThemes((prev) => ({
      ...prev,
      [temaKey]: !prev[temaKey],
    }));
  };
  const toggleMateria = (titulo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMaterias((prev) => ({ ...prev, [titulo]: !prev[titulo] }));
  };

  const materiasAgrupadas = materiais.reduce((acc, item) => {
    if (!acc[item.tema]) acc[item.tema] = {};
    if (!acc[item.tema][item.subtema]) acc[item.tema][item.subtema] = [];
    acc[item.tema][item.subtema].push(item);
    return acc;
  }, {});

  const calcularProgresso = (atividades) => {
    if (!atividades || atividades.length === 0) return 0;
    if (!progressoUsuario || progressoUsuario.length === 0) return 0;

    const total = atividades.length;
    const concluidas = atividades.filter((a) =>
      progressoUsuario.some((p) => p.atividade_id === a.id && p.concluida === 1)
    ).length;

    return Math.round((concluidas / total) * 100);
  };

  const normalizarProgresso = (data) => {
    if (!data) return [];

    if (Array.isArray(data)) return data;

    if (typeof data === "object") {
      return Object.values(data).flatMap((v) => (Array.isArray(v) ? v : [v]));
    }

    return [];
  };

  const atividadeConcluida = (atividadeId) => {
    return progressoUsuario.some(
      (p) => p.atividade_id === atividadeId && p.concluida === 1
    );
  };

  const marcarAtividadeConcluida = async (item) => {
    if (!usuarioId) return;

    if (
      progressoUsuario.some((p) => p.atividade_id === item.id && p.concluida)
    ) {
      console.log(`Atividade ${item.id} já concluída. Nada a fazer.`);
      return;
    }

    try {
      // Marca atividade como concluída no banco
      await MaterialService.atualizarProgresso(usuarioId, item.id);

      // Atualiza progresso localmente
      setProgressoUsuario((prev) => [
        ...prev,
        { atividade_id: item.id, concluida: 1 },
      ]);
      console.log(`Atividade ${item.id} marcada como concluída.`);

      // Adiciona XP
      const xp = 15;
      const responseXp = await AlunoService.addXp(usuarioId, xp);
      console.log("XP adicionado com sucesso:", responseXp.data || responseXp);

      await AsyncStorage.setItem(
        "xpPendente",
        JSON.stringify({ atividadeId: item.id, xp })
      );
    } catch (err) {
      console.error(
        "Erro ao marcar atividade como concluída ou adicionar XP:",
        err
      );
    }
  };

  const selecionarArquivo = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file)
          setArquivoPdf({
            uri: URL.createObjectURL(file),
            name: file.name,
            type: file.type,
          });
      };
      input.click();
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success") {
        setArquivoPdf({
          uri: result.uri,
          name: result.name,
          type: result.mimeType || "application/pdf",
        });
      }
    }
  };

  const enviarMaterial = async () => {
    if (!arquivoPdf || !titulo.trim() || !tema.trim()) {
      alert("Preencha todos os campos e selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("tema", tema.trim());
    formData.append("subtema", subtema.trim());
    formData.append("titulo", titulo.trim());
    formData.append("materia", materiaSelecionada);
    formData.append("criado_por", usuarioId);

    try {
      if (Platform.OS === "web") {
        const response = await fetch(arquivoPdf.uri);
        const blob = await response.blob();
        formData.append(
          "arquivo",
          new File([blob], arquivoPdf.name, { type: arquivoPdf.type })
        );
      } else {
        formData.append("arquivo", {
          uri: arquivoPdf.uri,
          name: arquivoPdf.name,
          type: arquivoPdf.type,
        });
      }

      const response = await MaterialService.publicarMateria(formData);
      if (response.status === 201) {
        alert("Material enviado com sucesso!");
        setTitulo("");
        setTema("");
        setArquivoPdf(null);
        setModalVisible(false);
        fetchMateriais();
      } else {
        alert(response.data.erro || "Erro ao enviar material.");
      }
    } catch (err) {
      console.error("Erro ao enviar material:", err);
      alert("Erro ao enviar material. Verifique a conexão e o IP do servidor.");
    }
  };

  const abrirModalEdicao = () => {
    const idsSelecionados = Object.keys(selecionadosEdicao).filter(
      (id) => selecionadosEdicao[id]
    );

    if (idsSelecionados.length === 0) {
      alert("Selecione ao menos uma atividade para editar.");
      return;
    }

    const primeiroId = parseInt(idsSelecionados[0]);

    const primeiro = materiais.find((m) => m.id === primeiroId);

    if (primeiro) {
      setTitulo(primeiro.titulo || "");
      setTema(primeiro.tema || "");
      setSubtema(primeiro.subtema || "");

      setModoEdicao(primeiroId);
    }

    setModalEdicaoVisible(true);
  };

  // quando o usuário clica no ícone edit/check do header
  const handleEditHeaderPress = () => {
    if (modoEdicao === "selecionar") {
      // usuário estava em modo seleção -> clicou no check para confirmar
      abrirModalEdicao();
      // você pode decidir manter modo de seleção ou sair:
      // setModoEdicao(null); // se quiser sair do modo seleção depois
    } else {
      // entra no modo seleção
      setModoEdicao("selecionar");
      setSelecionadosEdicao({}); // limpa seleções anteriores
    }
  };

  const enviarOuAtualizarMaterial = async () => {
    if (!titulo.trim() || !tema.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const dados = { titulo, tema, subtema, materia: materiaSelecionada };

    try {
      if (modoEdicao) {
        // Atualiza material
        await ProfessorService.editarMaterial(modoEdicao, dados);
        alert("Material atualizado com sucesso!");
      } else {
        // Novo envio
        if (!arquivoPdf) {
          alert("Selecione um arquivo.");
          return;
        }

        const formData = new FormData();
        formData.append("tema", tema.trim());
        formData.append("subtema", subtema.trim());
        formData.append("titulo", titulo.trim());
        formData.append("materia", materiaSelecionada);
        formData.append("criado_por", usuarioId);

        if (Platform.OS === "web") {
          const response = await fetch(arquivoPdf.uri);
          const blob = await response.blob();
          formData.append(
            "arquivo",
            new File([blob], arquivoPdf.name, { type: arquivoPdf.type })
          );
        } else {
          formData.append("arquivo", {
            uri: arquivoPdf.uri,
            name: arquivoPdf.name,
            type: arquivoPdf.type,
          });
        }

        await MaterialService.publicarMateria(formData);
        alert("Material enviado com sucesso!");
      }

      // Limpa e fecha modal
      setTitulo("");
      setTema("");
      setSubtema("");
      setArquivoPdf(null);
      setModoEdicao(null);
      setModalEnvioVisible(false);
      fetchMateriais();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar ou atualizar material.");
    }
  };

  const toggleSelecionadoEdicao = (id) => {
    setSelecionadosEdicao((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const ativarEdicao = (item) => {
    setModoEdicao(item.id);

    // Preenche modal com dados do item
    setTitulo(item.titulo);
    setTema(item.tema);
    setSubtema(item.subtema);

    setModalEnvioVisible(true); // usa o mesmo modal do envio
  };

  const atualizarMaterial = async () => {
    if (!titulo.trim() || !tema.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await ProfessorService.editarMaterial(modoEdicao, {
        titulo,
        tema,
        subtema,
        materia: materiaSelecionada,
      });
      alert("Material atualizado com sucesso!");
      setModalEnvioVisible(false); // fechamos o mesmo modal
      setModoEdicao(null);
      fetchMateriais();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar material.");
    }
  };

  const toggleSelecionado = (id) => {
    setSelecionadosExcluir((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelecionadoExclusao = (id, tipo, parentId) => {
    // Se for tema, seleciona todas atividades desse tema
    if (tipo === "tema") {
      const todasAtividades = materiais.filter((m) => m.tema === id);
      const novasSelecoes = {};
      todasAtividades.forEach((a) => (novasSelecoes[a.id] = true));
      setSelecionadosExcluir((prev) => ({ ...prev, ...novasSelecoes }));
    } else if (tipo === "subtema") {
      const todasAtividades = materiais.filter((m) => m.subtema === id);
      const novasSelecoes = {};
      todasAtividades.forEach((a) => (novasSelecoes[a.id] = true));
      setSelecionadosExcluir((prev) => ({ ...prev, ...novasSelecoes }));
    } else {
      toggleSelecionado(id);
    }
  };

  const ativarExclusao = () => {
    setModoExclusao(!modoExclusao);
    setSelecionadosExcluir({});
  };

  const handleDeleteHeaderPress = () => {
    // 1º clique → ativa modo de exclusão e habilita seleção
    if (!modoExclusao) {
      setModoExclusao(true);
      setSelecionadosExcluir({});
      return;
    }

    // 2º clique → tenta confirmar
    const selecionados = Object.keys(selecionadosExcluir).filter(
      (id) => selecionadosExcluir[id]
    );

    if (selecionados.length === 0) {
      alert("Selecione ao menos uma atividade para excluir.");
      return;
    }

    // Agora sim abre modal de exclusão
    setConfirmarExclusaoAtivo(true);
  };

  const deletarSelecionados = async () => {
    const ids = Object.keys(selecionadosExcluir).filter(
      (id) => selecionadosExcluir[id]
    );

    if (ids.length === 0) {
      alert("Selecione algo para excluir.");
      return;
    }

    try {
      for (let id of ids) {
        await ProfessorService.deletarMaterial(id);
      }

      alert("Materiais excluídos com sucesso!");
      setModoExclusao(false);
      setConfirmarExclusaoAtivo(false);
      setSelecionadosExcluir({});
      fetchMateriais();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir materiais.");
    }
  };

  const animarModal = () => {
    animScale.setValue(0);
    animOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(animScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Fechamento automático suave após 2,5 segundos
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(animOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animScale, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalXpVisible(false);
      });
    }, 2500);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0b4e91ff",
      }}
    >
      {/* Header */}
      <TopNavbar />

      {/* ScrollView com materiais */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Carregando materiais...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 10,
            flexGrow: 1,
            paddingBottom: 120,
          }}
        >
          <Animatable.View animation="fadeInUp" duration={800} delay={100}>
            <View style={styles.mainContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialIcons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>

                <Text style={styles.containerTitle}>{materiaSelecionada}</Text>

                {(isProfessor || isAdmin) && (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={handleEditHeaderPress}
                      style={{ marginHorizontal: 5 }}
                    >
                      <MaterialIcons
                        name={modoEdicao ? "check" : "edit"}
                        size={28}
                        color="#0c4499"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDeleteHeaderPress}
                      style={{ marginHorizontal: 5 }}
                    >
                      <MaterialIcons
                        name={modoExclusao ? "check" : "delete"}
                        size={28}
                        color="#d32f2f"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {Object.keys(materiasAgrupadas).length === 0 ? (
                <Text style={styles.emptyText}>Nenhum material disponível</Text>
              ) : (
                Object.keys(materiasAgrupadas).map((materiaTitulo) => {
                  const temas = materiasAgrupadas[materiaTitulo];
                  const todasAtividades = Object.values(temas).flat();
                  const progressoMateria = calcularProgresso(todasAtividades);

                  return (
                    <View key={materiaTitulo} style={styles.temaContainer}>
                      {/* Header da matéria */}
                      <Text
                        style={[
                          styles.temaHeader,
                          progressoMateria === 100
                            ? styles.temaHeaderConcluida
                            : null,
                        ]}
                        onPress={() => toggleMateria(materiaTitulo)} // CORRIGIDO
                      >
                        <Text
                          style={[
                            styles.temaTitulo,
                            progressoMateria === 100 && styles.textoConcluido,
                          ]}
                        >
                          {materiaTitulo}
                        </Text>
                        <MaterialIcons
                          name={
                            expandedMaterias[materiaTitulo]
                              ? "keyboard-arrow-up"
                              : "keyboard-arrow-down"
                          } // CORRIGIDO
                          size={24}
                          color={progressoMateria === 100 ? "#2E7D32" : "black"}
                        />
                      </Text>

                      {/* Barra de progresso geral da matéria */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ width: 40, fontWeight: "bold" }}>
                          {progressoMateria}%
                        </Text>
                        <View
                          style={[styles.progressBarBackground, { flex: 1 }]}
                        >
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${progressoMateria}%` },
                            ]}
                          />
                        </View>
                      </View>

                      {/* Lista de temas */}
                      {expandedMaterias[materiaTitulo] &&
                        Object.keys(temas).map((tema) => {
                          const atividadesTema = temas[tema];
                          const progressoTema =
                            calcularProgresso(atividadesTema);
                          const temaKey = `${materiaTitulo}__${tema}`;

                          return (
                            <View
                              key={tema}
                              style={[styles.temaContainer, { marginLeft: 0 }]}
                            >
                              <TouchableOpacity
                                style={[
                                  styles.temaHeader,
                                  progressoTema === 100 &&
                                    styles.temaHeaderConcluida,
                                ]}
                                onPress={() => toggleTheme(temaKey)} // CORRETO
                              >
                                <Text
                                  style={[
                                    styles.temaTitulo,
                                    progressoTema === 100 &&
                                      styles.textoConcluido,
                                  ]}
                                >
                                  {tema}
                                </Text>
                                <MaterialIcons
                                  name={
                                    expandedThemes[tema]
                                      ? "keyboard-arrow-up"
                                      : "keyboard-arrow-down"
                                  }
                                  size={24}
                                  color="black"
                                />
                              </TouchableOpacity>

                              {/* Barra de progresso do tema */}
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 5,
                                }}
                              >
                                <Text style={{ width: 40, fontWeight: "bold" }}>
                                  {progressoTema}%
                                </Text>
                                <View
                                  style={[
                                    styles.progressBarBackground,
                                    { flex: 1 },
                                  ]}
                                >
                                  <View
                                    style={[
                                      styles.progressBarFill,
                                      { width: `${progressoTema}%` },
                                    ]}
                                  />
                                </View>
                              </View>

                              {/* Atividades */}
                              {expandedThemes[temaKey] &&
                                atividadesTema.map((item) => {
                                  const concluida = atividadeConcluida(item.id);
                                  const isSelecionadoEdicao =
                                    !!selecionadosEdicao[item.id];
                                  const isSelecionadoExcluir =
                                    !!selecionadosExcluir[item.id];

                                  return (
                                    <View
                                      key={item.id}
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      {modoExclusao && (
                                        <TouchableOpacity
                                          onPress={() =>
                                            toggleSelecionado(item.id)
                                          }
                                          style={{ marginRight: 8 }}
                                        >
                                          <MaterialIcons
                                            name={
                                              isSelecionadoExcluir
                                                ? "check-box"
                                                : "check-box-outline-blank"
                                            }
                                            size={26}
                                            color="#333"
                                          />
                                        </TouchableOpacity>
                                      )}

                                      {modoEdicao === "selecionar" && (
                                        <TouchableOpacity
                                          onPress={() =>
                                            toggleSelecionadoEdicao(item.id)
                                          }
                                          style={{ marginRight: 8 }}
                                        >
                                          <MaterialIcons
                                            name={
                                              isSelecionadoEdicao
                                                ? "check-box"
                                                : "check-box-outline-blank"
                                            }
                                            size={26}
                                            color="#0c4499"
                                          />
                                        </TouchableOpacity>
                                      )}

                                      <TouchableOpacity
                                        style={[
                                          styles.cardActivity,
                                          concluida && styles.cardConcluida,
                                          { flex: 1 },
                                        ]}
                                        onPress={() => {
                                          if (modoExclusao) {
                                            toggleSelecionado(item.id);
                                            return;
                                          }
                                          if (modoEdicao === "selecionar") {
                                            toggleSelecionadoEdicao(item.id);
                                            return;
                                          }

                                          // comportamento normal: marca concluída e navega para tela do PDF
                                          marcarAtividadeConcluida(item);
                                          navigation.navigate("TelaPDF", {
                                            arquivoUrl: `http://localhost:3000/materias/pdf/${item.id}`,
                                            atividadeId: item.id,
                                            titulo: item.titulo,
                                            tema: item.tema,
                                            usuarioId,
                                            totalPaginas: 1,
                                          });
                                        }}
                                      >
                                        <Text
                                          style={[
                                            styles.arquivo,
                                            concluida && styles.textoConcluido,
                                          ]}
                                        >
                                          {item.titulo}
                                        </Text>
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
              )}
            </View>
          </Animatable.View>
        </ScrollView>
      )}

      {/* Botão flutuante */}
      {(isProfessor || isAdmin) && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalEnvioVisible(true)}
        >
          <Text style={{ fontSize: 35, color: "#fff", marginBottom: 10 }}>
            +
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal de envio */}
      <Modal animationType="fade" transparent visible={modalEnvioVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { zIndex: 2000 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enviar material</Text>
              <TouchableOpacity onPress={() => setModalEnvioVisible(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Matéria</Text>
            <DropDownPicker
              open={open}
              value={materiaSelecionada}
              items={materiasDisponiveis}
              setOpen={setOpen}
              setValue={setMateriaSelecionada}
              setItems={setMateriasDisponiveis}
              style={styles.input}
              zIndex={3000}
              zIndexInverse={1000}
            />

            <Text style={styles.label}>Tema</Text>
            <TextInput
              style={styles.input}
              value={tema}
              onChangeText={setTema}
              placeholder="Digite o tema"
            />

            <Text style={styles.label}>Subtema</Text>
            <TextInput
              style={styles.input}
              value={subtema}
              onChangeText={setSubtema}
              placeholder="Digite o Subtema"
            />

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título"
            />

            <TouchableOpacity
              style={styles.fileButton}
              onPress={selecionarArquivo}
            >
              <Text style={{ color: "#fff" }}>
                {arquivoPdf?.name || "Adicionar arquivo"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={enviarOuAtualizarMaterial}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {modoEdicao ? "Salvar" : "Enviar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição */}
      <Modal animationType="fade" transparent visible={modalEdiçãoVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar material</Text>
              <TouchableOpacity onPress={() => setModalEdicaoVisible(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Matéria</Text>
            <DropDownPicker
              open={open}
              value={materiaSelecionada}
              items={materiasDisponiveis}
              setOpen={setOpen}
              setValue={setMateriaSelecionada}
              setItems={setMateriasDisponiveis}
              style={styles.input}
              zIndex={3000}
              zIndexInverse={1000}
            />

            <Text style={styles.label}>Tema</Text>
            <TextInput
              style={styles.input}
              value={tema}
              onChangeText={setTema}
              placeholder="Digite o tema"
            />

            <Text style={styles.label}>Subtema</Text>
            <TextInput
              style={styles.input}
              value={subtema}
              onChangeText={setSubtema}
              placeholder="Digite o subtema"
            />

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título"
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={atualizarMaterial}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal dExcluir */}
      <Modal
        transparent
        animationType="fade"
        visible={confirmarExclusaoAtivo}
        onRequestClose={() => setConfirmarExclusaoAtivo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDeleteContainer}>
            <Text style={styles.modalDeleteTitle}>Confirmar exclusão</Text>

            <Text style={styles.modalDeleteText}>
              Tem certeza que deseja excluir os materiais selecionados?
              {"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                Essa ação é irreversível.
              </Text>
            </Text>

            <View style={styles.modalDeleteButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setConfirmarExclusaoAtivo(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#d32f2f" }]}
                onPress={deletarSelecionados}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de XP */}
      <Modal visible={modalXpVisible} transparent animationType="none">
        <View style={styles.modalXpOverlay}>
          <Animated.View
            style={[
              styles.modalXpBox,
              {
                opacity: animOpacity,
                transform: [{ scale: animScale }],
              },
            ]}
          >
            <MaterialIcons name="star" size={90} color="#FFD700" />
            <Text style={styles.modalXpTexto}>+{xpGanho} XP!</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* MenuBar */}
      <View style={styles.menuBarContainer}>
        <MenuBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {},
  botaoVoltar: { position: "absolute", top: 10 },
  botao: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#FFF",
    fontSize: 8,
    top: 5,
    position: "absolute",
    alignSelf: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  temaContainer: {
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  temaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  temaHeaderConcluida: {
    backgroundColor: "#C8E6C9",
    borderRadius: 8,
    padding: 10,
  },
  temaTitulo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  materiaTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0c4499",
    marginBottom: 5,
  },
  cardActivity: {
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
    width: "100%",
    alignSelf: "stretch",
  },
  arquivo: { fontSize: 14, color: "#555", marginBottom: 5 },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginTop: 5,
    marginBottom: 5,
    flex: 1,
  },
  progressBarFill: { height: 6, backgroundColor: "#4CAF50", borderRadius: 3 },
  cardConcluida: { backgroundColor: "#C8E6C9" },
  textoConcluido: { color: "#2E7D32", fontWeight: "bold" },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#0c4499",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    zIndex: 1000,
  },
  fileButton: {
    backgroundColor: "#8f8f8fff",
    borderRadius: 5,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: "#0b4e91",
    borderRadius: 5,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imagehH1: { width: 220, height: 80, marginBottom: 10 },
  menuBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#fc1f1fff",
    zIndex: 1000,
    elevation: 10,
  },
  mainContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#ecececff",
    minHeight: Dimensions.get("window").height * 0.75,
  },
  containerTitle: {
    fontSize: 28,
    marginTop: 4,
    marginBottom: 10,
    flex: 1,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  bolinhaContainer: {
    width: 20,
    alignItems: "center",
    // Faz a bolinha centralizar verticalmente em relação ao card
    justifyContent: "flex-start",
    marginTop: 10,
  },

  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    zIndex: 1,
  },

  linhaVertical: {
    width: 2,
    flex: 1, // Faz a linha preencher verticalmente
    backgroundColor: "#000",
    marginTop: 2, // Espaço entre bolinha e linha
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },

  modalXpOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000,
  },
  modalXpBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  modalXpTexto: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0b4e91",
    marginTop: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b4e91",
    marginTop: 40,
  },

  eleteModalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  modalDeleteContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  modalDeleteTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#d32f2f",
    textAlign: "center",
  },

  modalDeleteText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },

  modalDeleteButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
