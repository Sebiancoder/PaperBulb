import { Handle, Position } from 'react-flow-renderer';

function TextBoxNode({ id, data, isConnectable }) {
  const { label, onRemove } = data;

  return (
    <div className="react-flow__node-default" style={{ border: '1px solid gray', padding: '10px', background: 'white' }}>
      <div>
        <textarea placeholder="Enter text..." defaultValue={label}></textarea>
        <button onClick={() => onRemove(id)}>x</button>
        <div>this is textbox node</div>
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
      </div>
    </div>
  );
};

export default TextBoxNode;
