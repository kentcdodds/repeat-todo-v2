import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyA97ojPcCkfPdcW83hEPguaRRaIBTMSI2k',
  authDomain: 'repeat-todo.firebaseapp.com',
  databaseURL: 'https://repeat-todo.firebaseio.com',
  projectId: 'repeat-todo',
  storageBucket: 'repeat-todo.appspot.com',
}
firebase.initializeApp(config)

export default firebase
