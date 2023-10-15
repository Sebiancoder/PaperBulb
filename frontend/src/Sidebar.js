import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import sendBackendRequest from './sendBackendRequest';
import './Sidebar.css';
import { select } from 'd3-selection';

function Sidebar({ isCollapsed, setIsCollapsed, selectedNode }) {
  const [currentLevel, setCurrentLevel] = React.useState(80);
  const [simplifiedAbstract, setSimplifiedAbstract] = React.useState('');
  const [keywords, setKeywords] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const levels = [
    { value: 0, label: 'child' },
    { value: 20, label: 'highschool' },
    { value: 40, label: 'undergrad' },
    { value: 60, label: "masters" },
    { value: 80, label: 'original'}
  ];

  React.useEffect(() => {
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

    if (selectedNode) {
      fetchSimplifiedAbstract();
    }
  }, [selectedNode, currentLevel]);

  React.useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const params = new URLSearchParams({ paper: selectedNode?.data.paperId });
        const response = await sendBackendRequest("get_jargon", params.toString());
        if (response && response.jargon) {
          setKeywords(response.jargon);
        }
        const params2 = new URLSearchParams({ paper: selectedNode?.data.paperId });
        const response2 = await sendBackendRequest("learn_more", params2.toString());
        if (response2 && response2.learn_more) {
          setKeywords(response.learn_more);
        }
      } catch (error) {
        console.error("Error fetching keywords:", error);
      }
    };
  
    if (selectedNode) {
      fetchKeywords();
    }
  }, [selectedNode]);

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
          <p>{isLoading ? (
            <p style={{marginBottom: '500px'}}>Loading...</p>
          ) : (simplifiedAbstract?.toString() ?? selectedNode?.data.abstract)}</p>
          <div>
            <h5>Keywords:</h5>
            {/* <ul>
              {keywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
