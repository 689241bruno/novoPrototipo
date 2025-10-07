import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicial from "../pages/Tela_inicial/index.js";
import Login from "../pages/Tela_login/index.js";
import Cadastro from "../pages/Tela_cadastro/index.js";
import Usuarios from "../Usuarios/index.js";
import Principal from "../pages/Tela_principal/index.js";
import Perfil from "../pages/Tela_perfil_usuario/index.js";
import TelaTeste from "../Testes_de_componentes/index.js";
import EsqueciSenha from "../pages/Tela_login/Tela_esqueci_senha/index.js";
import CodigoVerificacao from "../pages/Tela_login/Tela_esqueci_senha/Tela_codigo_verificacao/index.js";
import Linguagens from "../pages/materias/Tela_Linguagens/index.js";
/*<<<<<<< HEAD*/
import Ranking from "../pages/Tela_ranking/index.js";
/*=======*/
import TelaPDF from "../pages/materias/LeitorPDF/TelaPDF.js";
import Matematica from "../pages/materias/Tela_Matematica/index.js";
import CienciasNatureza from "../pages/materias/Tela_CienciasNatureza/index.js";
import CienciasHumanas from "../pages/materias/Tela_CienciasHumanas/index.js";
/*>>>>>>> 0e94cae2afa08e8be536100a73fbca73dcd98811*/

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
        name="Usuarios"
        component={Usuarios}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Principal"
        component={Principal}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Perfil"
        component={Perfil}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Ranking"
        component={Ranking}
        options={{ headerShown: false }}
      />  

      <Stack.Screen
        name="TelaTeste"
        component={TelaTeste}
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
        name="CienciasNatureza"
        component={CienciasNatureza}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CienciasHumanas"
        component={CienciasHumanas}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TelaPDF"
        component={TelaPDF}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
