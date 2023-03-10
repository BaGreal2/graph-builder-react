import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Edge from './components/Edge';
import Node from './components/Node';
import Toolbar from './components/Toolbar';

function App() {
	// setting main variables
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [nodesSelected, setNodesSelected] = useState([]);
	// modes states
	const [mode, setMode] = useState('create');
	const [algorithm, setAlgorithm] = useState('');
	// color states
	const [nodesColor, setNodesColor] = useState('#2a507e');
	const [edgesColor, setEdgesColor] = useState('#ffffff');
	// graph type
	const [type, setType] = useState('');
	// algorithm variables
	const [viewVisited, setViewVisited] = useState([]);
	const [viewDead, setViewDead] = useState([]);

	// creating node on field click
	function onCreateNode(e) {
		setViewVisited([]);
		setViewDead([]);
		// checkng if node exist on click spot or other mods enabled
		if (
			nodes.some((node) => {
				return (
					e.layerX > node.x - node.radius &&
					e.layerX < node.x + node.radius &&
					e.layerY > node.y - node.radius &&
					e.layerY < node.y + node.radius
				);
			}) &&
			mode === 'create'
		) {
			return;
		}
		setNodes((prev) => [
			...prev,
			{
				index: nodes.length + 1,
				x: e.layerX,
				y: e.layerY,
				radius: 20,
				connections: [],
			},
		]);
	}

	return (
		<div className="app">
			<Toolbar
				nodes={nodes}
				edges={edges}
				nodesSelected={nodesSelected}
				setNodesSelected={setNodesSelected}
				setNodes={setNodes}
				setEdges={setEdges}
				mode={mode}
				setMode={setMode}
				nodesColor={nodesColor}
				setNodesColor={setNodesColor}
				edgesColor={edgesColor}
				setEdgesColor={setEdgesColor}
				type={type}
				setType={setType}
				setAlgorithm={setAlgorithm}
			/>
			<Stage
				width={window.innerWidth - 50}
				height={window.innerHeight}
				className="stage"
				onClick={(e) => mode === 'create' && onCreateNode(e.evt)}
			>
				<Layer>
					{edges.map((edge, id) => {
						return (
							<Edge
								key={id}
								edge={edge}
								mode={mode}
								edgesColor={edgesColor}
								nodes={nodes}
								setNodes={setNodes}
								setEdges={setEdges}
							/>
						);
					})}
					{nodes.map((node, id) => {
						return (
							<Node
								key={id}
								node={node}
								nodesSelected={nodesSelected}
								setNodesSelected={setNodesSelected}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
								setEdges={setEdges}
								mode={mode}
								nodesColor={nodesColor}
								type={type}
								viewVisited={viewVisited}
								viewDead={viewDead}
								setViewVisited={setViewVisited}
								setViewDead={setViewDead}
								algorithm={algorithm}
							/>
						);
					})}
				</Layer>
			</Stage>
			<Tooltip id="my-tooltip" className="tooltip" />
		</div>
	);
}

export default App;
