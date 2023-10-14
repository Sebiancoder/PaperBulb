import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, useNodesState, useEdgesState, MiniMap, Controls, Background } from 'react-flow-renderer';
import { ArticleNode } from './ArticleNode';
import TextBoxNode from './TextBoxNode';
import sendBackendRequest from './sendBackendRequest';

const nodeTypes = {
  article: ArticleNode,
  textbox: TextBoxNode
};

function FlowComponent({ onNodeClick, paperId }) {
  const defaultNode = [{
    id: 'default',
    type: 'article',
    position: { x: 200, y: 200 }, // adjust position to center or wherever you prefer
    data: { label: 'Search Something and Select a Paper' }
  }];

  const [nodes, setNodes] = useNodesState(defaultNode);
  const [edges, setEdges] = useEdgesState([]);

  const getInitialNodes = async () => {
    try {
        const params = new URLSearchParams({ 
          start_paper: paperId,
          ref_dlim: 1,
          cb_dlim: 1
        });
        console.log("params:", params.toString());
        const response = await sendBackendRequest("generate_graph", params.toString());
          
        if (response) {
            const nodes = [];
            const edges = [];
            
            Object.keys(response).forEach(paperId => {
                const paper = response[paperId];
                nodes.push({
                    id: paperId,
                    type: 'article',
                    position: { x: Math.random() * 400, y: Math.random() * 400 },
                    data: { label: paper.title || 'No title' }
                });

                (paper.references || []).forEach(ref => {
                    if (response[ref]) {
                        edges.push({
                            id: `${paperId}-${ref}`,
                            source: paperId,
                            target: ref,
                            type: 'simplebezier'
                        });
                    }
                });
            });

            setNodes(nodes.length ? nodes : defaultNode); // If no nodes were added, revert back to default
            setEdges(edges);
        }

        console.log("Transformed nodes and edges:", nodes, edges);
    } catch (error) {
        console.error("Error fetching initial nodes:", error);
    }
  };

  useEffect(() => {
    if (paperId) {
      getInitialNodes();
    }
  }, [paperId]);

  const handleNodeClick = useCallback((event, node) => {
    if (node.id === 'default') return;

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
      nodes={nodes}
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

export default function Flow({ onNodeClick, paperId }) {
  return (
    <ReactFlowProvider>
      <FlowComponent onNodeClick={onNodeClick} paperId={paperId} />
    </ReactFlowProvider>
  );
}
