import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, LayoutAnimation, UIManager, Platform, ScrollView, Modal, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import UsuarioService from "../../../services/UsuarioService";
import { MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from "expo-document-picker";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TelaLinguagens() {
  const [modalVisible, setModalVisible] = useState(false);
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState("");

  // DropdownPicker
  const [open, setOpen] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState("Linguagens");
  const [materiasDisponiveis, setMateriasDisponiveis] = useState([
    { label: "Linguagens", value: "Linguagens" },
    { label: "Matemática", value: "Matemática" },
    { label: "Ciências", value: "Ciências" },
    { label: "História", value: "História" },
  ]);

  // Função para abrir o explorador de arquivos
  const selecionarArquivo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.type === "success") setArquivoPdf(result);
  };

  const enviarMaterial = async () => {
    if (!arquivoPdf || !titulo || !tema) {
      alert("Preencha todos os campos e selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("tema", tema);
    formData.append("materia", materiaSelecionada);
    formData.append("arquivo", {
      uri: arquivoPdf.uri,
      name: arquivoPdf.name,
      type: "application/pdf",
    });
    formData.append("criado_por", 1);

    try {
      await UsuarioService.publicarMateriaFormData(formData);
      alert("Material enviado com sucesso!");
      setModalVisible(false);
      setTitulo("");
      setTema("");
      setArquivoPdf(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar material.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Botão "+" visível apenas para professores */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 30, color: "#fff" }}>+</Text>
      </TouchableOpacity>

      {/* Modal de envio */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enviar material</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
            />

            <Text style={styles.label}>Tema</Text>
            <TextInput
              style={styles.input}
              value={tema}
              onChangeText={setTema}
              placeholder="Digite o tema"
            />

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título"
            />

            <TouchableOpacity style={styles.fileButton} onPress={selecionarArquivo}>
              <Text style={{ color: "#fff" }}>{arquivoPdf ? arquivoPdf.name : "Adicionar arquivo"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendButton} onPress={enviarMaterial}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0c4499",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 5,
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
    backgroundColor: "#0c4499",
    borderRadius: 5,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
