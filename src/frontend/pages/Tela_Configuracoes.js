import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import UsuarioService from '../services/UsuarioService';
import { useNavigation } from '@react-navigation/native';

export default function Tela_Configuracoes() {
    const [userEmail, setUserEmail] = useState('');
    const [userSenha, setUserSenha] = useState('••••••••••');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const carregarDadosUsuario = async () => {
            try {
                const email = await UsuarioService.getLoggedInUserEmail();
                if (email) {
                    setUserEmail(email);

                    const senha = await AsyncStorage.getItem('usuarioSenha');
                    if (senha) setUserSenha('••••••••••');

                    const resp = await UsuarioService.verificarTipo(email);
                    console.log("Resposta verificarTipo:", resp.data);

                    if (resp?.data?.is_admin === 1) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar dados do usuário!", err);
            }
        };
        
        carregarDadosUsuario();
    }, []);

    const handleMudarSenha = async () => {
        if (!userEmail) {
            Alert.alert('Erro', 'Email do usuário não encontrado!');
            return;
        }

        try {
            await UsuarioService.recuperarSenha(userEmail);
            Alert.alert(
                'Email enviado!',
                'Um link para redefinir sua senha foi enviado para o seu email.'
            );
        } catch (err) {
            console.error("Erro ao enviar link de redefinição:", err);
            Alert.alert('Erro', 'Não foi possível enviar o email de redefinição!');
        }
    };

    const handleLogout = async () => {
        try { 
            await AsyncStorage.clear();
            Alert.alert('Sessão encerrada', 'Você saiu da sua conta');
            navigation.replace("Login");
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
            Alert.alert("Erro", "Não foi possível sair da conta.");
        }
    }

    const irParaPainel = (section) => {
        navigation.navigate('PainelControle', { section });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopNavbar />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.whiteContainer}>
                    <Text style={styles.sectionTitle}>Perfil</Text>

                    <View style={styles.fieldCard}>
                        <Text style={styles.fieldLabel}>Email</Text>
                        <Text style={styles.fieldValue}>{userEmail || 'Carregando...'}</Text>
                    </View>

                    <View style={styles.fieldCard}>
                        <Text style={styles.fieldLabel}>Senha</Text>
                        <Text style={styles.fieldValue}>{userSenha}</Text>
                    </View>

                    <TouchableOpacity style={styles.bigButtonAlt} onPress={handleMudarSenha}>
                        <Text style={[styles.bigButtonText, { color: '#0b4e91' }]}>Mudar senha</Text>
                    </TouchableOpacity>

                    {isAdmin && (
                        <>
                            <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Administração</Text>

                            {[
                                { label: 'Usuários', section: 'usuarios' },
                                { label: 'Materiais Didáticos', section: 'materiais' },
                                { label: 'Notificações', section: 'notificacoes' },
                                { label: 'Desafios', section: 'desafios' },
                                { label: 'Questões', section: 'questoes' },
                            ].map((item) => (
                                <TouchableOpacity
                                    key={item.section}
                                    style={styles.adminButton}
                                    activeOpacity={0.8}
                                    onPress={() => irParaPainel(item.section)}
                                >
                                    <Text style={styles.adminButtonText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Outros</Text>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={[styles.bigButtonText, { color: '#fff' }]}>Sair da conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.menuBarContainer}>
                <MenuBar />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0b4e91',
    },
    scrollContainer: {
        flex: 1,
    },
    whiteContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: '#f6f7f9',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0b4e91',
        marginBottom: 10,
    },
    fieldCard: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#d6dbe1',
    },
    fieldLabel: {
        fontSize: 13,
        color: '#5b6b79',
    },
    fieldValue: {
        fontWeight: '700',
        marginTop: 4,
        color: '#2c3e50',
    },
    bigButtonAlt: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#0b4e91',
    },
    bigButtonText: {
        fontWeight: '700',
        fontSize: 15,
    },
    adminButton: {
        backgroundColor: '#0b4e91',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    adminButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    menuBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
    },
});
