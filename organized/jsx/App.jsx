import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FileOrganizer from './components/FileOrganizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', Arial, sans-serif", position: 'relative', overflow: 'hidden' }}>
              <style>
                {`
                  .landing-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 60px 20px;
                    text-align: center;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                    color: #fff;
                  }
                  .landing-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #6b7280 0%, #1e3a8a 100%);
                    z-index: 1;
                  }
                  .landing-heading {
                    font-size: 48px;
                    margin-bottom: 24px;
                    font-weight: 800;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                  }
                  .landing-paragraph {
                    font-size: 20px;
                    line-height: 1.8;
                    margin-bottom: 20px;
                    opacity: 0.9;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                  }
                  .analyze-button {
                    display: inline-block;
                    padding: 14px 32px;
                    background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 20px;
                    font-weight: 600;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                  }
                  .analyze-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
                  }
                  .analyze-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                  }
                  .file-icons {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    pointer-events: none;
                  }
                  .file-icon {
                    position: absolute;
                    font-size: 40px;
                    opacity: 0.15;
                    animation: float 10s infinite ease-in-out;
                  }
                  .file-icon:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
                  .file-icon:nth-child(2) { top: 20%; right: 20%; animation-delay: 2s; }
                  .file-icon:nth-child(3) { bottom: 15%; left: 25%; animation-delay: 4s; }
                  .file-icon:nth-child(4) { bottom: 25%; right: 15%; animation-delay: 6s; }
                  .file-icon:nth-child(5) { top: 30%; left: 50%; animation-delay: 8s; }
                  @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                  }
                `}
              </style>
              <div className="landing-background"></div>
              <div className="file-icons">
                <span className="file-icon">📄</span>
                <span className="file-icon">🖼</span>
                <span className="file-icon">🎥</span>
                <span className="file-icon">🎵</span>
                <span className="file-icon">💻</span>
              </div>
              <div className="landing-container">
                <h1 className="landing-heading">Automated File Organizing System</h1>
                <p className="landing-paragraph">
                  Discover the power of effortless file management with our Automated File Organizing System. Seamlessly organize images, documents, videos, code, and more with intelligent sorting based on file type, size, or date.
                </p>
                <p className="landing-paragraph">
                  Drag and drop your files or entire folders to experience instant categorization. Preview your files in detail, download them by category, or clear your workspace with a single click. Simplify your digital life today.
                </p>
                <p className="landing-paragraph">
                  Ready to transform how you manage your files? Dive in and start organizing with ease and precision.
                </p>
                <Link to="/organizer" className="analyze-button">
                  Ready to Analyze
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/organizer" element={<FileOrganizer />} />
      </Routes>
    </Router>
  );
}

export default App;