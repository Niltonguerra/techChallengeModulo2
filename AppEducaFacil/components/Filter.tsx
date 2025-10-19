import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Menu, Searchbar } from "react-native-paper";
import { getHashtags } from "../services/post";

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
    const [showMenu, setShowMenu] = useState(false);
    const [createdAtAfter, setCreatedAtAfter] = useState<Date | null>(null);
    const [createdAtBefore, setCreatedAtBefore] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState<"after" | "before" | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [loadingHashtags, setLoadingHashtags] = useState(true);

    useEffect(() => {
        const fetchHashtags = async () => {
            try {
                const data = await getHashtags();
                setHashtags(data || []);
            } catch (err) {
                console.error("Erro ao carregar hashtags:", err);
            } finally {
                setLoadingHashtags(false);
            }
        };

        fetchHashtags();
    }, []);

    const formatDateLocal = (date: Date | null) => {
        if (!date) return undefined;
        const localDate = new Date(date);
        localDate.setHours(0, 0, 0, 0);
        return localDate.toISOString();
    };
    const handleApply = () => {
        onFilter({
            search,
            content,
            createdAtAfter: formatDateLocal(createdAtAfter),
            createdAtBefore: formatDateLocal(createdAtBefore),
        });
    };

    const handleClear = () => {
        setSearch("");
        setContent("");
        setCreatedAtAfter(null);
        setCreatedAtBefore(null);
        onFilter({});
    };

    return (
        <View style={{ gap: 12, marginBottom: 16 }}>
            <Searchbar
                placeholder="Buscar título ou descrição"
                value={search}
                onChangeText={setSearch}
            />

            {loadingHashtags ? (
                <ActivityIndicator animating size="small" />
            ) : (
                <Menu
                    visible={showMenu}
                    onDismiss={() => setShowMenu(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setShowMenu(true)}>
                            {content ? `Categoria: ${content}` : "Selecionar categoria"}
                        </Button>
                    }
                >
                    <Menu.Item
                        title="Todos"
                        onPress={() => {
                            setContent("");
                            setShowMenu(false);
                        }}
                    />
                    {hashtags.map((tag) => (
                        <Menu.Item
                            key={tag}
                            onPress={() => {
                                setContent(tag);
                                setShowMenu(false);
                            }}
                            title={tag}
                        />
                    ))}
                </Menu>
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button onPress={() => setShowPicker("after")} mode="outlined">
                    {createdAtAfter
                        ? `De: ${createdAtAfter.toLocaleDateString()}`
                        : "Data inicial"}
                </Button>
                <Button onPress={() => setShowPicker("before")} mode="outlined">
                    {createdAtBefore
                        ? `Até: ${createdAtBefore.toLocaleDateString()}`
                        : "Data final"}
                </Button>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={
                        showPicker === "after"
                            ? createdAtAfter || new Date()
                            : createdAtBefore || new Date()
                    }
                    mode="date"
                    onChange={(e, selectedDate) => {
                        setShowPicker(null);
                        if (!selectedDate) return;
                        if (showPicker === "after") setCreatedAtAfter(selectedDate);
                        else setCreatedAtBefore(selectedDate);
                    }}
                />
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                <Button mode="contained" onPress={handleApply} style={{ flex: 1 }}>
                    Aplicar Filtro
                </Button>
                <Button mode="text" onPress={handleClear} style={{ flex: 1 }}>
                    Limpar Filtros
                </Button>
            </View>
        </View>
    );
};
