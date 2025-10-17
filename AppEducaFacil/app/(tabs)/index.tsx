import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import PostForm from '@/components/PostForm/form';
import { PaperProvider } from 'react-native-paper';

export default function TabOneScreen() {
  return (
    <View style={{height: '100%'}}>
      <PaperProvider>
        {/* //<< temp for dev. undo later
        <EditScreenInfo path="app/(tabs)/index.tsx" />
        */}
        <PostForm postId='mock'/>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
