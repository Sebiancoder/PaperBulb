import { Handle, Position } from 'react-flow-renderer';

function TextBoxNode({ id, data, isConnectable }) {
  const { label, onRemove } = data;

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="react-flow__node-default" style={{ border: '1px solid gray', padding: '10px', background: 'white', cursor: 'move' }}>
      <textarea 
        placeholder="Enter text..." 
        defaultValue={label}
        onMouseDown={handleMouseDown}
      ></textarea>
      <button onClick={() => onRemove(id)} onMouseDown={handleMouseDown}>x</button>
      <div>this is textbox node</div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextBoxNode;
