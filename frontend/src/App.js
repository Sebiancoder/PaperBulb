import React, { useCallback } from 'react';
import Search from './Search';
import './App.css';

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
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

function App() {
  return (
    <div className="app">
      <div className='toolbar'>
        <h1>PaperBulb</h1>
        <Search />

      </div>
      <Flow />
    </div>
  );
}

export default App;
