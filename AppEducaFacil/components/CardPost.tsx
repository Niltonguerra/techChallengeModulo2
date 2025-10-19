import { Post } from '@/types/post';
import * as React from 'react';
import { Button, Card, Text } from 'react-native-paper';

type CardPostProps = {
  post: Post;
};

const CardPost: React.FC<CardPostProps> = ({ post }) => {

  return (
    <Card style={{ marginVertical: 8 }}>
      {post.image && <Card.Cover source={{ uri: post.image }} />}
      <Card.Content>
        <Text variant="titleLarge">{post.title}</Text>
        <Text>{post.introduction}</Text>
      </Card.Content>
      <Card.Actions>
        <Button>Cancelar</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
};

export default CardPost;
