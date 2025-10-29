import styleGuide from "@/constants/styleGuide";
import { useDeletePost } from "@/hooks/handleDeletePost/handleDeletePost";
import { CardPostProps } from "@/types/cards";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, TextStyle, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const CardPost = (dataCard: CardPostProps) => {
  const router = useRouter();
  const { handleDeletePost } = useDeletePost();

  const handleOpenDetail = () => {
    router.push({
      pathname: "/PostDetail" as const,
      params: { id: dataCard.dataProperties.id },
    });
  };

  const handleOpenEdit = () => {
    router.push({
      pathname: "/post/form" as const,
      params: { edit: dataCard.dataProperties.id },
    });
  };

  const onDeletePress = async () => {
    try {
      await handleDeletePost(dataCard.dataProperties.id);
      // Opcional: adicionar callback para atualizar lista
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      {/* Imagem de capa */}
      <Card.Cover source={{ uri: dataCard.dataProperties.image ?? "" }} />
      <Pressable
        onPress={handleOpenDetail}
        style={styles.cardContentLinkPressable}
      >
        <Card.Content style={styles.cardContent}>
          <Text style={styles.title}>{dataCard.dataProperties.title}</Text>
          <View style={styles.tagsContainer}>
            {dataCard.dataProperties.content_hashtags.map((tag, idx) => (
              <View key={`${tag}-${idx}`} style={styles.tag}>
                <Text style={styles.tagText}>
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.introduction}>
            {dataCard.dataProperties.introduction}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.authorName}>
              Autor: {dataCard.dataProperties.user_name}
            </Text>
            <View style={styles.dateRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color="#9ca3af"
              />
              <Text style={styles.date}>
                {new Date(
                  dataCard.dataProperties.updated_at
                ).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Pressable>
      {dataCard.isEditable && (
        <Card.Actions style={styles.btnContainer}>
          <Button
            labelStyle={styles.btnLabel}
            style={styles.btnEdit}
            onPress={handleOpenEdit}
          >
            Editar
          </Button>
          <Button
            labelStyle={styles.btnLabel}
            style={styles.btnDelete}
            onPress={onDeletePress}
          >
            Deletar
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: styleGuide.palette.main.fourthColor,
    borderRadius: 16,
    overflow: "hidden",
  },
  img: {
    marginBottom: 8,
    width: "100%",
    height: 180,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  cardContent: {},
  cardContentLinkPressable: {},
  title: {
    ...(styleGuide.typography.h3 as TextStyle),
    fontWeight: "bold",
    marginBottom: 8,
  },
  introduction: {
    ...(styleGuide.typography.h5 as TextStyle),
    fontSize: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: styleGuide.palette.main.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    ...(styleGuide.typography.h6 as TextStyle),
    color: styleGuide.palette.main.fourthColor,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  authorName: {
    ...(styleGuide.typography.h5 as TextStyle),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    ...(styleGuide.typography.h5 as TextStyle),
  },
  btnContainer: {
    paddingTop: 0,
    justifyContent: "flex-end",
  },
  btnLabel: {
    ...(styleGuide.typography.button as TextStyle),
  },
  btnEdit: {
    backgroundColor: styleGuide.palette.main.secondColor,
  },
  btnDelete: {
    backgroundColor: styleGuide.palette.main.primaryColor,
  },
});

export default CardPost;
