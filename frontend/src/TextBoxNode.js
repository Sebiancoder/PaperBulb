import { Handle, Position } from 'react-flow-renderer';
import { useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

function TextBoxNode({ id, data, isConnectable }) {
  const { label, onRemove, paperId } = data;
  const [currentLevel, setCurrentLevel] = useState(20); // Default to middle school student (value for Slider)
  const [simplifiedAbstract, setSimplifiedAbstract] = useState('');

  const levels = [
    { value: 0, label: 'middle school student' },
    { value: 20, label: 'high school student' },
    { value: 40, label: 'undergraduate college student' },
    { value: 60, label: "master's student" },
    { value: 80, label: 'phd' },
    { value: 100, label: 'expert' }
  ];

  useEffect(() => {
    const fetchSimplifiedAbstract = async () => {
      try {
        const selectedLevel = levels.find(l => l.value === currentLevel).label;
        const params = new URLSearchParams({ paper: paperId, level: selectedLevel });
        const response = await sendBackendRequest("get_gpt_summary", params.toString());
        if (response) {
          setSimplifiedAbstract(response.abstract);
        }
      } catch (error) {
        console.error("Error fetching simplified abstract:", error);
      }
    };

    fetchSimplifiedAbstract();
  }, [paperId, currentLevel]);

  const handleLevelChange = (event, newValue) => {
    setCurrentLevel(newValue);
  };

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="react-flow__node-default" style={{ border: '1px solid gray', padding: '10px', background: 'white', cursor: 'move' }}>
      
      <Typography gutterBottom>
        Simplify for:
      </Typography>
      <Slider
        defaultValue={20}
        aria-label="Simplification Level"
        step={null}
        marks={levels}
        onChange={handleLevelChange}
        valueLabelDisplay="auto"
      />
      
      <p>{simplifiedAbstract || 'Fetching abstract...'}</p>

      <button onClick={() => onRemove(id)} onMouseDown={handleMouseDown}>x</button>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextBoxNode;
