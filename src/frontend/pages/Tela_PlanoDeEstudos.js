import React from "react";
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
} from "react-native";
import * as Animatable from "react-native-animatable";
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import ProgressBar from "../components/ProgressBar";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState, useMemo, useEffect } from "react";
import PlanoService from "../services/PlanoService";

const { width: SCREEN_W } = Dimensions.get("window");
const CELL_WIDTH = Math.floor(SCREEN_W / 7);

const weekNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

// Exemplo simples de dados - você pode ligar ao backend depois
const defaultWeek = [
  {
    dayIndex: 1,
    name: "Hoje",
    materia: "Matemática",
    tema: "Aritmética",
    start: "08:00",
    end: "09:00",
    tasks: [],
  },
  {
    dayIndex: 2,
    name: "Segunda",
    materia: "Português",
    tema: "Gramática",
    start: "09:00",
    end: "10:00",
    tasks: [],
  },
  {
    dayIndex: 3,
    name: "Terça",
    materia: "História",
    tema: "Revoluções",
    start: "10:00",
    end: "11:00",
    tasks: [],
  },
  {
    dayIndex: 4,
    name: "Quarta",
    materia: "Biologia",
    tema: "Células",
    start: "11:00",
    end: "12:00",
    tasks: [],
  },
  {
    dayIndex: 5,
    name: "Quinta",
    materia: "Física",
    tema: "Cinemática",
    start: "13:00",
    end: "14:00",
    tasks: [],
  },
  {
    dayIndex: 6,
    name: "Sexta",
    materia: "Química",
    tema: "Ligações",
    start: "14:00",
    end: "15:00",
    tasks: [],
  },
  {
    dayIndex: 7,
    name: "Sábado",
    materia: "Geografia",
    tema: "Mapas",
    start: "15:00",
    end: "16:00",
    tasks: [],
  },
];

function DayCard({ index, item, expanded, onToggle, onEdit, onDelete }) {
  // Coleta matérias únicas do dia
  const materiasDoDia =
    [...new Set(item.tasks.map((t) => t.materia))].join(", ") ||
    item.materia ||
    "—";

  return (
    <View style={styles.dayCardContainer}>
      <TouchableOpacity
        style={styles.dayCard}
        activeOpacity={0.8}
        onPress={() => onToggle(index)}
      >
        <View style={styles.dayLeftNumber}>
          <Text style={styles.dayNumber}>{index}</Text>
        </View>

        <View style={styles.dayMain}>
          <View style={styles.rowBetween}>
            <Text style={styles.dayTitle}>
              {item.isToday ? "Hoje" : item.name}
            </Text>
            {/* Matérias do dia */}
            <Text style={styles.materiaTitle}>{materiasDoDia}</Text>
          </View>

          {/* Horários ajustados */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <Text style={styles.timeText}>Início: {item.start}</Text>
            <Text style={styles.timeText}>Término: {item.end}</Text>
          </View>
        </View>

        <View style={styles.chevronContainer}>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={26}
            color="#0b4e91"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedArea}>
          {item.tasks.length === 0 ? (
            <Text style={{ padding: 8, color: "#475569" }}>
              Nenhuma tarefa para este dia.
            </Text>
          ) : (
            item.tasks.map((t, i) => (
              <View key={i} style={styles.smallTaskCard}>
                <Text style={styles.smallTaskIndex}>{i + 1}</Text>

                <View style={{ flex: 1 }}>
                  <Text style={styles.smallTaskMateria}>{t.materia}</Text>
                  <Text style={styles.smallTaskTema}>{t.tema}</Text>

                  <View style={{ marginTop: 6 }}>
                    <Text style={styles.timeTextSmall}>Início: {t.start}</Text>
                    <Text style={styles.timeTextSmall}>Término: {t.end}</Text>
                  </View>
                </View>

                {/* Ícones de editar e excluir */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => onEdit && onEdit(item, t)}>
                    <MaterialIcons name="edit" size={22} color="#0b4e91" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete && onDelete(t)}>
                    <MaterialIcons name="delete" size={22} color="#c20707ff" />
                  </TouchableOpacity>
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
  const [monthOffset, setMonthOffset] = useState(0);

  const baseDate = new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + monthOffset;

  // Semana começa na segunda -> ajustar firstDay
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  // Cabeçalho compatível com week starting on Monday
  const weekHeaderLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <View style={styles.calendarContainer}>
      {/* Navegação do mês */}
      <View style={styles.monthNavRow}>
        <TouchableOpacity onPress={() => setMonthOffset(monthOffset - 1)}>
          <MaterialIcons name="chevron-left" size={28} color="#0b4e91" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {new Date(year, month).toLocaleString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <TouchableOpacity onPress={() => setMonthOffset(monthOffset + 1)}>
          <MaterialIcons name="chevron-right" size={28} color="#0b4e91" />
        </TouchableOpacity>
      </View>

      {/* Cabeçalho dos dias da semana (segunda -> domingo) */}
      <View style={styles.weekHeaderRow}>
        {weekHeaderLabels.map((w, i) => (
          <View key={i} style={[styles.weekHeaderCell, { width: CELL_WIDTH }]}>
            <Text style={styles.weekHeader}>{w}</Text>
          </View>
        ))}
      </View>

      {/* Grade de dias */}
      <View style={styles.calendarGrid}>
        {cells.map((cell, i) => {
          const isToday =
            cell && cell.toDateString() === new Date().toDateString();
          const isSelected =
            cell &&
            selectedDate &&
            cell.toDateString() === selectedDate.toDateString();

          return (
            <TouchableOpacity
              key={String(i)}
              style={[
                styles.calendarCell,
                { flexBasis: `${100 / 7}%` },
                isToday && styles.calendarCellToday,
                isSelected && styles.calendarCellSelected,
              ]}
              disabled={!cell}
              onPress={() => cell && onSelect(cell)}
            >
              <Text
                style={[
                  styles.calendarCellText,
                  isSelected && { color: "#fff" },
                ]}
              >
                {cell ? cell.getDate() : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function Tela_PlanoDeEstudos() {
  const [mode, setMode] = useState("dias"); // 'dias' | 'cal'
  const [weekData, setWeekData] = useState(
    defaultWeek.map((w) => ({ ...w, isToday: false }))
  );
  const [expandedIndex, setExpandedIndex] = useState(null);
  const daysToShow = useMemo(() => weekData, [weekData]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [newMateria, setNewMateria] = useState("");
  const [newTema, setNewTema] = useState("");
  const [newStart, setNewStart] = useState("08:00");
  const [newEnd, setNewEnd] = useState("09:00");
  const [newDayIndex, setNewDayIndex] = useState(1);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [multiDeleteMode, setMultiDeleteMode] = useState(false);

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [editMateria, setEditMateria] = useState("");
  const [editTema, setEditTema] = useState("");
  const [editStart, setEditStart] = useState("08:00");
  const [editEnd, setEditEnd] = useState("09:00");
  const [editDayIndex, setEditDayIndex] = useState(1);

  function jsDayToUiDay(jsDay) {
    // getDay(): 0 = domingo ... 6 = sábado
    return jsDay + 1; // agora 1 = domingo, 7 = sábado (sem inverter)
  }

  // Converte formato da UI (1..7) para getDay() padrão (0..6)
  function uiDayToJsDay(uiDay) {
    return uiDay - 1;
  }

  async function loadWeekData() {
    try {
      const usuario_id = await PlanoService.getUsuarioId();
      if (!usuario_id) return;

      const dados = await PlanoService.listarPlano(usuario_id);

      const novaSemana = Array(7)
        .fill()
        .map((_, i) => ({
          dayIndex: i + 1,
          name: weekNames[i],
          tasks: [],
          isToday: i === new Date().getDay(),
        }));

      dados.forEach((tarefa) => {
        const diaDate = new Date(tarefa.dia);
        if (isNaN(diaDate)) return;

        const jsDay = diaDate.getDay();
        const uiDay = jsDayToUiDay(jsDay);

        const taskObj = {
          id: tarefa.id,
          materia: tarefa.materia,
          tema: tarefa.tema,
          start: tarefa.inicio,
          end: tarefa.termino,
          dayIndex: uiDay,
        };

        novaSemana[uiDay - 1].tasks.push(taskObj);
      });

      // ✅ Atualiza o estado com os dados carregados
      setWeekData(novaSemana);
    } catch (err) {
      console.error("Erro ao carregar plano de estudos:", err);
    }
  }

  useEffect(() => {
    loadWeekData();
  }, []);

  function handleDeleteTask() {
    setDeleteModalVisible(true);
  }

  function toggleSelectTask(id) {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((t) => t !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  }

  async function handleConfirmMultiDelete() {
    try {
      for (const id of selectedTasks) {
        await PlanoService.deletarTarefa(id);
      }

      // Atualiza a lista local
      const updated = weekData.map((day) => ({
        ...day,
        tasks: day.tasks.filter((t) => !selectedTasks.includes(t.id)),
      }));

      setWeekData(updated);
      setSelectedTasks([]);
      setMultiDeleteMode(false);
      setDeleteModalVisible(false);
    } catch (err) {
      console.error("Erro ao excluir múltiplas tarefas:", err);
    }
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) return;

    try {
      await PlanoService.deletarTarefa(taskToDelete.id);
      // Atualiza a semana localmente
      const updated = weekData.map((day) => ({
        ...day,
        tasks: day.tasks.filter((t) => t.id !== taskToDelete.id),
      }));

      setWeekData(updated);
      setTaskToDelete(null);
      setDeleteModalVisible(false);
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  }

  function openEditModal(task) {
    // garante que a tarefa passada tenha dayIndex (1..7)
    setTaskToEdit({
      ...task,
      dayIndex: task.dayIndex || 1,
    });
    setEditModalVisible(true);
  }

  async function handleUpdateTask() {
    if (!taskToEdit) return;

    try {
      const usuario_id = await PlanoService.getUsuarioId();
      if (!usuario_id) return alert("Usuário não encontrado!");

      // valida dayIndex
      if (
        !taskToEdit?.dayIndex ||
        taskToEdit.dayIndex < 1 ||
        taskToEdit.dayIndex > 7
      ) {
        console.warn("dayIndex inválido:", taskToEdit?.dayIndex);
        return alert("Erro: dia da semana inválido ao atualizar tarefa!");
      }

      // calcula data ISO para o backend (usa dia da semana relativo à semana atual)
      const hoje = new Date();
      const diaSelecionado = new Date(hoje);
      diaSelecionado.setDate(
        hoje.getDate() - hoje.getDay() + (taskToEdit.dayIndex - 1)
      );

      if (isNaN(diaSelecionado)) {
        console.error("Data inválida gerada:", diaSelecionado);
        return alert("Erro ao processar data da tarefa!");
      }

      const dia = diaSelecionado.toISOString().split("T")[0];

      // chama o endpoint de edição (seu serviço chama editarTarefa / editar)
      await PlanoService.editarTarefa(taskToEdit.id, {
        usuario_id,
        dia,
        materia: taskToEdit.materia,
        tema: taskToEdit.tema,
        inicio: taskToEdit.start,
        termino: taskToEdit.end,
      });

      // recarrega a semana inteira do servidor para refletir quaisquer mudanças de dia
      await loadWeekData();

      setEditModalVisible(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      alert("Erro ao atualizar tarefa. Veja console para detalhes.");
    }
  }

  function handleEditModeToggle() {
    const tasksHoje = weekData[selectedDate.getDay()]?.tasks || [];
    if (tasksHoje.length === 0) {
      setErrorModalVisible(true);
      return;
    }
    setEditMode(!editMode);
  }

  function handleTaskClickForEdit(task) {
    if (editMode) {
      openEditModal(task);
      setEditMode(false);
    } else if (multiDeleteMode) {
      toggleSelectTask(task.id);
    }
  }

  function toggleExpand(i) {
    setExpandedIndex(expandedIndex === i ? null : i);
  }

  async function handleAddTask() {
    try {
      const usuario_id = await PlanoService.getUsuarioId();
      if (!usuario_id) return alert("Usuário não encontrado!");

      const hoje = new Date();
      const diaSelecionado = new Date(hoje);
      const targetJsDay = newDayIndex - 1;
      diaSelecionado.setDate(hoje.getDate() - hoje.getDay() + targetJsDay);
      const dia = diaSelecionado.toISOString().split("T")[0];
      await PlanoService.criarTarefa({
        usuario_id,
        dia,
        materia: newMateria,
        tema: newTema,
        inicio: newStart,
        termino: newEnd,
      });

      const updated = [...weekData];
      const nova = await PlanoService.criarTarefa({
        usuario_id,
        dia,
        materia: newMateria,
        tema: newTema,
        inicio: newStart,
        termino: newEnd,
      });

      updated[newDayIndex - 1].tasks.push({
        id: nova.id,
        materia: newMateria,
        tema: newTema,
        start: newStart,
        end: newEnd,
      });
      setWeekData(updated);

      setModalVisible(false);
      setNewMateria("");
      setNewTema("");
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  }

  function openAddModalForSelectedDay() {
    const diaSemana = jsDayToUiDay(selectedDate.getDay());
    setNewDayIndex(diaSemana);
    setEditModalVisible(false);
    setModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNavbar />

      <Animatable.View
        delay={300}
        animation={"fadeInUp"}
        style={styles.whiteContainer}
      >
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              mode === "dias" && styles.toggleButtonActive,
            ]}
            onPress={() => setMode("dias")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "dias" && styles.toggleTextActive,
              ]}
            >
              Dias da Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              mode === "cal" && styles.toggleButtonActive,
            ]}
            onPress={() => setMode("cal")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "cal" && styles.toggleTextActive,
              ]}
            >
              Calendário
            </Text>
          </TouchableOpacity>
        </View>

        {mode === "dias" ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {daysToShow.map((d, idx) => (
              <DayCard
                key={idx}
                index={idx + 1}
                item={d}
                expanded={expandedIndex === idx}
                onToggle={() => toggleExpand(idx)}
                onEdit={(day, task) =>
                  openEditModal({ ...task, dayIndex: day.dayIndex })
                }
                onDelete={(tarefa) => {
                  setTaskToDelete(tarefa);
                  setDeleteModalVisible(true);
                }}
              />
            ))}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
            <CalendarGrid
              selectedDate={selectedDate}
              onSelect={(d) => setSelectedDate(d)}
            />

            <View style={styles.selectedDayBox}>
              <View style={styles.dayHeaderRow}>
                <Text style={styles.selectedDayTitle}>
                  {weekNames[selectedDate.getDay()]}:{" "}
                  {String(selectedDate.getDate()).padStart(2, "0")}/
                  {String(selectedDate.getMonth() + 1).padStart(2, "0")}/
                  {selectedDate.getFullYear()}
                </Text>
                <View style={styles.dayHeaderIcons}>
                  <TouchableOpacity onPress={() => handleEditModeToggle()}>
                    <MaterialIcons
                      name={editMode ? "check-circle" : "edit"}
                      size={24}
                      color={editMode ? "#007AFF" : "#0b4e91"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (multiDeleteMode) {
                        setDeleteModalVisible(true);
                      } else {
                        setMultiDeleteMode(true);
                      }
                    }}
                  >
                    <MaterialIcons
                      name={multiDeleteMode ? "check-circle" : "delete"}
                      size={24}
                      color={multiDeleteMode ? "#007AFF" : "#c20707ff"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => openAddModalForSelectedDay()}
                  >
                    <MaterialIcons
                      name="add-circle"
                      size={28}
                      color="#0b4e91"
                      style={{ marginLeft: 14 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={{ marginTop: 8, maxHeight: 300 }}>
                {weekData[selectedDate.getDay()] &&
                weekData[selectedDate.getDay()].tasks.length > 0 ? (
                  weekData[selectedDate.getDay()].tasks.map((tarefa, index) => (
                    <TouchableOpacity
                      key={tarefa.id || index}
                      onPress={() =>
                        handleTaskClickForEdit({
                          ...tarefa,
                          dayIndex: jsDayToUiDay(selectedDate.getDay()),
                        })
                      }
                      style={[
                        styles.smallTaskCard,
                        multiDeleteMode &&
                          selectedTasks.includes(tarefa.id) && {
                            backgroundColor: "#f8d7da",
                          },
                      ]}
                      activeOpacity={editMode || multiDeleteMode ? 0.6 : 1}
                    >
                      <Text style={styles.smallTaskIndex}>{index + 1}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.smallTaskMateria}>
                          {tarefa.materia}
                        </Text>
                        <Text style={styles.smallTaskTema}>{tarefa.tema}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 6,
                          }}
                        >
                          <Text style={styles.timeTextSmall}>
                            Início: {tarefa.start}
                          </Text>
                          <Text style={styles.timeTextSmall}>
                            Término: {tarefa.end}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: "#475569" }}>
                    Nenhuma tarefa neste dia.
                  </Text>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* Floating + button — agora só aparece na aba Dias da Semana */}
        {mode === "dias" && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => {
              // Define o dia da semana atual automaticamente (1 = Domingo, 7 = Sábado)
              const diaAtual =
                new Date().getDay() === 0 ? 7 : new Date().getDay();
              setNewDayIndex(diaAtual);
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Modal adicionar tarefa */}
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
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
                <Picker
                  selectedValue={newDayIndex}
                  onValueChange={(v) => setNewDayIndex(v)}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Picker.Item key={i} label={`${i}`} value={i} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Matéria</Text>
              <TextInput
                style={styles.input}
                value={newMateria}
                onChangeText={setNewMateria}
                placeholder="Matéria"
              />

              <Text style={styles.label}>Tema</Text>
              <TextInput
                style={styles.input}
                value={newTema}
                onChangeText={setNewTema}
                placeholder="Tema"
              />

              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Início</Text>
                  <TextInput
                    style={styles.input}
                    value={newStart}
                    onChangeText={setNewStart}
                    placeholder="08:00"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Término</Text>
                  <TextInput
                    style={styles.input}
                    value={newEnd}
                    onChangeText={setNewEnd}
                    placeholder="09:00"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleAddTask}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de edição (agora independente) */}
        <Modal
          animationType="fade"
          transparent
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar tarefa</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <MaterialIcons name="close" size={22} color="#000" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Dia da semana (1-7)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={taskToEdit?.dayIndex || 1}
                  onValueChange={(v) =>
                    setTaskToEdit((prev) => ({ ...prev, dayIndex: v }))
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Picker.Item key={i} label={`${i}`} value={i} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Matéria</Text>
              <TextInput
                style={styles.input}
                value={taskToEdit?.materia || ""}
                onChangeText={(t) =>
                  setTaskToEdit((prev) => ({ ...prev, materia: t }))
                }
                placeholder="Matéria"
              />

              <Text style={styles.label}>Tema</Text>
              <TextInput
                style={styles.input}
                value={taskToEdit?.tema || ""}
                onChangeText={(t) =>
                  setTaskToEdit((prev) => ({ ...prev, tema: t }))
                }
                placeholder="Tema"
              />

              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Início</Text>
                  <TextInput
                    style={styles.input}
                    value={taskToEdit?.start || ""}
                    onChangeText={(t) =>
                      setTaskToEdit((prev) => ({ ...prev, start: t }))
                    }
                    placeholder="08:00"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Término</Text>
                  <TextInput
                    style={styles.input}
                    value={taskToEdit?.end || ""}
                    onChangeText={(t) =>
                      setTaskToEdit((prev) => ({ ...prev, end: t }))
                    }
                    placeholder="09:00"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleUpdateTask}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  Salvar alterações
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de exclusão*/}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {multiDeleteMode ? (
                <>
                  <Text style={styles.modalTitle}>
                    Excluir tarefas selecionadas?
                  </Text>
                  <Text style={{ color: "#475569", marginTop: 6 }}>
                    {selectedTasks.length} tarefa(s) serão{" "}
                    <Text style={{ color: "#c62828", fontWeight: "700" }}>
                      removidas
                    </Text>{" "}
                    permanentemente.
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 16,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setMultiDeleteMode(false);
                        setSelectedTasks([]);
                      }}
                      style={[
                        styles.sendButton,
                        { backgroundColor: "#9e9e9e" },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleConfirmMultiDelete}
                      style={[
                        styles.sendButton,
                        { backgroundColor: "#c62828" },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Excluir tarefa?</Text>
                  <Text style={{ color: "#475569", marginTop: 6 }}>
                    Esta ação é{" "}
                    <Text style={{ color: "#c62828", fontWeight: "700" }}>
                      irreversível
                    </Text>{" "}
                    e removerá a tarefa.
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 16,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setDeleteModalVisible(false)}
                      style={[
                        styles.sendButton,
                        { backgroundColor: "#9e9e9e" },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleConfirmDelete}
                      style={[
                        styles.sendButton,
                        { backgroundColor: "#c62828" },
                      ]}
                    >
                      <Text style={{ color: "#fff" }}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Modal de erro: Nenhuma tarefa */}
        <Modal
          visible={errorModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Nenhuma tarefa encontrada</Text>
              <Text
                style={{ color: "#475569", marginTop: 6, textAlign: "center" }}
              >
                Não há tarefas disponíveis para esta ação.
              </Text>
              <TouchableOpacity
                style={[styles.sendButton, { marginTop: 16 }]}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text style={{ color: "#fff" }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animatable.View>

      <View style={styles.menuBarContainer}>
        <MenuBar />
      </View>
    </SafeAreaView>
  );
}
// largura de cada célula (com pequena margem)
const CELL_HEIGHT = CELL_WIDTH * 1.1; // altura proporcional para manter aspecto bonito

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0b4e91" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    elevation: 4,
    marginBottom: 10,
  },
  whiteContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: "#ececec",
    borderRadius: 14,
    padding: 12,
  },
  toggleRow: { flexDirection: "row", marginBottom: 12, alignSelf: "center" },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 6,
    backgroundColor: "#fff",
  },
  toggleButtonActive: { backgroundColor: "#0b4e91" },
  toggleText: { color: "#0b4e91", fontWeight: "600" },
  toggleTextActive: { color: "#fff" },

  monthNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  monthTitle: {
    fontWeight: "700",
    color: "#0b4e91",
    fontSize: 16,
    textTransform: "capitalize",
  },
  dayCardContainer: { marginBottom: 10 },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    elevation: 2,
  },
  dayLeftNumber: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dayNumber: { fontWeight: "700", color: "#0b4e91" },
  dayMain: { flex: 1 },

  dayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayHeaderIcons: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowBetweenSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  dayTitle: { fontWeight: "700", color: "#0b4e91" },
  materiaTitle: {
    fontWeight: "600",
    color: "#1f3f67",
    marginLeft: 12, // adiciona deslocamento à esquerda
  },
  timeText: { color: "#65707a", fontSize: 12, marginTop: 2 },
  chevronContainer: {
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  expandedArea: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    marginLeft: 52,
  },

  smallTaskCard: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  smallTaskIndex: { width: 26, fontWeight: "700", color: "#0b4e91" },
  smallTaskMateria: { fontWeight: "700" },
  smallTaskTema: { color: "#6b7280", marginTop: 2 },
  timeTextSmall: { fontSize: 12, color: "#555" },

  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0c4499",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: "700" },
  label: { fontWeight: "600", color: "#2f4a6c", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 6,
    marginTop: 6,
  },
  sendButton: {
    marginTop: 12,
    backgroundColor: "#0b4e91",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  calendarContainer: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
  },
  weekHeader: {
    width: (SCREEN_W - 60) / 7,
    textAlign: "center",
    fontWeight: "700",
    color: "#5b6b79",
  },

  weekHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekHeaderCell: {
    alignItems: "center",
    paddingVertical: 4,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // << AQUI
  },
  calendarCell: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
  },

  calendarCellToday: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
  },

  calendarCellSelected: {
    backgroundColor: "#0b4e91",
    borderRadius: 10,
  },

  calendarCellText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },

  selectedDayBox: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  selectedDayTitle: { fontWeight: "700", color: "#0b4e91" },

  menuBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
});
