
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { db, auth } from '../firebase/config';

function Comments(props) {
    const { postId } = props.route.params;

    const [posteo, setPosteo] = useState(null);
    const [comentario, setComentario] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        db.collection('posts')
            .doc(postId)
            .onSnapshot(doc => {
                if (doc.data() !== undefined) {
                    setPosteo(doc.data());
                } else {
                    setError('No se encontró el posteo');
                }
            }, e => {
                console.log(e);
                setError('No se pudieron cargar los comentarios');
            });
    }, [postId]);

    function guardarComentario() {
        if (auth.currentUser === null) {
            setError('Tenés que iniciar sesión para comentar');
            return;
        }

        if (comentario === '') {
            setError('Escribí un comentario antes de publicar');
            return;
        }

        const nuevoComentario = {
            email: auth.currentUser.email,
            texto: comentario,
            createdAt: Date.now()
        };

        db.collection('posts').doc(postId).update({
            comentarios: firebase.firestore.FieldValue.arrayUnion(nuevoComentario)
        })
            .then(() => {
                setComentario('');
                setError('');
            })
            .catch(e => {
                console.log(e);
                setError('No se pudo guardar el comentario');
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Comentarios</Text>

            {posteo !== null ?
                <View style={styles.card}>
                    <Text style={styles.email}>
                        {posteo.email}
                    </Text>

                    <Text style={styles.descripcion}>
                        {posteo.descripcion}
                    </Text>
                </View>
                :
                <Text>Cargando publicación...</Text>
            }

            <Text style={styles.subtitulo}>
                Comentarios de la publicación
            </Text>

            {posteo !== null ?
                (posteo.comentarios !== undefined ?
                    (posteo.comentarios.length === 0 ?
                        <Text style={styles.vacio}>
                            Todavía no hay comentarios
                        </Text>
                        :
                        null)
                    :
                    <Text style={styles.vacio}>
                        Todavía no hay comentarios
                    </Text>)
                :
                null
            }

            <FlatList
                data={
                    posteo !== null ?
                        (posteo.comentarios !== undefined ?
                            posteo.comentarios
                            :
                            [])
                        :
                        []
                }
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

            <TextInput
                style={styles.field}
                placeholder="Escribí un comentario..."
                onChangeText={text => setComentario(text)}
                value={comentario}
            />

            <Pressable
                style={styles.button}
                onPress={() => guardarComentario()}
            >
                <Text style={styles.buttonText}>
                    Publicar comentario
                </Text>
            </Pressable>

            <Text style={styles.error}>{error}</Text>
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
    field: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 10,
        padding: 12,
        minHeight: 70,
        textAlignVertical: 'top',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#7c3aed',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    error: {
        color: '#dc2626',
        marginTop: 10,
    },
});

export default Comments;
