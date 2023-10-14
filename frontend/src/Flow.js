import React, { useCallback } from 'react';
import ReactFlow, { ReactFlowProvider, useNodesState, useEdgesState, MiniMap, Controls, Background } from 'react-flow-renderer';
import { ArticleNode } from './ArticleNode';
import TextBoxNode from './TextBoxNode';

const nodeTypes = {
  article: ArticleNode,
  textbox: TextBoxNode
};

const initialNodes = [
  { id: '1', type: 'article', position: { x: 0, y: 100 }, data: { label: 'Deep Learning with Images of Dogs' } },
  { id: '2', type: 'article', position: { x: 300, y: 100 }, data: { label: 'Dogs for Dogs: a Systematic Review' } }
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'simplebezier' }];

function FlowComponent({ onNodeClick}) {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback((event, node) => {
    if (node.type === 'article') {
      const newNodeId = `${node.id}-textbox`;
      if (!nodes.find(n => n.id === newNodeId)) {
        const newNode = {
          id: newNodeId,
          type: 'textbox',
          position: { x: node.position.x, y: node.position.y + 100 },
          data: { label: '' }
        };
        const newEdge = {
          id: `e${node.id}-${newNodeId}`,
          source: node.id,
          target: newNodeId,
          type: 'simplebezier'
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
      }
    }
    if (onNodeClick) {
      onNodeClick(node);
    }

    return node;
  }, [setNodes, setEdges, nodes, onNodeClick]);

  const handleRemoveNode = useCallback((nodeId) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes.map(node => 
        node.type === 'textbox' ? { ...node, data: { ...node.data, onRemove: handleRemoveNode } } : node)}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default function Flow({ onNodeClick }) {
  return (
    <ReactFlowProvider>
      <FlowComponent onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}
