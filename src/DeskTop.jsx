import { useState, useRef } from 'react';
import './DeskTop.css'
import AolChat from './modules/AolChat/AolChat.jsx';
import IExplorer from './modules/IExplorer/IExplorer.jsx';

function DeskTop() {
  const [showChat, setShowChat] = useState(false);
  const [showIExplorer, setShowIExplorer] = useState(false);

  const zIndexRef = useRef(100);
  const getTopZIndex = () => {
    zIndexRef.current += 1;
    return zIndexRef.current;
  };

  const AolIconClicked = () => {
    console.log("AOL is Opening...");
    setShowChat(true);
  };

  const IExplorerClicked = () => {
    console.log("IExplorer is Opening...");
    setShowIExplorer(true);
  };

  return (
    <div id="wrapper">
      <div id="desktop">
        {showChat && <AolChat getTopZIndex={getTopZIndex} onClose={() => setShowChat(false)} />}
        {showIExplorer && <IExplorer getTopZIndex={getTopZIndex} onClose={() => setShowIExplorer(false)} />}

        <span onClick={AolIconClicked} id="aol-desktop-icon">
          <span id="aol-desktop-image-icon"></span>
          <p>AOL Messenger</p>
        </span>

        <span onClick={IExplorerClicked} id="iexplorer-desktop-icon">
          <span id="iexplorer-desktop-image-icon"></span>
          <p>IExplorer</p>
        </span>
      </div>

      <div id="task-bar">
        <button id="start-button" type="button">Start</button>
      </div>
    </div>
  );
}

export default DeskTop;

