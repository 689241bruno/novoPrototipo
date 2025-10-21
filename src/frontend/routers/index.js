import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Páginas principais
import Inicial from "../pages/Tela_Inicial.js";
import Login from "../pages/Tela_login/Tela_Login.js";
import Cadastro from "../pages/Tela_Cadastro.js";
import Principal from "../pages/Tela_Principal.js";
import Desafios from "../pages/Tela_Desafios.js";
import PerfilUsuario from "../pages/Tela_Perfil_Usuario.js";
import PlanoDeEstudos from "../pages/Tela_PlanoDeEstudos.js";
import Flashcard from "../pages/Tela_Flashcards.js";
import FlashcardsMateria from "../pages/Tela_FlashcardsMateria.js";
import Ranking from "../pages/Tela_Ranking.js";
import Configuracoes from "../pages/Tela_Configuracoes.js";

// Telas de recuperação de senha
import EsqueciSenha from "../pages/Tela_login/Tela_esqueci_senha.js";
import CodigoVerificacao from "../pages/Tela_login/Tela_codigo_verificacao.js";

// Páginas de matérias
import CienciasHumanas from "../pages/materias/Tela_CienciasHumanas.js";
import CienciasNatureza from "../pages/materias/Tela_CienciasNatureza.js";
import Linguagens from "../pages/materias/Tela_Linguagens.js";
import Matematica from "../pages/materias/Tela_Matematica.js";
import TelaPDF from "../pages/materias/TelaPDF.js";

// Outros
import Teste from "../Testes_de_componentes/index.js";
import Usuarios from "../Usuarios/index.js";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inicial"
        component={Inicial}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Principal"
        component={Principal}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Desafios"
        component={Desafios}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PerfilUsuario"
        component={PerfilUsuario}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PlanoDeEstudos"
        component={PlanoDeEstudos}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Flashcard"
        component={Flashcard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FlashcardsMateria"
        component={FlashcardsMateria}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Ranking"
        component={Ranking}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Configuracoes"
        component={Configuracoes}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EsqueciSenha"
        component={EsqueciSenha}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CodigoVerificacao"
        component={CodigoVerificacao}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CienciasHumanas"
        component={CienciasHumanas}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CienciasNatureza"
        component={CienciasNatureza}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Linguagens"
        component={Linguagens}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Matematica"
        component={Matematica}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TelaPDF"
        component={TelaPDF}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Teste"
        component={Teste}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Usuarios"
        component={Usuarios}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}