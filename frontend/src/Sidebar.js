import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import sendBackendRequest from './sendBackendRequest';
import './Sidebar.css';

function Sidebar({ isCollapsed, setIsCollapsed, selectedNode }) {
  const [currentLevel, setCurrentLevel] = React.useState(80);
  const [simplifiedAbstract, setSimplifiedAbstract] = React.useState('');
  const [keywords, setKeywords] = React.useState([]);
  const [resources, setResources] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const levels = [
    { value: 0, label: 'child' },
    { value: 20, label: 'highschool' },
    { value: 40, label: 'undergrad' },
    { value: 60, label: "masters" },
    { value: 80, label: 'original'}
  ];

  const fetchSimplifiedAbstract = async () => {
    setIsLoading(true);
    try {
      const selectedLevel = levels.find(l => l.value === currentLevel).label;
  
      if (selectedLevel === 'original') {
        setSimplifiedAbstract(selectedNode?.data.abstract);
        setIsLoading(false);
        return;
      }
  
      const params = new URLSearchParams({ paper: selectedNode?.data.paperId, ulev: selectedLevel });
      const response = await sendBackendRequest("get_gpt_summary", params.toString());
      console.log("Response from get_gpt_summary:", response[selectedLevel]);
  
      if (response) {
        setSimplifiedAbstract(response[selectedLevel]);
      }
    } catch (error) {
      console.error("Error fetching simplified abstract:", error);
    }
    setIsLoading(false);
  };

  const fetchKeywords = async () => {
    try {
      const params = new URLSearchParams({ paper: selectedNode?.data.paperId });
      const response = await sendBackendRequest("get_jargon", params.toString());
      if (response && response.jargon) {
        setKeywords(response.jargon);
      }
      console.log("Response from get_jargon:", response.jargon);
    } catch (error) {
      console.error("Error fetching keywords:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const params2 = new URLSearchParams({ paper: selectedNode?.data.paperId });
      const response2 = await sendBackendRequest("learn_more", params2.toString());
      if (response2 && response2.learn_more) {
        setResources(response2.learn_more);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  React.useEffect(() => {
    if (selectedNode) {
      fetchSimplifiedAbstract();
      fetchKeywords();
      fetchResources();
    }
  }, [selectedNode, currentLevel]);

  const handleLevelChange = (event, newValue) => {
    setCurrentLevel(newValue);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={() => { setIsCollapsed(!isCollapsed) }}>
        {isCollapsed ? '«' : '»'}
      </button>
      {!isCollapsed && selectedNode && (
        <div className='content-box'>
          <h4>{selectedNode?.data.label}</h4>
          <a href={`https://www.semanticscholar.org/paper/${selectedNode?.data.paperId}`} 
             style={{ fontSize: '12px' }} 
             target="_blank" 
             rel="noopener noreferrer">
            Link to Paper
          </a>
          <Typography gutterBottom>
            Abstract Level:
          </Typography>
          <Slider
            className='slider'
            defaultValue={80}
            aria-label="Simplification Level"
            step={null}
            marks={levels}
            onChange={handleLevelChange}
            valueLabelDisplay="auto"
            max={80}
          />
          <div>
            <p>{isLoading ? (
              <p style={{marginBottom: '500px'}}>Loading...</p>
            ) : (simplifiedAbstract ?? selectedNode?.data.abstract)}</p>
          </div>
          <div>
            <h5>Keywords:</h5>
                {typeof keywords === 'string' ? (
                  keywords.split('- ').map((keyword, index) => (
                      <a 
                          key={index} 
                          href={`https://www.google.com/search?q=${keyword}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="keyword-link">
                          {keyword.trim()}
                      </a>
                  ))
              ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
