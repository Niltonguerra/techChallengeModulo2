import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { RequestUser } from '@/types/login';
import { loginUserService } from '@/services/user';
import { getHashtags, getListById, getListTodos } from '@/services/post';
import { Post } from '@/types/post';

const CardPost = () => {
  const [data, setData] = useState<any | null>();
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSend:RequestUser = {
          email:'niltondg.39@gmail.com',
          password: 'ndg.100502'
        } 
        const result = await getListById('39eed3a6-20d2-42fb-8aaf-08f45d2df410');
        setData(result.ListPost[0].title);
      } catch (error) {
        setErro(error.message || 'Erro ao carregar dados');
      }
    };

    fetchData();
  }, []);

  return (
    <Card style={{ marginVertical: 8 }}>
      <Card.Content>
        {erro ? (
          <Text variant="titleLarge">Erro: {erro}</Text>
        ) : data ? (
          <>
            <Text variant="titleLarge">{data}</Text>

          </>
        ) : (
          <Text variant="titleLarge">Carregando...</Text>
        )}
      </Card.Content>
      <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
};

export default CardPost;
