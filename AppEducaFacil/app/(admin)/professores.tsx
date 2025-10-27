import React, { useEffect, useState } from 'react';
import { ScrollView, View, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import CardUser from '@/components/CardUser/CardUser';
import { getAllUsers } from '@/services/user';

export default function AlunosScreen() {
    const [students, setStudents] = useState<any[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const currentUser = useSelector((state: RootState) => state.auth.user);


    useEffect(() => {
        async function fetchStudents() {
            if (!token) return;
            const users = await getAllUsers(token, 'professor');
            setStudents(users);
        }
        fetchStudents();
    }, [token]);

    if (!currentUser || currentUser.permission !== 'admin') {
        return <View style={styles.restricted}><Button title="Acesso restrito" disabled /></View>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.createBtn}>
                <Button title="Criar Aluno" onPress={() => console.log('Abrir modal de criação')} />
            </View>

            {students.map(student => (
                <CardUser
                    key={student.id}
                    isEditable={true}
                    dataProperties={{
                        id: student.id,
                        name: student.name,
                        photo: student.photo,
                        email: student.email,
                    }}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    createBtn: { marginBottom: 12 },
    restricted: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
