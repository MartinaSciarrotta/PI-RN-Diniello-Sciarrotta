import { View, Text, Pressable, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { db, auth } from '../../firebase/config';
import { FontAwesome } from '@expo/vector-icons';

function Post(props) {
    const { post, navigation } = props;
    const likes = post.data.likes !== undefined ? post.data.likes : [];

    function usuarioDioLike() {
        return likes.filter(
            item => item === auth.currentUser.email
        ).length > 0;
    }

    function darLike() {
        const email = auth.currentUser.email;

        if (usuarioDioLike()) {
            db.collection('posts').doc(post.id).update({
                likes: firebase.firestore.FieldValue.arrayRemove(email)
            })
                .catch(e => console.log(e));
        } else {
            db.collection('posts').doc(post.id).update({
                likes: firebase.firestore.FieldValue.arrayUnion(email)
            })
                .catch(e => console.log(e));
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.email}>
                {post.data.email}
            </Text>

            <Text style={styles.descripcion}>
                {post.data.descripcion}
            </Text>

            <Text style={styles.likes}>
                {likes.length} me gusta
            </Text>

            <Pressable
                style={styles.buttonLike}
                onPress={() => darLike()}
            >
                <View style={styles.likeContent}>
                    <FontAwesome
                        name={usuarioDioLike() ? 'heart' : 'heart-o'}
                        size={18}
                        color="#7c3aed"
                        style={styles.likeIcon}
                    />

                    <Text style={styles.buttonText}>
                        {usuarioDioLike() ? 'Ya no me gusta' : 'Me gusta'}
                    </Text>
                </View>
            </Pressable>

            <Pressable
                style={styles.buttonComentar}
                onPress={() => navigation.navigate(
                    'Comments',
                    { postId: post.id }
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
    );
}

const styles = StyleSheet.create({
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

export default Post;
