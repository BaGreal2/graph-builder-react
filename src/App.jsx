import { useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuid } from 'uuid';
import Edge from './components/Edge';
import Node from './components/Node';
import Toolbar from './components/Toolbar';

function App() {
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);
	const [nodesSelected, setNodesSelected] = useState([]);
	const [counter, setCounter] = useState(1);
	const [scaleMode, setScaleMode] = useState('');
	const [selectMode, setSelectMode] = useState(true);
	const [weightMode, setWeightMode] = useState(false);
	const [deleteMode, setDeleteMode] = useState(false);
	const [colorMode, setColorMode] = useState(false);
	const [type, setType] = useState('');

	function onCreateNode(e) {
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
				_id: _id,
				index: counter,
				x: e.layerX,
				y: e.layerY,
				radius: 20,
				selected: false,
				connections: [],
			},
		]);
		setCounter((prev) => prev + 1);
	}

	function generateEdges(nodesArr, type) {
		const newEdges = [];
		nodesArr.map((node) => {
			node.connections.map((connection) => {
				let _id = uuid();
				const node1 = node;
				const node2 = nodesArr.find((node) => node.index - 1 === connection[0]);

				const newEdge = {
					_id: _id,
					from: node1.index,
					to: node2.index,
					index1: node1.connections.length,
					index2: node2.connections.length,
					weight: connection[1],
					points: getConnectorPoints(node1, node2),
					type: type,
				};
				newEdges.push(newEdge);
			});
		});
		setEdges(newEdges);
	}

	function getConnectorPoints(from, to) {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const radiusFrom = from.radius;
		const radiusTo = to.radius;
		const angle = Math.atan2(-dy, dx);

		return [
			from.x + -radiusFrom * Math.cos(angle + Math.PI),
			from.y + radiusFrom * Math.sin(angle + Math.PI),
			to.x + -radiusTo * Math.cos(angle),
			to.y + radiusTo * Math.sin(angle),
		];
	}

	useEffect(() => {}, [nodes, counter, edges]);

	return (
		<div className="app">
			<Toolbar
				nodes={nodes}
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
				getConnectorPoints={getConnectorPoints}
				connectionActive={nodes.filter((node) => node.selected).length > 1}
				generateEdges={generateEdges}
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
								fill="white"
								weightMode={weightMode}
								deleteMode={deleteMode}
								nodes={nodes}
								setNodes={setNodes}
								from={edge.from}
								to={edge.to}
								index1={edge.index1}
								index2={edge.index2}
								weight={edge.weight}
								points={edge.points}
								type={edge.type}
								generateEdges={generateEdges}
							/>
						);
					})}
					{nodes.map((node) => {
						return (
							<Node
								key={node._id}
								x={node.x}
								y={node.y}
								radius={node.radius}
								index={node.index}
								selected={node.selected}
								nodesSelected={nodesSelected}
								setNodesSelected={setNodesSelected}
								nodes={nodes}
								setNodes={setNodes}
								edges={edges}
								setEdges={setEdges}
								getConnectorPoints={getConnectorPoints}
								scaleMode={scaleMode}
								deleteMode={deleteMode}
							/>
						);
					})}
				</Layer>
			</Stage>
		</div>
	);
}

export default App;
