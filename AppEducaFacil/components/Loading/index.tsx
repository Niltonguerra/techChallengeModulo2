import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native"
import { Text } from "react-native-paper";

type LoadingProps = {
	loadingText?: string;
}

const Loading: React.FC<LoadingProps> = ({ loadingText = 'Carregando dados...' }) => {
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
			<Text>{loadingText}</Text>
			<ActivityIndicator size="large" />
		</View>
	);
}

export default Loading;