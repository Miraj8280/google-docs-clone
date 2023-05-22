import React from 'react';
import '../styles/toolBar.css';
import docsPng from '../assets/google-docs.png'

function ToolBar() {
  return (
    <div className="toolbar">
      <div className="toolbar-icon">
        <img src={docsPng} alt="Docs Icon" />
      </div>
      <div className="toolbar-content">
        <div className="toolbar-title">Untitled document</div>   
        <div className="toolbar-actions">
          <button className="toolbar-button">File</button>
          <button className="toolbar-button">Edit</button>
          <button className="toolbar-button">View</button>
          <button className="toolbar-button">Insert</button>
          <button className="toolbar-button">Format</button>
          <button className="toolbar-button">Tools</button>
          <button className="toolbar-button">Extensions</button>
          <button className="toolbar-button">Help</button>
        </div>
      </div>
    </div>
  )
}

export default ToolBar;