import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import sendBackendRequest from './sendBackendRequest';
import './Sidebar.css';
import { fontSize } from '@mui/system';

function Sidebar({ isCollapsed, setIsCollapsed, selectedNode }) {
  const [currentLevel, setCurrentLevel] = React.useState(20);
  const [simplifiedAbstract, setSimplifiedAbstract] = React.useState('');
  
  const levels = [
    { value: 0, label: 'child' },
    { value: 20, label: 'highschool' },
    { value: 40, label: 'undergrad' },
    { value: 60, label: "masters" },
    { value: 80, label: 'phd' },
    { value: 100, label: 'expert' }
  ];

  React.useEffect(() => {
    const fetchSimplifiedAbstract = async () => {
      try {
        const selectedLevel = levels.find(l => l.value === currentLevel).label;
        const params = new URLSearchParams({ paper: selectedNode?.data.paperId, level: selectedLevel });
        const response = await sendBackendRequest("get_gpt_summary", params.toString());
        if (response) {
          setSimplifiedAbstract(response.abstract);
        }
      } catch (error) {
        console.error("Error fetching simplified abstract:", error);
      }
    };

    if (selectedNode) {
      fetchSimplifiedAbstract();
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
        <div>
          <h4>{selectedNode?.data.label}</h4>
            <a href={`https://www.semanticscholar.org/paper/${selectedNode?.data.paperId}`} style={{ fontSize: '12px' }}>Link to Paper</a>
          
          <Typography gutterBottom>
            Simplify for:
          </Typography>
          <Slider
            className='slider'
            defaultValue={20}
            aria-label="Simplification Level"
            step={null}
            marks={levels}
            onChange={handleLevelChange}
            valueLabelDisplay="auto"
          />
          <p>{simplifiedAbstract || selectedNode?.data.abstract}</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
