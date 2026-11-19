import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';

function Register(props) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  function register(email, password, userName) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        db.collection('users').add({
          email: auth.currentUser.email,
          userName: userName,
          createdAt: Date.now(),
        })
          .then(() => {
            setRegisterError('');
            auth.signOut()
              .then(() => props.navigation.navigate('Login'))
          })
          .catch(e => console.log(e))
      })
      .catch(error => {
        setRegisterError(error.message);
      })
  }

    function onSubmit() {
    if (email === '') {
      setRegisterError('El email es obligatorio');
    } else if (userName === '') {
      setRegisterError('El nombre de usuario es obligatorio');
    } else if (password === '') {
      setRegisterError('La contraseña es obligatoria');
    } else {
      register(email, password, userName);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear cuenta</Text>
      <Text style={styles.subtitulo}>Sumate a la comunidad</Text>

      <TextInput
        style={styles.field}
        keyboardType='email-address'
        placeholder='Email'
        placeholderTextColor='#9ca3af'
        onChangeText={text => setEmail(text)}
        value={email}
      />

      <TextInput
        style={styles.field}
        keyboardType='default'
        placeholder='Nombre de usuario'
        placeholderTextColor='#9ca3af'
        onChangeText={text => setUserName(text)}
        value={userName}
      />

      <TextInput
        style={styles.field}
        keyboardType='default'
        placeholder='Contraseña'
        placeholderTextColor='#9ca3af'
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <Pressable style={styles.button} onPress={() => onSubmit()}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </Pressable>

      <Text style={styles.error}>{registerError}</Text>

      <Pressable onPress={() => props.navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 32,
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
    marginVertical: 6,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
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
  link: {
    color: '#7c3aed',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default Register;