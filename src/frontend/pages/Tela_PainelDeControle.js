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

    const [tituloDesafio, setTituloDesafio] = useState("");
    const [descricaoDesafio, setDescricaoDesafio] = useState("");
    const [xpDesafio, setXpDesafio] = useState("");
    const [imagemDesafio, setImagemDesafio] = useState(null);

    // ----- Questões -----
    const [modalQuestaoVisible, setModalQuestaoVisible] = useState(false);
    const [modalExcluirQuestaoVisible, setModalExcluirQuestaoVisible] = useState(false);
    const [tituloQuestao, setTituloQuestao] = useState("");
    const [textoQuestao, setTextoQuestao] = useState("");
    const [anoQuestao, setAnoQuestao] = useState("");
    const [categoriaQuestao, setCategoriaQuestao] = useState("");
    const [subcategoriaQuestao, setSubcategoriaQuestao] = useState("");
    const [alternativas, setAlternativas] = useState({
        A: { texto: "", resposta: "" },
        B: { texto: "", resposta: "" },
        C: { texto: "", resposta: "" },
        D: { texto: "", resposta: "" },
        E: { texto: "", resposta: "" },
    });
    const [questaoSelecionada, setQuestaoSelecionada] = useState(null);

    // --- Notificações ---
    const [modalNotificacaoVisible, setModalNotificacaoVisible] = useState(false);
    const [tituloNotif, setTituloNotif] = useState("");
    const [mensagemNotif, setMensagemNotif] = useState("");
    const [tipoNotif, setTipoNotif] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {
                const [usuariosResp, professoresResp, materiasResp, desafiosResp] = await Promise.all([
                    UsuarioService.listarUsuarios(),
                    ProfessorService.listarProfessores(),
                    MaterialService.listar(),
                    DesafioService.listarDesafios(),
                ]);

                // Relacionar os professores às suas matérias
                const usuariosComMateria = (usuariosResp.data || []).map((u) => {
                    if (u.is_professor) {
                        const professor = professoresResp.data.find(p => p.usuario_id === u.id);
                        return { ...u, materia: professor ? professor.materia : "—" };
                    }
                    return { ...u, materia: "—" };
                });

                console.log("Professores carregados:", professoresResp.data);
                console.log("Usuários carregados:", usuariosResp.data);
                console.log("Combinados:", usuariosComMateria);

                setUsuarios(usuariosComMateria || []);
                setMateriais(materiasResp.data || []);
                setDesafios(desafiosResp.data || []);
            } catch (err) {
                console.error("Erro ao carregar dados do painel:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

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
            const dados = {
                nome: editNome,
                email: editEmail,
            };
            await UsuarioService.editarUsuario(usuarioSelecionado.id, dados);
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
            await ProfessorService.editarProfessor(usuarioSelecionado.id, dados);
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

            await AdminService.editarMaterial(materialSelecionado.id, dados);

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
            await AdminService.deletarMaterial(id);
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
            await DesafioService.criar({
                titulo: tituloDesafio,
                descricao: descricaoDesafio,
                xp: xpDesafio,
                imagem: imagemDesafio,
            });
            alert("Desafio enviado com sucesso!");
            setModalDesafioVisible(false);
        } catch (err) {
            console.error("Erro ao enviar desafio:", err);
            alert("Erro ao enviar desafio");
        }
    }

    function openEditDesafio(d) {
        setTituloDesafio(d.titulo);
        setDescricaoDesafio(d.descricao);
        setXpDesafio(String(d.xp));
        setImagemDesafio(null);
        setModalEditarDesafioVisible(true);
    }

    async function editarDesafio() {
        try {
            await DesafioService.editar({
                titulo: tituloDesafio,
                descricao: descricaoDesafio,
                xp: xpDesafio,
                imagem: imagemDesafio,
            });
            alert("Desafio atualizado!");
            setModalEditarDesafioVisible(false);
        } catch (err) {
            console.error("Erro ao editar desafio:", err);
        }
    }

    async function handleDeleteDesafio(id) {
        try {
            await DesafioService.excluir(id);
            alert("Desafio excluído!");
        } catch (err) {
            console.error("Erro ao excluir desafio:", err);
        }
    } 

    // --- Questão --- 
    async function enviarQuestao() {
        try {
            await DesafioService.criarQuestao({
                titulo: tituloQuestao,
                texto: textoQuestao,
                ano: anoQuestao,
                categoria: categoriaQuestao,
                subcategoria: subcategoriaQuestao,
                alternativas,
            });
            alert("Questão enviada!");
            setModalQuestaoVisible(false);
        } catch (err) {
            console.error("Erro ao enviar questão:", err);
        }
    }

    async function excluirQuestao() {
        if (!questaoSelecionada) return; // garante que há uma questão selecionada

        try {
            await DesafioService.excluirQuestao(questaoSelecionada.id); // chama o serviço para excluir
            alert("Questão excluída com sucesso!");
            setModalExcluirQuestaoVisible(false);
            // Atualiza a lista de questões (se tiver um estado 'questoes')
            setQuestoes(prev => prev.filter(q => q.id !== questaoSelecionada.id));
            setQuestaoSelecionada(null); // limpa a questão selecionada
        } catch (err) {
            console.error("Erro ao excluir questão:", err);
            alert("Erro ao excluir questão");
        }
    }

    function openExcluirQuestaoModal(questao) {
        setQuestaoSelecionada(questao);
        setModalExcluirQuestaoVisible(true);
    }

    async function selecionarArquivo() {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (result.type === 'success') {
                setArquivoPdf(result);
            }
        } catch (err) {
            console.error("Erro ao selecionar arquivo:", err);
        }
    }

    async function selecionarImagemDesafio() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
            if (!result.canceled) {
                setImagemDesafio(result.assets[0]);
            }
        } catch (err) {
            console.error("Erro ao selecionar imagem:", err);
        }
    }

    // Notificação (apenas para testes)
    function enviarNotificacao() {
        alert(`Título: ${tituloNotif}\nMensagem: ${mensagemNotif}\nTipo: ${tipoNotif}`);
        setModalNotificacaoVisible(false);
        setTituloNotif("");
        setMensagemNotif("");
        setTipoNotif("");
    }

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
                setModalQuestaoVisible(true);
                break;
            case "notificacoes":
                setModalNotificacaoVisible(true);
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
            // Questões e notificações podem não ter edição direta, ajuste se houver
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
                setModalExcluirQuestaoVisible(true);
                break;
            // Notificações podem não ter exclusão
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
            <TopNavbar />

            <View style={styles.container}>
                {/* Sidebar animada */}
                <Animated.View
                    style={[styles.sidebar, { transform: [{ translateX: slideX }] }]}
                >
                    <Text style={styles.sidebarTitle}>Painel de Controle</Text>
                    {["usuarios", "materiais", "notificacoes", "desafios", "questoes"].map(
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
                            await UsuarioService.editarUsuario(usuarioSelecionado.id, dados);

                            if (usuarioSelecionado?.is_professor) {
                                await ProfessorService.editarProfessor(usuarioSelecionado.id, editMateria);
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

                    <Text style={styles.label}>XP</Text>
                    <TextInput style={styles.input} value={xpDesafio} onChangeText={setXpDesafio} placeholder="Digite o XP" keyboardType="numeric" />

                    {Platform.OS === 'web' ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setImagemDesafio(e.target.files[0]);
                        }
                        }}
                    />
                    ) : (
                        <TouchableOpacity style={styles.fileButton} onPress={selecionarImagemDesafio}>
                                <Text style={{ color: "#fff" }}>{imagemDesafio?.name || "Adicionar imagem"}</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.sendButton} onPress={enviarDesafio}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Exclusão Desafio */}
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

                    <Text style={styles.label}>XP</Text>
                    <TextInput style={styles.input} value={xpDesafio} onChangeText={setXpDesafio} keyboardType="numeric" />

                    <TouchableOpacity style={styles.fileButton} onPress={selecionarImagemDesafio}>
                        <Text style={{ color: "#fff" }}>{imagemDesafio?.name || "Alterar imagem"}</Text>
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

            {/* Modal Envio Questão */}
            <Modal animationType="fade" transparent visible={modalQuestaoVisible} onRequestClose={() => setModalQuestaoVisible(false)}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={styles.modalOverlay}>
                            <View style={[styles.modalContainer, { zIndex: 2000 }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Adicionar questão</Text>
                                    <TouchableOpacity onPress={() => setModalQuestaoVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.label}>Título</Text>
                                <TextInput style={styles.input} value={tituloQuestao} onChangeText={setTituloQuestao} placeholder="Digite o título" />

                                <Text style={styles.label}>Texto</Text>
                                <TextInput style={styles.input} value={textoQuestao} onChangeText={setTextoQuestao} placeholder="Digite o enunciado" multiline />

                                <Text style={styles.label}>Ano</Text>
                                <TextInput style={styles.input} value={anoQuestao} onChangeText={setAnoQuestao} placeholder="Ex: 2024" keyboardType="numeric" />

                                <Text style={styles.label}>Categoria</Text>
                                <TextInput style={styles.input} value={categoriaQuestao} onChangeText={setCategoriaQuestao} placeholder="Digite a categoria" />

                                <Text style={styles.label}>Subcategoria</Text>
                                <TextInput style={styles.input} value={subcategoriaQuestao} onChangeText={setSubcategoriaQuestao} placeholder="Digite a subcategoria" />

                                {/* Alternativas */}
                                {["A", "B", "C", "D", "E"].map((alt, i) => (
                                    <View key={i}>
                                    <Text style={styles.label}>Alternativa {alt}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={alternativas[alt]?.texto || ""}
                                        onChangeText={(texto) => setAlternativas({ ...alternativas, [alt]: { ...alternativas[alt], texto } })}
                                        placeholder={`Digite o texto da alternativa ${alt}`}
                                    />

                                    <Text style={styles.label}>Resposta</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={alternativas[alt]?.resposta || ""}
                                        onChangeText={(resposta) => setAlternativas({ ...alternativas, [alt]: { ...alternativas[alt], resposta } })}
                                        placeholder={`Digite a resposta da alternativa ${alt}`}
                                    />
                                    </View>
                                ))}

                                <TouchableOpacity style={styles.sendButton} onPress={enviarQuestao}>
                                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modal Exclusão Questão */}
            <Modal animationType="fade" transparent visible={modalExcluirQuestaoVisible} onRequestClose={() => setModalExcluirQuestaoVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Excluir questão</Text>
                    <Text style={styles.deleteWarning}>Tem certeza que deseja excluir esta questão? Esta ação não poderá ser desfeita.</Text>

                    <View style={styles.deleteButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalExcluirQuestaoVisible(false)}>
                        <Text style={{ color: "#333" }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={excluirQuestao}>
                            <Text style={{ color: "#fff" }}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Adição Notificação */}
            <Modal animationType="fade" transparent visible={modalNotificacaoVisible} onRequestClose={() => setModalNotificacaoVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Enviar notificação</Text>
                        <TouchableOpacity onPress={() => setModalNotificacaoVisible(false)}>
                        <MaterialIcons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Título</Text>
                    <TextInput style={styles.input} value={tituloNotif} onChangeText={setTituloNotif} placeholder="Digite o título" />

                    <Text style={styles.label}>Mensagem</Text>
                    <TextInput style={styles.input} value={mensagemNotif} onChangeText={setMensagemNotif} placeholder="Digite a mensagem" multiline />

                    <Text style={styles.label}>Tipo</Text>
                    <TextInput style={styles.input} value={tipoNotif} onChangeText={setTipoNotif} placeholder="Digite o tipo (ex: aviso, alerta...)" />

                    <TouchableOpacity style={styles.sendButton} onPress={enviarNotificacao}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <MenuBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0b4e91" },
    container: { flex: 1, flexDirection: "row", backgroundColor: "#f4f6fa" },

    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 70,
        width: width * 0.65,
        backgroundColor: "#0b4e91",
        paddingTop: 20,
        zIndex: 5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    sidebarTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },
    sidebarButton: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff33",
    },
    sidebarButtonActive: {
        backgroundColor: "#fff",
    },
    sidebarText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
    },
    sidebarTextActive: {
        color: "#0b4e91",
    },
    toggleButton: {
        position: "absolute",
        top: 80,
        left: 5,
        zIndex: 10,
        backgroundColor: "#0b4e91",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    toggleText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        marginTop: 10,
        marginLeft: 60,
        padding: 10,
    },
    section: { marginBottom: 20 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#0b4e91",
    },
    table: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        overflow: "hidden",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#E9EFFB",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    cell: {
        padding: 8,
        fontSize: 14,
        color: "#333",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholder: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginTop: 40,
    },

    crudButtonRow: {
        flexDirection: "row",
        justifyContent: "flex-start", // alinha à esquerda
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 6, 
        gap: 10,
    },
    crudButton: {
        width: 80,
        height: 38,
        backgroundColor: "#0b4e91",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    sendButton: {
        backgroundColor: "#0b4e91",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 16,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0b4e91",
    },

    label: {
        fontSize: 14,
        color: "#475569",
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        fontSize: 14,
        backgroundColor: "#f9f9f9",
    },
    fileButton: {
        backgroundColor: "#0b4e91",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 12,
    },
    tipoButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
    },
});
