import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        props.navigation.navigate('HomeMenu');
      }
    })
  }, [])

    function onSubmit() {
    if (email === '') {
      setLoginError('El email es obligatorio');
    } else if (password === '') {
      setLoginError('La contraseña es obligatoria');
    } else {
      auth.signInWithEmailAndPassword(email, password)
        .then(response => {
          setLoginError('');
          setEmail('');
          setPassword('');
          props.navigation.navigate('HomeMenu');
        })
        .catch(error => {
          setLoginError(error.message);
        })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenida/o</Text>
      <Text style={styles.subtitulo}>Iniciá sesión para continuar</Text>

      <TextInput
        style={styles.field}
        keyboardType='email-address'
        placeholder='Email'
        onChangeText={text => setEmail(text)}
        value={email}
      />

      <TextInput
        style={styles.field}
        keyboardType='default'
        placeholder='Contraseña'
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
      />

      <Pressable style={styles.button} onPress={() => onSubmit()}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Text style={styles.error}>{loginError}</Text>

      <Pressable onPress={() => props.navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
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

export default Login;