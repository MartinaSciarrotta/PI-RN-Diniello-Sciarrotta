import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';

function Profile(props) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [posteos, setPosteos] = useState([]);

  useEffect(() => {
    setEmail(auth.currentUser.email);

    db.collection('users')
      .where('email', '==', auth.currentUser.email)
      .onSnapshot(docs => {
        docs.forEach(doc => {
          setUserName(doc.data().userName);
        })
      })

    db.collection('posts')
      .where('email', '==', auth.currentUser.email)
      .onSnapshot(docs => {
        let posts = [];
        docs.forEach(doc => {
          posts.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setPosteos(posts);
      })
  }, [])

  function logout() {
    auth.signOut()
      .then(() => props.navigation.navigate('Login'))
      .catch(e => console.log(e))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.email}>{email}</Text>

        <Pressable style={styles.button} onPress={() => logout()}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </Pressable>
      </View>

      <Text style={styles.seccion}>Mis posteos ({posteos.length})</Text>

      {posteos.length === 0 ?
        <Text style={styles.vacio}>Todavía no publicaste nada</Text>
        :
        <View style={styles.flatlist}>
          <FlatList
            data={posteos}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <View style={styles.card}>
                <Text style={styles.cardTexto}>{item.data.descripcion}</Text>
                <Text style={styles.cardLikes}>{item.data.likes.length} me gusta</Text>
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
  header: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e1065',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  seccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e1065',
    marginBottom: 10,
  },
  vacio: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
  flatlist: {
    width: '100%',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardTexto: {
    fontSize: 16,
    color: '#1f2937',
  },
  cardLikes: {
    fontSize: 13,
    color: '#7c3aed',
    marginTop: 8,
  },
});

export default Profile;