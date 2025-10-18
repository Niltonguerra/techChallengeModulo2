import React from 'react';
import { ScrollView, FlatList,StyleSheet } from 'react-native';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import CardUser from './CardUser/CardUser';
import CardPost from './CardPost/CardPost';

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
      <FlatList
        data={dados} // array de itens
        keyExtractor={(item) => item.id} // chave única para cada item
        renderItem={({ item }) => (
            <CardPost isEditable={true} dataProperties={{
              id: '39eed3a6-20d2-42fb-8aaf-08f45d2df410nilton',
              title: 'geografia, o mundo e suas diferentes culturas',
              description: 'A geografia é a ciência que estuda a superfície terrestre e as relações que os seres humanos estabelecem com o espaço em que vivem. Ela vai além da descrição de rios, montanhas e climas, pois busca compreender como o ambiente influencia a vida das pessoas e, ao mesmo tempo, como as sociedades transformam os espaços ao longo da história. Essa disciplina é fundamental para entender o mundo em sua diversidade, tanto natural quanto cultural.\n\nO planeta é formado por diferentes paisagens, climas, vegetações e recursos, e isso resulta em modos distintos de viver. Regiões de clima frio, como o Ártico, moldaram culturas baseadas na caça, pesca e uso de roupas pesadas. Já em áreas tropicais, como a Amazônia, as populações desenvolveram formas de convivência ligadas à floresta, aproveitando sua biodiversidade. Em desertos, como o Saara, surgiram povos adaptados à escassez de água, que criaram rotas de comércio e modos de sobrevivência específicos. Cada ambiente natural contribuiu para a formação de práticas, costumes e organizações sociais próprias.\n\nAlém dos fatores físicos, a geografia cultural destaca como as sociedades produzem e compartilham valores, crenças, tradições e identidades. A diversidade cultural é uma das maiores riquezas da humanidade: línguas, religiões, artes, músicas, culinárias e modos de vestir revelam como cada povo interpreta e representa o mundo. Culturas orientais, por exemplo, preservam tradições milenares ligadas ao equilíbrio espiritual e à coletividade. Já culturas ocidentais deram maior destaque ao individualismo e ao progresso técnico. Mesmo com diferenças, todas expressam formas legítimas de existir e merecem respeito.\n\nNo mundo atual, marcado pela globalização, culturas e economias se conectam de maneira intensa. Produtos, informações e ideias circulam rapidamente, aproximando sociedades que antes estavam distantes. Esse processo facilita o contato entre diferentes povos e amplia o intercâmbio cultural, mas também pode gerar conflitos e ameaçar tradições locais, já que a homogeneização cultural tende a enfraquecer costumes mais antigos. Assim, o desafio contemporâneo é equilibrar a integração mundial com a preservação da diversidade cultural.\n\nA geografia, portanto, ajuda a refletir sobre essas questões. Ao estudar o espaço, revela como as sociedades se organizam, como utilizam os recursos naturais e como se relacionam entre si. Ela mostra que compreender as diferenças culturais é essencial para a convivência pacífica e para a construção de um mundo mais justo. Reconhecer a pluralidade do planeta significa valorizar a identidade de cada povo e, ao mesmo tempo, compreender que todos compartilham a mesma casa comum: a Terra.',
              introduction: 'Um mapa-múndi é uma representação cartográfica de toda a superfície do planeta Terra em uma superfície plana reduzida. O mapa do mundo, portanto, retrata de uma só vez todos os seis continentes e os cinco oceanos terrestres em escala reduzida, apresentando baixo grau de detalhamento.',
              imageUrl: 'https://i.ibb.co/MDs70Rb8/mapa-mundi.webp',
              content_hashtags: ["#geografia","#cultura"],
              author: 'luis-gu10@hotmail.com',
              created_at: '2025-10-04T16:42:10.364Z',
              updated_at: '2025-10-04T16:42:10.364Z',
              authorEmail: 'luis-gu10@hotmail.com',
              external_link: {'Wikipedia': 'https://pt.wikipedia.org/wiki/Geografia'}
            }} />
        )}
      />
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
