import React, { useState } from 'react';
import Flow from './Flow';
import Search from './Search';
import './App.css';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);
    setSelectedNode(node); // Update the selectedNode state
  };

  return (
    <div className="app">
      <div className='toolbar'>
        <Search />
      </div>

      <div className="body">
        {/* Pass the onNodeClick callback to FlowComponent */}
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
              {/* Add more details or actions here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
