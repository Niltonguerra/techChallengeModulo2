import { View } from "@/components/Themed";
import styleGuide from "@/constants/styleGuide";
import { getListById } from "@/services/post";
import { Post } from "@/types/post";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, TextStyle } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Divider, IconButton, Text } from "react-native-paper";

export default function PostDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [post, setPost] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getListById(id)
                .then((data) => setPost(data.ListPost))
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    if (error || !post)
        return (
            <View style={styles.errorContainer}>
                <Text>Post não encontrado ou erro ao carregar.</Text>
                <Button onPress={() => router.back()}>Voltar</Button>
            </View>
        );

    if (!post?.length) return <Text>Post não encontrado</Text>;

    const data = post[0];

    return (
        <View style={styles.wrapper}>
            {/* Botão de fechar fixo */}
            <IconButton
                icon="close"
                size={22}
                style={styles.closeButton}
                onPress={() => router.back()}
                iconColor={styleGuide.palette.main.fourthColor}
            />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Imagem de capa */}
                {data.image && (
                    <Card style={styles.imageCard} mode="elevated" elevation={2}>
                        <Card.Cover source={{ uri: data.image }} style={styles.image} />
                    </Card>
                )}

                {/* Título */}
                <Text variant="headlineLarge" style={styles.title}>
                    {data.title}
                </Text>

                {/* Autor e data */}
                <View style={styles.authorRow}>
                    <Avatar.Text
                        size={42}
                        label={data.user_name?.[0]?.toUpperCase() ?? "?"}
                        style={{ backgroundColor: styleGuide.palette.main.primaryColor }}
                    />
                    <View style={styles.authorTextRow}>
                        <Text style={styles.authorName}>{data.user_name ?? "Autor desconhecido"}</Text>
                        <Text style={styles.authorDate}>
                            {new Date(data.updated_at).toLocaleDateString("pt-BR")}
                        </Text>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    {data.content_hashtags.map((tag, idx) => (
                        <View key={`${tag}-${idx}`} style={styles.tag}>
                            <Text style={styles.tagText}>
                                {tag.startsWith("#") ? tag : `#${tag}`}
                            </Text>
                        </View>
                    ))}
                </View>

                <Divider style={{ marginVertical: 12 }} />

                {/* Introdução */}
                {data.introduction && (
                    <View style={{ marginBottom: 12 }}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Introdução</Text>
                        <Text variant="bodyMedium" style={styles.bodyText}>{data.introduction}</Text>
                    </View>
                )}

                {/* Descrição */}
                {data.description && (
                    <View style={{ marginBottom: 12 }}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Descrição</Text>
                        <Text variant="bodyMedium" style={styles.bodyText}>{data.description}</Text>
                    </View>
                )}

                {/* Links externos */}
                {data.external_link &&
                    Object.entries(data.external_link).map(([key, value]) => {
                        if (typeof value !== "string") return null;

                        return (
                            <View key={key} style={styles.linkContainer}>
                                <Text variant="titleMedium" style={styles.linkLabel}>
                                    Material de apoio:
                                </Text>
                                <Button
                                    icon="link"
                                    mode="contained-tonal"
                                    onPress={() => Linking.openURL(value)}
                                    style={styles.linkButton}
                                    labelStyle={{ textTransform: "none" }}
                                >
                                    {key}
                                </Button>
                            </View>
                        );
                    })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    container: {
        paddingHorizontal: 18,
        paddingTop: 80,
        paddingBottom: 40,
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 16,
        zIndex: 10,
        backgroundColor: styleGuide.palette.main.primaryColor,
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    imageCard: {
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 16,
    },
    image: {
        borderRadius: 14,
    },
    title: {
        ...(styleGuide.typography.h3 as TextStyle),
        fontWeight: "bold",
        marginBottom: 10,
        color: styleGuide.palette.main.textPrimaryColor,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    authorTextRow: {
        marginLeft: 10,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    authorName: {
        fontSize: 16,
        fontWeight: "600",
        color: styleGuide.palette.main.textPrimaryColor,
    },
    authorDate: {
        fontSize: 13,
        color: styleGuide.palette.main.textSecondaryColor,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    tag: {
        backgroundColor: styleGuide.palette.main.primaryColor,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        color: styleGuide.palette.main.fourthColor,
        fontSize: 12,
        fontWeight: "500",
    },
    sectionTitle: {
        fontWeight: "bold",
        color: styleGuide.palette.main.textPrimaryColor,
        marginBottom: 4,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 22,
        color: styleGuide.palette.main.textSecondaryColor,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    linkContainer: {
        marginTop: 10,
        marginBottom: 6,
        backgroundColor: styleGuide.palette.main.fourthColor,
        borderRadius: 10,
        padding: 10,
    },
    linkLabel: {
        fontWeight: "bold",
        marginBottom: 6,
        color: styleGuide.palette.main.textPrimaryColor,
    },
    linkButton: {
        alignSelf: "flex-start",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
