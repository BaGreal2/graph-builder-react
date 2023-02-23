import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import Edge from './components/Edge';
import Node from './components/Node';
import Toolbar from './components/Toolbar';

function App() {
	// setting main variables
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [nodesSelected, setNodesSelected] = useState([]);
	const [scaleMode, setScaleMode] = useState('');
	const [selectMode, setSelectMode] = useState(true);
	const [weightMode, setWeightMode] = useState(false);
	const [deleteMode, setDeleteMode] = useState(false);
	const [colorMode, setColorMode] = useState(false);
	const [nodesColor, setNodesColor] = useState('#2a507e');
	const [edgesColor, setEdgesColor] = useState('#ffffff');
	const [type, setType] = useState('');

	// creating node on field click
	function onCreateNode(e) {
		// checkng if node exist on click spot or other mods enabled
		if (
			nodes.some((node) => {
				return (
					e.layerX > node.x - node.radius &&
					e.layerX < node.x + node.radius &&
					e.layerY > node.y - node.radius &&
					e.layerY < node.y + node.radius
				);
			}) ||
			weightMode ||
			scaleMode !== ''
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
				selected: false,
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
				deleteMode={deleteMode}
				setDeleteMode={setDeleteMode}
				selectMode={selectMode}
				setSelectMode={setSelectMode}
				weightMode={weightMode}
				setWeightMode={setWeightMode}
				scaleModeUp={scaleMode === 'up'}
				scaleModeDown={scaleMode === 'down'}
				setScaleMode={setScaleMode}
				colorMode={colorMode}
				setColorMode={setColorMode}
				nodesColor={nodesColor}
				setNodesColor={setNodesColor}
				edgesColor={edgesColor}
				setEdgesColor={setEdgesColor}
				connectionActive={nodes.filter((node) => node.selected).length > 1}
				type={type}
				setType={setType}
			/>
			<Stage
				width={window.innerWidth - 50}
				height={window.innerHeight}
				className="stage"
				onClick={(e) => selectMode && onCreateNode(e.evt)}
			>
				<Layer>
					{edges.map((edge, id) => {
						return (
							<Edge
								key={id}
								edge={edge}
								weightMode={weightMode}
								deleteMode={deleteMode}
								colorMode={colorMode}
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
								index={id + 1}
								node={node}
								nodesSelected={nodesSelected}
								setNodesSelected={setNodesSelected}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
								setEdges={setEdges}
								scaleMode={scaleMode}
								deleteMode={deleteMode}
								colorMode={colorMode}
								nodesColor={nodesColor}
								type={type}
							/>
						);
					})}
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
