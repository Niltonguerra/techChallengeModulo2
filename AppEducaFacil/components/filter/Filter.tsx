import styleGuide from "@/constants/styleGuide";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { ActivityIndicator, Button, IconButton, Menu, Searchbar } from "react-native-paper";
import { getHashtags } from "../../services/post";

type FilterProps = {
    onFilter: (filters: {
        search?: string;
        content?: string;
        createdAtAfter?: string;
        createdAtBefore?: string;
    }) => void;
};

export const Filter: React.FC<FilterProps> = ({ onFilter }) => {
    const [search, setSearch] = useState("");
    const [content, setContent] = useState("");
    const [dates, setDates] = useState<{ after?: Date; before?: Date }>({});
    const [activePicker, setActivePicker] = useState<"after" | "before" | "menu" | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const { width } = useWindowDimensions();
    const scrollRef = useRef<ScrollView>(null);
    const scrollOffset = useRef(0);

    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const leftOpacity = useRef(new Animated.Value(0)).current;
    const rightOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        getHashtags().then(data => setHashtags(data || [])).finally(() => setLoading(false));
    }, []);

    const formatDate = (date?: Date) =>
        date ? new Date(date.setHours(0, 0, 0, 0)).toISOString() : undefined;

    useEffect(() => {
        onFilter({
            search,
            content,
            createdAtAfter: formatDate(dates.after),
            createdAtBefore: formatDate(dates.before),
        });
    }, [search, content, dates]);

    const handleClear = () => {
        setSearch("");
        setContent("");
        setDates({});
        scrollRef.current?.scrollTo({ x: 0, animated: true });
        scrollOffset.current = 0;
        setShowLeftArrow(false);
        setShowRightArrow(false);
        leftOpacity.setValue(0);
        rightOpacity.setValue(0);
    };

    const toggleArrow = (arrow: "left" | "right", visible: boolean) => {
        const target = arrow === "left" ? leftOpacity : rightOpacity;
        Animated.timing(target, {
            toValue: visible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleScrollLeft = () => {
        scrollRef.current?.scrollTo({
            x: Math.max(0, scrollOffset.current - width / 2),
            animated: true,
        });
    };

    const handleScrollRight = () => {
        scrollRef.current?.scrollTo({
            x: scrollOffset.current + width / 2,
            animated: true,
        });
    };

    return (
        <View style={styles.container}>
            {/* Barra de busca */}
            <Searchbar
                placeholder="Buscar título ou descrição"
                placeholderTextColor={styleGuide.palette.main.textSecondaryColor}
                value={search}
                onChangeText={setSearch}
                style={styles.searchbar}
                inputStyle={styles.searchbarInput}
                iconColor={styleGuide.palette.main.primaryColor}
            />

            {/* Scroll horizontal */}
            <View style={styles.scrollContainer}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    onContentSizeChange={(contentWidth) => {
                        const hasScroll = contentWidth > width;
                        setShowRightArrow(hasScroll);
                        toggleArrow("right", hasScroll);
                    }}
                    onScroll={({ nativeEvent }) => {
                        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                        scrollOffset.current = contentOffset.x;

                        const leftVisible = contentOffset.x > 5;
                        const rightVisible =
                            contentOffset.x + layoutMeasurement.width < contentSize.width - 5;

                        setShowLeftArrow(leftVisible);
                        setShowRightArrow(rightVisible);
                        toggleArrow("left", leftVisible);
                        toggleArrow("right", rightVisible);
                    }}
                    scrollEventThrottle={16}
                >
                    {/* Categoria */}
                    <View style={styles.categoryContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Menu
                                visible={activePicker === "menu"}
                                onDismiss={() => setActivePicker(null)}
                                anchor={
                                    <Button
                                        mode="outlined"
                                        onPress={() => setActivePicker("menu")}
                                        style={styles.button}
                                        contentStyle={styles.buttonContent}
                                        labelStyle={styles.buttonLabel}
                                        icon="shape-outline"
                                    >
                                        {content ? content : "Categoria"}
                                    </Button>
                                }
                            >
                                <Menu.Item title="Todos" onPress={() => { setContent(""); setActivePicker(null); }} />
                                {hashtags.map(tag => (
                                    <Menu.Item key={tag} title={tag} onPress={() => { setContent(tag); setActivePicker(null); }} />
                                ))}
                            </Menu>
                        )}
                    </View>

                    {/* Botões de datas */}
                    <Button
                        mode="outlined"
                        onPress={() => setActivePicker("after")}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        icon="calendar-range"
                    >
                        {dates.after ? dates.after.toLocaleDateString() : "De"}
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => setActivePicker("before")}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        icon="calendar"
                    >
                        {dates.before ? dates.before.toLocaleDateString() : "Até"}
                    </Button>

                    {/* Botão limpar */}
                    <IconButton
                        icon="close-circle-outline"
                        size={33}
                        onPress={handleClear}
                        iconColor={styleGuide.palette.main.primaryColor}
                        style={styles.clearButton}
                    />
                </ScrollView>

                {/* Setas */}
                {showLeftArrow && (
                    <Animated.View style={[styles.arrowContainer, { left: 4, opacity: leftOpacity }]}>
                        <TouchableOpacity onPress={handleScrollLeft} activeOpacity={0.7} style={styles.arrowTouchable}>
                            <MaterialCommunityIcons
                                name="chevron-left"
                                size={24}
                                color={styleGuide.palette.main.fourthColor}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {showRightArrow && (
                    <Animated.View style={[styles.arrowContainer, { right: 4, opacity: rightOpacity }]}>
                        <TouchableOpacity onPress={handleScrollRight} activeOpacity={0.7} style={styles.arrowTouchable}>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={24}
                                color={styleGuide.palette.main.fourthColor}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>

            {/* DateTimePicker */}
            {(activePicker === "after" || activePicker === "before") && (
                <DateTimePicker
                    value={dates[activePicker] || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, d) => {
                        if (d) setDates(prev => ({ ...prev, [activePicker]: d }));
                        setActivePicker(null);
                    }}
                    style={{ height: 0 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 8, width: "100%" },
    searchbar: {
        width: "100%",
        borderWidth: 1,
        borderColor: styleGuide.palette.main.primaryColor,
        borderRadius: 8,
        backgroundColor: "transparent",
        paddingHorizontal: 8,
        justifyContent: "center",
        elevation: 0,
    },
    searchbarInput: {
        fontSize: 13,
        color: styleGuide.palette.main.textPrimaryColor,
        paddingVertical: 6,
        textAlignVertical: "center",
    },
    scrollContainer: { position: "relative", marginTop: 2 },
    scrollContent: { alignItems: "center", paddingHorizontal: 1 },
    categoryContainer: { flexGrow: 1, flexBasis: 120, marginRight: 1 },
    button: {
        height: 38,
        justifyContent: "center",
        borderRadius: 4,
        marginRight: 4,
        borderColor: styleGuide.palette.main.primaryColor,
    },
    buttonContent: { height: 38, paddingVertical: 0 },
    buttonLabel: { fontSize: 13, color: styleGuide.palette.main.primaryColor },
    clearButton: { height: 34, width: 34, justifyContent: "center", alignItems: "center" },
    arrowContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    arrowTouchable: {
        backgroundColor: styleGuide.palette.main.primaryColor,
        borderRadius: 20,
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: styleGuide.palette.main.thirdColor,
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 },
    },
});
