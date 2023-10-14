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

  function getNodeLevels(startNodeId, edges) {
    let levels = {};
    let visited = new Set();
    let queue = [{ id: startNodeId, level: 0 }];
  
    while (queue.length > 0) {
      let current = queue.shift();
      visited.add(current.id);
      levels[current.id] = current.level;
  
      // Find neighbors of the current node
      let neighbors = edges.filter(e => e.source === current.id || e.target === current.id)
                           .map(e => e.source === current.id ? e.target : e.source)
                           .filter(id => !visited.has(id));
  
      for (let neighbor of neighbors) {
        queue.push({ id: neighbor, level: current.level + 1 });
      }
    }
  
    return levels;
  }
  
  const getInitialNodes = async () => {
    try {
        const params = new URLSearchParams({ 
          start_paper: paperId,
          ref_dlim: 1,
          cb_dlim: 1
        });
        const response = await sendBackendRequest("generate_graph", params.toString());
        if (response) {
            let nodes = [];
            const edges = [];
            // Create node objects
            Object.keys(response).forEach(paperId => {
              const paper = response[paperId];
              if (!paper) { 
                console.warn(`No paper metadata found for paperId: ${paperId}`);
                return; 
              }
              nodes.push({
                id: paperId,
                type: 'article',
                year: paper.year || 0,
                position: { x: 0, y: 0 },
                data: {
                  label: paper.title || 'No title', 
                  abstract: paper.abstract || 'No abstract',
                  authors: paper.authors || 'No authors',
                  year: paper.year || 'No year',
                  paperId: paperId
                }
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

            // Assign x position based on reverse level (deepest nodes first)
            const levels = getNodeLevels(paperId, edges);
            const maxLevel = Math.max(...Object.values(levels));
            const spacingX = 500; // Change this for desired spacing between levels
            const spacingY = 300;  // Vertical spacing
            const yearSpacing = 200; // Spacing within the same level based on year

            // Group nodes by levels
            const nodesByLevel = {};
            nodes.forEach(node => {
                const level = levels[node.id] || 0;
                if (!nodesByLevel[level]) {
                    nodesByLevel[level] = [];
                }
                nodesByLevel[level].push(node);
            });

            // Flatten nodes array while maintaining the order: first by level then by year within each level
            const sortedNodes = [];
            Object.keys(nodesByLevel)
                .sort((a, b) => b - a) // Sort level in descending order so that deeper levels come first
                .forEach(level => {
                    // Within each level, sort by year in ascending order
                    const nodesInLevel = nodesByLevel[level].sort((a, b) => a.year - b.year);
                    sortedNodes.push(...nodesInLevel);
                });

            // Now, assign x and y positions based on the order in sortedNodes
            let currentLevel = -1;
            let xOffset = 0;
            sortedNodes.forEach((node, idx) => {
                const nodeLevel = levels[node.id] || 0;
                
                if (currentLevel !== nodeLevel) {
                    xOffset += spacingX;
                    currentLevel = nodeLevel;
                } else {
                    xOffset += yearSpacing;
                }

                // Distribute nodes on the y-axis with a slight random factor
                const randomYOffset = Math.random() * 100 - 50; // Random value between -50 and 50
                node.position.y = (idx % 3) * spacingY + randomYOffset; 

                node.position.x = xOffset;
            });

            setNodes(nodes.length ? nodes : defaultNode);
            setEdges(edges);



        }
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
          data: { label: '', onRemove: handleRemoveNode }
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
      nodesDraggable={true} // this is true by default

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
