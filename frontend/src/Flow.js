import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { ArticleNode } from './ArticleNode';
import TextBoxNode from './TextBoxNode'; 

const nodeTypes = {
  article: ArticleNode,
  textbox: TextBoxNode
};

// Adjust node positions for a horizontal layout
const initialNodes = [
  { id: '1', type: 'article', position: { x: 0, y: 100 }, data: { label: 'Deep Learning with Images of Dogs' } },
  { id: '2', type: 'article', position: { x: 300, y: 100 }, data: { label: 'Dogs for Dogs: a Systematic Review' } },
];

// Use smoothstep edges
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'simplebezier' }];

function Flow({ onNodeClick }) {

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleRemoveNode = (nodeId) => {
    // Filter out the node and connected edges
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
  
    onNodesChange(newNodes);
    setEdges(newEdges);
  };

  const handleNodeClick = (event, node) => {
  console.log("Node clicked:", node);

  // Generate a new ID for the text box node
  const newId = `${node.id}-textbox`;

  // Check if the node already has a connected text box node
  if (!nodes.find(n => n.id === newId)) {
    console.log("Creating a new textbox node...");

    const newNode = {
      id: newId,
      type: 'textbox',
      position: { x: node.position.x + 50, y: node.position.y },
      data: { label: '' }
    };

    console.log("New Node:", newNode);

    const newEdge = {
      id: `e${node.id}-${newId}`,
      source: node.id,
      target: newId,
      type: 'smoothstep'
    };

    console.log("New Edge:", newEdge);

    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];

    onNodesChange(updatedNodes); // Directly using the updated nodes array
    setEdges(updatedEdges); // Directly using the updated edges array

    console.log("Updated Nodes:", updatedNodes);
    console.log("Updated Edges:", updatedEdges);
  }

  if (onNodeClick) {
    onNodeClick(node);
  }
};



  return (
    <ReactFlow
    nodes={nodes.map(node => 
      node.type === 'textbox' ? { ...node, onRemove: handleRemoveNode } : node)}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
