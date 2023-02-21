import { useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuid } from 'uuid';
import Edge from './components/Edge';
import Node from './components/Node';
import Toolbar from './components/Toolbar';

function App() {
	// setting main variables
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [nodesSelected, setNodesSelected] = useState([]);
	const [counter, setCounter] = useState(1);
	const [scaleMode, setScaleMode] = useState('');
	const [selectMode, setSelectMode] = useState(true);
	const [weightMode, setWeightMode] = useState(false);
	const [deleteMode, setDeleteMode] = useState(false);
	const [colorMode, setColorMode] = useState(false);
	const [selectedColor, setSelectedColor] = useState('#2a507e');
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
		let _id = uuid();
		setNodes((prev) => [
			...prev,
			{
				_id,
				index: counter,
				x: e.layerX,
				y: e.layerY,
				radius: 20,
				color: '#2a507e',
				selected: false,
				connections: [],
			},
		]);
		setCounter((prev) => prev + 1);
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
				selectedColor={selectedColor}
				setSelectedColor={setSelectedColor}
				setCounter={setCounter}
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
					{edges.map((edge) => {
						return (
							<Edge
								key={edge._id}
								edge={edge}
								fill="white"
								weightMode={weightMode}
								deleteMode={deleteMode}
								nodes={nodes}
								setNodes={setNodes}
								setEdges={setEdges}
							/>
						);
					})}
					{nodes.map((node) => {
						return (
							<Node
								key={node._id}
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
								selectedColor={selectedColor}
							/>
						);
					})}
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
