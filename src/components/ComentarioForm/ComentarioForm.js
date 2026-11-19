import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { db, auth } from '../../firebase/config';

function ComentarioForm(props) {
    const { postId } = props;

    const [comentario, setComentario] = useState('');
    const [error, setError] = useState('');

    function guardarComentario() {
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
        <View>
            <TextInput
                style={styles.field}
                placeholder="Escribí un comentario..."
                placeholderTextColor='#9ca3af'
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

export default ComentarioForm;
