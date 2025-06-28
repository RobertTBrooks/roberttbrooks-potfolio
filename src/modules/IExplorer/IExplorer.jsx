import './IExplorer.css';
import { useEffect, useState, useRef } from 'react';

/* Bookmarked URLs */
const bookmarks = [
  { label: "To Do App", url: "https://roberttbrooks.github.io/top-to-do-list-pj/" },
  { label: "Restaurant Demo Page", url: "https://roberttbrooks.github.io/top-restaurant-page-pj/" },
  { label: "Tic-Tac-toe", url: "https://roberttbrooks.github.io/top-tic-tac-toe-pj/" },
  { label: "Small Library", url: "https://roberttbrooks.github.io/top-small-library-pj/" },
  { label: "Etch-a-Sketch", url: "https://roberttbrooks.github.io/Etch-a-Sketch_TOP_PJ/" },
];

function IExplorer({ onClose, getTopZIndex }) {
  const [urlInput, setUrlInput] = useState('');
  const [urlEntered, setUrlEntered] = useState('');
  const [currentPage, setCurrentPage] = useState("404 - Page not found");
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
    const handle = document.getElementById("tab-bar-header");
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      let url = urlInput.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      setUrlEntered(url);
      setCurrentPage(url);
    }
  };

  return (
    <div
      id="IE-wrapper"
      ref={wrapperRef}
      className={isMaximized ? "fullscreen" : "windowed"}
      style={{ zIndex }}
    >
      <div className="tab-bar" id="tab-bar-header">
        <span className="ie-header-icon"></span>
        <div className="header-title"><p>{currentPage}</p></div>
        <span className="ie-header-button-box">
          <button onClick={toggleMax} className="max-iexplorer" type="button">▢</button>
          <button onClick={onClose} className="close-iexplorer" type="button">X</button>
        </span>
      </div>

      <div className="ie-menu-bar"><p>File</p><p>Edit</p><p>Help</p></div>

      <div className="url-bar">
        <input
          id="url-search"
          type="text"
          name="url-search"
          placeholder="www.Go-to?.com"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      <div className="ie-bookmark-bar">
        {bookmarks.map(({ label, url }) => (
          <button
            key={label}
            className="ie-bookmarks"
            type="button"
            value={url}
            onClick={() => {
              setUrlEntered(url);
              setCurrentPage(url);
            }}
          >{label}</button>
        ))}
      </div>

      <div className="ie-view-port">
        <iframe
          className="ie-webpage-view"
          src={urlEntered || undefined}
          title="IE Webpage Viewer"
        />
      </div>

      <div className="ie-bottom-bar"><span></span></div>
    </div>
  );
}

export default IExplorer;

