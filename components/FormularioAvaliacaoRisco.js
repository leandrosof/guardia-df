import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Colors from "../constants/Colors";

// Componente Checkbox simples para React Native
const Checkbox = ({ label, value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={checkboxStyles.container}
      onPress={() => onValueChange(!value)}
    >
      <View style={[checkboxStyles.checkbox, value && checkboxStyles.checked]}>
        {value && <Text style={checkboxStyles.checkmark}>✓</Text>}
      </View>
      <Text style={checkboxStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.light.mediumGrey,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  checked: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint
  },
  checkmark: {
    color: Colors.light.white,
    fontSize: 14,
    fontWeight: "bold"
  },
  label: {
    fontSize: 16,
    flexShrink: 1,
    color: Colors.light.text
  }
});

function FormularioAvaliacaoRisco({ onFormSubmit }) {
  const [respostas, setRespostas] = useState({
    // Bloco I
    ameacaAgressor: {
      armaFogo: false,
      faca: false,
      outraForma: false,
      nenhuma: false
    },
    agressoesFisicas2A: {
      soco: false,
      chute: false,
      tapa: false,
      empurrao: false,
      puxaoCabelo: false,
      outra: false,
      nenhuma: false
    },
    agressoesFisicas2B: {
      queimadura: false,
      enforcamento: false,
      sufocamento: false,
      estrangulamento: false,
      tiro: false,
      afogamento: false,
      facada: false,
      paulada: false,
      nenhuma: false
    },
    atendimentoMedico: { medico: false, internacao: false, nao: false },
    relacoesSexuaisForcadas: false,
    perseguicaoCiumenta: false,
    comportamentosAgressor6: {
      fraseSeNaoForMinha: false,
      perturbarVigiar: false,
      proibirVisitarFamiliares: false,
      proibirTrabalharEstudar: false,
      telefonemasInsistentes: false,
      impedirAcessoDinheiro: false,
      outrosCiúmesControle: false,
      proibirIrMedico: false,
      nenhum: false
    },
    registroOcorrenciaPolicial: { df: false, foraDf: false, nao: false },
    descumprimentoMedidaProtetiva: false,
    agressoesMaisFrequentes: false,
    // Bloco II
    usoAbusivoAlcoolDrogasMedicamentos: {
      alcool: false,
      drogas: false,
      medicamentos: false,
      nao: false,
      naoSei: false
    },
    doencaMentalAgressor: {
      simComMedicacao: false,
      simSemMedicacao: false,
      nao: false,
      naoSei: false
    },
    tentativaSuicidioAgressor: false,
    dificuldadesFinanceirasAgressor: false,
    usoArmaFogoAgressor13: {
      usou: false,
      ameacouUsar: false,
      facilAcesso: false,
      nao: false,
      naoSei: false
    },
    ameacaAgressaoFilhosOutros: {
      filhos: false,
      outrosFamiliares: false,
      amigos: false,
      colegasTrabalho: false,
      outrasPessoas: false,
      animais: false,
      nao: false,
      naoSei: false
    },
    // Bloco III
    separouRecentemente: false,
    temFilhos: {
      comAgressor: false,
      outroRelacionamento: false,
      nenhum: false
    },
    conflitoGuardaFilhos: false,
    filhosPresenciaramViolencia: false,
    violenciaDuranteGravidez: false,
    gravidaOuBebeRecente: false,
    novoRelacionamentoAumentoAgressao: false,
    deficienciaOuDoencaDegenerativa: false,
    mulherIdosa: false,
    corRaca: {
      preta: false,
      parda: false,
      indigena: false,
      amarelaOriental: false,
      branca: false
    },
    isoladaAmigosFamiliares: false
  });

  const [pontuacaoRisco, setPontuacaoRisco] = useState(0);
  const [nivelRisco, setNivelRisco] = useState("NÃO AVALIADO");

  const handleChange = (parentKey, childKey, value) => {
    setRespostas((prev) => ({
      ...prev,
      [parentKey]:
        childKey !== undefined
          ? { ...prev[parentKey], [childKey]: value }
          : value
    }));
  };

  useEffect(() => {
    let pontos = 0;

    // Bloco I
    // 1-A e 1-B
    if (
      respostas.ameacaAgressor.armaFogo ||
      respostas.ameacaAgressor.faca ||
      respostas.ameacaAgressor.outraForma
    ) {
      pontos += 1;
    }

    // 2-A
    if (
      respostas.agressoesFisicas2A.soco ||
      respostas.agressoesFisicas2A.chute ||
      respostas.agressoesFisicas2A.tapa ||
      respostas.agressoesFisicas2A.empurrao ||
      respostas.agressoesFisicas2A.puxaoCabelo ||
      respostas.agressoesFisicas2A.outra
    ) {
      pontos += 1;
    }

    // 2-B e 3 (combinadas)
    let agressaoGrave2B_3 = false;
    if (
      respostas.agressoesFisicas2B.queimadura ||
      respostas.agressoesFisicas2B.enforcamento ||
      respostas.agressoesFisicas2B.sufocamento ||
      respostas.agressoesFisicas2B.estrangulamento ||
      respostas.agressoesFisicas2B.tiro ||
      respostas.agressoesFisicas2B.afogamento ||
      respostas.agressoesFisicas2B.facada ||
      respostas.agressoesFisicas2B.paulada
    ) {
      agressaoGrave2B_3 = true;
    }
    if (
      respostas.atendimentoMedico.medico ||
      respostas.atendimentoMedico.internacao
    ) {
      agressaoGrave2B_3 = true;
    }
    if (agressaoGrave2B_3) {
      pontos += 1;
    }

    // 4. Obrigações sexuais
    if (respostas.relacoesSexuaisForcadas) {
      pontos += 1;
    }

    // 5 e 6 (combinadas)
    let ciumeControle5_6 = false;
    if (respostas.perseguicaoCiumenta) {
      ciumeControle5_6 = true;
    }
    if (
      respostas.comportamentosAgressor6.fraseSeNaoForMinha ||
      respostas.comportamentosAgressor6.perturbarVigiar ||
      respostas.comportamentosAgressor6.proibirVisitarFamiliares ||
      respostas.comportamentosAgressor6.proibirTrabalharEstudar ||
      respostas.comportamentosAgressor6.telefonemasInsistentes ||
      respostas.comportamentosAgressor6.impedirAcessoDinheiro ||
      respostas.comportamentosAgressor6.outrosCiúmesControle ||
      respostas.comportamentosAgressor6.proibirIrMedico
    ) {
      ciumeControle5_6 = true;
    }
    if (ciumeControle5_6) {
      pontos += 1;
    }

    // 7-A. Já registrou ocorrência policial ou pedido de medida protetiva?
    if (
      respostas.registroOcorrenciaPolicial.df ||
      respostas.registroOcorrenciaPolicial.foraDf
    ) {
      pontos += 1;
    }

    // 7-B. Agressor já descumpriu medida protetiva?
    if (respostas.descumprimentoMedidaProtetiva) {
      pontos += 1;
    }

    // 8. Agressões/ameaças mais frequentes/graves nos últimos meses?
    if (respostas.agressoesMaisFrequentes) {
      pontos += 1;
    }

    // Bloco II
    // 9. Uso abusivo de álcool ou de drogas ou de medicamentos?
    if (
      respostas.usoAbusivoAlcoolDrogasMedicamentos.alcool ||
      respostas.usoAbusivoAlcoolDrogasMedicamentos.drogas ||
      respostas.usoAbusivoAlcoolDrogasMedicamentos.medicamentos
    ) {
      pontos += 1;
    }

    // 10. Agressor tem doença mental comprovada?
    if (
      respostas.doencaMentalAgressor.simComMedicacao ||
      respostas.doencaMentalAgressor.simSemMedicacao
    ) {
      pontos += 1;
    }

    // 11. Agressor já tentou suicídio ou falou em suicidar-se?
    if (respostas.tentativaSuicidioAgressor) {
      pontos += 1;
    }

    // 12. Agressor com dificuldades financeiras/desempregado?
    if (respostas.dificuldadesFinanceirasAgressor) {
      pontos += 1;
    }

    // 13. Agressor já usou, ameaçou usar arma de fogo ou tem fácil acesso a uma arma?
    if (respostas.usoArmaFogoAgressor13.facilAcesso) {
      pontos += 1;
    }

    // 14. Agressor já ameaçou ou agrediu filhos, outros familiares, amigos, colegas, outras pessoas ou animais?
    if (
      respostas.ameacaAgressaoFilhosOutros.filhos ||
      respostas.ameacaAgressaoFilhosOutros.outrosFamiliares ||
      respostas.ameacaAgressaoFilhosOutros.amigos ||
      respostas.ameacaAgressaoFilhosOutros.colegasTrabalho ||
      respostas.ameacaAgressaoFilhosOutros.outrasPessoas ||
      respostas.ameacaAgressaoFilhosOutros.animais
    ) {
      pontos += 1;
    }

    // Bloco III
    // 15. Separou recentemente do(a) agressor(a)?
    if (respostas.separouRecentemente) {
      pontos += 1;
    }

    // 16-A. Você tem filhos? (Apenas "Sim, de outro relacionamento" conta)
    if (respostas.temFilhos.outroRelacionamento) {
      pontos += 1;
    }

    // 17. Conflito com agressor em relação à guarda/visitas/pensão de filho(s)?
    if (respostas.conflitoGuardaFilhos) {
      pontos += 1;
    }

    // 18. Filho(s) já presenciaram ato(s) de violência?
    if (respostas.filhosPresenciaramViolencia) {
      pontos += 1;
    }

    // 19 e 20 (combinadas)
    let violenciaGravidez19_20 = false;
    if (respostas.violenciaDuranteGravidez) {
      violenciaGravidez19_20 = true;
    }
    if (respostas.gravidaOuBebeRecente) {
      violenciaGravidez19_20 = true;
    }
    if (violenciaGravidez19_20) {
      pontos += 1;
    }

    // 21. Novo relacionamento, e ameaças/agressões aumentaram?
    if (respostas.novoRelacionamentoAumentoAgressao) {
      pontos += 1;
    }

    // 22. Possui alguma deficiência ou doença degenerativa? E 22-B. Mulher idosa? (combinadas)
    let vulnerabilidade22_22B = false;
    if (respostas.deficienciaOuDoencaDegenerativa) {
      vulnerabilidade22_22B = true;
    }
    if (respostas.mulherIdosa) {
      vulnerabilidade22_22B = true;
    }
    if (vulnerabilidade22_22B) {
      pontos += 1;
    }

    // 23. Cor/raça (Preta, Parda, Indígena)
    if (
      respostas.corRaca.preta ||
      respostas.corRaca.parda ||
      respostas.corRaca.indigena
    ) {
      pontos += 1;
    }

    // 28. Sente-se isolada?
    if (respostas.isoladaAmigosFamiliares) {
      pontos += 1;
    }

    setPontuacaoRisco(pontos);

    // Determinar o nível de risco
    const isRiscoExtremoGatilho =
      respostas.ameacaAgressor.armaFogo ||
      respostas.ameacaAgressor.faca || // 1-A
      respostas.agressoesFisicas2B.queimadura ||
      respostas.agressoesFisicas2B.enforcamento ||
      respostas.agressoesFisicas2B.sufocamento ||
      respostas.agressoesFisicas2B.estrangulamento ||
      respostas.agressoesFisicas2B.tiro ||
      respostas.agressoesFisicas2B.afogamento ||
      respostas.agressoesFisicas2B.facada ||
      respostas.agressoesFisicas2B.paulada || // 2-B
      respostas.comportamentosAgressor6.fraseSeNaoForMinha || // 6a
      respostas.comportamentosAgressor6.perturbarVigiar || // 6b
      respostas.comportamentosAgressor6.proibirVisitarFamiliares; // 6c

    if (isRiscoExtremoGatilho || pontos > 15) {
      setNivelRisco("RISCO EXTREMO"); // Situação iminente de violência física grave ou potencialmente letal, a justificar acompanhamento próximo e imediato pelos órgãos de proteção.
    } else if (pontos >= 8) {
      setNivelRisco("RISCO GRAVE"); // Situação atual de violências sérias, mas sem indicadores de risco iminente de violência física grave ou potencialmente, que podem, todavia, evoluir para o risco extremo.
    } else if (pontos >= 3) {
      setNivelRisco("RISCO MODERADO"); // Situação atual de violências sérias sem indicadores de risco iminente de violências físicas graves ou potencialmente letais, ou de possível progressão para risco iminente.
    } else {
      setNivelRisco("BAIXO RISCO APARENTE");
    }
  }, [respostas]);

  const handleSubmit = () => {
    if (onFormSubmit) {
      onFormSubmit(pontuacaoRisco, nivelRisco);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        FORMULÁRIO NACIONAL DE AVALIAÇÃO DE RISCO
      </Text>
      <Text style={styles.subtitle}>(Adaptação para Demonstração)</Text>
      <Text style={styles.infoText}>
        Original aprovado pela Resolução Conjunta CNJ e CNMP n. 05/2020.{" "}
      </Text>

      <Text style={styles.blockTitle}>
        Bloco I: Sobre o histórico de violência
      </Text>

      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          O agressor(a) já ameaçou você ou algum familiar com a finalidade de
          atingi-la?
        </Text>
        <Checkbox
          label="Sim, utilizando arma de fogo"
          value={respostas.ameacaAgressor.armaFogo}
          onValueChange={(val) =>
            handleChange("ameacaAgressor", "armaFogo", val)
          }
        />
        <Checkbox
          label="Sim, utilizando faca"
          value={respostas.ameacaAgressor.faca}
          onValueChange={(val) => handleChange("ameacaAgressor", "faca", val)}
        />
        <Checkbox
          label="Sim, de outra forma"
          value={respostas.ameacaAgressor.outraForma}
          onValueChange={(val) =>
            handleChange("ameacaAgressor", "outraForma", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.ameacaAgressor.nenhuma}
          onValueChange={(val) =>
            handleChange("ameacaAgressor", "nenhuma", val)
          }
        />
      </View>

      {/* Questão 2-A */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          O agressor(a) já praticou alguma(s) destas agressões físicas contra
          você?{" "}
        </Text>
        <Checkbox
          label="Soco"
          value={respostas.agressoesFisicas2A.soco}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "soco", val)
          }
        />
        <Checkbox
          label="Chute"
          value={respostas.agressoesFisicas2A.chute}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "chute", val)
          }
        />
        <Checkbox
          label="Tapa"
          value={respostas.agressoesFisicas2A.tapa}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "tapa", val)
          }
        />
        <Checkbox
          label="Empurrão"
          value={respostas.agressoesFisicas2A.empurrao}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "empurrao", val)
          }
        />
        <Checkbox
          label="Puxão de cabelo"
          value={respostas.agressoesFisicas2A.puxaoCabelo}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "puxaoCabelo", val)
          }
        />
        <Checkbox
          label="Outra"
          value={respostas.agressoesFisicas2A.outra}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "outra", val)
          }
        />
        <Checkbox
          label="Nenhuma agressão física"
          value={respostas.agressoesFisicas2A.nenhuma}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2A", "nenhuma", val)
          }
        />
      </View>

      {/* Questão 2-B e 3 (combinadas para pontuação) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          O agressor(a) já praticou alguma(s) destas agressões físicas graves
          contra você?
        </Text>
        <Checkbox
          label="Queimadura"
          value={respostas.agressoesFisicas2B.queimadura}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "queimadura", val)
          }
        />
        <Checkbox
          label="Enforcamento"
          value={respostas.agressoesFisicas2B.enforcamento}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "enforcamento", val)
          }
        />
        <Checkbox
          label="Sufocamento"
          value={respostas.agressoesFisicas2B.sufocamento}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "sufocamento", val)
          }
        />
        <Checkbox
          label="Estrangulamento"
          value={respostas.agressoesFisicas2B.estrangulamento}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "estrangulamento", val)
          }
        />
        <Checkbox
          label="Tiro"
          value={respostas.agressoesFisicas2B.tiro}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "tiro", val)
          }
        />
        <Checkbox
          label="Afogamento"
          value={respostas.agressoesFisicas2B.afogamento}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "afogamento", val)
          }
        />
        <Checkbox
          label="Facada"
          value={respostas.agressoesFisicas2B.facada}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "facada", val)
          }
        />
        <Checkbox
          label="Paulada"
          value={respostas.agressoesFisicas2B.paulada}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "paulada", val)
          }
        />
        <Checkbox
          label="Nenhuma agressão física"
          value={respostas.agressoesFisicas2B.nenhuma}
          onValueChange={(val) =>
            handleChange("agressoesFisicas2B", "nenhuma", val)
          }
        />

        <Text style={[styles.questionText, { marginTop: 10 }]}>
          3. Você necessitou de atendimento médico e/ou internação após algumas
          dessas agressões?{" "}
        </Text>
        <Checkbox
          label="Sim, atendimento médico"
          value={respostas.atendimentoMedico.medico}
          onValueChange={(val) =>
            handleChange("atendimentoMedico", "medico", val)
          }
        />
        <Checkbox
          label="Sim, Internação"
          value={respostas.atendimentoMedico.internacao}
          onValueChange={(val) =>
            handleChange("atendimentoMedico", "internacao", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.atendimentoMedico.nao}
          onValueChange={(val) => handleChange("atendimentoMedico", "nao", val)}
        />
      </View>

      {/* Questão 4 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          4. O agressor(a) já obrigou você a ter relações sexuais ou praticar
          atos sexuais contra sua vontade?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.relacoesSexuaisForcadas}
          onValueChange={(val) =>
            handleChange("relacoesSexuaisForcadas", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.relacoesSexuaisForcadas}
          onValueChange={(val) =>
            handleChange("relacoesSexuaisForcadas", undefined, !val)
          }
        />
      </View>

      {/* Questão 5 e 6 (combinadas para pontuação) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          5. O agressor(a) persegue você, demonstra ciúme excessivo, tenta
          controlar sua vida e as coisas que você faz (aonde você vai, com quem
          conversa, o tipo de roupa que usa, etc.)?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.perseguicaoCiumenta}
          onValueChange={(val) =>
            handleChange("perseguicaoCiumenta", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.perseguicaoCiumenta &&
            respostas.perseguicaoCiumenta !== null
          }
          onValueChange={(val) =>
            handleChange("perseguicaoCiumenta", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.perseguicaoCiumenta === null}
          onValueChange={(val) =>
            handleChange("perseguicaoCiumenta", undefined, null)
          }
        />

        <Text style={[styles.questionText, { marginTop: 10 }]}>
          6. O agressor(a) já teve algum destes comportamentos?{" "}
        </Text>
        <Checkbox
          label='Disse algo parecido com a frase: "se não for minha, não será de mais ninguém"'
          value={respostas.comportamentosAgressor6.fraseSeNaoForMinha}
          onValueChange={(val) =>
            handleChange("comportamentosAgressor6", "fraseSeNaoForMinha", val)
          }
        />
        <Checkbox
          label="Perturbou, perseguiu ou vigiou você nos locais que frequenta"
          value={respostas.comportamentosAgressor6.perturbarVigiar}
          onValueChange={(val) =>
            handleChange("comportamentosAgressor6", "perturbarVigiar", val)
          }
        />
        <Checkbox
          label="Proibiu você de visitar familiares ou amigos"
          value={respostas.comportamentosAgressor6.proibirVisitarFamiliares}
          onValueChange={(val) =>
            handleChange(
              "comportamentosAgressor6",
              "proibirVisitarFamiliares",
              val
            )
          }
        />
        <Checkbox
          label="Proibiu você de trabalhar ou estudar"
          value={respostas.comportamentosAgressor6.proibirTrabalharEstudar}
          onValueChange={(val) =>
            handleChange(
              "comportamentosAgressor6",
              "proibirTrabalharEstudar",
              val
            )
          }
        />
        <Checkbox
          label="Fez telefonemas, enviou mensagens pelo celular ou e-mails de forma insistente"
          value={respostas.comportamentosAgressor6.telefonemasInsistentes}
          onValueChange={(val) =>
            handleChange(
              "comportamentosAgressor6",
              "telefonemasInsistentes",
              val
            )
          }
        />
        <Checkbox
          label="Impediu você de ter acesso a dinheiro, conta bancária ou outros bens"
          value={respostas.comportamentosAgressor6.impedirAcessoDinheiro}
          onValueChange={(val) =>
            handleChange(
              "comportamentosAgressor6",
              "impedirAcessoDinheiro",
              val
            )
          }
        />
        <Checkbox
          label="Teve outros comportamentos de ciúme excessivo e de controle sobre você"
          value={respostas.comportamentosAgressor6.outrosCiúmesControle}
          onValueChange={(val) =>
            handleChange("comportamentosAgressor6", "outrosCiúmesControle", val)
          }
        />
        <Checkbox
          label="Proibiu você de ir ao médico ou pedir ajuda a outros profissionais"
          value={respostas.comportamentosAgressor6.proibirIrMedico}
          onValueChange={(val) =>
            handleChange("comportamentosAgressor6", "proibirIrMedico", val)
          }
        />
        <Checkbox
          label="Nenhum dos comportamentos acima listados"
          value={respostas.comportamentosAgressor6.nenhum}
          onValueChange={(val) =>
            handleChange("comportamentosAgressor6", "nenhum", val)
          }
        />
      </View>

      {/* Questão 7-A */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          7- Você já registrou ocorrência policial ou formulou pedido de medida
          protetiva de urgência envolvendo esse(a) mesmo(a) agressor(a)?
        </Text>
        <Checkbox
          label="Sim, no DF"
          value={respostas.registroOcorrenciaPolicial.df}
          onValueChange={(val) =>
            handleChange("registroOcorrenciaPolicial", "df", val)
          }
        />
        <Checkbox
          label="Sim, fora do DF"
          value={respostas.registroOcorrenciaPolicial.foraDf}
          onValueChange={(val) =>
            handleChange("registroOcorrenciaPolicial", "foraDf", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.registroOcorrenciaPolicial.nao}
          onValueChange={(val) =>
            handleChange("registroOcorrenciaPolicial", "nao", val)
          }
        />
      </View>

      {/* Questão 7-B */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          7- O agressor(a) já descumpriu medida protetiva anteriormente?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.descumprimentoMedidaProtetiva}
          onValueChange={(val) =>
            handleChange("descumprimentoMedidaProtetiva", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.descumprimentoMedidaProtetiva &&
            respostas.descumprimentoMedidaProtetiva !== null
          }
          onValueChange={(val) =>
            handleChange("descumprimentoMedidaProtetiva", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.descumprimentoMedidaProtetiva === null}
          onValueChange={(val) =>
            handleChange("descumprimentoMedidaProtetiva", undefined, null)
          }
        />
      </View>

      {/* Questão 8 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          8. As agressões ou ameaças do agressor(a) contra você se tornaram mais
          frequentes ou mais graves nos últimos meses?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.agressoesMaisFrequentes}
          onValueChange={(val) =>
            handleChange("agressoesMaisFrequentes", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.agressoesMaisFrequentes &&
            respostas.agressoesMaisFrequentes !== null
          }
          onValueChange={(val) =>
            handleChange("agressoesMaisFrequentes", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.agressoesMaisFrequentes === null}
          onValueChange={(val) =>
            handleChange("agressoesMaisFrequentes", undefined, null)
          }
        />
      </View>

      <Text style={styles.blockTitle}>Bloco II: Sobre o(a) agressor(a)</Text>

      {/* Questão 9 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          9. O agressor(a) faz uso abusivo de álcool ou de drogas ou de
          medicamentos?
        </Text>
        <Checkbox
          label="Sim, de álcool"
          value={respostas.usoAbusivoAlcoolDrogasMedicamentos.alcool}
          onValueChange={(val) =>
            handleChange("usoAbusivoAlcoolDrogasMedicamentos", "alcool", val)
          }
        />
        <Checkbox
          label="Sim, de drogas"
          value={respostas.usoAbusivoAlcoolDrogasMedicamentos.drogas}
          onValueChange={(val) =>
            handleChange("usoAbusivoAlcoolDrogasMedicamentos", "drogas", val)
          }
        />
        <Checkbox
          label="Sim, de medicamentos"
          value={respostas.usoAbusivoAlcoolDrogasMedicamentos.medicamentos}
          onValueChange={(val) =>
            handleChange(
              "usoAbusivoAlcoolDrogasMedicamentos",
              "medicamentos",
              val
            )
          }
        />
        <Checkbox
          label="Não"
          value={respostas.usoAbusivoAlcoolDrogasMedicamentos.nao}
          onValueChange={(val) =>
            handleChange("usoAbusivoAlcoolDrogasMedicamentos", "nao", val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.usoAbusivoAlcoolDrogasMedicamentos.naoSei}
          onValueChange={(val) =>
            handleChange("usoAbusivoAlcoolDrogasMedicamentos", "naoSei", val)
          }
        />
      </View>

      {/* Questão 10 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          10. O agressor(a) tem alguma doença mental comprovada por avaliação
          médica?
        </Text>
        <Checkbox
          label="Sim e faz uso de medicação"
          value={respostas.doencaMentalAgressor.simComMedicacao}
          onValueChange={(val) =>
            handleChange("doencaMentalAgressor", "simComMedicacao", val)
          }
        />
        <Checkbox
          label="Sim e não faz uso de medicação"
          value={respostas.doencaMentalAgressor.simSemMedicacao}
          onValueChange={(val) =>
            handleChange("doencaMentalAgressor", "simSemMedicacao", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.doencaMentalAgressor.nao}
          onValueChange={(val) =>
            handleChange("doencaMentalAgressor", "nao", val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.doencaMentalAgressor.naoSei}
          onValueChange={(val) =>
            handleChange("doencaMentalAgressor", "naoSei", val)
          }
        />
      </View>

      {/* Questão 11 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          11. O agressor(a) já tentou suicídio ou falou em suicidar-se?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.tentativaSuicidioAgressor}
          onValueChange={(val) =>
            handleChange("tentativaSuicidioAgressor", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.tentativaSuicidioAgressor &&
            respostas.tentativaSuicidioAgressor !== null
          }
          onValueChange={(val) =>
            handleChange("tentativaSuicidioAgressor", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.tentativaSuicidioAgressor === null}
          onValueChange={(val) =>
            handleChange("tentativaSuicidioAgressor", undefined, null)
          }
        />
      </View>

      {/* Questão 12 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          12. O agressor(a) está com dificuldades financeiras, está desempregado
          ou tem dificuldade de se manter no emprego?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.dificuldadesFinanceirasAgressor}
          onValueChange={(val) =>
            handleChange("dificuldadesFinanceirasAgressor", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.dificuldadesFinanceirasAgressor &&
            respostas.dificuldadesFinanceirasAgressor !== null
          }
          onValueChange={(val) =>
            handleChange("dificuldadesFinanceirasAgressor", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.dificuldadesFinanceirasAgressor === null}
          onValueChange={(val) =>
            handleChange("dificuldadesFinanceirasAgressor", undefined, null)
          }
        />
      </View>

      {/* Questão 13 (parcialmente, apenas fácil acesso conta como novo ponto) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          13. O agressor(a) tem fácil acesso a uma arma (não considerando se já
          usou ou ameaçou usar, pois já contabilizado)?
        </Text>
        <Checkbox
          label="Sim, tem fácil acesso"
          value={respostas.usoArmaFogoAgressor13.facilAcesso}
          onValueChange={(val) =>
            handleChange("usoArmaFogoAgressor13", "facilAcesso", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.usoArmaFogoAgressor13.nao}
          onValueChange={(val) =>
            handleChange("usoArmaFogoAgressor13", "nao", val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.usoArmaFogoAgressor13.naoSei}
          onValueChange={(val) =>
            handleChange("usoArmaFogoAgressor13", "naoSei", val)
          }
        />
      </View>

      {/* Questão 14 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          14. O agressor(a) já ameaçou ou agrediu seus filhos, outros
          familiares, amigos, colegas de trabalho, pessoas desconhecidas ou
          animais?{" "}
        </Text>
        <Checkbox
          label="Sim, filhos"
          value={respostas.ameacaAgressaoFilhosOutros.filhos}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "filhos", val)
          }
        />
        <Checkbox
          label="Sim, outros familiares"
          value={respostas.ameacaAgressaoFilhosOutros.outrosFamiliares}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "outrosFamiliares", val)
          }
        />
        <Checkbox
          label="Sim, amigos"
          value={respostas.ameacaAgressaoFilhosOutros.amigos}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "amigos", val)
          }
        />
        <Checkbox
          label="Sim, colegas de trabalho"
          value={respostas.ameacaAgressaoFilhosOutros.colegasTrabalho}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "colegasTrabalho", val)
          }
        />
        <Checkbox
          label="Sim, outras pessoas"
          value={respostas.ameacaAgressaoFilhosOutros.outrasPessoas}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "outrasPessoas", val)
          }
        />
        <Checkbox
          label="Sim, animais"
          value={respostas.ameacaAgressaoFilhosOutros.animais}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "animais", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.ameacaAgressaoFilhosOutros.nao}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "nao", val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.ameacaAgressaoFilhosOutros.naoSei}
          onValueChange={(val) =>
            handleChange("ameacaAgressaoFilhosOutros", "naoSei", val)
          }
        />
      </View>

      <Text style={styles.blockTitle}>Bloco III: Sobre você</Text>

      {/* Questão 15 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          15. Você se separou recentemente do agressor(a), tentou ou manifestou
          intenção de se separar?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.separouRecentemente}
          onValueChange={(val) =>
            handleChange("separouRecentemente", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.separouRecentemente}
          onValueChange={(val) =>
            handleChange("separouRecentemente", undefined, !val)
          }
        />
      </View>

      {/* Questão 16-A (apenas "filhos de outro relacionamento" conta) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>16-A. Você tem filhos? </Text>
        <Checkbox
          label="Sim, com o agressor"
          value={respostas.temFilhos.comAgressor}
          onValueChange={(val) => handleChange("temFilhos", "comAgressor", val)}
        />
        <Checkbox
          label="Sim, de outro relacionamento"
          value={respostas.temFilhos.outroRelacionamento}
          onValueChange={(val) =>
            handleChange("temFilhos", "outroRelacionamento", val)
          }
        />
        <Checkbox
          label="Não"
          value={respostas.temFilhos.nenhum}
          onValueChange={(val) => handleChange("temFilhos", "nenhum", val)}
        />
      </View>

      {/* Questão 17 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          17. Você está vivendo algum conflito com o(a) agressor(a) em relação à
          guarda do(s) filho(s), visitas ou pagamento de pensão?{" "}
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.conflitoGuardaFilhos}
          onValueChange={(val) =>
            handleChange("conflitoGuardaFilhos", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.conflitoGuardaFilhos &&
            respostas.conflitoGuardaFilhos !== null
          }
          onValueChange={(val) =>
            handleChange("conflitoGuardaFilhos", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.conflitoGuardaFilhos === null}
          onValueChange={(val) =>
            handleChange("conflitoGuardaFilhos", undefined, null)
          }
        />
      </View>

      {/* Questão 18 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          18. Seu(s) filho(s) já presenciaram ato(s) de violência do(a)
          agressor(a) contra você?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.filhosPresenciaramViolencia}
          onValueChange={(val) =>
            handleChange("filhosPresenciaramViolencia", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.filhosPresenciaramViolencia}
          onValueChange={(val) =>
            handleChange("filhosPresenciaramViolencia", undefined, !val)
          }
        />
      </View>

      {/* Questão 19 e 20 (combinadas para pontuação) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          19. Você sofreu algum tipo de violência durante a gravidez ou nos três
          meses posteriores ao parto?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.violenciaDuranteGravidez}
          onValueChange={(val) =>
            handleChange("violenciaDuranteGravidez", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.violenciaDuranteGravidez}
          onValueChange={(val) =>
            handleChange("violenciaDuranteGravidez", undefined, !val)
          }
        />

        <Text style={[styles.questionText, { marginTop: 10 }]}>
          20. Você está grávida ou teve bebê nos últimos 18 meses?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.gravidaOuBebeRecente}
          onValueChange={(val) =>
            handleChange("gravidaOuBebeRecente", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.gravidaOuBebeRecente}
          onValueChange={(val) =>
            handleChange("gravidaOuBebeRecente", undefined, !val)
          }
        />
      </View>

      {/* Questão 21 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          21. Se você está em um novo relacionamento, percebeu que as ameaças ou
          as agressões físicas aumentaram em razão disso?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.novoRelacionamentoAumentoAgressao}
          onValueChange={(val) =>
            handleChange("novoRelacionamentoAumentoAgressao", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.novoRelacionamentoAumentoAgressao}
          onValueChange={(val) =>
            handleChange("novoRelacionamentoAumentoAgressao", undefined, !val)
          }
        />
      </View>

      {/* Questão 22 e 22-B (combinadas para pontuação) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          22. Você possui alguma deficiência ou doença degenerativa que
          acarretam condição limitante ou de vulnerabilidade física ou mental?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.deficienciaOuDoencaDegenerativa}
          onValueChange={(val) =>
            handleChange("deficienciaOuDoencaDegenerativa", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={!respostas.deficienciaOuDoencaDegenerativa}
          onValueChange={(val) =>
            handleChange("deficienciaOuDoencaDegenerativa", undefined, !val)
          }
        />

        <Text style={[styles.questionText, { marginTop: 10 }]}>
          22- Você se considera uma mulher idosa?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.mulherIdosa}
          onValueChange={(val) => handleChange("mulherIdosa", undefined, val)}
        />
        <Checkbox
          label="Não"
          value={!respostas.mulherIdosa}
          onValueChange={(val) => handleChange("mulherIdosa", undefined, !val)}
        />
      </View>

      {/* Questão 23 (Cor/Raça) */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          23. Com qual cor/raça você se identifica:
        </Text>
        <Checkbox
          label="preta"
          value={respostas.corRaca.preta}
          onValueChange={(val) => handleChange("corRaca", "preta", val)}
        />
        <Checkbox
          label="parda"
          value={respostas.corRaca.parda}
          onValueChange={(val) => handleChange("corRaca", "parda", val)}
        />
        <Checkbox
          label="indígena"
          value={respostas.corRaca.indigena}
          onValueChange={(val) => handleChange("corRaca", "indigena", val)}
        />
        <Checkbox
          label="amarela/oriental"
          value={respostas.corRaca.amarelaOriental}
          onValueChange={(val) =>
            handleChange("corRaca", "amarelaOriental", val)
          }
        />
        <Checkbox
          label="branca"
          value={respostas.corRaca.branca}
          onValueChange={(val) => handleChange("corRaca", "branca", val)}
        />
      </View>

      {/* Questão 28 */}
      <View style={styles.formSection}>
        <Text style={styles.questionText}>
          28. Você se sente isolada de amigos, familiares, pessoas da comunidade
          ou trabalho?
        </Text>
        <Checkbox
          label="Sim"
          value={respostas.isoladaAmigosFamiliares}
          onValueChange={(val) =>
            handleChange("isoladaAmigosFamiliares", undefined, val)
          }
        />
        <Checkbox
          label="Não"
          value={
            !respostas.isoladaAmigosFamiliares &&
            respostas.isoladaAmigosFamiliares !== null
          }
          onValueChange={(val) =>
            handleChange("isoladaAmigosFamiliares", undefined, !val)
          }
        />
        <Checkbox
          label="Não sei"
          value={respostas.isoladaAmigosFamiliares === null}
          onValueChange={(val) =>
            handleChange("isoladaAmigosFamiliares", undefined, null)
          }
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Finalizar Avaliação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.light.background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: Colors.light.text
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: Colors.light.mediumGrey
  },
  infoText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.mediumGrey
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderColor,
    paddingBottom: 5,
    color: Colors.light.primary
  },
  formSection: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.cardBackground
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.light.text
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  submitButtonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default FormularioAvaliacaoRisco;
