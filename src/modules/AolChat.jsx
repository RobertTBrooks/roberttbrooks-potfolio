import { useEffect } from 'react';
// Updated for Firebase v9+ Modular SDK

import React, { useRef, useState } from 'react';
import './AolChat.css';
import soplogo from '../assets/Sop_icon.png';
import aolLogo from '../assets/aol-logo.png';
import sendIcon from '../assets/email-icon.png';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
//import { getAnalytics } from 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
//const analytics = getAnalytics(app);

function AolChat() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    const dragElement = (elmnt, handle) => {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

      const dragMouseDown = (e) => {
        e.preventDefault();
        // Get mouse cursor position at start
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      };

      const elementDrag = (e) => {
        e.preventDefault();
        // Calculate new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set new element position
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      };

      const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      // If handle exists, use that to drag, else drag whole element
      (handle || elmnt).onmousedown = dragMouseDown;
    };

    const appWindow = document.getElementById("chatWindow");
    const appHeader = document.getElementById("chat-header");
    if (appWindow && appHeader) {
      dragElement(appWindow, appHeader);
    }
  }, []);
  return (
    <div className="App" id="chatWindow">
      <header id="chat-header">
        <img src={aolLogo} alt="" />
        <p>{user ? user.displayName : ""}</p>
      </header>
      <div class="menu-bar">
        <span className="menu-bar-drop-down">
          <SignOut />
        </span>
        <hr />
      </div>
      <div className="chat-boarder">
        <h4>Online</h4>

        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </div>
    </div>
  );
}


function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");

  const signUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(firestore, "users", uid), {
        username: username,
        email: email,
        createdAt: new Date()
      });

      console.log("User registered with username!");
    } catch (err) {
      console.error(err.message);
    }
  };
  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in!");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="sign-in-sign-up">

      <label for="username">Enter or Create Username</label>
      <input name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label for="emai">Email & Password</label>
      <input name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <span className="sign-in-button-box">
        <button onClick={signIn}>Sign In</button>
        <button onClick={signUp}>Sign Up</button>
      </span>

    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(q, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    const userDoc = await getDoc(doc(firestore, "users", uid));
    const username = userDoc.exists() ? userDoc.data().username : "Anonymous";

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      username,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter a Message" />
        <button type="submit" disabled={!formValue}><img className="send-icon" src={sendIcon} /></button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, username } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || soplogo} alt="avatar" />
      <p> <strong>{username || "Unknown"}</strong><br /> {text}</p>
    </div >
  );
}


export default AolChat;

