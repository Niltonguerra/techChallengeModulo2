import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { Post } from "@/types/post";
import styleGuide from "@/constants/styleGuide";
import { CarouselPostsProps } from "@/types/carrossel";

const { width } = Dimensions.get("window");

export default function CarouselPosts({ posts }: CarouselPostsProps) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (posts?.length) {
      setRecentPosts(posts.slice(0, 5));
    }
  }, [posts]);

  const handleOpen = (post: Post) => {
    router.push({
      pathname: "/PostDetail",
      params: { id: post.id },
    });
  };

  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3}
        autoplayLoop
        showPagination
        paginationStyleItem={styles.paginationItem}
        paginationActiveColor={styleGuide.palette.main.fourthColor}
        paginationDefaultColor={styleGuide.palette.main.textSecondaryColor}
        data={recentPosts}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.child}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.image}
              imageStyle={styles.imageBorder}
            >
              <LinearGradient
                colors={[
                  "rgba(0, 0, 0, 0.05)",
                  "rgba(0, 0, 0, 0.25)",
                  "rgba(0, 0, 0, 0.5)",
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.overlay}
              >
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleOpen(item)}
                >
                  <Text style={styles.buttonText}>Ir para Atividade</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
  },
  child: {
    width: width,
    height: 400,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageBorder: {
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
   ...styleGuide.typography.h3,
    color: styleGuide.palette.light.fourthLightColor,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: styleGuide.palette.main.secondColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
       ...styleGuide.typography.button,
    color: styleGuide.palette.light.fourthLightColor,
    fontWeight: "600",
  },
  paginationItem: {
    marginHorizontal: 4,
  },
});
