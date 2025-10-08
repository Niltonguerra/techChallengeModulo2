import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const CardHome = () => (
  <Card style={{marginVertical:8 }}>
    <Card.Content>
      <Text variant="titleLarge">Card title</Text>
      <Text variant="bodyMedium">Card content</Text>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

export default CardHome;