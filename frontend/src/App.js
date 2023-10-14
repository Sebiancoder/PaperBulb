import React, { useState } from 'react';
import  Flow  from './Flow';
import Search from './Search';
import './App.css';
import 'react-flow-renderer/dist/style.css';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // state to manage the sidebar

  return (
    <div className="app">
      <div className='toolbar'>
        <Search />
      </div>

      <div className="body">

        <Flow onNodeClick={setSelectedNode} />
        
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <button onClick={() => { setIsCollapsed(!isCollapsed) }}>
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
          {!isCollapsed && (
            <div>
              <h3>Node Details</h3>
              <p>ID: {selectedNode?.id}</p>
              <p>Label: {selectedNode?.data?.label}</p>
              {/* Add more details or actions here */}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


export default App;
