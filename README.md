<p align="center">
  <img src="https://i.imgur.com/QVSmAYM.png" width="200" alt="Logo Guardiã DF" />
</p>

<p align="center"><strong>Tecnologia que protege. Apoio real, resposta rápida.</strong></p>

---

## 🛡️ Sobre o projeto

**Guardiã DF** é um aplicativo mobile desenvolvido com **Expo (React Native)**, criado para oferecer suporte, proteção e resposta emergencial a mulheres em situação de risco, especialmente vítimas de violência doméstica sob medida protetiva de urgência.

Nosso objetivo é transformar o tempo entre o risco e a resposta em **prevenção inteligente e ação imediata**, por meio de recursos acessíveis e eficazes.

---

## 🚀 Tecnologias utilizadas

- [Expo SDK 53](https://expo.dev/)
- React Native
- JavaScript
- `react-native-maps` + `expo-location`
- **Projeto 100% Frontend**

---

## 🧩 Funcionalidades principais

### ✅ Já implementadas:

- Cadastro acessível para qualquer mulher
- Avaliação de Risco Personalizada: ferramenta para a mulher avaliar sua situação e receber orientações específicas
- Rota de fuga manual ou automática até pontos seguros
- Mapa de calor com zonas de maior e menor risco
- Marcação de pontos de risco (ruas escuras, locais perigosos) e pontos seguros (delegacias, batalhões, comércios)
- Rede de apoio com:
  - Delegacia da Mulher (DEAM)
  - Assistência jurídica
  - Atendimento psicossocial
  - Abrigos temporários
- Botão de pânico para acionar a viatura mais próxima (por geolocalização)
- Conteúdo educativo sobre direitos, violência e como agir em caso de ameaça

### 🔄 Funcionalidades futuras:

- 📊 Integração com sistema judicial: identificação automática de mulheres com medida protetiva
- 🔐 Verificação por biometria facial para ativar funcionalidades judiciais
- 📍 Visualização da localização do agressor monitorado por tornozeleira eletrônica
- 💬 Envio automático de alertas via WhatsApp (deep link)
- 🔒 Integração com botão físico Bluetooth (pulseira, chaveiro etc.)
- 🚓 Chamado inteligente de viatura com rastreamento de status e priorização por risco

---

## 🔐 Cadastro com inteligência planejada

O app permitirá o cadastro de qualquer mulher.

Nas versões futuras:

- Caso o CPF da usuária esteja vinculado a uma **medida protetiva**, o sistema conectará automaticamente com o agressor monitorado por tornozeleira.
- A ativação dessa funcionalidade será feita com **verificação por biometria facial**, garantindo segurança e legitimidade no acesso.
- Mulheres sem vínculo judicial poderão usar normalmente todas as funcionalidades não restritas.

---

## 🚓 Chamado inteligente de viatura *(futuro)*

Ao registrar um **alerta de risco**, a usuária poderá **optar por acionar uma viatura imediatamente**.

Funcionamento previsto:

- A viatura mais próxima e disponível será **notificada automaticamente**.
- Se todas estiverem ocupadas, o alerta **entrará em uma fila priorizada** com base em **grau de risco e proximidade**.
- A usuária poderá acompanhar o **status do atendimento em tempo real** (em andamento, aguardando ou finalizado).

Essa funcionalidade garantirá uma **resposta eficiente, integrada e estratégica**, alinhada com os serviços públicos de segurança.

---

## 🛠️ Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/guardia-df.git
   cd guardia-df
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Instale o Expo CLI (caso ainda não tenha):
   ```bash
   npm install -g expo-cli
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npx expo start
   ```
