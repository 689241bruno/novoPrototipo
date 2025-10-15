import React, { useState, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Dimensions,
    FlatList,
} from 'react-native';
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import ProgressBar from '../components/ProgressBar';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';


const { width: SCREEN_W } = Dimensions.get('window');


const weekNames = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];


// Exemplo simples de dados - você pode ligar ao backend depois
const defaultWeek = [
    { dayIndex: 1, name: 'Hoje', materia: 'Matemática', tema: 'Aritmética', start: '08:00', end: '09:00', tasks: [] },
    { dayIndex: 2, name: 'Segunda', materia: 'Português', tema: 'Gramática', start: '09:00', end: '10:00', tasks: [] },
    { dayIndex: 3, name: 'Terça', materia: 'História', tema: 'Revoluções', start: '10:00', end: '11:00', tasks: [] },
    { dayIndex: 4, name: 'Quarta', materia: 'Biologia', tema: 'Células', start: '11:00', end: '12:00', tasks: [] },
    { dayIndex: 5, name: 'Quinta', materia: 'Física', tema: 'Cinemática', start: '13:00', end: '14:00', tasks: [] },
    { dayIndex: 6, name: 'Sexta', materia: 'Química', tema: 'Ligações', start: '14:00', end: '15:00', tasks: [] },
    { dayIndex: 7, name: 'Sábado', materia: 'Geografia', tema: 'Mapas', start: '15:00', end: '16:00', tasks: [] },
];


function DayCard({ index, item, expanded, onToggle }) {
    return (
        <View style={styles.dayCardContainer}>
            <TouchableOpacity style={styles.dayCard} activeOpacity={0.8} onPress={() => onToggle(index)}>
                <View style={styles.dayLeftNumber}>
                    <Text style={styles.dayNumber}>{index}</Text>
                </View>


                <View style={styles.dayMain}>
                    <View style={styles.rowBetween}>
                    <Text style={styles.dayTitle}>{item.isToday ? 'Hoje' : item.name}</Text>
                    <Text style={styles.materiaTitle}>{item.materia}</Text>
                </View>


                <View style={styles.rowBetweenSmall}>
                    <Text style={styles.timeText}>Início: {item.start}</Text>
                        <Text style={styles.timeText}>Término: {item.end}</Text>
                    </View>
                </View>


                <View style={styles.chevronContainer}>
                    <MaterialIcons name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={26} color="#0b4e91" />
                </View>
            </TouchableOpacity>


            {expanded && (
                <View style={styles.expandedArea}>
                    {(item.tasks.length === 0) ? (
                    <Text style={{ padding: 8, color: '#475569' }}>Nenhuma tarefa para este dia.</Text>
                    ) : (
                        item.tasks.map((t, i) => (
                        <View key={i} style={styles.smallTaskCard}>
                            <Text style={styles.smallTaskIndex}>{i+1}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.smallTaskMateria}>{t.materia}</Text>
                                <Text style={styles.smallTaskTema}>{t.tema}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                                    <Text style={styles.timeTextSmall}>Início: {t.start}</Text>
                                    <Text style={styles.timeTextSmall}>Término: {t.end}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                    )}
                </View>
            )}
        </View>
    );
}

function CalendarGrid({ selectedDate, onSelect }) {
    // Simple month grid for current month
    const [today] = useState(new Date());
    const year = today.getFullYear();
    const month = today.getMonth();


    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();


    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));


    return (
        <View style={styles.calendarContainer}>
            <View style={styles.weekHeaderRow}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map((w) => (
                <Text key={w} style={styles.weekHeader}>{w}</Text>
                ))}
            </View>


            <View style={styles.calendarGrid}>
                {cells.map((cell, i) => {
                    const isToday = cell && cell.toDateString() === new Date().toDateString();
                    const isSelected = cell && selectedDate && cell.toDateString() === selectedDate.toDateString();


                    return (
                        <TouchableOpacity
                            key={String(i)}
                            style={[styles.calendarCell, isToday && styles.calendarCellToday, isSelected && styles.calendarCellSelected]}
                            disabled={!cell}
                            onPress={() => cell && onSelect(cell)}
                        >
                            <Text style={[styles.calendarCellText, isSelected && { color: '#fff' }]}>{cell ? cell.getDate() : ''}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function Tela_PlanoDeEstudos() {
    const [mode, setMode] = useState('dias'); // 'dias' | 'cal'
    const [weekData, setWeekData] = useState(defaultWeek.map((w,i) => ({ ...w, isToday: i === 0 })));
    const [expandedIndex, setExpandedIndex] = useState(null);


    const [modalVisible, setModalVisible] = useState(false);
    const [newMateria, setNewMateria] = useState('');
    const [newTema, setNewTema] = useState('');
    const [newStart, setNewStart] = useState('08:00');
    const [newEnd, setNewEnd] = useState('09:00');
    const [newDayIndex, setNewDayIndex] = useState(1);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysToShow = useMemo(() => weekData, [weekData]);

    function toggleExpand(i) {
        setExpandedIndex(expandedIndex === i ? null : i);
    }

    function handleAddTask() {
        const idx = Math.max(0, Math.min(6, newDayIndex - 1));
        const copy = [...weekData];
        copy[idx].tasks.push({ materia: newMateria || 'Matéria', tema: newTema || 'Tema', start: newStart, end: newEnd });
        setWeekData(copy);
        setModalVisible(false);
        setNewMateria(''); setNewTema('');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopNavbar />

            <View style={styles.whiteContainer}>
                <View style={styles.toggleRow}>
                    <TouchableOpacity style={[styles.toggleButton, mode === 'dias' && styles.toggleButtonActive]} onPress={() => setMode('dias')}>
                        <Text style={[styles.toggleText, mode === 'dias' && styles.toggleTextActive]}>Dias da Semana</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.toggleButton, mode === 'cal' && styles.toggleButtonActive]} onPress={() => setMode('cal')}>
                        <Text style={[styles.toggleText, mode === 'cal' && styles.toggleTextActive]}>Calendário</Text>
                    </TouchableOpacity>
                </View>


                {mode === 'dias' ? (
                    <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                        {daysToShow.map((d, idx) => (
                        <DayCard key={idx} index={idx+1} item={d} expanded={expandedIndex === idx} onToggle={() => toggleExpand(idx)} />
                        ))}
                    </ScrollView>
                ) : (
                    <ScrollView>
                        <CalendarGrid selectedDate={selectedDate} onSelect={(d) => setSelectedDate(d)} />


                        <View style={styles.selectedDayBox}>
                            <Text style={styles.selectedDayTitle}>{weekNames[selectedDate.getDay()]}: {String(selectedDate.getDate()).padStart(2,'0')}/{String(selectedDate.getMonth()+1).padStart(2,'0')}/{selectedDate.getFullYear()}</Text>

                            {/* Por simplicidade usamos os dados de weekData baseado no dia da semana */}
                            <View style={{ marginTop: 8 }}>
                                {weekData[selectedDate.getDay()] ? (
                                    <View style={{ marginBottom: 8 }}>
                                        <Text style={{ fontWeight: '700' }}>{weekData[selectedDate.getDay()].materia}</Text>
                                        <Text style={{ color: '#717b83', marginTop: 4 }}>{weekData[selectedDate.getDay()].tema}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                                            <Text>Início: {weekData[selectedDate.getDay()].start}</Text>
                                            <Text>Término: {weekData[selectedDate.getDay()].end}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <Text>Nenhuma tarefa neste dia.</Text>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                )}

                {/* Floating + button */}
                <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>


                {/* Modal adicionar tarefa */}
                <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Adicionar tarefa</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <MaterialIcons name="close" size={22} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Dia da semana (1-7)</Text>
                            <View style={styles.pickerContainer}>
                                <Picker selectedValue={newDayIndex} onValueChange={(v) => setNewDayIndex(v)}>
                                    {[1,2,3,4,5,6,7].map(i => <Picker.Item key={i} label={`${i}`} value={i} />)}
                                </Picker>
                            </View>

                            <Text style={styles.label}>Matéria</Text>
                            <TextInput style={styles.input} value={newMateria} onChangeText={setNewMateria} placeholder="Matéria" />

                            <Text style={styles.label}>Tema</Text>
                            <TextInput style={styles.input} value={newTema} onChangeText={setNewTema} placeholder="Tema" />


                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Início</Text>
                                    <TextInput style={styles.input} value={newStart} onChangeText={setNewStart} placeholder="08:00" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Término</Text>
                                    <TextInput style={styles.input} value={newEnd} onChangeText={setNewEnd} placeholder="09:00" />
                                </View>
                            </View>


                            <TouchableOpacity style={styles.sendButton} onPress={handleAddTask}>
                                <Text style={{ color: '#fff', fontWeight: '700' }}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>

            <View style={styles.menuBarContainer}>
                <MenuBar />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0b4e91' },
    whiteContainer: { flex: 1, margin: 10, backgroundColor: '#ececec', borderRadius: 14, padding: 12 },
    toggleRow: { flexDirection: 'row', marginBottom: 12, alignSelf: 'center' },
    toggleButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginHorizontal: 6, backgroundColor: '#fff' },
    toggleButtonActive: { backgroundColor: '#0b4e91' },
    toggleText: { color: '#0b4e91', fontWeight: '600' },
    toggleTextActive: { color: '#fff' },

    dayCardContainer: { marginBottom: 10 },
    dayCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10, shadowColor: '#000', shadowOpacity: 0.06, elevation: 2 },
    dayLeftNumber: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#f0f4f8', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    dayNumber: { fontWeight: '700', color: '#0b4e91' },
    dayMain: { flex: 1 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowBetweenSmall: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    dayTitle: { fontWeight: '700', color: '#0b4e91' },
    materiaTitle: { fontWeight: '600', color: '#1f3f67' },
    timeText: { color: '#65707a', fontSize: 12 },
    chevronContainer: { width: 36, justifyContent: 'center', alignItems: 'center' },
    expandedArea: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginTop: 8, marginLeft: 52 },

    smallTaskCard: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 8 },
    smallTaskIndex: { width: 26, fontWeight: '700', color: '#0b4e91' },
    smallTaskMateria: { fontWeight: '700' },
    smallTaskTema: { color: '#6b7280', marginTop: 2 },
    timeTextSmall: { fontSize: 12, color: '#555' },

    floatingButton: { position: 'absolute', bottom: 100, right: 18, width: 60, height: 60, borderRadius: 30, backgroundColor: '#0c4499', justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 2, borderColor: '#fff' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '86%', backgroundColor: '#fff', borderRadius: 10, padding: 14 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    modalTitle: { fontSize: 16, fontWeight: '700' },
    label: { fontWeight: '600', color: '#2f4a6c', marginTop: 8 },
    input: { borderWidth: 1, borderColor: '#d0d7de', borderRadius: 6, padding: 8, marginTop: 6 },
    pickerContainer: { borderWidth: 1, borderColor: '#d0d7de', borderRadius: 6, marginTop: 6 },
    sendButton: { marginTop: 12, backgroundColor: '#0b4e91', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

    calendarContainer: { padding: 6, backgroundColor: '#fff', borderRadius: 10, marginBottom: 12 },
    weekHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 },
    weekHeader: { width: (SCREEN_W - 60) / 7, textAlign: 'center', fontWeight: '700', color: '#5b6b79' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarCell: { width: (SCREEN_W - 60) / 7, height: 44, justifyContent: 'center', alignItems: 'center' },
    calendarCellText: { color: '#1f3f67' },
    calendarCellToday: { borderWidth: 1, borderColor: '#0b4e91', borderRadius: 6 },
    calendarCellSelected: { backgroundColor: '#0b4e91', borderRadius: 6 },

    selectedDayBox: { marginTop: 12, backgroundColor: '#fff', padding: 10, borderRadius: 10 },
    selectedDayTitle: { fontWeight: '700', color: '#0b4e91' },

    menuBarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70 },
});