import React from 'react';
import {
SafeAreaView,
View,
Text,
StyleSheet,
ScrollView,
Image,
TouchableOpacity,
Dimensions,
} from 'react-native';
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import ProgressBar from "../components/ProgressBar";


const { width: SCREEN_WIDTH } = Dimensions.get('window');


const sampleData = [
    { id: '1', title: 'Desafio 1', desc: 'Complete 30 minutos de revisão', progress: 0.6, image: null },
    { id: '2', title: 'Desafio 2', desc: 'Resolver 10 exercícios', progress: 1.0, image: null },
    { id: '3', title: 'Desafio 3', desc: 'Ler 3 páginas de teoria', progress: 0.35, image: null },
    { id: '4', title: 'Desafio 4', desc: 'Assistir 1 vídeo aula', progress: 0.15, image: null },
];


export default function Tela_Conquistas() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <TopNavbar />

            <View style={styles.whiteContainer}>
                <Text style={styles.headerTitle}>Desafios Semanais</Text>


                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {sampleData.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardRow}>
                            <View style={styles.imagePlaceholder}>
                            {/* Substitua por <Image source={...} /> se tiver imagem */}
                            <Text style={styles.x}>🗂️</Text>
                        </View>


                        <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>


                        <View style={{ marginTop: 8 }}>
                            <ProgressBar progress={item.progress} height={12} />
                            <Text style={styles.progressText}>{Math.round(item.progress * 100)}%</Text>
                            </View>
                            </View>
                            </View>
                        </View>
                    ))}
                    <View style={{ height: 120 }} />
                </ScrollView>
            </View>


            <View style={styles.menuBarContainer}>
                <MenuBar />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0b4e91' },
    whiteContainer: {
        flex: 1,
        backgroundColor: '#ececec',
        margin: 10,
        borderRadius: 15,
        padding: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        color: '#012233',
        alignSelf: 'center',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    cardRow: { flexDirection: 'row', alignItems: 'center' },
    imagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    x: { fontSize: 28 },
    cardContent: { flex: 1 },
    cardTitle: { fontWeight: '700', fontSize: 16, color: '#0b4e91' },
    cardDesc: { color: '#4b5863', marginTop: 4 },
    progressText: { marginTop: 6, fontSize: 12, color: '#65707a' },

    menuBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
    },
});