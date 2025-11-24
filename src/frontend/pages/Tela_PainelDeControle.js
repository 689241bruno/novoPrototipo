import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    Platform,
    Modal, 
    TextInput,
    Switch,
    KeyboardAvoidingView
} from "react-native";
import * as Animatable from "react-native-animatable";
import Checkbox from "expo-checkbox";
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from "@expo/vector-icons";
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import UsuarioService from "../services/UsuarioService";
import ProfessorService from "../services/ProfessorService";
import AdminService from "../services/AdminService";
import MaterialService from "../services/MaterialService";
import DesafioService from "../services/DesafioService";
import QuestaoService from "../services/QuestaoService";
import NotificacaoService from "../services/NotificacaoService";
import RedacaoService from "../services/RedacaoService";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Tela_PainelControle() {
    const route = useRoute();
    const [activeSection, setActiveSection] = useState(route.params?.section || "usuarios");

    const [usuarios, setUsuarios] = useState([]);
    const [materia, setMateria] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [desafios, setDesafios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [isSliderOpen, setIsSliderOpen] = useState(true);
    const slideX = useRef(new Animated.Value(0)).current;
    const limite = width * 0.65;

    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const [selectedMateriais, setSelectedMateriais] = useState([]);
    const [selectedDesafios, setSelectedDesafios] = useState([]);

    // Estados para o modal de adicionar
    const [novoNome, setNovoNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [novaMateria, setNovaMateria] = useState("");
    const [isProfessor, setIsProfessor] = useState(true);

    const [tipoUsuario, setTipoUsuario] = useState("aluno"); // aluno, professor, admin

    // Estados para o modal de edição
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [editNome, setEditNome] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editMateria, setEditMateria] = useState("");

    // Estados para exclusão múltipla
    const [selectedUsers, setSelectedUsers] = useState([]);

    // ----- Materiais -----
    const [addMaterialModalVisible, setAddMaterialModalVisible] = useState(false);
    const [editMaterialModalVisible, setEditMaterialModalVisible] = useState(false);
    const [deleteMaterialModalVisible, setDeleteMaterialModalVisible] = useState(false);
    const [openMateria, setOpenMateria] = useState(false);

    const [materiasDisponiveis, setMateriasDisponiveis] = useState([
        { label: "Linguagens", value: "Linguagens" },
        { label: "Matemática", value: "Matematica" },
        { label: "Ciências da Natureza", value: "Ciencias da Natureza" },
        { label: "Ciências Humanas", value: "Ciencias Humanas" },
    ]);

    const [materialSelecionado, setMaterialSelecionado] = useState(null);
    const [tema, setTema] = useState("");
    const [subtema, setSubtema] = useState("");
    const [titulo, setTitulo] = useState("");
    const [materiaSelecionada, setMateriaSelecionada] = useState("");
    const [arquivoPdf, setArquivoPdf] = useState(null);
    
    // ----- Desafios -----
    const [modalDesafioVisible, setModalDesafioVisible] = useState(false);
    const [modalEditarDesafioVisible, setModalEditarDesafioVisible] = useState(false);
    const [modalExcluirDesafioVisible, setModalExcluirDesafioVisible] = useState(false);

    const [idDesafio, setIdDesafio] = useState(null);
    const [tituloDesafio, setTituloDesafio] = useState("");
    const [descricaoDesafio, setDescricaoDesafio] = useState("");
    const [materiaDesafio, setMateriaDesafio] = useState("");
    const [quantidadeDesafio, setQuantidadeDesafio] = useState("");
    const [xpDesafio, setXpDesafio] = useState("");
    const [imagemDesafio, setImagemDesafio] = useState(null);

    // --- Questões ---
    const [questoes, setQuestoes] = useState([]);
    const [selectedQuestoes, setSelectedQuestoes] = useState([]);
    const [modalAddQuestaoVisible, setModalAddQuestaoVisible] = useState(false);
    const [modalEditQuestaoVisible, setModalEditQuestaoVisible] = useState(false);
    const [modalDeleteQuestaoVisible, setModalDeleteQuestaoVisible] = useState(false);
    const [questaoSelecionada, setQuestaoSelecionada] = useState(null);
    
    const [tituloQuestao, setTituloQuestao] = useState("");
    const [enunciado, setEnunciado] = useState("");
    const [anoQuestao, setAnoQuestao] = useState("");
    const [prova, setProva] = useState("");
    const [materiaQuestao, setMateriaQuestao] = useState("");
    const [temaQuestao, setTemaQuestao] = useState("");
    const [alternativas, setAlternativas] = useState([
        { letra: "A", texto: "", correta: false },
        { letra: "B", texto: "", correta: false },
        { letra: "C", texto: "", correta: false },
        { letra: "D", texto: "", correta: false },
        { letra: "E", texto: "", correta: false },
    ]);

    const [editTituloQuestao, setEditTituloQuestao] = useState("");
    const [editEnunciado, setEditEnunciado] = useState("");
    const [editAnoQuestao, setEditAnoQuestao] = useState("");
    const [editProva, setEditProva] = useState("");
    const [editQuestaoMateria, setEditQuestaoMateria] = useState("");
    const [editTema, setEditTema] = useState("");
    const [editAlternativas, setEditAlternativas] = useState([]);

    // --- Notificações --- 
    const [notificacoes, setNotificacoes] = useState([]);
    const [selectedNotificacoes, setSelectedNotificacoes] = useState([]);

    const [modalAddNotifVisible, setModalAddNotifVisible] = useState(false);
    const [modalEditNotifVisible, setModalEditNotifVisible] = useState(false);
    const [modalDeleteNotifVisible, setModalDeleteNotifVisible] = useState(false);

    const [notifSelecionada, setNotifSelecionada] = useState(null);

    // Campos
    const [tituloNotif, setTituloNotif] = useState("");
    const [mensagemNotif, setMensagemNotif] = useState("");
    const [tipoNotif, setTipoNotif] = useState(""); // info, alerta, aviso...

    // --- Temas (Redações) ---
    const [temas, setTemas] = useState([]);
    const [selectedTemas, setSelectedTemas] = useState([]);

    const [tema_redacao, setTemaRedacao] = useState("");
    const [anoTema, setAnoTema] = useState("");

    const [titulo1, setTitulo1] = useState("");
    const [titulo2, setTitulo2] = useState("");
    const [titulo3, setTitulo3] = useState("");
    const [titulo4, setTitulo4] = useState("");

    const [texto1, setTexto1] = useState("");
    const [texto2, setTexto2] = useState("");
    const [texto3, setTexto3] = useState("");
    const [texto4, setTexto4] = useState("");

    const [imagem1, setImagem1] = useState(null);
    const [imagem2, setImagem2] = useState(null);
    const [imagem3, setImagem3] = useState(null);
    const [imagem4, setImagem4] = useState(null);

    const [idTema, setIdTema] = useState(null);

    const [modalAddTemaVisible, setModalAddTemaVisible] = useState(false);
    const [modalEditTemaVisible, setModalEditTemaVisible] = useState(false);
    const [modalExcluirTemaVisible, setModalExcluirTemaVisible] = useState(false);

    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    usuariosResp,
                    professoresResp,
                    materiasResp,
                    desafiosResp,
                    questoesResp,
                    redacoesResp,
                    notificacoesResp,
                ] = await Promise.all([
                    UsuarioService.listarUsuarios(),
                    ProfessorService.listarProfessores(),
                    MaterialService.listar(),
                    DesafioService.listarDesafios(),
                    QuestaoService.listar(),     
                    RedacaoService.listar(),
                    NotificacaoService.listar()
                ]);

                // Relacionar os professores às suas matérias
                const usuariosComMateria = (usuariosResp.data || []).map((u) => {
                    if (u.is_professor) {
                        const professor = professoresResp.data.find(p => p.usuario_id === u.id);
                        return { ...u, materia: professor ? professor.materia : "—" };
                    }
                    return { ...u, materia: "—" };
                });

                setUsuarios(usuariosComMateria || []);
                setMateriais(materiasResp.data || []);
                setDesafios(desafiosResp.data || []);
                setQuestoes(questoesResp.data || []);
                setTemas(redacoesResp.data || []);
                setNotificacoes(notificacoesResp.data || []);
            } catch (err) {
                console.error("Erro ao carregar dados do painel:", err);
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, [refresh]);

    useEffect(() => {
        if (modalAddQuestaoVisible) {
            setAlternativas([
                { letra: "A", texto: "", correta: false },
                { letra: "B", texto: "", correta: false },
                { letra: "C", texto: "", correta: false },
                { letra: "D", texto: "", correta: false },
                { letra: "E", texto: "", correta: false },
            ]);
        }
    }, [modalAddQuestaoVisible]);

    // Alternar abertura e fechamento do slider
    const toggleSlider = () => {
        Animated.timing(slideX, {
            toValue: isSliderOpen ? -limite : 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsSliderOpen(!isSliderOpen));
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Carregando dados...</Text>
            </View>
        );
    }

    // --- Adicionar novo usuário ---
    async function handleAddUsuario() {
        try {
            // Garante que tipoUsuario tenha valor (por padrão "aluno")
            const tipo = tipoUsuario || "aluno";

            const is_admin = tipo === "admin" ? 1 : 0;
            const is_professor = tipo === "professor" ? 1 : 0;
            const is_aluno = tipo === "aluno" ? 1 : 0;

            console.log("Enviando para backend:", { novoNome, novoEmail, novaSenha, is_aluno, is_professor, is_admin });

            // Cria o usuário base
            const novoUsuario = await UsuarioService.cadastrarUsuario(
                novoNome,
                novoEmail,
                novaSenha,
                is_aluno,
                is_professor,
                is_admin
            );

            const usuario_id =
                novoUsuario.data?.id ||
                novoUsuario.data?.usuario?.id ||
                novoUsuario.data?.novoUsuario?.id ||
            null;

            // Se for professor, cria o registro
            if (tipo === "professor" && novaMateria.trim()) {
                await ProfessorService.cadastrarProfessor(usuario_id, novaMateria);
            }

            // Se for admin, cria o registro
            if (tipo === "admin") {
                await UsuarioService.cadastrarAdmin(usuario_id, novoEmail);
            }

            setUsuarios([...usuarios, novoUsuario.data || novoUsuario]);
            alert("Usuário cadastrado com sucesso!");
            setAddModalVisible(false);

            // Limpa campos
            setNovoNome("");
            setNovoEmail("");
            setNovaSenha("");
            setNovaMateria("");
            setTipoUsuario("aluno");
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error("Erro ao cadastrar usuário:", err);
            alert("Erro ao cadastrar usuário");
        }
    }

    // --- Abrir modal de edição com dados preenchidos ---
    function openEditModal(usuario) {
        setUsuarioSelecionado(usuario);
        setEditNome(usuario.nome);
        setEditEmail(usuario.email);
        setEditMateria(usuario.materia || "");
        setEditModalVisible(true);
    }

    // --- Salvar alterações de edição ---
    async function handleEditUsuario() {
        try {
            console.log("📤 Enviando:", {
                id: usuarioSelecionado.id,
                nome: editNome,
                email: editEmail
            });

            await UsuarioService.editarUsuario({
                id: usuarioSelecionado.id,
                nome: editNome,
                email: editEmail
            });

            setRefresh(prev => prev + 1);
            alert("Usuário atualizado com sucesso!");
            setEditModalVisible(false);
        } catch (err) {
            console.error("Erro ao editar usuário:", err);
            alert("Erro ao editar usuário");
        }
    }

    async function handleEditProfessor() {
        try {
            const dados = { materia: editMateria };
            await ProfessorService.editarProfessor(usuarioSelecionado.id, { materia: editMateria });
            setRefresh(prev => prev + 1);
            alert("Matéria do professor atualizada!");
        } catch (err) {
            console.error("Erro ao editar professor:", err);
            alert("Erro ao editar professor");
        }
    }

    // --- Exclusão múltipla ---
    async function handleMultiDelete() {
        try {
            for (const id of selectedUsers) {
                await UsuarioService.deletarUsuario(id);
            }
            setRefresh(prev => prev + 1);
            alert("Usuários excluídos com sucesso!");
            setSelectedUsers([]);
            setDeleteModalVisible(false);
        } catch (err) {
            console.error("Erro ao excluir usuários:", err);
        }
    }

    async function handleDeleteUsuario(id) {
        try {
            await UsuarioService.deletarUsuario(id);
            setRefresh(prev => prev + 1);
            alert("Usuário excluído!");
            setUsuarios(usuarios.filter(u => u.id !== id));
        } catch (err) {
            console.error("Erro ao excluir usuário:", err);
        }
    }

    // --- Material ---
    async function handleAddMaterial() {
        try {
            await MaterialService.publicarMateria({
                titulo,
                materia: materiaSelecionada,
                arquivo: arquivoPdf,
            });
            setRefresh(prev => prev + 1);
            alert("Material publicado com sucesso!");
            setAddMaterialModalVisible(false);
        } catch (err) {
            console.error("Erro ao enviar material:", err);
            alert("Erro ao enviar material");
        }
    }

    const selecionarArquivoPDF = async () => {
        try {
            if (Platform.OS === "web") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/pdf";
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                const fileUrl = URL.createObjectURL(file);
                setArquivoPdf({
                    uri: fileUrl,
                    name: file.name,
                    type: file.type || "application/pdf",
                    file, // guarda o objeto original
                });
                }
            };
            input.click();
            } else {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const file = result.assets[0];
                setArquivoPdf({
                uri: file.uri,
                name: file.name,
                type: file.mimeType || "application/pdf",
                });
            }
            }
        } catch (err) {
            console.error("Erro ao selecionar arquivo:", err);
            alert("Erro ao selecionar o arquivo.");
        }
    };

    const enviarMaterial = async () => {
        if (!arquivoPdf || !titulo.trim() || !tema.trim()) {
            alert("Preencha todos os campos e selecione um arquivo.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("titulo", titulo.trim());
            formData.append("tema", tema.trim());
            formData.append("subtema", subtema.trim());
            formData.append("materia", materiaSelecionada);
            formData.append("criado_por", 1); // substitua pelo ID real do usuário logado, se houver

            if (Platform.OS === "web") {
            const blob = arquivoPdf.file
                ? arquivoPdf.file
                : await (await fetch(arquivoPdf.uri)).blob();
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
            setRefresh(prev => prev + 1);

            if (response.status === 201 || response.ok) {
                alert("Material enviado com sucesso!");
                setTitulo("");
                setTema("");
                setSubtema("");
                setArquivoPdf(null);
                setAddMaterialModalVisible(false);
            } else {
                console.error("Erro no envio:", response);
                alert("Erro ao enviar material. Verifique o servidor.");
            }
        } catch (err) {
            console.error("Erro ao enviar material:", err);
            alert("Erro ao enviar material. Verifique a conexão e o servidor.");
        }
    };

    function openEditMaterial(m) {
        if (!m) return;
        setMaterialSelecionado(m);
        setTitulo(m.titulo || "");
        setMateriaSelecionada(m.materia || "");
        setTema(m.tema || "");
        setSubtema(m.subtema || "");
        setEditMaterialModalVisible(true);
    }

    function closeEditMaterialModal() {
        setEditMaterialModalVisible(false);
        setMaterialSelecionado(null);
        setTitulo("");
        setMateriaSelecionada("");
        setTema("");
        setSubtema("");
        setArquivoPdf(null);
    }

    async function handleEditMaterial() {
        if (!materialSelecionado) {
            alert("Selecione um material para editar.");
            return;
        }
        if (!titulo.trim() || !tema.trim() || !materiaSelecionada.trim()) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const dados = {
                titulo: titulo.trim(),
                materia: materiaSelecionada.trim(),
                tema: tema.trim(),
                subtema: subtema.trim(),
            };

            await ProfessorService.editarMaterial(materialSelecionado.id, dados);
            setRefresh(prev => prev + 1);

            // Atualizar lista de materiais localmente
            setMateriais((prev) =>
                prev.map((m) => (m.id === materialSelecionado.id ? { ...m, ...dados } : m))
            );

            alert("Material atualizado com sucesso!");
            closeEditMaterialModal();
        } catch (err) {
            console.error("Erro ao editar material:", err);
            alert("Erro ao editar material! Verifique a conexão e o servidor.");
        }
    }

    async function handleDeleteMaterial(id) {
        try {
            await ProfessorService.deletarMaterial(id);
            setRefresh(prev => prev + 1);
            alert("Material excluído com sucesso!");
            setMateriais(materiais.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Erro ao excluir material:", err);
            alert("Erro ao excluir material!");
        }
    }

    // --- Desafios ---
    async function enviarDesafio() {
        try {
            const payload = {
                titulo: tituloDesafio,
                descricao: descricaoDesafio,
                materia: materiaDesafio,       // <-- ADICIONADO
                quantidade: quantidadeDesafio, // <-- ADICIONADO
                xp: xpDesafio,
                img: imagemDesafio ?? null
            };

            await DesafioService.criarDesafio(payload);
            setRefresh(prev => prev + 1);

            alert("Desafio enviado com sucesso!");
            setModalDesafioVisible(false);
        } catch (err) {
            console.error("Erro ao enviar desafio:", err);
            alert("Erro ao enviar desafio");
        }
    }

    function openEditDesafio(d) {
        setIdDesafio(d.id);               // <-- FALTAVA!
        setTituloDesafio(d.titulo);
        setDescricaoDesafio(d.descricao);
        setMateriaDesafio(d.materia);
        setQuantidadeDesafio(String(d.quantidade));
        setXpDesafio(String(d.xp));
        setImagemDesafio(null);
        setModalEditarDesafioVisible(true);
    }

    async function editarDesafio() {
        try {
            const payload = {
                titulo: tituloDesafio,
                descricao: descricaoDesafio,
                materia: materiaDesafio,
                quantidade: quantidadeDesafio,
                xp: xpDesafio,
                img: imagemDesafio ?? null
            };

            await DesafioService.editarDesafio(idDesafio, payload);
            setRefresh(prev => prev + 1);

            alert("Desafio atualizado!");
            setModalEditarDesafioVisible(false);

        } catch (err) {
            console.error("Erro ao editar desafio:", err);
            alert("Erro ao editar desafio");
        }
    }

    async function handleDeleteDesafio(id) {
        try {
            await DesafioService.deletarDesafio(id);
            setRefresh(prev => prev + 1);
            alert("Desafio excluído!");
        } catch (err) {
            console.error("Erro ao excluir desafio:", err);
        }
    } 

    const selecionarImagemDesafio = async () => {
        try {
            if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onloadend = () => {
                    setImagemDesafio(reader.result); // base64 direto!
                    };
                    reader.readAsDataURL(file);
                };

                input.click();
            } else {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    base64: true
                });

                if (!result.canceled) {
                    const base64 = "data:image/jpeg;base64," + result.assets[0].base64;
                    setImagemDesafio(base64);
                }
            }
        } catch (err) {
            console.error("Erro ao selecionar imagem:", err);
            alert("Erro ao selecionar imagem.");
        }
    };

    // --- Questão --- 
    async function handleAddQuestao() {
        try {
            await QuestaoService.criar({
                titulo: tituloQuestao,
                enunciado: enunciado,
                ano: anoQuestao,
                prova: prova,
                materia: materiaQuestao,
                tema: temaQuestao,
                alternativas: alternativas
            });

            alert("Questão cadastrada!");
            setModalAddQuestaoVisible(false);
            setRefresh(prev => prev + 1);

        } catch (err) {
            console.error("Erro ao criar questão:", err);
            alert("Erro ao criar questão");
        }
    }

    function openEditQuestao(q) {
        setQuestaoSelecionada(q);

        setEditTituloQuestao(q.titulo);
        setEditEnunciado(q.enunciado);
        setEditAnoQuestao(q.ano);
        setEditProva(q.prova);
        setEditQuestaoMateria(q.materia);
        setEditAlternativas(q.alternativas);

        setModalEditQuestaoVisible(true);
    }

    async function handleEditQuestao() {
        try {
            await QuestaoService.editar(questaoSelecionada.id, {
                titulo: editTituloQuestao,
                enunciado: editEnunciado,
                ano: editAnoQuestao,
                prova: editProva,
                materia: editQuestaoMateria,
                tema: editTema,
                alternativas: editAlternativas
            });

            alert("Questão atualizada!");
            setModalEditQuestaoVisible(false);
            setRefresh(prev => prev + 1);

        } catch (err) {
            console.error("Erro ao editar questão:", err);
            alert("Erro ao editar questão");
        }
    }

    async function handleDeleteQuestao(id) {
        try {
            await QuestaoService.deletar(id);
            alert("Questão excluída!");
            setRefresh(prev => prev + 1);

        } catch (err) {
            console.error("Erro ao excluir questão:", err);
            alert("Erro ao excluir questão");
        }
    }

    async function handleMultiDeleteQuestoes() {
        if (selectedQuestoes.length === 0) {
            alert("Selecione ao menos uma questão!");
            return;
        }

        try {
            for (const id of selectedQuestoes) {
                await QuestaoService.deletar(id);
            }

            alert("Questões excluídas!");
            setSelectedQuestoes([]);
            setModalDeleteQuestaoVisible(false);
            setRefresh(prev => prev + 1);

        } catch (err) {
            console.error("Erro ao excluir múltiplas questões:", err);
            alert("Erro ao excluir!");
        }
    }

    // Notificação
    async function handleAddNotificacao() {
        try {
            await NotificacaoService.criar({
                titulo: tituloNotif,
                mensagem: mensagemNotif,
                tipo: tipoNotif,
            });

            alert("Notificação enviada!");
            setModalAddNotifVisible(false);
            setTituloNotif("");
            setMensagemNotif("");
            setTipoNotif("");
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error("Erro ao criar notificação:", err);
            alert("Erro ao criar notificação.");
        }
    }

    function openEditNotificacao(notif) {
        setNotifSelecionada(notif);

        setTituloNotif(notif.titulo);
        setMensagemNotif(notif.mensagem);
        setTipoNotif(notif.tipo);

        setModalEditNotifVisible(true);
    }

    async function handleEditNotificacao() {
        try {
            await NotificacaoService.editar(notifSelecionada.id, {
                titulo: tituloNotif,
                mensagem: mensagemNotif,
                tipo: tipoNotif
            });

            alert("Notificação atualizada!");
            setModalEditNotifVisible(false);
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error("Erro ao editar notificação:", err);
            alert("Erro ao editar.");
        }
    }

    async function handleDeleteNotificacao(id) {
        try {
            await NotificacaoService.deletar(id);

            alert("Notificação excluída!");
            setRefresh(prev => prev + 1);
        } catch (err) {
            console.error("Erro ao excluir notificação:", err);
            alert("Erro ao excluir.");
        }
    }

    async function handleMultiDeleteNotificacoes() {
        if (selectedNotificacoes.length === 0) {
            alert("Selecione pelo menos uma notificação!");
            return;
        }

        try {
            for (const id of selectedNotificacoes) {
                await NotificacaoService.deletar(id);
            }

            alert("Notificações excluídas!");
            setSelectedNotificacoes([]);
            setModalDeleteNotifVisible(false);
            setRefresh(prev => prev + 1);
            
        } catch (err) {
            console.error("Erro ao excluir notificações:", err);
            alert("Erro ao excluir múltiplas notificações.");
        }
    }

    // Temas Redação
    async function enviarTema() {
        try {
            const payload = {
                tema: tema_redacao,
                ano: anoTema,

                titulo_texto1: titulo1,
                titulo_texto2: titulo2,
                titulo_texto3: titulo3,
                titulo_texto4: titulo4,

                texto1: texto1,
                texto2: texto2,
                texto3: texto3,
                texto4: texto4,

                img1: imagem1 ?? null,
                img2: imagem2 ?? null,
                img3: imagem3 ?? null,
                img4: imagem4 ?? null,
            };

            await RedacaoService.criar(payload);
            setRefresh(prev => prev + 1);

            alert("Tema criado!");
            setModalAddTemaVisible(false);

        } catch (err) {
            console.error("Erro ao criar tema:", err);
            alert("Erro ao criar tema");
        }
    }

    function openEditTema(t) {
        setIdTema(t.id);

        setTemaRedacao(t.tema_redacao);
        setAnoTema(t.ano);

        setTitulo1(t.titulo_texto1);
        setTitulo2(t.titulo_texto2);
        setTitulo3(t.titulo_texto3);
        setTitulo4(t.titulo_texto4);

        setTexto1(t.texto1);
        setTexto2(t.texto2);
        setTexto3(t.texto3);
        setTexto4(t.texto4);

        // Para evitar enviar imagem antiga automaticamente
        setImagem1(null);
        setImagem2(null);
        setImagem3(null);
        setImagem4(null);

        setModalEditTemaVisible(true);
    }

    async function editarTema() {
        try {
            const payload = {
                tema: tema_redacao,
                ano: anoTema,

                titulo_texto1: titulo1,
                titulo_texto2: titulo2,
                titulo_texto3: titulo3,
                titulo_texto4: titulo4,

                texto1: texto1,
                texto2: texto2,
                texto3: texto3,
                texto4: texto4,

                img1: imagem1 ?? null,
                img2: imagem2 ?? null,
                img3: imagem3 ?? null,
                img4: imagem4 ?? null,
            };

            await RedacaoService.editar(idTema, payload);
            setRefresh(prev => prev + 1);

            alert("Tema atualizado!");
            setModalEditTemaVisible(false);

        } catch (err) {
            console.error("Erro ao editar tema:", err);
            alert("Erro ao editar tema");
        }
    }

    async function handleDeleteTema(id) {
        try {
            await RedacaoService.deletar(id);
            setRefresh(prev => prev + 1);
            alert("Tema excluído!");
        } catch (err) {
            console.error("Erro ao excluir tema:", err);
        }
    }

    const selecionarImagem = async (index) => {
        try {
            if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result;

                        if (index === 1) setImagem1(base64);
                        if (index === 2) setImagem2(base64);
                        if (index === 3) setImagem3(base64);
                        if (index === 4) setImagem4(base64);
                    };
                    reader.readAsDataURL(file);
                };

                input.click();
            } else {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    base64: true,
                });

                if (!result.canceled) {
                    const base64 = "data:image/jpeg;base64," + result.assets[0].base64;

                    if (index === 1) setImagem1(base64);
                    if (index === 2) setImagem2(base64);
                    if (index === 3) setImagem3(base64);
                    if (index === 4) setImagem4(base64);
                }
            }
        } catch (err) {
            console.error("Erro ao selecionar imagem:", err);
            alert("Erro ao selecionar imagem.");
        }
    };

    // Funções para abrir os modais corretos
    const abrirAdicionar = () => {
        switch (activeSection) {
            case "usuarios":
                setAddModalVisible(true);
                break;
            case "materiais":
                setAddMaterialModalVisible(true);
                break;
            case "desafios":
                setModalDesafioVisible(true);
                break;
            case "questoes":
                setModalAddQuestaoVisible(true);
                break;
            case "notificacoes":
                setModalAddNotifVisible(true);
                break;
            case "temas":
                setModalAddTemaVisible(true);
                break;
        }
    };

    const abrirEditar = () => {
        switch (activeSection) {
            case "usuarios":
                setEditModalVisible(true);
                break;
            case "materiais":
                setEditMaterialModalVisible(true);
                break;
            case "desafios":
                setModalEditarDesafioVisible(true);
                break;
            case "questoes":
                setModalEditQuestaoVisible(true);
                break;
            case "notificacoes":
                setModalEditNotifVisible(true);
                break;
            case "temas":
                setModalEditTemaVisible(true);
                break;
        }
    };

    const abrirExcluir = () => {
        switch (activeSection) {
            case "usuarios":
                setDeleteModalVisible(true);
                break;
            case "materiais":
                setDeleteMaterialModalVisible(true);
                break;
            case "desafios":
                setModalExcluirDesafioVisible(true);
                break;
            case "questoes":
                setModalDeleteQuestaoVisible(true);
                break;
            case "notificacoes":
                setModalDeleteNotifVisible(true);
                break;
            case "temas":
                setDeleteTemaModalVisible(true);
                break;
        }
    };

    // Exibir tabela de acordo com a seção ativa
    const renderSection = () => {
        switch (activeSection) {
            case "usuarios":
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Usuários</Text>
                    <ScrollView horizontal>
                        <View style={styles.table}>
                        <View style={[styles.tableHeader, { alignItems: "center" }]}>
                            <Text style={[styles.cell, { width: 40 }]}>Sel.</Text>
                            <Text style={[styles.cell, { width: 60 }]}>ID</Text>
                            <Text style={[styles.cell, { width: 150 }]}>Nome</Text>
                            <Text style={[styles.cell, { width: 200 }]}>Email</Text>
                            <Text style={[styles.cell, { width: 100 }]}>Tipo</Text>
                            <Text style={[styles.cell, { width: 150 }]}>Matéria</Text>
                            <Text style={[styles.cell, { width: 120 }]}>Ações</Text>
                        </View>

                        <ScrollView style={{ maxHeight: 350 }} nestedScrollEnabled={true}>
                            {usuarios.map((u) => (
                                <View key={u.id} style={[styles.tableRow, { alignItems: "center" }]}>
                                    <View style={[styles.cell, { width: 40 }]}>
                                    <Checkbox
                                        value={selectedUsuarios.includes(u.id)}
                                        onValueChange={(val) => {
                                            if (val) setSelectedUsuarios([...selectedUsuarios, u.id]);
                                            else setSelectedUsuarios(selectedUsuarios.filter((id) => id !== u.id));
                                        }}
                                        color={selectedUsers.includes(u.id) ? "#0b4e91" : undefined}
                                    />
                                    </View>
                                    <Text style={[styles.cell, { width: 60 }]}>{u.id}</Text>
                                    <Text style={[styles.cell, { width: 150 }]}>{u.nome}</Text>
                                    <Text style={[styles.cell, { width: 200 }]}>{u.email}</Text>
                                    <Text style={[styles.cell, { width: 100 }]}>
                                        {u.is_admin ? "Admin" : u.is_professor ? "Professor" : "Aluno"}
                                    </Text>
                                    <Text style={[styles.cell, { width: 150 }]}>
                                        {u.is_professor ? (u.materia || "—") : "—"}
                                    </Text>
                                    <View
                                        style={[
                                            styles.cell,
                                            { width: 120, flexDirection: "row", justifyContent: "center", gap: 10 },
                                        ]}
                                    >
                                        <TouchableOpacity onPress={() => openEditModal(u)}>
                                            <MaterialIcons name="edit" size={22} color="#0b4e91" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteUsuario(u.id)}>
                                            <MaterialIcons name="delete" size={22} color="#b91c1c" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            );

            case "materiais":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Materiais</Text>
                        <ScrollView horizontal>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.cell, { width: 40 }]}>Sel.</Text>
                                    <Text style={[styles.cell, { width: 60 }]}>ID</Text>
                                    <Text style={[styles.cell, { width: 120 }]}>Matéria</Text>
                                    <Text style={[styles.cell, { width: 200 }]}>Título</Text>
                                    <Text style={[styles.cell, { width: 150 }]}>Autor</Text>
                                    <Text style={[styles.cell, { width: 120 }]}>Ações</Text>
                                </View>

                                <ScrollView style={{ maxHeight: 350 }}>
                                    {materiais.map((m) => (
                                        <View key={m.id} style={[styles.tableRow, { alignItems: "center" }]}>
                                            <View style={[styles.cell, { width: 40 }]}>
                                            <Checkbox
                                                value={selectedUsers.includes(m.id)}
                                                onValueChange={(val) => {
                                                if (val)
                                                    setSelectedUsers([...selectedUsers, m.id]);
                                                else
                                                    setSelectedUsers(selectedUsers.filter((id) => id !== m.id));
                                                }}
                                                color={selectedUsers.includes(m.id) ? "#0b4e91" : undefined}
                                            />
                                            </View>
                                            <Text style={[styles.cell, { width: 60 }]}>{m.id}</Text>
                                            <Text style={[styles.cell, { width: 120 }]}>{m.materia}</Text>
                                            <Text style={[styles.cell, { width: 200 }]}>{m.titulo}</Text>
                                            <Text style={[styles.cell, { width: 150 }]}>{m.criado_por}</Text>
                                            <View
                                                style={[
                                                    styles.cell,
                                                    { width: 120, flexDirection: "row", justifyContent: "center", gap: 10 },
                                                ]}
                                            >
                                                <TouchableOpacity onPress={() => openEditMaterial(m)}>
                                                    <MaterialIcons name="edit" size={22} color="#0b4e91" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleDeleteMaterial(m.id)}>
                                                    <MaterialIcons name="delete" size={22} color="#b91c1c" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                );

            case "desafios":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Desafios</Text>
                        <ScrollView horizontal>
                            <View style={styles.table}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.cell, { width: 40 }]}>Sel.</Text>
                                    <Text style={[styles.cell, { width: 60 }]}>ID</Text>
                                    <Text style={[styles.cell, { width: 200 }]}>Título</Text>
                                    <Text style={[styles.cell, { width: 100 }]}>XP</Text>
                                    <Text style={[styles.cell, { width: 120 }]}>Ações</Text>
                                </View>

                                <ScrollView style={{ maxHeight: 350 }}>
                                    {desafios.map((d) => (
                                        <View key={d.id} style={[styles.tableRow, { alignItems: "center" }]}>
                                            <View style={[styles.cell, { width: 40 }]}>
                                                <Checkbox
                                                    value={selectedUsers.includes(d.id)}
                                                    onValueChange={(val) => {
                                                    if (val)
                                                        setSelectedUsers([...selectedUsers, d.id]);
                                                    else
                                                        setSelectedUsers(selectedUsers.filter((id) => id !== d.id));
                                                    }}
                                                    color={selectedUsers.includes(d.id) ? "#0b4e91" : undefined}
                                                />
                                            </View>
                                            <Text style={[styles.cell, { width: 60 }]}>{d.id}</Text>
                                            <Text style={[styles.cell, { width: 200 }]}>{d.titulo}</Text>
                                            <Text style={[styles.cell, { width: 100 }]}>{d.xp}</Text>
                                            <View
                                                style={[
                                                    styles.cell,
                                                    { width: 120, flexDirection: "row", justifyContent: "center", gap: 10 },
                                                ]}
                                            >
                                                <TouchableOpacity onPress={() => openEditDesafio(d)}>
                                                    <MaterialIcons name="edit" size={22} color="#0b4e91" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleDeleteDesafio(d.id)}>
                                                    <MaterialIcons name="delete" size={22} color="#b91c1c" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))};
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                );

            case "questoes":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Questões</Text>

                        <ScrollView horizontal>
                            <View style={styles.table}>

                                {/* Cabeçalho */}
                                <View style={[styles.tableHeader, { alignItems: "center" }]}>
                                    <Text style={[styles.cellHeader, { width: 40 }]}>Sel.</Text>
                                    <Text style={[styles.cellHeader, { width: 60 }]}>ID</Text>
                                    <Text style={[styles.cellHeader, { width: 250 }]}>Título</Text>
                                    <Text style={[styles.cellHeader, { width: 400 }]}>Enunciado</Text>
                                    <Text style={[styles.cellHeader, { width: 80 }]}>Ano</Text>
                                    <Text style={[styles.cellHeader, { width: 150 }]}>Prova</Text>
                                    <Text style={[styles.cellHeader, { width: 150 }]}>Matéria</Text>
                                    <Text style={[styles.cellHeader, { width: 300 }]}>Alternativas</Text>
                                    <Text style={[styles.cellHeader, { width: 120 }]}>Ações</Text>
                                </View>

                                {/* Conteúdo */}
                                <ScrollView style={{ maxHeight: 350 }} nestedScrollEnabled={true}>
                                    {questoes.map((q) => (
                                        <View key={q.id} style={[styles.tableRow, { alignItems: "flex-start" }]}>

                                            {/* Checkbox */}
                                            <View style={[styles.cell, { width: 40 }]}>
                                                <Checkbox
                                                    value={selectedQuestoes.includes(q.id)}
                                                    onValueChange={(val) => {
                                                        if (val)
                                                            setSelectedQuestoes([...selectedQuestoes, q.id]);
                                                        else
                                                            setSelectedQuestoes(
                                                                selectedQuestoes.filter(id => id !== q.id)
                                                            );
                                                    }}
                                                    color={selectedQuestoes.includes(q.id) ? "#0b4e91" : undefined}
                                                />
                                            </View>

                                            {/* ID */}
                                            <Text style={[styles.cell, { width: 60 }]}>{q.id}</Text>

                                            {/* Título */}
                                            <Text style={[styles.cellMulti, { width: 250 }]}>
                                                {q.titulo}
                                            </Text>

                                            {/* Texto / Enunciado */}
                                            <Text style={[styles.cellMulti, { width: 400 }]}>
                                                {q.enunciado}
                                            </Text>

                                            {/* Ano */}
                                            <Text style={[styles.cell, { width: 80 }]}>{q.ano}</Text>

                                            {/* Categoria */}
                                            <Text style={[styles.cell, { width: 150 }]}>{q.prova}</Text>

                                            {/* Subcategoria */}
                                            <Text style={[styles.cell, { width: 150 }]}>{q.materia}</Text>

                                            {/* Alternativas */}
                                            <Text style={[styles.cellMulti, { width: 300 }]}>
                                                {q.alternativas
                                                    .map(a => `${a.letra}) ${a.texto}${a.correta ? "  ✓" : ""}`)
                                                    .join("\n\n")}
                                            </Text>

                                            {/* Ações */}
                                            <View
                                                style={[
                                                    styles.cell,
                                                    {
                                                        width: 120,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        gap: 10,
                                                    },
                                                ]}
                                            >
                                                <TouchableOpacity onPress={() => openEditQuestao(q)}>
                                                    <MaterialIcons name="edit" size={22} color="#0b4e91" />
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => handleDeleteQuestao(q.id)}>
                                                    <MaterialIcons name="delete" size={22} color="#b91c1c" />
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    ))}
                                </ScrollView>

                            </View>
                        </ScrollView>
                    </View>
                );

            case "notificacoes":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notificações</Text>

                        <ScrollView horizontal>
                            <View style={styles.table}>

                                <View style={styles.tableHeader}>
                                    <Text style={[styles.cellHeader, { width: 40 }]}>Sel.</Text>
                                    <Text style={[styles.cellHeader, { width: 60 }]}>ID</Text>
                                    <Text style={[styles.cellHeader, { width: 200 }]}>Título</Text>
                                    <Text style={[styles.cellHeader, { width: 400 }]}>Mensagem</Text>
                                    <Text style={[styles.cellHeader, { width: 150 }]}>Tipo</Text>
                                    <Text style={[styles.cellHeader, { width: 120 }]}>Ações</Text>
                                </View>

                                <ScrollView style={{ maxHeight: 350 }}>
                                    {notificacoes.map((n) => (
                                        <View key={n.id} style={styles.tableRow}>

                                            <View style={[styles.cell, { width: 40 }]}>
                                                <Checkbox
                                                    value={selectedNotificacoes.includes(n.id)}
                                                    onValueChange={(val) => {
                                                        if (val)
                                                            setSelectedNotificacoes([...selectedNotificacoes, n.id]);
                                                        else
                                                            setSelectedNotificacoes(
                                                                selectedNotificacoes.filter(id => id !== n.id)
                                                            );
                                                    }}
                                                    color={selectedNotificacoes.includes(n.id) ? "#0b4e91" : undefined}
                                                />
                                            </View>

                                            <Text style={[styles.cell, { width: 60 }]}>{n.id}</Text>
                                            <Text style={[styles.cell, { width: 200 }]}>{n.titulo}</Text>
                                            <Text style={[styles.cellMulti, { width: 400 }]}>{n.mensagem}</Text>
                                            <Text style={[styles.cell, { width: 150 }]}>{n.tipo}</Text>

                                            <View style={[styles.cell, { width: 120, flexDirection: "row", justifyContent: "center", gap: 10 }]}>
                                                <TouchableOpacity onPress={() => openEditNotificacao(n)}>
                                                    <MaterialIcons name="edit" size={22} color="#0b4e91" />
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => handleDeleteNotificacao(n.id)}>
                                                    <MaterialIcons name="delete" size={22} color="#b91c1c" />
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                );

            case "temas":
                return (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Temas de Redação</Text>

                        <ScrollView horizontal>
                            <View style={styles.table}>

                                {/* Cabeçalho */}
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.cellHeader, { width: 40 }]}>Sel.</Text>
                                    <Text style={[styles.cellHeader, { width: 60 }]}>ID</Text>
                                    <Text style={[styles.cellHeader, { width: 250 }]}>Tema</Text>
                                    <Text style={[styles.cellHeader, { width: 80 }]}>Ano</Text>
                                    <Text style={[styles.cellHeader, { width: 300 }]}>Títulos</Text>
                                    <Text style={[styles.cellHeader, { width: 500 }]}>Textos</Text>
                                    <Text style={[styles.cellHeader, { width: 120 }]}>Ações</Text>
                                </View>

                                {/* Conteúdo */}
                                <ScrollView style={{ maxHeight: 350 }}>
                                    {temas.map((t) => (
                                        <View key={t.id} style={[styles.tableRow, { alignItems: "flex-start" }]}>

                                            {/* Checkbox */}
                                            <View style={[styles.cell, { width: 40 }]}>
                                                <Checkbox
                                                    value={selectedTemas.includes(t.id)}
                                                    onValueChange={(val) => {
                                                        if (val)
                                                            setSelectedTemas([...selectedTemas, t.id]);
                                                        else
                                                            setSelectedTemas(selectedTemas.filter(id => id !== t.id));
                                                    }}
                                                    color={selectedTemas.includes(t.id) ? "#0b4e91" : undefined}
                                                />
                                            </View>

                                            {/* ID */}
                                            <Text style={[styles.cell, { width: 60 }]}>{t.id}</Text>

                                            {/* Tema */}
                                            <Text style={[styles.cellMulti, { width: 250 }]}>
                                                {t.tema_redacao || t.tema}
                                            </Text>

                                            {/* Ano */}
                                            <Text style={[styles.cell, { width: 80 }]}>{t.ano}</Text>

                                            {/* Títulos */}
                                            <Text style={[styles.cellMulti, { width: 300 }]}>
                                                {(t.titulo_texto1 || "") + "\n\n" +
                                                (t.titulo_texto2 || "") + "\n\n" +
                                                (t.titulo_texto3 || "") + "\n\n" +
                                                (t.titulo_texto4 || "")}
                                            </Text>

                                            {/* Textos */}
                                            <Text style={[styles.cellMulti, { width: 500 }]}>
                                                {t.texto1 + "\n\n" + t.texto2 + "\n\n" + t.texto3 + "\n\n" + t.texto4}
                                            </Text>

                                            {/* Ações */}
                                            <View
                                                style={[
                                                    styles.cell,
                                                    {
                                                        width: 120,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        gap: 10,
                                                    },
                                                ]}
                                            >
                                                <TouchableOpacity onPress={() => openEditTema(t)}>
                                                    <MaterialIcons name="edit" size={22} color="#0b4e91" />
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => handleDeleteTema(t.id)}>
                                                    <MaterialIcons name="delete" size={22} color="#b91c1c" />
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    ))}
                                </ScrollView>

                            </View>
                        </ScrollView>
                    </View>
                );

            default:
                return <Text style={styles.placeholder}>Selecione uma seção</Text>;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <Animatable.View delay={300} animation="fadeInDown" style={styles.header}>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#0b4e91ff" }}>
                    <TopNavbar />
                </SafeAreaView>
            </Animatable.View>

            <View style={styles.container}>
                {/* Sidebar animada */}
                <Animated.View
                    style={[styles.sidebar, { transform: [{ translateX: slideX }] }]}
                >
                    <Text style={styles.sidebarTitle}>Painel de Controle</Text>
                    {["usuarios", "materiais", "notificacoes", "desafios", "questoes", "temas"].map(
                        (item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                            styles.sidebarButton,
                            activeSection === item && styles.sidebarButtonActive,
                            ]}
                            onPress={() => setActiveSection(item)}
                        >
                            <Text
                                style={[
                                    styles.sidebarText,
                                    activeSection === item && styles.sidebarTextActive,
                                ]}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                        </TouchableOpacity>
                        )
                    )}
                </Animated.View>

                {/* Botão de alternância do slider */}
                <TouchableOpacity style={styles.toggleButton} onPress={toggleSlider}>
                    <Text style={styles.toggleText}>
                        {isSliderOpen ? "<" : ">"}
                    </Text>
                </TouchableOpacity>

                {/* Conteúdo principal */}
                <ScrollView style={styles.content}>
                    {renderSection()}
                    <View style={styles.crudButtonRow}>
                        {/* Botão Adicionar */}
                        <TouchableOpacity style={styles.crudButton} onPress={abrirAdicionar}>
                            <MaterialIcons name="add" size={26} color="#fff" />
                        </TouchableOpacity>

                        {/* Botão Editar */}
                        <TouchableOpacity style={styles.crudButton} onPress={abrirEditar}>
                            <MaterialIcons name="edit" size={24} color="#fff" />
                        </TouchableOpacity>

                        {/* Botão Excluir */}
                        <TouchableOpacity style={styles.crudButton} onPress={abrirExcluir}>
                            <MaterialIcons name="delete" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Modal Adicionar Usuario */}
            <Modal visible={addModalVisible} transparent animationType="fade" onRequestClose={() => setAddModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cadastrar Usuário</Text>
                            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Nome</Text>
                        <TextInput style={styles.input} placeholder="Nome completo" value={novoNome} onChangeText={setNovoNome} />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} placeholder="Email" value={novoEmail} onChangeText={setNovoEmail} />

                        <Text style={styles.label}>Senha</Text>
                        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={novaSenha} onChangeText={setNovaSenha} />

                        {/* Seleção de tipo */}
                        <Text style={styles.label}>Tipo de Usuário</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                            {["aluno", "professor", "admin"].map((tipo) => (
                            <TouchableOpacity
                                key={tipo}
                                style={[
                                styles.tipoButton,
                                tipoUsuario === tipo && { backgroundColor: "#0b4e91" },
                                ]}
                                onPress={() => setTipoUsuario(tipo)}
                            >
                                <Text style={{ color: tipoUsuario === tipo ? "#fff" : "#000", fontWeight: "600" }}>
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>

                        {/* Campo de matéria só se for professor */}
                        {tipoUsuario === "professor" && (
                            <>
                                <Text style={styles.label}>Matéria que leciona</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex: Matemática"
                                    value={novaMateria}
                                    onChangeText={setNovaMateria}
                                />
                            </>
                        )}

                        <TouchableOpacity style={styles.sendButton} onPress={handleAddUsuario}>
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar Usuario */}
            <Modal
                visible={editModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar Usuário</Text>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                        <MaterialIcons name="close" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput style={styles.input} value={editNome} onChangeText={setEditNome} />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={editEmail} onChangeText={setEditEmail} />

                    {usuarioSelecionado?.is_professor && (
                        <>
                            <Text style={styles.label}>Matéria</Text>
                            <TextInput style={styles.input} value={editMateria} onChangeText={setEditMateria} />
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={async () => {
                        try {
                            const dados = { nome: editNome, email: editEmail };
                            await UsuarioService.editarUsuario({
                                id: usuarioSelecionado.id,
                                nome: editNome,
                                email: editEmail
                            });

                            if (usuarioSelecionado?.is_professor) {
                                await ProfessorService.editarProfessor(usuarioSelecionado.id, { materia: editMateria });
                            }

                            alert("Usuário atualizado com sucesso!");
                            setEditModalVisible(false);
                        } catch (err) {
                            console.error("Erro ao editar usuário:", err);
                            alert("Erro ao editar usuário");
                        }
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar Alterações</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Excluir Usuario */}
            <Modal visible={deleteModalVisible} transparent animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { maxHeight: "80%" }]}>
                    <Text style={[styles.modalTitle, { textAlign: "center" }]}>Selecionar Usuários para Excluir</Text>
                    <ScrollView style={{ marginTop: 10, maxHeight: 300 }}>
                        {usuarios.map((u) => (
                        <View key={u.id} style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                            <Checkbox
                            value={selectedUsers.includes(u.id)}
                            onValueChange={(val) => {
                                setSelectedUsers(prev => 
                                    val ? [...prev, u.id] : prev.filter(id => id !== u.id)
                                );
                            }}
                            color={selectedUsers.includes(u.id) ? "#0b4e91" : undefined}
                            />
                            <Text style={{ marginLeft: 8 }}>{u.nome} ({u.is_admin ? "Admin" : u.is_professor ? "Professor" : "Aluno"})</Text>
                        </View>
                        ))}
                    </ScrollView>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={[styles.sendButton, { backgroundColor: '#9e9e9e', flex: 1, marginRight: 6 }]}>
                        <Text style={{ color: '#fff' }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleMultiDelete} style={[styles.sendButton, { backgroundColor: '#c20707', flex: 1, marginLeft: 6 }]}>
                        <Text style={{ color: '#fff' }}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Enviar Material */}
            <Modal
                animationType="fade"
                transparent
                visible={addMaterialModalVisible}
                onRequestClose={() => setAddMaterialModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { zIndex: 2000 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Enviar Material</Text>
                            <TouchableOpacity onPress={() => setAddMaterialModalVisible(false)}>
                            <MaterialIcons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Matéria</Text>
                        <DropDownPicker
                            open={openMateria}
                            value={materiaSelecionada}
                            items={materiasDisponiveis}
                            setOpen={setOpenMateria}
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

                        <TouchableOpacity style={styles.fileButton} onPress={selecionarArquivoPDF}>
                            <Text style={{ color: "#fff" }}>
                                {arquivoPdf?.name || "Selecionar arquivo PDF"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sendButton} onPress={enviarMaterial}>
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar Material */}
            <Modal
                visible={editMaterialModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeEditMaterialModal}
            >
                <View style={styles.modalOverlay}>
                    {materialSelecionado ? (
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Editar Material</Text>
                                <TouchableOpacity onPress={closeEditMaterialModal}>
                                    <MaterialIcons name="close" size={22} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={{ maxHeight: 400, padding: 10 }}>
                                <Text style={styles.label}>Matéria</Text>
                                <DropDownPicker
                                    open={openMateria}
                                    value={materiaSelecionada}
                                    items={materiasDisponiveis}
                                    setOpen={setOpenMateria}
                                    setValue={setMateriaSelecionada}
                                    setItems={setMateriasDisponiveis}
                                    style={styles.input}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                />

                                <Text style={styles.label}>Tema</Text>
                                <TextInput style={styles.input} value={tema} onChangeText={setTema} />

                                <Text style={styles.label}>Subtema</Text>
                                <TextInput style={styles.input} value={subtema} onChangeText={setSubtema} />

                                <Text style={styles.label}>Título</Text>
                                <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

                                <TouchableOpacity
                                    style={[styles.sendButton, { marginTop: 10, backgroundColor: "#0b4e91" }]}
                                    onPress={handleEditMaterial}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar Alterações</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    ) : (
                        <ActivityIndicator size="large" color="#007AFF" />
                    )}
                </View>
            </Modal>

            {/* Modal Excluir Material */}
            <Modal visible={deleteMaterialModalVisible} transparent animationType="fade" onRequestClose={() => setDeleteMaterialModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Excluir Material</Text>
                        <Text style={styles.deleteWarning}>Tem certeza que deseja excluir este material?</Text>

                        <View style={styles.deleteButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteMaterialModalVisible(false)}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMaterial(materialSelecionado?.id)}>
                                <Text style={{ color: "#fff" }}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Adição Desafio */}
            <Modal animationType="fade" transparent visible={modalDesafioVisible} onRequestClose={() => setModalDesafioVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Enviar desafio</Text>
                        <TouchableOpacity onPress={() => setModalDesafioVisible(false)}>
                        <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Título</Text>
                    <TextInput style={styles.input} value={tituloDesafio} onChangeText={setTituloDesafio} placeholder="Digite o título" />

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput style={styles.input} value={descricaoDesafio} onChangeText={setDescricaoDesafio} placeholder="Digite a descrição" multiline />

                    <Text style={styles.label}>Matéria</Text>
                    <TextInput style={styles.input} value={materiaDesafio} onChangeText={setMateriaDesafio} placeholder="Digite a matéria" />

                    <Text style={styles.label}>Quantidade de Atividades</Text>
                    <TextInput style={styles.input} value={quantidadeDesafio} onChangeText={setQuantidadeDesafio} placeholder="Quantidade" keyboardType="numeric" />

                    <Text style={styles.label}>XP</Text>
                    <TextInput style={styles.input} value={xpDesafio} onChangeText={setXpDesafio} placeholder="Digite o XP" keyboardType="numeric" />

                    {Platform.OS === "web" ? (
                        <button
                            style={styles.fileButton}
                            onClick={selecionarImagemDesafio}
                        >
                            {imagemDesafio ? "Imagem selecionada" : "Adicionar imagem"}
                        </button>
                        ) : (
                        <TouchableOpacity style={styles.fileButton} onPress={selecionarImagemDesafio}>
                            <Text style={{ color: "#fff" }}>
                            {imagemDesafio ? "Imagem selecionada" : "Adicionar imagem"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.sendButton} onPress={enviarDesafio}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar Desafio */}
            <Modal animationType="fade" transparent visible={modalEditarDesafioVisible} onRequestClose={() => setModalEditarDesafioVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar desafio</Text>
                        <TouchableOpacity onPress={() => setModalEditarDesafioVisible(false)}>
                        <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Título</Text>
                    <TextInput style={styles.input} value={tituloDesafio} onChangeText={setTituloDesafio} />

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput style={styles.input} value={descricaoDesafio} onChangeText={setDescricaoDesafio} multiline />

                    <Text style={styles.label}>Matéria</Text>
                    <TextInput style={styles.input} value={materiaDesafio} onChangeText={setMateriaDesafio} placeholder="Digite a matéria" />

                    <Text style={styles.label}>Quantidade de Atividades</Text>
                    <TextInput style={styles.input} value={quantidadeDesafio} onChangeText={setQuantidadeDesafio} placeholder="Quantidade" keyboardType="numeric" />

                    <Text style={styles.label}>XP</Text>
                    <TextInput style={styles.input} value={xpDesafio} onChangeText={setXpDesafio} keyboardType="numeric" />

                    <TouchableOpacity style={styles.fileButton} onPress={selecionarImagemDesafio}>
                        <Text style={{ color: "#fff" }}>
                            {imagemDesafio ? "Nova imagem selecionada" : "Alterar imagem"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sendButton} onPress={editarDesafio}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Exclusão Desafio ===== */}
            <Modal animationType="fade" transparent visible={modalExcluirDesafioVisible} onRequestClose={() => setModalExcluirDesafioVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Excluir desafio</Text>
                    <Text style={styles.deleteWarning}>Tem certeza que deseja excluir este desafio? Esta ação não poderá ser desfeita.</Text>

                    <View style={styles.deleteButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalExcluirDesafioVisible(false)}>
                            <Text style={{ color: "#333" }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteDesafio(seuIdDoDesafio)}>
                            <Text style={{ color: "#fff" }}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Adicionar Questão */}
            <Modal
                visible={modalAddQuestaoVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalAddQuestaoVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Cadastrar Questão</Text>
                                <TouchableOpacity onPress={() => setModalAddQuestaoVisible(false)}>
                                    <MaterialIcons name="close" size={22} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Título</Text>
                            <TextInput style={styles.input} value={tituloQuestao} onChangeText={setTituloQuestao} />

                            <Text style={styles.label}>Enunciado</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                multiline
                                value={enunciado}
                                onChangeText={setEnunciado}
                            />

                            <Text style={styles.label}>Ano</Text>
                            <TextInput style={styles.input} value={anoQuestao} onChangeText={setAnoQuestao} />

                            <Text style={styles.label}>Prova</Text>
                            <TextInput style={styles.input} value={prova} onChangeText={setProva} />

                            <Text style={styles.label}>Matéria</Text>
                            <TextInput style={styles.input} value={materiaQuestao} onChangeText={setMateriaQuestao} />
                            
                            <Text style={styles.label}>Alternativas</Text>

                            {alternativas.map((alt, idx) => (
                                <View 
                                    key={idx} 
                                    style={{
                                        marginBottom: 12,
                                        padding: 10,
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 8,
                                        backgroundColor: "#f9f9f9"
                                    }}
                                >
                                    <Text style={{ fontWeight: "700", fontSize: 16 }}>
                                        Alternativa {alt.letra}
                                    </Text>

                                    <Text style={{ marginTop: 6, fontWeight: "600" }}>Letra:</Text>
                                    <TextInput
                                        style={[styles.input, { width: 60 }]}
                                        value={alt.letra}
                                        maxLength={1}
                                        onChangeText={(t) => {
                                            const copy = [...alternativas];
                                            copy[idx].letra = t.toUpperCase();
                                            setAlternativas(copy);
                                        }}
                                    />

                                    <Text style={{ marginTop: 6, fontWeight: "600" }}>Texto:</Text>
                                    <TextInput
                                        style={[styles.input, { height: 80 }]}
                                        multiline
                                        placeholder={`Digite a alternativa ${alt.letra}`}
                                        value={alt.texto}
                                        onChangeText={(t) => {
                                            const copy = [...alternativas];
                                            copy[idx].texto = t;
                                            setAlternativas(copy);
                                        }}
                                    />

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: alt.correta ? "#0b4e91" : "#bdbdbd",
                                            padding: 8,
                                            borderRadius: 6,
                                            marginTop: 8,
                                            width: 150,
                                            alignSelf: "center"
                                        }}
                                        onPress={() => {
                                            const updated = alternativas.map(a => ({
                                                ...a,
                                                correta: false
                                            }));
                                            updated[idx].correta = true;
                                            setAlternativas(updated);
                                        }}
                                    >
                                        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
                                            {alt.correta ? "✓ Correta" : "Marcar como correta"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}


                            <TouchableOpacity style={styles.sendButton} onPress={handleAddQuestao}>
                                <Text style={{ color: "#fff", fontWeight: "700" }}>Enviar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar Questão */}
            <Modal
                visible={modalEditQuestaoVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalEditQuestaoVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Editar Questão</Text>

                                <TouchableOpacity onPress={() => setModalEditQuestaoVisible(false)}>
                                    <MaterialIcons name="close" size={22} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Título</Text>
                            <TextInput style={styles.input} value={editTituloQuestao} onChangeText={setEditTituloQuestao} />

                            <Text style={styles.label}>Enunciado</Text>
                            <TextInput
                                style={[styles.input, { height: 120 }]}
                                multiline
                                value={editEnunciado}
                                onChangeText={setEditEnunciado}
                            />

                            <Text style={styles.label}>Ano</Text>
                            <TextInput style={styles.input} value={editAnoQuestao} onChangeText={setEditAnoQuestao} />

                            <Text style={styles.label}>Prova</Text>
                            <TextInput style={styles.input} value={editProva} onChangeText={setEditProva} />

                            <Text style={styles.label}>Matéria</Text>
                            <TextInput style={styles.input} value={editQuestaoMateria} onChangeText={setEditQuestaoMateria} />
                            
                            <Text style={styles.label}>Alternativas</Text>
                            {editAlternativas.map((alt, idx) => (
                                <View 
                                    key={idx}
                                    style={{
                                        marginBottom: 12,
                                        padding: 10,
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        borderRadius: 8,
                                        backgroundColor: "#f9f9f9"
                                    }}
                                >
                                    <Text style={{ fontWeight: "700", fontSize: 16 }}>
                                        Alternativa {alt.letra}
                                    </Text>

                                    <Text style={{ marginTop: 6, fontWeight: "600" }}>Letra:</Text>
                                    <TextInput
                                        style={[styles.input, { width: 60 }]}
                                        value={alt.letra}
                                        maxLength={1}
                                        onChangeText={(t) => {
                                            const copy = [...editAlternativas];
                                            copy[idx].letra = t.toUpperCase();
                                            setEditAlternativas(copy);
                                        }}
                                    />

                                    <Text style={{ marginTop: 6, fontWeight: "600" }}>Texto:</Text>
                                    <TextInput
                                        style={[styles.input, { height: 80 }]}
                                        multiline
                                        value={alt.texto}
                                        onChangeText={(t) => {
                                            const copy = [...editAlternativas];
                                            copy[idx].texto = t;
                                            setEditAlternativas(copy);
                                        }}
                                    />

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: alt.correta ? "#0b4e91" : "#bdbdbd",
                                            padding: 8,
                                            borderRadius: 6,
                                            marginTop: 8,
                                            width: 150,
                                            alignSelf: "center"
                                        }}
                                        onPress={() => {
                                            const updated = editAlternativas.map(a => ({
                                                ...a,
                                                correta: false
                                            }));
                                            updated[idx].correta = true;
                                            setEditAlternativas(updated);
                                        }}
                                    >
                                        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
                                            {alt.correta ? "✓ Correta" : "Marcar como correta"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.sendButton} onPress={handleEditQuestao}>
                                <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Exclusão Questão */}
            <Modal
                visible={modalDeleteQuestaoVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalDeleteQuestaoVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { maxHeight: "80%" }]}>
                        <Text style={[styles.modalTitle, { textAlign: "center" }]}>
                            Selecionar Questões para Excluir
                        </Text>

                        <ScrollView style={{ marginTop: 10, maxHeight: 300 }}>
                            {questoes.map((q) => (
                                <View key={q.id} style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                                    <Checkbox
                                        value={selectedQuestoes.includes(q.id)}
                                        onValueChange={(val) => {
                                            setSelectedQuestoes(prev =>
                                                val ? [...prev, q.id] : prev.filter(id => id !== q.id)
                                            );
                                        }}
                                        color={selectedQuestoes.includes(q.id) ? "#0b4e91" : undefined}
                                    />
                                    <Text style={{ marginLeft: 8 }}>
                                        ({q.id}) {q.titulo}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                            <TouchableOpacity
                                onPress={() => setModalDeleteQuestaoVisible(false)}
                                style={[styles.sendButton, { backgroundColor: '#9e9e9e', flex: 1, marginRight: 6 }]}
                            >
                                <Text style={{ color: '#fff' }}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleMultiDeleteQuestoes}
                                style={[styles.sendButton, { backgroundColor: '#c20707', flex: 1, marginLeft: 6 }]}
                            >
                                <Text style={{ color: '#fff' }}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Adição Notificação */}
            <Modal visible={modalAddNotifVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Criar Notificação</Text>
                            <TouchableOpacity onPress={() => setModalAddNotifVisible(false)}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Título</Text>
                        <TextInput style={styles.input} value={tituloNotif} onChangeText={setTituloNotif} />

                        <Text style={styles.label}>Mensagem</Text>
                        <TextInput style={[styles.input, { height: 120 }]} multiline value={mensagemNotif} onChangeText={setMensagemNotif} />

                        <Text style={styles.label}>Tipo</Text>
                        <TextInput style={styles.input} value={tipoNotif} onChangeText={setTipoNotif} />

                        <TouchableOpacity style={styles.sendButton} onPress={handleAddNotificacao}>
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar Notificação */}
            <Modal visible={modalEditNotifVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Notificação</Text>
                            <TouchableOpacity onPress={() => setModalEditNotifVisible(false)}>
                                <MaterialIcons name="close" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Título</Text>
                        <TextInput style={styles.input} value={tituloNotif} onChangeText={setTituloNotif} />

                        <Text style={styles.label}>Mensagem</Text>
                        <TextInput 
                            style={[styles.input, { height: 120 }]}
                            multiline
                            value={mensagemNotif}
                            onChangeText={setMensagemNotif}
                        />

                        <Text style={styles.label}>Tipo</Text>
                        <TextInput style={styles.input} value={tipoNotif} onChangeText={setTipoNotif} />

                        <TouchableOpacity style={styles.sendButton} onPress={handleEditNotificacao}>
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Exclusão Notificação */}
            <Modal visible={modalDeleteNotifVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>Excluir notificações?</Text>
                        <Text style={{ textAlign: "center", marginBottom: 20 }}>
                            {selectedNotificacoes.length} notificações selecionadas.
                        </Text>

                        <TouchableOpacity style={styles.deleteButton} onPress={handleMultiDeleteNotificacoes}>
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Excluir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalDeleteNotifVisible(false)}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* Modal Adição Tema */}
            <Modal visible={modalAddTemaVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView
                            style={{ width: "100%", maxHeight: "75%" }}
                            contentContainerStyle={{ paddingBottom: 28 }}
                            showsVerticalScrollIndicator={true}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled={true}
                        >
                            <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Adicionar Tema</Text>
                            <TouchableOpacity onPress={() => setModalAddTemaVisible(false)}>
                                <MaterialIcons name="close" size={22} />
                            </TouchableOpacity>
                            </View>

                            {/* Campos */}
                            <Text style={styles.label}>Tema</Text>
                            <TextInput style={styles.input} value={tema_redacao} onChangeText={setTemaRedacao} />

                            <Text style={styles.label}>Ano</Text>
                            <TextInput style={styles.input} value={anoTema} onChangeText={setAnoTema} keyboardType="numeric" />

                            <Text style={styles.label}>Título 1</Text>
                            <TextInput style={styles.input} value={titulo1} onChangeText={setTitulo1} />

                            <Text style={styles.label}>Título 2</Text>
                            <TextInput style={styles.input} value={titulo2} onChangeText={setTitulo2} />

                            <Text style={styles.label}>Título 3</Text>
                            <TextInput style={styles.input} value={titulo3} onChangeText={setTitulo3} />

                            <Text style={styles.label}>Título 4</Text>
                            <TextInput style={styles.input} value={titulo4} onChangeText={setTitulo4} />

                            <Text style={styles.label}>Texto 1</Text>
                            <TextInput style={[styles.input, { minHeight: 80 }]} multiline value={texto1} onChangeText={setTexto1} />

                            <Text style={styles.label}>Texto 2</Text>
                            <TextInput style={[styles.input, { minHeight: 80 }]} multiline value={texto2} onChangeText={setTexto2} />

                            <Text style={styles.label}>Texto 3</Text>
                            <TextInput style={[styles.input, { minHeight: 80 }]} multiline value={texto3} onChangeText={setTexto3} />

                            <Text style={styles.label}>Texto 4</Text>
                            <TextInput style={[styles.input, { minHeight: 80 }]} multiline value={texto4} onChangeText={setTexto4} />

                            {/* Imagens */}
                            <Text style={styles.label}>Imagem 1</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(1)}>
                                <Text style={{ color: "#fff" }}>{imagem1 ? "Imagem 1 selecionada" : "Selecionar imagem 1"}</Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Imagem 2</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(2)}>
                                <Text style={{ color: "#fff" }}>{imagem2 ? "Imagem 2 selecionada" : "Selecionar imagem 2"}</Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Imagem 3</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(3)}>
                                <Text style={{ color: "#fff" }}>{imagem3 ? "Imagem 3 selecionada" : "Selecionar imagem 3"}</Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Imagem 4</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(4)}>
                                <Text style={{ color: "#fff" }}>{imagem4 ? "Imagem 4 selecionada" : "Selecionar imagem 4"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sendButton} onPress={enviarTema}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Edição Tema */}
            <Modal visible={modalEditTemaVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView
                            style={{ width: "100%", maxHeight: "75%" }}
                            contentContainerStyle={{ paddingBottom: 28 }}
                            showsVerticalScrollIndicator={true}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled={true}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Editar Tema</Text>
                                <TouchableOpacity onPress={() => setModalEditTemaVisible(false)}>
                                    <MaterialIcons name="close" size={22} />
                                </TouchableOpacity>
                            </View>

                            {/* Tema */}
                            <Text style={styles.label}>Tema</Text>
                            <TextInput style={styles.input} value={tema_redacao} onChangeText={setTemaRedacao} />

                            <Text style={styles.label}>Ano</Text>
                            <TextInput style={styles.input} value={anoTema} onChangeText={setAnoTema} keyboardType="numeric" />

                            {/* Títulos */}
                            <Text style={styles.label}>Título 1</Text>
                            <TextInput style={styles.input} value={titulo1} onChangeText={setTitulo1} />

                            <Text style={styles.label}>Título 2</Text>
                            <TextInput style={styles.input} value={titulo2} onChangeText={setTitulo2} />

                            <Text style={styles.label}>Título 3</Text>
                            <TextInput style={styles.input} value={titulo3} onChangeText={setTitulo3} />

                            <Text style={styles.label}>Título 4</Text>
                            <TextInput style={styles.input} value={titulo4} onChangeText={setTitulo4} />

                            {/* Textos */}
                            <Text style={styles.label}>Texto 1</Text>
                            <TextInput style={styles.input} multiline value={texto1} onChangeText={setTexto1} />

                            <Text style={styles.label}>Texto 2</Text>
                            <TextInput style={styles.input} multiline value={texto2} onChangeText={setTexto2} />

                            <Text style={styles.label}>Texto 3</Text>
                            <TextInput style={styles.input} multiline value={texto3} onChangeText={setTexto3} />

                            <Text style={styles.label}>Texto 4</Text>
                            <TextInput style={styles.input} multiline value={texto4} onChangeText={setTexto4} />

                            {/* 4 imagens */}
                            <Text style={styles.label}>Imagem 1</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(1)}>
                                <Text style={{ color: "#fff" }}>
                                    {imagem1 ? "Nova imagem 1 selecionada" : "Alterar imagem 1"}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Imagem 2</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(2)}>
                                <Text style={{ color: "#fff" }}>
                                    {imagem2 ? "Nova imagem 2 selecionada" : "Alterar imagem 2"}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Imagem 3</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(3)}>
                                <Text style={{ color: "#fff" }}>
                                    {imagem3 ? "Nova imagem 3 selecionada" : "Alterar imagem 3"}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Imagem 4</Text>
                            <TouchableOpacity style={styles.fileButton} onPress={() => selecionarImagem(4)}>
                                <Text style={{ color: "#fff" }}>
                                    {imagem4 ? "Nova imagem 4 selecionada" : "Alterar imagem 4"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sendButton} onPress={editarTema}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar alterações</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal Excluir Tema */}
            <Modal
                animationType="fade"
                transparent
                visible={modalExcluirTemaVisible}
                onRequestClose={() => setModalExcluirTemaVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>Excluir Tema</Text>
                        <Text style={styles.deleteWarning}>
                            Tem certeza que deseja excluir este tema? Esta ação não poderá ser desfeita.
                        </Text>

                        <View style={styles.deleteButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalExcluirTemaVisible(false)}
                            >
                                <Text style={{ color: "#333" }}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteTema(idTema)}
                            >
                                <Text style={{ color: "#fff" }}>Excluir</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

            <MenuBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0b4e91" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", elevation: 4, marginBottom: 10 },
    container: { flex: 1, flexDirection: "row", backgroundColor: "#f4f6fa" },

    sidebar: { position: "absolute", left: 0, top: 0, bottom: 70, width: width * 0.65, backgroundColor: "#0b4e91", paddingTop: 20, zIndex: 5, borderTopRightRadius: 20, borderBottomRightRadius: 20, },
    sidebarTitle: { color: "#fff", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10, },
    sidebarButton: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#ffffff33", },
    sidebarButtonActive: { backgroundColor: "#fff", },
    sidebarText: { color: "#fff",  textAlign: "center", fontWeight: "700", },
    sidebarTextActive: { color: "#0b4e91", },

    toggleButton: { position: "absolute", top: 80,nleft: 5, zIndex: 10, backgroundColor: "#0b4e91", borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, },
    toggleText: { color: "#fff", fontSize: 18, fontWeight: "bold", },
    content: { flex: 1, marginTop: 10, marginLeft: 60, padding: 10, },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#0b4e91" },

    table: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, overflow: "hidden" },
    tableHeader: { flexDirection: "row", backgroundColor: "#E9EFFB" },
    tableRow: { flexDirection: "row",  alignItems: "flex-start", borderBottomWidth: 1,  borderColor: "#eee", },

    cell: { padding: 8, fontSize: 14, color: "#333" },
    cellHeader: { padding: 8, fontSize: 14, fontWeight: "700", color: "#0b4e91", },

    cellMulti: { padding: 8, fontSize: 14, color: "#333", flexWrap: "wrap", flexShrink: 1, },

    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    placeholder: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 40, },

    crudButtonRow: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 10, marginBottom: 10, marginLeft: 6,  gap: 10, },
    crudButton: { width: 80, height: 38, backgroundColor: "#0b4e91", borderRadius: 8, justifyContent: "center", alignItems: "center", elevation: 3, },
    sendButton: { backgroundColor: "#0b4e91", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 16, },

    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.3)", },
    modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 5, maxHeight: "85%", overflow: Platform.OS === "android" ? "hidden" : "visible", },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0b4e91", },

    label: { fontSize: 14, color: "#475569", marginTop: 12, marginBottom: 4, },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, fontSize: 14, backgroundColor: "#f9f9f9", },
    fileButton: { backgroundColor: "#0b4e91", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 12, },
    tipoButton: { flex: 1, marginHorizontal: 5, paddingVertical: 8, borderRadius: 8, backgroundColor: "#e5e7eb", alignItems: "center", },
});
