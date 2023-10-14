import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

function TextBoxNode({ id, data, isConnectable }) {
  const { label, onRemove } = data;

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="react-flow__node-default" style={{ border: '1px solid gray', padding: '10px', background: 'white' }}>
      <div className="header" style={{ cursor: 'grab', background: '#f0f0f0', padding: '5px', marginBottom: '5px' }}>
        TextBox Node
      </div>
      <div>
        <textarea 
          placeholder="Enter text..." 
          defaultValue={label}
          onMouseDown={handleMouseDown}
        ></textarea>
        <button onClick={() => onRemove(id)} onMouseDown={handleMouseDown}>x</button>
        <div>this is textbox node</div>
        <Handle
          type="target"
          position={Position.Right}
          style={{ background: '#555' }}
          onConnect={(params) => console.log('handle onConnect', params)}
        />
      </div>
    </div>
  );
};

export default TextBoxNode;
