import { Handle } from 'react-flow-renderer';

function ArticleNode({ data }) {
    return (
    <div style={{ padding: '10px', borderRadius: '5px', background: 'lightgray', border: '1px solid gray' }}>
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
        {/* This is the handle for connections */}
        <Handle type="target" position="left" style={{ background: '#555' }} />
        <Handle type="source" position="right" style={{ background: '#555' }} />
        </div>
        {data.label}
    </div>
    );
}
  
export { ArticleNode };