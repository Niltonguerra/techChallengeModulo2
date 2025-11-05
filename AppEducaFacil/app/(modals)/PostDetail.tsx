import styleGuide from "@/constants/styleGuide";
import { createComment, deleteComment, getCommentsByPost } from "@/services/comments";
import { getListById } from "@/services/post";
import { RootState } from "@/store/store";
import { Comments, Post } from "@/types/post";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    TextInput,
    TextStyle,
    View,
} from "react-native";
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    Divider,
    IconButton,
    Text,
} from "react-native-paper";
import { useSelector } from "react-redux";

export default function PostDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [comments, setComments] = useState<Comments[]>([]);
    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    const user = useSelector((state: RootState) => state.auth.user);

    // Carrega o post e comentários
    const fetchPostAndComments = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await getListById(id);
            const postData = data.ListPost[0];
            setPost(postData);
            // const commentsData = await getCommentsByPost(postData.id);
            const commentsData: Comments[] = [
                {
                    "id": "9d691aab-0edc-461f-a89c-d9441c524790",
                    "content": "Esse post é muito bom! Esse post é muito bom! Esse post é muito bom! Esse post é muito bom! Esse post é muito bom! Esse post é muito bom! ",
                    "createdAt": "2025-11-02T15:52:52.134Z",
                    "user": {
                        "name": "Luis",
                        "photo": "https://i.pinimg.com/736x/c6/a7/75/c6a7753e45950582ae36a7c8a87ad505.jpg"
                    }
                },
                {
                    "id": "2ee7d9a4-8385-4c4c-9243-8b8d785f03df",
                    "content": "Esse post é muito bom!",
                    "createdAt": "2025-11-02T15:53:43.499Z",
                    "user": {
                        "name": "Luis",
                        "photo": "https://i.pinimg.com/736x/c6/a7/75/c6a7753e45950582ae36a7c8a87ad505.jpg"
                    }
                },
                {
                    "id": "9cd3da0c-63b5-4a28-978b-6fef3bb30cc2",
                    "content": "Esse post é muito bom2!",
                    "createdAt": "2025-11-02T15:53:48.265Z",
                    "user": {
                        "name": "Luis",
                        "photo": "https://i.pinimg.com/736x/c6/a7/75/c6a7753e45950582ae36a7c8a87ad505.jpg"
                    }
                }
            ]
            setComments(commentsData);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    // Adiciona comentário
    const handleAddComment = async () => {
        if (!newComment.trim() || !post) return;
        setCommentLoading(true);
        try {
            await createComment({ postId: post.id, content: newComment.trim() });
            setNewComment("");
            const commentsData = await getCommentsByPost(post.id);
            setComments(commentsData);
        } catch (err) {
            console.error("Erro ao criar comentário", err);
        } finally {
            setCommentLoading(false);
        }
    };

    // Deleta comentário
    const handleDeleteComment = async (commentId: string) => {
        if (!post) return;
        setCommentLoading(true);
        try {
            await deleteComment(commentId);
            const commentsData = await getCommentsByPost(post.id);

            setComments(commentsData);
        } catch (err) {
            console.error("Erro ao deletar comentário", err);
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    if (error || !post)
        return (
            <View style={styles.errorContainer}>
                <Text>Post não encontrado ou erro ao carregar.</Text>
                <Button onPress={() => router.back()}>Voltar</Button>
            </View>
        );

    return (
        <View style={styles.wrapper}>
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
                {/* Imagem do post */}
                {post.image && (
                    <Card style={styles.imageCard} mode="elevated" elevation={2}>
                        <Card.Cover source={{ uri: post.image }} style={styles.image} />
                    </Card>
                )}

                {/* Título */}
                <Text variant="headlineLarge" style={styles.title}>
                    {post.title}
                </Text>

                {/* Autor e data */}
                <View style={styles.authorRow}>
                    {post.user_photo ? (
                        <Avatar.Image
                            size={36}
                            source={{ uri: post.user_photo }}
                            style={{ backgroundColor: "#ccc" }}
                        />
                    ) : (
                        <Avatar.Text
                            size={42}
                            label={post.user_name?.[0]?.toUpperCase() ?? "?"}
                            style={{ backgroundColor: styleGuide.palette.main.primaryColor }}
                        />
                    )}

                    <View style={styles.authorTextRow}>
                        <Text style={styles.authorName}>{post.user_name}</Text>
                        <Text style={styles.authorDate}>
                            {new Date(post.updated_at).toLocaleDateString("pt-BR")}
                        </Text>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    {post.content_hashtags.map((tag, idx) => (
                        <View key={`${tag}-${idx}`} style={styles.tag}>
                            <Text style={styles.tagText}>
                                {tag.startsWith("#") ? tag : `#${tag}`}
                            </Text>
                        </View>
                    ))}
                </View>

                <Divider style={{ marginVertical: 12 }} />

                {/* Introdução */}
                {post.introduction && (
                    <View style={{ marginBottom: 12 }}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Introdução
                        </Text>
                        <Text variant="bodyMedium" style={styles.bodyText}>
                            {post.introduction}
                        </Text>
                    </View>
                )}

                {/* Descrição */}
                {post.description && (
                    <View style={{ marginBottom: 12 }}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            Descrição
                        </Text>
                        <Text variant="bodyMedium" style={styles.bodyText}>
                            {post.description}
                        </Text>
                    </View>
                )}

                {/* Links externos */}
                {post.external_link &&
                    Object.entries(post.external_link).map(([key, value]) => {
                        if (!value) return null;
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

                {/* Seção de comentários */}
                <Divider style={{ marginVertical: 16 }} />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Comentários
                </Text>

                {/* Input para adicionar comentário */}
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Escreva um comentário..."
                        value={newComment}
                        onChangeText={setNewComment}
                        editable={!commentLoading}
                    />
                    <Button
                        mode="contained"
                        onPress={handleAddComment}
                        loading={commentLoading}
                        disabled={commentLoading}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                    >
                        Enviar
                    </Button>
                </View>

                {/* Lista de comentários */}
                {comments.length ? (
                    comments.map((comment) => (

                        <View key={comment.id} style={styles.commentBubbleContainer}>
                            {comment.user.photo ? (
                                <Avatar.Image size={36} source={{ uri: comment.user.photo }} />
                            ) : (
                                <Avatar.Text
                                    size={36}
                                    label={comment.user.name?.[0]?.toUpperCase() ?? "?"}
                                    style={{ backgroundColor: styleGuide.palette.main.primaryColor }}
                                />
                            )}
                            <View style={styles.commentBubble}>
                                <Text style={styles.commentAuthor}>{comment.user.name}</Text>
                                <Text style={styles.commentText}>{comment.content}</Text>
                                <Text style={styles.commentDate}>
                                    {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                                </Text>
                            </View>
                            <IconButton
                                icon="delete"
                                size={18}
                                onPress={() => handleDeleteComment(comment.id)}
                                iconColor={styleGuide.palette.error}
                                style={{ marginLeft: 4 }}
                            />
                        </View>
                    ))
                ) : (
                    <Text style={styles.bodyText}>Nenhum comentário ainda.</Text>
                )}
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

    commentInputContainer: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
    commentInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 8, backgroundColor: "#fff" },

    button: { backgroundColor: styleGuide.palette.main.primaryColor },
    buttonLabel: {
        color: styleGuide.palette.main.fourthColor,
    },

    commentBubbleContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,

    },
    commentBubble: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: styleGuide.palette.main.fourthColor,
        borderRadius: 12,
        padding: 8,
    },
    commentAuthor: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 2,
        color: styleGuide.palette.main.textSecondaryColor,
    },
    commentText: {
        fontSize: 14,
        color: styleGuide.palette.main.textSecondaryColor,
    },
    commentDate: {
        fontSize: 12,
        color: styleGuide.palette.main.textSecondaryColor,
        marginTop: 4,
        alignSelf: "flex-end",
    },
});
