import * as React from 'react';
import axios from 'axios';
import { Button, Card, Text } from 'react-native-paper';
import { CardPostType } from '@/types/cards';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';


const CardPost = (dataCard:CardPostType) => {

  return (
<Card style={{ marginVertical: 8 }}>
  <Card.Content>
    <Link href="/modal" asChild>
      <Pressable>
        <Text variant="titleLarge">{dataCard.dataProperties.title}</Text>
        <Card.Cover source={{ uri: dataCard.dataProperties.imageUrl }} />
        <Text variant="bodyMedium">{dataCard.dataProperties.introduction}</Text>
        <Text variant="bodySmall">
          {dataCard.dataProperties.content_hashtags.join(', ')}
        </Text>
        <Text variant="bodySmall">{dataCard.dataProperties.author}</Text>
        <Text variant="bodySmall">{dataCard.dataProperties.updated_at}</Text>
      </Pressable>
    </Link>

    {dataCard.isEditable && (
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    )}
  </Card.Content>
</Card>
  );
};


const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  title: {

    fontWeight: 'bold',
  },
  body: {
  },
});





export default CardPost;
