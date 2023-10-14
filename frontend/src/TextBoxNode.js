// TextBoxNode.js
import React from 'react';
import { Handle } from 'react-flow-renderer';

function TextBoxNode({ id, data, onRemove }) {
  return (
    <div style={{ border: '1px solid gray', padding: '10px', background: 'white' }}>
      <textarea placeholder="Enter text..." defaultValue={data.label}></textarea>
      <button
        style={{ position: 'absolute', right: 0, top: 0 }}
        onClick={() => onRemove(id)}
      >
        x
      </button>
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
    </div>
  );
}

export default TextBoxNode;
