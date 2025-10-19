import { MaterialCommunityIcons } from "@expo/vector-icons"; // Ícones para as setas indicativas
import DateTimePicker from "@react-native-community/datetimepicker"; // Componente de seleção de data
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, View, useWindowDimensions } from "react-native"; // Componentes e hooks do RN
import { ActivityIndicator, Button, IconButton, Menu, Searchbar } from "react-native-paper"; // Componentes de UI
import { getHashtags } from "../services/post"; // Função para buscar categorias (hashtags)

type FilterProps = {
    onFilter: (filters: {
        search?: string;
        content?: string;
        createdAtAfter?: string;
        createdAtBefore?: string;
    }) => void; // Função que retorna os filtros aplicados
};

export const Filter: React.FC<FilterProps> = ({ onFilter }) => {
    // Estados de filtros
    const [search, setSearch] = useState(""); // Texto da barra de busca
    const [content, setContent] = useState(""); // Categoria selecionada
    const [dates, setDates] = useState<{ after?: Date; before?: Date }>({}); // Datas "De" e "Até"
    const [activePicker, setActivePicker] = useState<"after" | "before" | "menu" | null>(null); // Controle do menu ou DatePicker
    const [hashtags, setHashtags] = useState<string[]>([]); // Lista de categorias
    const [loading, setLoading] = useState(true); // Indicador de carregamento
    const { width } = useWindowDimensions(); // Largura da tela

    // Estados e animações para setas indicativas do scroll
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const leftOpacity = useRef(new Animated.Value(0)).current; // Opacidade animada da seta esquerda
    const rightOpacity = useRef(new Animated.Value(0)).current; // Opacidade animada da seta direita
    const scrollRef = useRef<ScrollView>(null); // Referência para o scroll horizontal

    // Carregar hashtags/categorias
    useEffect(() => {
        getHashtags().then(data => setHashtags(data || [])).finally(() => setLoading(false));
    }, []);

    // Formatar datas para enviar ao filtro
    const formatDate = (date?: Date) =>
        date ? new Date(date.setHours(0, 0, 0, 0)).toISOString() : undefined;

    // Disparar o filtro sempre que algum estado mudar
    useEffect(() => {
        onFilter({
            search,
            content,
            createdAtAfter: formatDate(dates.after),
            createdAtBefore: formatDate(dates.before),
        });
    }, [search, content, dates]);

    // Limpar filtros
    const handleClear = () => {
        setSearch(""); // Limpa busca
        setContent(""); // Limpa categoria
        setDates({}); // Limpa datas

        scrollRef.current?.scrollTo({ x: 0, animated: true }); // Reseta scroll para o início

        // Esconde setas imediatamente
        setShowLeftArrow(false);
        setShowRightArrow(false);
        leftOpacity.setValue(0);
        rightOpacity.setValue(0);
    };

    // Função para animar entrada/saída das setas
    const toggleArrow = (arrow: "left" | "right", visible: boolean) => {
        const target = arrow === "left" ? leftOpacity : rightOpacity;
        Animated.timing(target, {
            toValue: visible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ marginBottom: 8, width: "100%" }}>
            {/* Barra de busca */}
            <Searchbar
                placeholder="Buscar título ou descrição"
                value={search}
                onChangeText={setSearch}
                style={{
                    height: 38,
                    justifyContent: "center",
                    width: "100%",
                    borderRadius: 8,
                }}
                inputStyle={{
                    height: 38,
                    textAlignVertical: "center",
                    paddingVertical: 0,
                    fontSize: 13,
                }}
            />

            {/* Container do scroll horizontal */}
            <View style={{ position: "relative", marginTop: 2 }}>
                <ScrollView
                    ref={scrollRef} // Referência para resetar scroll
                    horizontal
                    showsHorizontalScrollIndicator={false} // Oculta scroll padrão
                    contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10 }}
                    onContentSizeChange={(contentWidth) => {
                        // Verifica se precisa mostrar seta direita inicialmente
                        const hasScroll = contentWidth > width;
                        setShowRightArrow(hasScroll);
                        toggleArrow("right", hasScroll);
                    }}
                    onScroll={({ nativeEvent }) => {
                        // Atualiza visibilidade das setas conforme posição do scroll
                        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                        const leftVisible = contentOffset.x > 5;
                        const rightVisible = contentOffset.x + layoutMeasurement.width < contentSize.width - 5;
                        setShowLeftArrow(leftVisible);
                        setShowRightArrow(rightVisible);
                        toggleArrow("left", leftVisible);
                        toggleArrow("right", rightVisible);
                    }}
                    scrollEventThrottle={16} // Frequência de atualização do scroll
                >
                    {/* Categoria */}
                    <View style={{ flexGrow: 1, flexBasis: 120, marginRight: 6 }}>
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
                                        style={{
                                            height: 38,
                                            justifyContent: "center",
                                            borderRadius: 6,
                                        }}
                                        contentStyle={{ height: 38, paddingVertical: 0 }}
                                        labelStyle={{ fontSize: 13 }}
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

                    {/* Botão Data "De" */}
                    <Button
                        mode="outlined"
                        onPress={() => setActivePicker("after")}
                        style={{
                            height: 38,
                            justifyContent: "center",
                            borderRadius: 6,
                            marginRight: 6,
                        }}
                        contentStyle={{ height: 38, paddingVertical: 0 }}
                        labelStyle={{ fontSize: 13 }}
                        icon="calendar-range"
                    >
                        {dates.after ? dates.after.toLocaleDateString() : "De"}
                    </Button>

                    {/* Botão Data "Até" */}
                    <Button
                        mode="outlined"
                        onPress={() => setActivePicker("before")}
                        style={{
                            height: 38,
                            justifyContent: "center",
                            borderRadius: 6,
                            marginRight: 6,
                        }}
                        contentStyle={{ height: 38, paddingVertical: 0 }}
                        labelStyle={{ fontSize: 13 }}
                        icon="calendar"
                    >
                        {dates.before ? dates.before.toLocaleDateString() : "Até"}
                    </Button>

                    {/* Botão Limpar */}
                    <IconButton
                        icon="close-circle-outline"
                        size={18}
                        onPress={handleClear} // Reseta filtros e scroll
                        style={{
                            height: 34,
                            width: 34,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    />
                </ScrollView>

                {/* Setas indicativas esquerda */}
                {showLeftArrow && (
                    <Animated.View
                        style={{
                            opacity: leftOpacity,
                            position: "absolute",
                            left: 2,
                            top: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            borderRadius: 20,
                            width: 24,
                            height: 24,
                            alignSelf: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            shadowOffset: { width: 1, height: 1 },
                        }}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={20} color="#444" />
                    </Animated.View>
                )}

                {/* Setas indicativas direita */}
                {showRightArrow && (
                    <Animated.View
                        style={{
                            opacity: rightOpacity,
                            position: "absolute",
                            right: 2,
                            top: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            borderRadius: 20,
                            width: 24,
                            height: 24,
                            alignSelf: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            shadowOffset: { width: 1, height: 1 },
                        }}
                    >
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#444" />
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
                        setActivePicker(null); // Fecha picker após seleção
                    }}
                    style={{ height: 0 }} // Esconde o componente na tela
                />
            )}
        </View>
    );
};
