
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore'; 
import { useRef, useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyBMaLnZlBQmgh0ypfFx_EBf8kEC-XRC-vA",
  authDomain: "livinnotalks.firebaseapp.com",
  projectId: "livinnotalks", 
  storageBucket: "livinnotalks.appspot.com",
  messagingSenderId: "487675316430",
  appId: "1:487675316430:web:20b66a3313e5a08870e89f",
  measurementId: "G-RGVM76Q1TN"
})

const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Livinnotalks</h1>
        <SignOut />
      </header>
      <section>
          {user ? <ChatRoom /> : <SignIn /> }
        </section>
    </div>
  );
}


function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })


    setFormValue('')

    dummy.scrollIntoView({ behavior: 'smooth'});

  }



  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message = {msg}/>)}

        <div ref={dummy}></div>

      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}></input>
        <button type='submit'>Send</button>
      </form>

    </>
  )

}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (
  <div className={`message ${messageClass}`}>
    <img alt='Livinnotalks' src={photoURL} />
    <p>{text}</p>
  </div>
  )
}


export default App;
