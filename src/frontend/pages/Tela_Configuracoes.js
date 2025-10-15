import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";


export default function Tela_Configuracoes() {
    const userEmail = 'usuario@exemplo.com';


    return (
        <SafeAreaView style={styles.safeArea}>
            <TopNavbar />


            <View style={styles.whiteContainer}>
                <Text style={styles.sectionTitle}>Perfil</Text>


                <View style={styles.fieldCard}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <Text style={styles.fieldValue}>{userEmail}</Text>
                </View>


                <View style={styles.fieldCard}>
                    <Text style={styles.fieldLabel}>Senha</Text>
                    <Text style={styles.fieldValue}>••••••••••</Text>
                </View>


                <TouchableOpacity style={styles.bigButton}>
                    <Text style={styles.bigButtonText}>Mudar de conta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bigButtonAlt}>
                    <Text style={[styles.bigButtonText, { color: '#0b4e91' }]}>Mudar senha</Text>
                </TouchableOpacity>

                <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Outros</Text>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={[styles.bigButtonText, { color: '#fff' }]}>LogOut</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.menuBarContainer}>
                <MenuBar />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0b4e91' },
    whiteContainer: { flex: 1, margin: 10, backgroundColor: '#ececec', borderRadius: 14, padding: 14 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0b4e91', marginBottom: 8 },
    fieldCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
    fieldLabel: { fontSize: 12, color: '#5b6b79' },
    fieldValue: { fontWeight: '700', marginTop: 6 },
    bigButton: { backgroundColor: '#0b4e91', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
    bigButtonAlt: { backgroundColor: '#fff', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6, borderWidth: 1, borderColor: '#d0d7de' },
    bigButtonText: { color: '#fff', fontWeight: '700' },
    logoutButton: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
    menuBarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70 },
});