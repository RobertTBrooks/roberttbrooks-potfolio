import { useState, useRef, useEffect } from 'react';
import './DeskTop.css';
import AolChat from './modules/AolChat/AolChat.jsx';
import IExplorer from './modules/IExplorer/IExplorer.jsx';
import PdfViewer from './modules/PdfView/PdfView.jsx';
import Clock from './modules/Clock/Clock.jsx';

function DeskTop() {
  const [showChat, setShowChat] = useState(false);
  const [showIExplorer, setShowIExplorer] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const [zIndices, setZIndices] = useState({
    chat: 101,
    ie: 102,
    pdf: 103,
  });

  const startMenu = useRef(null);
  const zIndexRef = useRef(103);

  const bringToFront = (key) => {
    zIndexRef.current += 1;
    setZIndices((prev) => ({
      ...prev,
      [key]: zIndexRef.current,
    }));
  };

  const AolIconClicked = () => {
    setShowChat(true);
    bringToFront('chat');
  };

  const IExplorerClicked = () => {
    setShowIExplorer(true);
    bringToFront('ie');
  };

  const PdfViewerClicked = () => {
    setShowPdfViewer(true);
    bringToFront('pdf');
  };

  const StartMenuClicked = () => setShowStartMenu(prev => !prev);

  useEffect(() => {
    const CloseStartMenu = (event) => {
      if (
        startMenu.current &&
        !startMenu.current.contains(event.target) &&
        !event.target.closest("#start-button")
      ) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener("mousedown", CloseStartMenu);
    return () => document.removeEventListener("mousedown", CloseStartMenu);
  }, []);

  return (
    <div id="wrapper">
      <div id="desktop">
        {showChat && (
          <AolChat zIndex={zIndices.chat} bringToFront={() => bringToFront('chat')} onClose={() => setShowChat(false)} />
        )}
        {showIExplorer && (
          <IExplorer zIndex={zIndices.ie} bringToFront={() => bringToFront('ie')} onClose={() => setShowIExplorer(false)} />
        )}
        {showPdfViewer && (
          <PdfViewer zIndex={zIndices.pdf} bringToFront={() => bringToFront('pdf')} onClose={() => setShowPdfViewer(false)} />
        )}

        <div className="desktop-icon-grid">
          <span onClick={AolIconClicked} id="aol-desktop-icon"><span id="aol-desktop-image-icon"></span><p>AOL Messenger</p></span>
          <span onClick={IExplorerClicked} id="iexplorer-desktop-icon" ><span id="iexplorer-desktop-image-icon"></span><p>IExplorer</p></span>
          <span onClick={PdfViewerClicked} id="pdf-desktop-icon"><span id="pdf-desktop-image-icon"></span><p>RobertTB-Resume.pdf</p></span>
        </div>

        {showStartMenu && (
          <div className="start-menu-screen" ref={startMenu}>
            <div className="left-menu-banner">Windows 3.1</div>
            <div className="doc-menu-bar">
              <span onClick={() => { IExplorerClicked(); setShowStartMenu(false); }} id="iexplorer-menu-icon">
                <span id="iexplorer-menu-image-icon"></span>
                <p className="ie-menu-text">IExplorer</p>
              </span>
              <span onClick={() => { AolIconClicked(); setShowStartMenu(false); }} id="aol-menu-icon">
                <span id="aol-menu-image-icon"></span>
                <p className="aol-menu-text">AOL Messenger</p>
              </span>
              <span onClick={() => { PdfViewerClicked(); setShowStartMenu(false) }} id="pdf-menu-icon">
                <span id="pdf-menu-image-icon"></span>
                <p className="pdf-menu-text">RobertTB-Resume.pdf</p>
              </span>
            </div>
          </div>
        )}
      </div>

      <div id="task-bar">
        <button onClick={StartMenuClicked} id="start-button" type="button">Start</button>
        <div className="task-icons-grid">
          {showPdfViewer && (
            <span className="task-bar-icons" onClick={() => bringToFront('pdf')}>
              <span className="pdf-task-icon"></span>RobertTB-Resume
            </span>
          )}
          {showChat && (
            <span className="task-bar-icons" onClick={() => bringToFront('chat')}>
              <span className="aol-task-icon"></span>AOL Messenger
            </span>
          )}
          {showIExplorer && (
            <span className="task-bar-icons" onClick={() => bringToFront('ie')}>
              <span className="ie-task-icon"></span>IExplorer
            </span>
          )}
        </div>
        <div className="time-date-box">
          <Clock />
        </div>
      </div>
    </div>
  );
}

export default DeskTop;

