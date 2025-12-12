import styleGuide from "@/constants/styleGuide";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { getHashtags } from "../../services/post";
import { Text } from "react-native";
import { CustomDropdown } from "../CustomDropdown/CustomDropdown";

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

    const scrollRef = useRef<ScrollView>(null);
    const scrollOffset = useRef(0);

    const leftOpacity = useRef(new Animated.Value(0)).current;
    const rightOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        getHashtags()
            .then((data) => setHashtags(data || []))
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (date?: Date) =>
        date ? new Date(date.setHours(0, 0, 0, 0)).toISOString() : undefined;

    const handleApplyFilters = () => {
        onFilter({
            search,
            content,
            createdAtAfter: formatDate(dates.after),
            createdAtBefore: formatDate(dates.before),
        });
    };

    const handleClear = () => {
        setSearch("");
        setContent("");
        setDates({});

        scrollRef.current?.scrollTo({ x: 0, animated: true });
        scrollOffset.current = 0;

        leftOpacity.setValue(0);
        rightOpacity.setValue(0);

        onFilter({
            search: "",
            content: "",
            createdAtAfter: undefined,
            createdAtBefore: undefined,
        });
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Buscar título ou descrição"
                placeholderTextColor={styleGuide.palette.main.textSecondaryColor}
                value={search}
                onChangeText={setSearch}
                style={styles.searchbar}
                inputStyle={styles.searchbarInput}
                iconColor={styleGuide.palette.main.primaryColor}
            />

            <View style={styles.filterRow}>

                <View style={styles.half}>
                    <CustomDropdown
                        label="Categoria"
                        options={hashtags}
                        value={content}
                        onChange={(v) => setContent(v || "")}
                    />
                </View>

                <View style={styles.quarter}>
                    <Button
                        mode="outlined"
                        onPress={() => setActivePicker("after")}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        icon="calendar-range"
                        theme={{ colors: { primary: styleGuide.palette.main.primaryColor } }}
                    >
                        <Text
                            style={styles.truncatedText}
                            numberOfLines={1}
                            ellipsizeMode="tail"

                        >
                            {dates.after ? dates.after.toLocaleDateString() : "De"}
                        </Text>
                    </Button>
                </View>

                <View style={styles.quarter}>
                    <Button
                        mode="outlined"
                        onPress={() => setActivePicker("before")}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        icon="calendar"
                        theme={{ colors: { primary: styleGuide.palette.main.primaryColor } }}
                    >
                        <Text
                            style={styles.truncatedText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {dates.before ? dates.before.toLocaleDateString() : "Até"}
                        </Text>
                    </Button>
                </View>

            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Button
                    icon="magnify"
                    mode="outlined"
                    onPress={handleApplyFilters}
                    style={[styles.buttonApply, styles.applyButton]}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.applyLabel}
                >
                    Aplicar filtros
                </Button>

                <Button
                    mode="outlined"
                    onPress={handleClear}
                    icon="close-circle-outline"
                    style={styles.buttonApply}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                >
                    Limpar
                </Button>
            </View>


            {(activePicker === "after" || activePicker === "before") && (
                <DateTimePicker
                    value={dates[activePicker] || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        if (event.type === "dismissed") {
                            setActivePicker(null);
                            return;
                        }
                        if (selectedDate) {
                            setDates((prev) => ({ ...prev, [activePicker]: selectedDate }));
                        }
                        setActivePicker(null);
                    }}
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
    button: {
        height: 38,
        justifyContent: "center",
        borderRadius: 4,
        marginRight: 4,
        borderColor: styleGuide.palette.main.primaryColor,
    },
    buttonApply: {
        height: 38,
        width: '49.4%',
        justifyContent: "center",
        borderRadius: 4,
        marginRight: 4,
        borderColor: styleGuide.palette.main.primaryColor,
    },
    buttonContent: {
        height: 38, paddingVertical: 0, flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonLabel: { fontSize: 13, color: styleGuide.palette.main.primaryColor },
    clearButton: { height: 34, width: 34, justifyContent: "center", alignItems: "center" },
    applyButton: {
        backgroundColor: styleGuide.palette.main.primaryColor,
        color: styleGuide.palette.main.fourthColor,
    },
    applyLabel: {
        color: styleGuide.palette.main.fourthColor,
        fontSize: 14,
        fontWeight: "600",
    },
    filterRow: {
        flexDirection: "row",
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },

    half: {
        width: "40%",
        paddingRight: 4,
    },

    quarter: {
        width: "30%",
        paddingRight: 4,
    },

    truncatedTextContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    truncatedText: {
        fontSize: 13,
        flex: 1,
        color: styleGuide.palette.main.primaryColor,
        textAlign: "center",
    },

});
