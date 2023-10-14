import React, { useState } from 'react';
import Flow from './Flow';
import Search from './Search';
import LandingPage from './LandingPage';
import './App.css';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(true);  // Step 1

  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);
    setSelectedNode(node);
  };

  const handleEnterSite = () => {   // Step 4
    setIsLandingPage(false);
  };

  if (isLandingPage) {
    return <LandingPage handleEnterSite={handleEnterSite} />;
  }

  return (
    <div className="app">
      <div className='toolbar'>
        <Search />
      </div>

      <div className="body">
        <Flow onNodeClick={handleNodeClick} />
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <button onClick={() => { setIsCollapsed(!isCollapsed) }}>
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          {!isCollapsed && selectedNode && (
            <div>
              <h3>Node Details</h3>
              <p>ID: {selectedNode?.id}</p>
              <p>Label: {selectedNode?.data.label}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
