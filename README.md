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

Funcionalidades futuras:
- Validação por biometria facial
- Envio de alertas via WhatsApp (deep link)
- Botão físico de emergência via Bluetooth

---

## 🔐 Cadastro com inteligência planejada

- O app permitirá cadastro de qualquer mulher.
- Em futuras versões, se o CPF da usuária estiver vinculado a uma **medida protetiva**, o sistema fará a conexão com o agressor monitorado por tornozeleira.
- Essa ativação será feita com **verificação por biometria facial** — para garantir que é a própria vítima que está acessando.
- Usuárias sem vínculo judicial poderão usar normalmente todas as demais funcionalidades.

---

## 🧩 Funcionalidades principais

- ✅ Cadastro acessível para qualquer mulher
- 📊 Avaliação de Risco Personalizada: Ferramenta para a mulher avaliar sua situação e receber orientações específicas para sua segurança e busca de apoio
- 📍 Visualização da localização do agressor (futuramente, via tornozeleira eletrônica)
- 🛣️ Rota de fuga manual ou automática até pontos seguros
- 🔥 Mapa de calor com zonas de maior e menor risco
- 📌 Marcação de pontos de risco (ruas escuras, locais perigosos) e pontos seguros (delegacias, batalhões, comércios)
- 📞 Rede de apoio com:
  - Delegacia da Mulher (DEAM)
  - Assistência jurídica
  - Atendimento psicossocial
  - Abrigos temporários
- 🚨 Botão de pânico para acionar a viatura mais próxima (por geolocalização)
- 💬 Envio automático de alerta com localização via WhatsApp (futuramente)
- 🔒 Integração futura com botão físico Bluetooth (pulseira, chaveiro, etc.)
- 📚 Conteúdo educativo sobre direitos, violência e como agir em caso de ameaça

---

## 🚓 Chamado inteligente de viatura *(funcionalidade futura)*

Ao registrar um **alerta de risco**, a usuária poderá **escolher se deseja acionar uma viatura imediatamente**.

Esse acionamento funcionará de forma estratégica:

- A viatura mais próxima e disponível será **notificada automaticamente**.Add commentMore actions
- Caso todas as viaturas estejam ocupadas, o alerta **entrará em uma fila de ocorrências**, priorizada por **grau de risco e proximidade**.
- A usuária poderá acompanhar em tempo real o **status do atendimento** (em andamento, aguardando ou finalizado).

Essa funcionalidade visa garantir uma **resposta rápida, eficiente e integrada com os serviços de segurança pública**, ampliando a proteção no momento mais crítico.
---

## 🛠️ Como rodar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/guardia-df.git
   cd guardia-df

2. Instale as dependências: 

    ```bash
    npm install

3. Instale o Expo CLI (caso ainda não tenha): 
    ```bash
    npm install -g expo-cli
4. Inicie o servidor de desenvolvimento: 
    ```bash
    npx expo start