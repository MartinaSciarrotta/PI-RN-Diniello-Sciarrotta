
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

function NuevoPost(props) {
    const [descripcion, setDescripcion] = useState('');
    const [postError, setPostError] = useState('');

    function guardarPost() {
        if (!auth.currentUser) {
            setPostError('Tenés que iniciar sesión para publicar.');
            return;
        }

        db.collection('posts').add({
            descripcion: descripcion,
            email: auth.currentUser.email,
            createdAt: Date.now(),
            likes: [],
            comentarios: [],
        })
            .then(() => {
                setDescripcion('');
                setPostError('');
            })
            .catch(e => {
                console.log(e);
                setPostError('No se pudo guardar el posteo.');
            });
    }

    function onSubmit() {
        if (descripcion === '') {
            setPostError('Escribí algo antes de publicar');
        } else {
            guardarPost();
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Nuevo posteo</Text>
            <Text style={styles.subtitulo}>
                Compartí algo con la comunidad
            </Text>

            <TextInput
                style={styles.field}
                keyboardType='default'
                placeholder='¿Qué querés contar?'
                onChangeText={text => setDescripcion(text)}
                value={descripcion}
                multiline={true}
            />

            <Pressable
                style={styles.button}
                onPress={() => onSubmit()}
            >
                <Text style={styles.buttonText}>Publicar</Text>
            </Pressable>

            <Text style={styles.error}>{postError}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f3ff',
        paddingHorizontal: 24,
        paddingTop: 60,
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
    field: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderStyle: 'solid',
        borderRadius: 10,
        fontSize: 15,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#7c3aed',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: '#dc2626',
        marginTop: 10,
    },
});

export default NuevoPost;
