import React from 'react';
import { Handle } from 'react-flow-renderer';

function ArticleNode({ data }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '10px',
        borderRadius: '5px',
        background: 'lightgray',
        border: '1px solid gray',
        textAlign: 'center',
        width: '300px',
        height: 'fit-content',
        fontSize: '1.5em',
      }}
    >
      {/* Centered handles */}
      <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translate(-50%, -50%)' }}>
        <Handle type="target" position="left" style={{ background: 'transparent' }} />
      </div>
      <div style={{ position: 'absolute', top: '50%', right: '0', transform: 'translate(50%, -50%)' }}>
        <Handle type="source" position="right" style={{ background: 'transparent' }} />
      </div>
      {data.label}
    </div>
  );
}

export { ArticleNode };
