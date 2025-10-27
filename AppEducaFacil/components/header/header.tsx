import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  Platform,
} from "react-native";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styleGuide from "@/constants/styleGuide";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const Header = ({ title, subtitle, showBack }: HeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const shouldShowBack =
    typeof showBack === "boolean" ? showBack : navigation.canGoBack();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + (Platform.OS === "android" ? 22 : 28),
        },
      ]}
    >
      <View style={styles.leftContainer}>
        {shouldShowBack && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons
              testID="header-back-button"
              name="arrow-back-ios"
              size={30}
              color={styleGuide.palette.main.fourthColor}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text
          testID="header-title"
          accessibilityLabel="header-title"
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title && title.trim().length > 0 ? title : "Educafácil"}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: styleGuide.palette.main.primaryColor,
    paddingHorizontal: 18,
    height: Platform.OS === "android" ? 150 : 190,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: styleGuide.palette.light.primaryLightColor,
  },
  leftContainer: {
    minWidth: 64,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingBottom: 14,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  rightContainer: {
    minWidth: 64,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 14,
  },
  backButton: {
    padding: 8,
  },
  title: {
    ...(styleGuide.typography.h3 as TextStyle),
    color: styleGuide.palette.main.fourthColor,
    fontWeight: "900",
    textAlign: "center",
    fontSize: 26,
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: styleGuide.palette.main.fourthColor,
    opacity: 0.95,
  },
});

export default Header;
