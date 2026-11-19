
import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../firebase/config';

import Post from '../components/Post/Post';

function Home(props) {
    const [posteos, setPosteos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.collection('posts')
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
                setLoading(false);
            });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Inicio</Text>
            <Text style={styles.subtitulo}>
                Publicaciones de la comunidad
            </Text>

            {loading ?
                <ActivityIndicator size='large' color='#7c3aed' />
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
                            <Post post={item} navigation={props.navigation} />
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
    vacio: {
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Home;
