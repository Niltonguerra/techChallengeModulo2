import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useRouter } from "expo-router";
import styleGuide from "@/constants/styleGuide";
import { MaterialIcons } from "@expo/vector-icons";
import { FAQItem } from "@/types/faq";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export default function FAQ() {
  const router = useRouter();

  const faqData: FAQItem[] = [
    {
      question: "Como faço para criar uma conta?",
      answer:
        "Basta clicar em 'Registre-se aqui' na tela de login e preencher seus dados corretamente.",
    },
    {
      question: "Esqueci minha senha, o que fazer?",
      answer:
        "Clique em 'Esqueci minha senha' na tela de login, preencha o email que deseja recuperar a senha e siga as instruções enviadas por email.",
    },
    {
      question: "O aplicativo não carrega ou está lento, como resolver?",
      answer:
        "Verifique sua conexão com Wi-Fi ou dados móveis. Tente mudar de rede ou reiniciar o roteador/dispositivo.",
    },
    {
      question: "Como entro em contato com o suporte?",
      answer:
        "Você pode nos contatar pelo WhatsApp em (11) 93231-3383 ou pelo e-mail: educacaofacilfiap@gmail.com",
    },
    {
      question: "O app está travando ou fecha sozinho, o que fazer?",
      answer:
        "Feche e reabra o aplicativo, limpe o cache e verifique se há atualizações disponíveis. Se ainda travar, reinicie o dispositivo.",
    },
    {
      question: "Como atualizar meu perfil?",
      answer:
        "Após fazer login, na barra de navegação inferior clique na sua foto de perfil e depois em 'Editar Meu Perfil' para atualizar suas informações.",
    },
    {
      question:
        "Não estou recebendo o email de redefinição de senha ou validação de conta. O que fazer?",
      answer:
        "Verifique sua caixa de spam/lixo eletrônico. Adicione nosso email à lista de remetentes confiáveis. Se o problema persistir, entre em contato com o suporte.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topSpacer} />

      <Text style={styles.title}>Perguntas Frequentes (FAQ)</Text>

      {faqData.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <TouchableOpacity
            onPress={() => toggleExpand(index)}
            style={styles.questionContainer}
          >
            <Text style={styles.question}>{item.question}</Text>

            <MaterialIcons
              name={
                expandedIndex === index
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={24}
              color={styleGuide.palette.main.textPrimaryColor}
            />
          </TouchableOpacity>
          {expandedIndex === index && (
            <Text style={styles.answer}>{item.answer}</Text>
          )}
          <View style={styles.separator} />
        </View>
      ))}

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        © 2025 EducaFácil - Todos os direitos reservados.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleGuide.light.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topSpacer: {
    height: 50,
  },
  title: {
    ...styleGuide.typography.h2,
    textAlign: "center",
    marginBottom: 24,
    color: styleGuide.palette.main.primaryColor,
  },
  faqItem: {
    marginBottom: 12,
  },
  questionContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    ...styleGuide.typography.h4,
    color: styleGuide.palette.main.textPrimaryColor,
    flex: 1,
    flexShrink: 1,
  },
  answer: {
    ...styleGuide.typography.h5,
    marginTop: 6,
    lineHeight: 22,
    color: styleGuide.palette.main.textSecondaryColor,
  },
  separator: {
    height: 1,
    backgroundColor: styleGuide.light.tabIconDefault,
    marginTop: 10,
  },
  bottomButtonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: styleGuide.palette.main.secondColor,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    color: styleGuide.palette.main.textSecondaryColor,
    marginTop: 20,
    fontSize: 14,
  },
});
