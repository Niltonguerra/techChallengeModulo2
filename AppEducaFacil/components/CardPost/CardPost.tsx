import * as React from 'react';
import { Button, Card, Text, Snackbar } from 'react-native-paper';
import { CardPostProps } from '@/types/cards';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextStyle, View } from 'react-native';
import styleGuide from '@/constants/styleGuide';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDeletePost } from '@/hooks/handleDeletePost/handleDeletePost';

const CardPost = (dataCard: CardPostProps) => {
  const { handleDeletePost } = useDeletePost();
  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Link href="/modal" asChild>
        <Pressable accessibilityRole="link" style={styles.cardContentLinkPressable}>
          {dataCard.dataProperties.image ? (
          <Card.Cover style={styles.img} source={{ uri: dataCard.dataProperties.image }} />
          ) : (
            <View style={[styles.img, styles.defaultIconContainer]}>
              <MaterialCommunityIcons name="image-off" size={80} color="#9ca3af" />
            </View>
          )}
          <Card.Content style={styles.cardContent}>
            <Text style={styles.title}>{dataCard.dataProperties.title}</Text>
            <View style={styles.tagsContainer}>
              {dataCard.dataProperties.content_hashtags.map((tag, idx) => (
                <View key={`${tag}-${idx}`} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.introduction}>{dataCard.dataProperties.introduction}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.authorName}>Autor: {dataCard.dataProperties.author}</Text>
              <View style={styles.dateRow}>
                <MaterialCommunityIcons name="calendar" size={16} color="#9ca3af" />
                <Text style={styles.date}>
                  {new Date(dataCard.dataProperties.updated_at).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Pressable>
      </Link>
      {dataCard.isEditable && (
        <Card.Actions style={styles.btnContainer}>
          <Link href="/modal" asChild>
            <Button labelStyle={styles.btnLabel} style={styles.btnEdit}>Editar</Button>
          </Link>
          <Button labelStyle={styles.btnLabel} style={styles.btnDelete} onPress={() => handleDeletePost(dataCard.dataProperties.id)}>
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
    overflow: 'hidden',
  },
  img: {
    marginBottom: 8,
    padding: 0,
    margin: 0,
    width: '100%',
    height: 180,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  defaultIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  cardContent: {},
  cardContentLinkPressable: {},
  title: {
    ...styleGuide.typography.h3 as TextStyle,
    fontWeight: 'bold',
    margin: 0,
    marginBottom: 8,
  },
  introduction: {
    ...styleGuide.typography.h5 as TextStyle,
    fontSize: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    ...styleGuide.typography.h6 as TextStyle,
    color: styleGuide.palette.main.fourthColor,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorName: {
    ...styleGuide.typography.h5 as TextStyle,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    ...styleGuide.typography.h5 as TextStyle,
  },
  btnContainer: {
    paddingTop: 0,
  },
  btnLabel: {
    ...styleGuide.typography.button as TextStyle,
  },
  btnEdit: {
    backgroundColor: styleGuide.palette.main.secondColor,
    borderWidth: 0,
  },
  btnDelete: {
    backgroundColor: styleGuide.palette.main.primaryColor,
  },
});

export default CardPost;
