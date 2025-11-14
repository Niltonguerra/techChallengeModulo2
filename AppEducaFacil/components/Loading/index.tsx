import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native"
import { Text } from "react-native-paper";

const Loading: React.FC = () => {
	const styles = StyleSheet.create({
		loading: {
			justifyContent: 'center', 
			alignItems: 'center', 
			flex: 1,
			flexDirection: 'row',
			gap: 12,
			padding: 16,
		},
	});

	return (
		<View style={styles.loading}>
			<Text>Carregando  dados...</Text>
			<ActivityIndicator size="large" />
		</View>
	);
}

export default Loading;