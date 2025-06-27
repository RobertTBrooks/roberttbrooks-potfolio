import { useState } from 'react'
import './DeskTop.css'

function DeskTop() {

  return (
    <div id="wrapper">
      <div id="desktop">
        <span id="aol-desktop-icon">
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
