import React from 'react';
// import { ScrollView, FlatList,StyleSheet } from 'react-native';
// import { ExternalLink } from './ExternalLink';
// import { MonoText } from './StyledText';
// import { Text, View } from './Themed';
import { View } from './Themed';
// import Colors from '@/constants/Colors';
// import CardUser from './CardUser';
// import CardPost from './CardPost';

export default function EditScreenInfo({ path }: { path: string }) {
  const dados = [
    { id: '1', nome: 'Item 1' },
    { id: '2', nome: 'Item 2' },
    { id: '3', nome: 'Item 3' },
    { id: '4', nome: 'Item 4' },
    // Adicione mais itens
  ];
  return (
    <View>
      {/* <FlatList
        data={dados} // array de itens
        keyExtractor={(item) => item.id} // chave única para cada item
        renderItem={({ item }) => (
            <CardPost></CardPost>
        )}
      /> */}
    </View>
  );
}

// const styles = StyleSheet.create({
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightContainer: {
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   helpContainer: {
//     marginTop: 15,
//     marginHorizontal: 20,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     textAlign: 'center',
//   },
// });
