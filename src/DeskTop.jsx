import { useState, useRef } from 'react';
import './DeskTop.css'
import AolChat from './modules/AolChat/AolChat.jsx';
import IExplorer from './modules/IExplorer/IExplorer.jsx';
import PdfViewer from './modules/PdfView/PdfView.jsx';

function DeskTop() {
  const [showChat, setShowChat] = useState(false);
  const [showIExplorer, setShowIExplorer] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const startMenu = useRef(null);

  const zIndexRef = useRef(100);
  const getTopZIndex = () => {
    zIndexRef.current += 1;
    return zIndexRef.current;
  };

  const AolIconClicked = () => {
    console.log("AOL is Opening...");
    setShowChat(true);
    CloseStartMenu()
  };

  const IExplorerClicked = () => {
    console.log("IExplorer is Opening...");
    setShowIExplorer(true);
    CloseStartMenu()
  };


  const PdfViewerClicked = () => {
    console.log("PDF Viewer is Opening...");
    setShowPdfViewer(true);
    CloseStartMenu()
  };

  const StartMenuClicked = () => {
    console.log("Start Menu Opening...");
    setShowStartMenu(prev => !prev);
  }

  const CloseStartMenu = () => {
    if (showStartMenu) {
      console.log("Clicked out side of menu... closing");
      setShowStartMenu(false);

    }
  }

  return (
    <div id="wrapper">
      <div id="desktop">
        {showChat && <AolChat getTopZIndex={getTopZIndex} onClose={() => setShowChat(false)} />}
        {showIExplorer && <IExplorer getTopZIndex={getTopZIndex} onClose={() => setShowIExplorer(false)} />}
        {showPdfViewer && <PdfViewer getTopZIndex={getTopZIndex} onClose={() => setShowPdfViewer(false)} />}

        <div onClick={CloseStartMenu} className="desktop-icon-grid">

          <span onClick={AolIconClicked} id="aol-desktop-icon">
            <span id="aol-desktop-image-icon"></span>
            <p>AOL Messenger</p>
          </span>

          <span onClick={IExplorerClicked} id="iexplorer-desktop-icon">
            <span id="iexplorer-desktop-image-icon"></span>
            <p>IExplorer</p>
          </span>

          <span onClick={PdfViewerClicked} id="pdf-desktop-icon">
            <span id="pdf-desktop-image-icon"></span>
            <p>RobertTB-Resume.pdf</p>
          </span>
        </div>
        {showStartMenu && (

          <div className="start-menu-screen" ref={startMenu}>
            <div className="left-menu-banner">
              Windows 3.1
            </div>

            <div className="doc-menu-bar">

              <span onClick={IExplorerClicked} id="iexplorer-menu-icon">
                <span id="iexplorer-menu-image-icon"></span>
                <p className="ie-menu-text">IExplorer</p>
              </span>
              <span onClick={AolIconClicked} id="aol-menu-icon">
                <span id="aol-menu-image-icon"></span>
                <p className="aol-menu-text">AOL Messenger</p>
              </span>
              <span onClick={PdfViewerClicked} id="pdf-menu-icon">
                <span id="pdf-menu-image-icon"></span>
                <p className="pdf-menu-text">RobertTB-Resume.pdf</p>
              </span>
            </div>
          </div>
        )};
      </div>
      <div id="task-bar">
        <button onClick={StartMenuClicked} id="start-button" type="button">Start</button>
      </div>
    </div >
  );
}

export default DeskTop;

