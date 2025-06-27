import { useState } from 'react';
import './DeskTop.css'
import AolChat from './modules/AolChat.jsx';



function DeskTop() {
  const [showChat, setShowChat] = useState(false);

  const AolIconClicked = () => {
    console.log("Aol is Opening....")
    setShowChat(true);
  }



  return (
    <div id="wrapper">
      <div id="desktop">
        {showChat && <AolChat onClose={() => setShowChat(false)} />}

        <span onClick={AolIconClicked} id="aol-desktop-icon">
          <span id="aol-desktop-image-icon">

          </span>
          <p>Aol Messager</p>
        </span>

      </div>
      <div id="task-bar">
        <button id="start-button" type="button"> Start</button>
      </div>
    </div>
  )
}


export default DeskTop;
