import React, { useState, useEffect } from 'react';
import Flow from './Flow';
import Search from './Search';
import LandingPage from './LandingPage';
import Sidebar from './Sidebar';
import './App.css';
import 'react-flow-renderer/dist/style.css';


function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [papers, setPapers] = useState({});

  useEffect(() => {
    console.log("App's papers updated:", papers);
  }, [papers]);

  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);
    setSelectedNode(node);
  };

  const handleEnterSite = (paperId) => {
    setSelectedPaperId(paperId);
    setIsLandingPage(false);
  };

  if (isLandingPage) {
    return <LandingPage handleEnterSite={handleEnterSite} papers={papers} setPapers={setPapers} />;
  }

  return (
    <div className="app">
      <div className='toolbar'>
        <Search setIsLandingPage={setIsLandingPage} setPapers={setPapers} />
      </div>
  
      <div className="body">
        <Flow onNodeClick={handleNodeClick} paperId={selectedPaperId} />
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} selectedNode={selectedNode} />
      </div>

    </div>
  );
}

export default App;