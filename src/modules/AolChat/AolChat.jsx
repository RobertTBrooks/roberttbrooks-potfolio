import { useEffect } from 'react';
import React, { useRef, useState } from 'react';
import './AolChat.css';
import soplogo from '../../assets/Sop_icon.png';
import aolLogo from '../../assets/aol-logo.png';
import sendIcon from '../../assets/email-icon.png';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
//import { getAnalytics } from 'firebase/analytics';

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

function AolChat({ onClose, getTopZIndex }) {
  const [user] = useAuthState(auth);

  const [zIndex, setZIndex] = useState(() => getTopZIndex()); // Only on mount

  const wrapperRef = useRef(null);

  // Bring to front on mousedown
  useEffect(() => {
    const bringToFront = () => {

      setZIndex(getTopZIndex());
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("mousedown", bringToFront);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("mousedown", bringToFront);
      }
    };
  }, [getTopZIndex]);


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
    <div className="App" id="chatWindow" ref={wrapperRef} style={{ zIndex }}>
      <header id="chat-header">
        <img src={aolLogo} alt="" />
        <p>{user ? user.displayName : ""}</p>
        <p>AOL Messanger</p>
        <button onClick={onClose} className="close-aol" type="button">X</button>
      </header>
      <div className="aol-menu-bar">
        <span className="signout-box">
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
  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [username, setUsername] = useState("");

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      console.log("Signed in!");
    } catch (err) {
      console.error(err.message);
    }
  };

  const signUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      const uid = userCred.user.uid;

      await setDoc(doc(firestore, "users", uid), {
        username: username,
        email: signUpEmail,
        createdAt: new Date()
      });

      await updateProfile(userCred.user, {
        displayName: username
      });

      console.log("User registered with username!");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="sign-in-sign-up">
      <div className="signin-section">
        <h4>Sign In</h4>
        <label htmlFor="signin-email">Email</label>
        <input name="signin-email" placeholder="Email" value={signInEmail}
          onChange={(e) => setSignInEmail(e.target.value)}
        />
        <input type="password" placeholder="Password" value={signInPassword}
          onChange={(e) => setSignInPassword(e.target.value)}
        />
      </div>
      <button onClick={signIn}>Sign In</button>

      <div className="spacer" />

      <div className="signup-section">
        <h4>Sign Up</h4>
        <label htmlFor="username">Username</label>
        <input name="username" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="signup-email">Email</label>
        <input name="signup-email" placeholder="Email" value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
        <input type="password" placeholder="Password" value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
      </div>
      <button onClick={signUp}>Sign Up</button>
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
  const [messages] = useCollectionData(q, {
    idField: 'id',

  });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;
    const userDoc = await getDoc(doc(firestore, "users", uid));
    const username = userDoc.exists() ? userDoc.data().username : "Anonymous";

    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      username,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
    console.log("Loaded messages:", messages);

  };

  return (
    <>
      <main>
        {messages && messages.map((msg, idx) => <ChatMessage key={msg.id || idx} message={msg} />)}
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
  const { text, uid, username } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={soplogo} alt="avatar" />
      <p> <strong>{username || "Unknown"}</strong><br /> {text}</p>
    </div >
  );
}


export default AolChat;

