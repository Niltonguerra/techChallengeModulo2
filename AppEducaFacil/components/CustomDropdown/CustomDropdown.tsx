import styleGuide from "@/constants/styleGuide";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    LayoutRectangle,
    StyleSheet,
    Pressable,
    findNodeHandle,
    UIManager,
} from "react-native";
import { Portal } from "react-native-paper";

interface Props {
    label: string;
    options: string[];
    value: string | null;
    onChange: (value: string | null) => void;
}

export function CustomDropdown({ label, options, value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [inputLayout, setInputLayout] = useState<LayoutRectangle | null>(null);
    const inputRef = useRef<View>(null);

    const toggleDropdown = () => {
        if (!open) measurePosition();
        setOpen(!open);
    };

    const measurePosition = () => {
        const handle = findNodeHandle(inputRef.current);
        if (!handle) return;

        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            setInputLayout({ x: pageX, y: pageY, width, height });
        });
    };

    return (
        <View>
            <TouchableOpacity ref={inputRef} style={styles.input} onPress={toggleDropdown}>
                <MaterialIcons
                    name="label"
                    size={16}
                    color={styleGuide.palette.main.primaryColor}
                    style={{ marginRight: 6 }}
                />

                <Text style={styles.valueText} numberOfLines={1}
                    ellipsizeMode="tail">
                    {value || label}
                </Text>

                <MaterialIcons
                    name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={18}
                    color={styleGuide.palette.main.primaryColor}
                    style={{ marginLeft: "auto" }}
                />
            </TouchableOpacity>

            <Portal>
                {open && inputLayout && (
                    <>
                        <Pressable
                            style={styles.overlay}
                            onPress={() => setOpen(false)}
                        />

                        <View
                            style={[
                                styles.dropdown,
                                {
                                    top: inputLayout.y + inputLayout.height + 4,
                                    left: inputLayout.x,
                                    width: inputLayout.width,
                                },
                            ]}
                        >
                            <ScrollView
                                nestedScrollEnabled
                                style={{ maxHeight: 220 }}
                                contentContainerStyle={{ paddingVertical: 4 }}
                            >
                                {options.map((opt) => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={[
                                            styles.option,
                                            opt === value && styles.selectedOption,
                                        ]}
                                        onPress={() => {
                                            onChange(opt);
                                            setOpen(false);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                opt === value && styles.selectedText,
                                            ]}
                                        >
                                            {opt}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </>
                )}
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 38,
        justifyContent: "center",
        alignItems: "center",        
        flexDirection: "row",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: styleGuide.palette.main.primaryColor,
        paddingHorizontal: 10,
        backgroundColor: "transparent",
    },
    valueText: {
        fontSize: 13,
        color: styleGuide.palette.main.primaryColor,
        marginTop: 2,
        flexShrink: 1,
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
    },

    dropdown: {
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 8,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        overflow: "hidden",
        zIndex: 10000,
    },

    option: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },

    selectedOption: {
        backgroundColor: styleGuide.palette.main.fourthColor,
    },

    optionText: {
        fontSize: 16,
    },

    selectedText: {
        fontWeight: "bold",
        color: "styleGuide.palette.main.primaryColor",
    },
});
