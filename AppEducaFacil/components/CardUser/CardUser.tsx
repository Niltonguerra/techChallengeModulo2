import * as React from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { CardUserProps } from '@/types/cards';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, TextStyle, View, Image } from 'react-native';
import styleGuide from '@/constants/styleGuide';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDeleteUser } from '@/hooks/user/handleDeleteUser';

const CardUser = (dataCard: CardUserProps) => {
  const { handleDeleteUser } = useDeleteUser();

  return (
    <Card style={styles.card} mode="elevated" elevation={1}>
      <Pressable accessibilityRole="link">
        <View style={styles.row}>
          {dataCard.dataProperties.photo ? (
            <Image
              style={styles.img}
              source={{ uri: dataCard.dataProperties.photo }}
            />
          ) : (
            <View style={[styles.img, styles.defaultIconContainer]}>
              <MaterialCommunityIcons name="account" size={32} color="black" />
            </View>
          )}

          <View style={styles.userInfo}>
            <Text style={styles.title}>{dataCard.dataProperties.name}</Text>
            <Text style={styles.title}>{dataCard.dataProperties.email}</Text>
            {dataCard.isEditable && (
              <View style={styles.btnContainer}>
                <Link
                  href={{
                    pathname: "/(admin)/form-user",
                    params: {
                      userId: dataCard.dataProperties.id,
                      userType: dataCard.dataProperties.permission || "user",
                    },
                  }}
                  asChild
                >
                  <Button labelStyle={styles.btnLabel} style={styles.btnEdit}>
                    <MaterialCommunityIcons
                      name="account-edit"
                      size={24}
                      color={styleGuide.palette.warning}
                    />
                  </Button>
                </Link>
                <Button
                  labelStyle={styles.btnLabel}
                  style={styles.btnDelete}
                  onPress={() => handleDeleteUser(dataCard.dataProperties.id)}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={styleGuide.palette.error}
                  />
                </Button>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: styleGuide.palette.main.fourthColor,
    borderRadius: 16,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: "#f3f4f6",
  },
  defaultIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cccccc",
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    ...(styleGuide.typography.h5 as TextStyle),
    fontWeight: "bold",
    marginBottom: 6,
  },
  btnContainer: {
    flexDirection: "row",
    gap: 24,
  },
  btnLabel: {
    ...(styleGuide.typography.button as TextStyle),
  },
  btnEdit: {},
  btnDelete: {},
});

export default CardUser;
