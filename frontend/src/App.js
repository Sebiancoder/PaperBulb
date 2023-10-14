import React, { useState } from 'react';
import Flow from './Flow';
import Search from './Search';
import LandingPage from './LandingPage';
import './App.css';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [selectedPaperId, setSelectedPaperId] = useState(null);

  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);
    setSelectedNode(node);
  };

  const handleEnterSite = (paperId) => {
    setSelectedPaperId(paperId);
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
        <Flow onNodeClick={handleNodeClick} paperId={selectedPaperId} />
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <button onClick={() => { setIsCollapsed(!isCollapsed) }}>
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          {!isCollapsed && selectedNode && (
            <div>
              <h3>{selectedNode?.data.label}</h3>
              <p>{selectedNode?.data.paperId}</p>
              <p>{selectedNode?.data.abstract}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default App;
