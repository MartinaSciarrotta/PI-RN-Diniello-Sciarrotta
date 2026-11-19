
import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../firebase/config';

import ComentarioForm from '../components/ComentarioForm/ComentarioForm';

function Comments(props) {
    const { postId } = props.route.params;

    const [posteo, setPosteo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection('posts')
            .doc(postId)
            .onSnapshot(doc => {
                setPosteo(doc.data());
                setLoading(false);
            });
    }, [postId]);

    const comentarios = posteo !== null && posteo.comentarios !== undefined
        ? posteo.comentarios
        : [];

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Comentarios</Text>

            {loading ?
                <ActivityIndicator size='large' color='#7c3aed' />
                :
                <>
                    <View style={styles.card}>
                        <Text style={styles.email}>
                            {posteo.email}
                        </Text>

                        <Text style={styles.descripcion}>
                            {posteo.descripcion}
                        </Text>
                    </View>

                    <Text style={styles.subtitulo}>
                        Comentarios de la publicación
                    </Text>

                    {comentarios.length === 0 ?
                        <Text style={styles.vacio}>
                            Todavía no hay comentarios
                        </Text>
                        :
                        null
                    }

                    <FlatList
                        data={comentarios}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={styles.comentarioCard}>
                                <Text style={styles.email}>
                                    {item.email}
                                </Text>

                                <Text style={styles.descripcion}>
                                    {item.texto}
                                </Text>
                            </View>
                        }
                    />

                    <ComentarioForm postId={postId} />
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f3ff',
        paddingHorizontal: 20,
        paddingTop: 35,
        paddingBottom: 20,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2e1065',
        marginBottom: 20,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e1065',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    comentarioCard: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    email: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7c3aed',
        marginBottom: 6,
    },
    descripcion: {
        fontSize: 15,
        color: '#1f2937',
    },
    vacio: {
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Comments;
