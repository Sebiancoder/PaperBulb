import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {PanOnScrollMode, ReactFlowProvider, useNodesState, useEdgesState, MiniMap, Controls, Background } from 'react-flow-renderer';
import { ArticleNode } from './ArticleNode';
import sendBackendRequest from './sendBackendRequest';
import FilterMenu from './FilterMenu';

const nodeTypes = {
  article: ArticleNode
};

function FlowComponent({ onNodeClick, paperId }) {
  const [filterValues, setFilterValues] = useState({
    refDlim: 1,
    cbDlim: 1,
    minYear: 1950,
    minNumCitations: 500,
    nLeastReferences: 10
  });
  
  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
    refreshGraph(newFilterValues);
  };
  
  const refreshGraph = (newFilterValues) => {
    console.log("Refreshing graph with filter values:", newFilterValues);
    getInitialNodes(newFilterValues);
  };

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
  };

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
          ref_dlim: filterValues.refDlim,
          cb_dlim: filterValues.cbDlim,
          min_year: filterValues.minYear,
          min_num_citations: filterValues.minNumCitations,
          n_least_references: filterValues.nLeastReferences
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
            console.log("Nodes:", nodes);
            setEdges(edges);
            console.log("Edges:", edges);
        }
    } catch (error) {
        console.error("Error fetching initial nodes:", error);
    }
};

  useEffect(() => {
    if (paperId) {
        getInitialNodes(filterValues);  // Pass the filterValues from state
    }
  }, [paperId]);

  const handleNodeClick = useCallback((event, node) => {
    console.log("Node clicked:", node);
    if (onNodeClick) {
      onNodeClick(node);
    }
    return node;
  }, [setNodes, setEdges, nodes, onNodeClick]);


  const filterMenuStyles = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    height: 'min-content',
    zIndex: 100
  };

  return (
    <>
      <FilterMenu 
      style={filterMenuStyles}
      refDlim={filterValues.refDlim}
      cbDlim={filterValues.cbDlim}
      minYear={filterValues.minYear}
      minNumCitations={filterValues.minNumCitations}
      nLeastReferences={filterValues.nLeastReferences}
      onFilterChange={handleFilterChange}
    />
    <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            nodesDraggable={true}
            onLoad={onLoad}
            panOnScroll={true}
            panOnScrollMode={PanOnScrollMode.Horizontal}>
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
    </>
  );
}

export default function Flow({ onNodeClick, paperId }) {
  return (
    <ReactFlowProvider>
      <FlowComponent onNodeClick={onNodeClick} paperId={paperId} />
    </ReactFlowProvider>
  );
}
