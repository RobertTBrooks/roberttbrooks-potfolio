import { useState, useRef } from 'react';
import './DeskTop.css'
import AolChat from './modules/AolChat/AolChat.jsx';
import IExplorer from './modules/IExplorer/IExplorer.jsx';
import PdfViewer from './modules/PdfView/PdfView.jsx';

function DeskTop() {
  const [showChat, setShowChat] = useState(false);
  const [showIExplorer, setShowIExplorer] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

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


  const PdfViewerClicked = () => {
    console.log("PDF Viewer is Opening...");
    setShowPdfViewer(true);
  };

  return (
    <div id="wrapper">
      <div id="desktop">
        {showChat && <AolChat getTopZIndex={getTopZIndex} onClose={() => setShowChat(false)} />}
        {showIExplorer && <IExplorer getTopZIndex={getTopZIndex} onClose={() => setShowIExplorer(false)} />}
        {showPdfViewer && <PdfViewer getTopZIndex={getTopZIndex} onClose={() => setShowPdfViewer(false)} />}

        <div className="desktop-icon-grid">

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

      </div>
      <div id="task-bar">
        <button id="start-button" type="button">Start</button>
      </div>
    </div >
  );
}

export default DeskTop;

