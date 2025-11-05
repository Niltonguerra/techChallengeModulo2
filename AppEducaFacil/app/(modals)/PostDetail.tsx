import styleGuide from "@/constants/styleGuide";
import {
    createComment,
    deleteComment,
    getCommentsByPost,
} from "@/services/comments";
import { getListById } from "@/services/post";
import { RootState } from "@/store/store";
import { Comments, Post } from "@/types/post";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Animated,
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
    Snackbar,
    Text,
} from "react-native-paper";
import { useSelector } from "react-redux";

export default function PostDetail() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { id } = useLocalSearchParams<{ id: string }>();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [comments, setComments] = useState<Comments[]>([]);
    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const COMMENTS_LIMIT = 10;

    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const fetchPostAndComments = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await getListById(id);
            const postData = data.ListPost[0];
            setPost(postData);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (reset = false, action = 'insert') => {
        if (!post) return;
        if (loadingMore || commentLoading) return;

        const nextOffset = reset ? 0 : offset;
        if (!reset) setLoadingMore(true);
        else if (action === 'insert') setCommentLoading(true);

        try {
            const data = await getCommentsByPost(post.id, String(nextOffset), String(COMMENTS_LIMIT));

            if (reset) {
                setComments(data);
                setOffset(data.length);
            } else {
                setComments((prev) => [...prev, ...data]);
                setOffset((prev) => prev + data.length);
            }

            setHasMore(data.length === COMMENTS_LIMIT);
        } catch (err) {
            console.error("Erro ao buscar comentários:", err);
        } finally {
            if (reset) setCommentLoading(false);
            else setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    useEffect(() => {
        if (post) fetchComments(true);
    }, [post]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !post) return;
        setCommentLoading(true);
        try {
            await createComment({ postId: post.id, content: newComment.trim() });
            setNewComment("");
            await fetchComments(true);
        } catch (err) {
            console.error("Erro ao criar comentário", err);
        } finally {
            setCommentLoading(false);
        }
    };

    const performDelete = async (commentId: string) => {
        if (!post) return;
        setDeletingCommentId(commentId);
        try {
            await deleteComment(commentId);
            await fetchComments(true, 'delete');
            setSnackbar({
                visible: true,
                message: "Comentário excluído com sucesso.",
                type: "success",
            });
        } catch (err) {
            console.error("Erro ao deletar comentário", err);
            setSnackbar({
                visible: true,
                message: "Erro ao excluir comentário.",
                type: "error",
            });
        } finally {
            setDeletingCommentId(null);
        }
    };

    const confirmDelete = (commentId: string, fadeOutAndDelete: () => void) => {
        Alert.alert(
            "Excluir comentário",
            "Tem certeza que deseja excluir este comentário?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: fadeOutAndDelete },
            ]
        );
    };

    const handleScroll = ({ nativeEvent }: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);
        if (distanceFromBottom < 150 && hasMore && !loadingMore) {
            fetchComments(false);
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
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {post.image && (
                    <Card style={styles.imageCard} mode="elevated" elevation={2}>
                        <Card.Cover source={{ uri: post.image }} style={styles.image} />
                    </Card>
                )}

                <Text variant="headlineLarge" style={styles.title}>
                    {post.title}
                </Text>

                <View style={styles.authorRow}>
                    {post.user_photo ? (
                        <Avatar.Image
                            size={36}
                            source={{ uri: post.user_photo }}
                            style={{ backgroundColor: styleGuide.palette.main.textSecondaryColor }}
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

                <Divider style={{ marginVertical: 16 }} />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                    Comentários
                </Text>

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

                {comments.length ? (
                    comments.map((comment) => {
                        const opacity = new Animated.Value(1);

                        const fadeOutAndDelete = () => {
                            Animated.timing(opacity, {
                                toValue: 0,
                                duration: 300,
                                useNativeDriver: true,
                            }).start(async () => {
                                await performDelete(comment.id);
                            });
                        };

                        return (
                            <Animated.View key={comment.id} style={{ opacity }}>
                                <Card
                                    style={[
                                        styles.commentCard,
                                        deletingCommentId === comment.id && { opacity: 0.6 },
                                    ]}
                                    mode="contained"
                                >
                                    <View style={styles.commentHeader}>
                                        {comment.user.photo ? (
                                            <Avatar.Image
                                                size={40}
                                                source={{ uri: comment.user.photo }}
                                                style={{
                                                    backgroundColor: styleGuide.palette.main.fourthColor,
                                                }}
                                            />
                                        ) : (
                                            <Avatar.Text
                                                size={40}
                                                label={comment.user.name?.[0]?.toUpperCase() ?? "?"}
                                                style={{
                                                    backgroundColor:
                                                        styleGuide.palette.main.primaryColor,
                                                }}
                                            />
                                        )}

                                        <View style={styles.commentHeaderText}>
                                            <Text style={styles.authorName}>{comment.user.name}</Text>
                                            <Text style={styles.authorDate}>
                                                {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                                            </Text>
                                        </View>

                                        {(user?.permission === "admin" || user?.id === comment.user.id) && (
                                            deletingCommentId === comment.id ? (
                                                <ActivityIndicator size="small" />
                                            ) : (
                                                <IconButton
                                                    icon="delete"
                                                    size={20}
                                                    onPress={() => confirmDelete(comment.id, fadeOutAndDelete)}
                                                    iconColor={styleGuide.palette.error}
                                                />
                                            )
                                        )}
                                    </View>

                                    <Text variant="bodyMedium" style={styles.commentContent}>
                                        {comment.content}
                                    </Text>
                                </Card>
                            </Animated.View>
                        );
                    })
                ) : (
                    <Text style={styles.bodyText}>Nenhum comentário ainda.</Text>
                )}

                {loadingMore && (
                    <View style={{ paddingVertical: 16, alignItems: "center" }}>
                        <ActivityIndicator size="small" />
                    </View>
                )}
            </ScrollView>

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={2500}
                style={{
                    backgroundColor:
                        snackbar.type === "success"
                            ? styleGuide.palette.success
                            : styleGuide.palette.error,
                }}
            >
                {snackbar.message}
            </Snackbar>
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
    button: { backgroundColor: styleGuide.palette.main.primaryColor },
    buttonLabel: {
        color: styleGuide.palette.main.fourthColor,
    },
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: styleGuide.palette.main.primaryColor,
        borderRadius: 10,
        padding: 10,
        backgroundColor: styleGuide.palette.main.fourthColor,
    },
    commentCard: {
        marginBottom: 12,
        borderRadius: 14,
        backgroundColor: styleGuide.palette.main.fourthColor,
        padding: 1,
        elevation: 0,
        shadowColor: "transparent",
        borderWidth: 0,
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    commentHeaderText: {
        flex: 1,
        marginLeft: 10,
    },
    commentContent: {
        fontSize: 15,
        color: styleGuide.palette.main.textSecondaryColor,
        marginTop: 4,
        lineHeight: 22,
    },
});
