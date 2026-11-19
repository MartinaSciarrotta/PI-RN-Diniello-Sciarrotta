
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { db, auth } from '../firebase/config';
import { FontAwesome } from '@expo/vector-icons';

function Home(props) {
    const [posteos, setPosteos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (auth.currentUser === null) {
            setError('Tenés que iniciar sesión');
            return;
        }

        const unsubscribe = db.collection('posts')
            .orderBy('createdAt', 'desc')
            .onSnapshot(docs => {
                let posts = [];

                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });

                setPosteos(posts);
                setError('');
            }, e => {
                console.log(e);
                setError('No se pudieron cargar los posteos');
            });

        return () => unsubscribe();
    }, []);

    function darLike(id, likes) {
        if (auth.currentUser === null) {
            setError('Tenés que iniciar sesión');
            return;
        }

        const email = auth.currentUser.email;

        if (likes.filter(item => item === email).length > 0) {
            db.collection('posts').doc(id).update({
                likes: firebase.firestore.FieldValue.arrayRemove(email)
            })
                .catch(e => {
                    console.log(e);
                    setError('No se pudo quitar el like');
                });
        } else {
            db.collection('posts').doc(id).update({
                likes: firebase.firestore.FieldValue.arrayUnion(email)
            })
                .catch(e => {
                    console.log(e);
                    setError('No se pudo guardar el like');
                });
        }
    }

    function usuarioDioLike(likes) {
        if (auth.currentUser === null) {
            return false;
        }

        return likes.filter(
            item => item === auth.currentUser.email
        ).length > 0;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Inicio</Text>
            <Text style={styles.subtitulo}>
                Publicaciones de la comunidad
            </Text>

            {error !== '' ?
                <Text style={styles.error}>{error}</Text>
                :
                <View style={styles.lista}>
                    {posteos.length === 0 ?
                        <Text style={styles.vacio}>
                            Todavía no hay publicaciones
                        </Text>
                        :
                        null
                    }

                    <FlatList
                        data={posteos}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
                            <View style={styles.card}>
                                <Text style={styles.email}>
                                    {item.data.email}
                                </Text>

                                <Text style={styles.descripcion}>
                                    {item.data.descripcion}
                                </Text>

                                <Text style={styles.likes}>
                                    {(item.data.likes !== undefined
                                        ? item.data.likes
                                        : []).length} me gusta
                                </Text>

                                <Pressable
                                    style={styles.buttonLike}
                                    onPress={() => darLike(
                                        item.id,
                                        item.data.likes !== undefined
                                            ? item.data.likes
                                            : []
                                    )}
                                >
                                    <View style={styles.likeContent}>
                                        <FontAwesome
                                            name={usuarioDioLike(
                                                item.data.likes !== undefined
                                                    ? item.data.likes
                                                    : []
                                            ) ? 'heart' : 'heart-o'}
                                            size={18}
                                            color="#7c3aed"
                                            style={styles.likeIcon}
                                        />

                                        <Text style={styles.buttonText}>
                                            {usuarioDioLike(
                                                item.data.likes !== undefined
                                                    ? item.data.likes
                                                    : []
                                            )
                                                ? 'Ya no me gusta'
                                                : 'Me gusta'}
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={styles.buttonComentar}
                                    onPress={() => props.navigation.navigate(
                                        'Comments',
                                        { postId: item.id }
                                    )}
                                >
                                    <FontAwesome
                                        name="comment-o"
                                        size={18}
                                        color="#7c3aed"
                                    />
                                    <Text style={styles.textoComentar}>
                                        Comentar
                                    </Text>
                                </Pressable>
                            </View>
                        }
                    />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f3ff',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    lista: {
        flex: 1,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2e1065',
        marginBottom: 6,
    },
    subtitulo: {
        fontSize: 15,
        color: '#6b7280',
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    email: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7c3aed',
        marginBottom: 8,
    },
    descripcion: {
        fontSize: 16,
        color: '#1f2937',
        marginBottom: 12,
    },
    likes: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 10,
    },
    buttonLike: {
        backgroundColor: '#ede9fe',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#7c3aed',
        fontSize: 14,
        fontWeight: 'bold',
    },
    vacio: {
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 20,
    },
    error: {
        color: '#dc2626',
        marginTop: 10,
    },
    likeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    likeIcon: {
        marginRight: 8,
    },
    buttonComentar: {
        backgroundColor: '#ede9fe',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoComentar: {
        color: '#7c3aed',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default Home;
