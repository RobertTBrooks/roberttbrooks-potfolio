import './PdfView.css';
import { useEffect, useState, useRef } from 'react';
const resumePdf = "../../../public/Robert_Resume.pdf";


function PdfViewer({ onClose, getTopZIndex }) {
  const [isMaximized, setIsMaximized] = useState(false);
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

  const toggleMax = () => setIsMaximized(prev => !prev);

  useEffect(() => {
    const elmnt = wrapperRef.current;
    const handle = document.getElementById("pdf-header-bar");
    if (!elmnt || !handle) return;

    const dragElement = (elmnt, handle) => {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

      const dragMouseDown = (e) => {
        if (isMaximized) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      };

      const elementDrag = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      };

      const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      handle.onmousedown = dragMouseDown;
    };

    dragElement(elmnt, handle);
  }, [isMaximized]);

  useEffect(() => {
    const elmnt = wrapperRef.current;
    if (isMaximized && elmnt) {
      elmnt.style.top = null;
      elmnt.style.left = null;
    }
  }, [isMaximized]);




  return (
    <div
      id="pdf-wrapper"
      ref={wrapperRef}
      className={isMaximized ? "pdf-fullscreen" : "pdf-windowed"}
      style={{ zIndex }}
    >
      <div className="pdf-headerbar" id="pdf-header-bar">
        <span className="pdf-header-icon"></span>
        <div className="pdf-header-title"><p></p></div>
        <span className="pdf-header-button-box">
          <button onClick={toggleMax} className="max-pdf-viewer" type="button">▢</button>
          <button onClick={onClose} className="close-pdf-viewer" type="button">X</button>
        </span>
      </div>

      <div className="pdf-menu-bar"><p>File</p><p>Edit</p><p>Help</p></div>

      <div className="pdf-?">
      </div>

      <div className="pdf-tool-bar">
      </div>

      <div className="pdf-view-port">
        <iframe className="pdf-webpage-view" src={resumePdf} />
      </div>


      <div className="pdf-bottom-bar"><span></span></div>
    </div>
  );
}


export default PdfViewer;
