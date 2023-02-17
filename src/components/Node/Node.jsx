import React from 'react';
import { Circle, Group, Text } from 'react-konva';

function Node({
	x,
	y,
	radius,
	index,
	selected,
	nodesSelected,
	setNodesSelected,
	nodes,
	setNodes,
	edges,
	setEdges,
	getConnectorPoints,
	scaleMode,
	deleteMode,
}) {
	function onSelect() {
		let nodesCopy = [...nodes];
		let nodesSelectedCopy = [...nodesSelected];

		nodesCopy[index - 1].selected = !nodesCopy[index - 1].selected;
		if (nodesCopy[index - 1].selected) {
			nodesSelectedCopy.push(nodesCopy[index - 1]);
		} else {
			nodesSelectedCopy.splice(
				nodesSelectedCopy.indexOf(nodesCopy[index - 1]),
				1
			);
		}

		setNodesSelected([...nodesSelectedCopy]);
		setNodes([...nodesCopy]);
	}

	function onScale(mode) {
		let nodesCopy = [...nodes];
		let delta;
		switch (mode) {
			case 'up':
				delta = 10;
				break;
			case 'down':
				delta = -10;
				break;
			default:
				return;
		}
		let validRad = nodesCopy[index - 1].radius + delta >= 20;
		nodesCopy[index - 1].radius += validRad ? delta : 0;
		setNodes([...nodesCopy]);
	}

	function onDelete() {
		let nodesCopy = nodes.filter((node) => node.index !== index);
		setNodes([...nodesCopy]);
	}

	function onDragMove(e, index) {
		document.body.style.cursor = 'grabbing';
		nodes[index - 1].x = e.target.attrs.x;
		nodes[index - 1].y = e.target.attrs.y;

		const edgesCopy = [...edges];
		edgesCopy.map((edge) => {
			edge.points = getConnectorPoints(
				nodes[edge.from - 1],
				nodes[edge.to - 1]
			);
		});
		setEdges([...edgesCopy]);
	}

	function onClick() {
		if (scaleMode) {
			onScale(scaleMode);
			return;
		}
		if (deleteMode) {
			onDelete();
			return;
		}
		onSelect();
	}

	return (
		<Group
			x={x}
			y={y}
			width={radius * 2}
			height={radius * 2}
			draggable
			onDragMove={(e) => onDragMove(e, index)}
			onMouseEnter={() => (document.body.style.cursor = 'grab')}
			onDragEnd={() => (document.body.style.cursor = 'grab')}
			onMouseLeave={() => (document.body.style.cursor = 'default')}
			onClick={() => onClick()}
		>
			<Circle radius={radius} fill={selected ? '#c28547' : '#2a507e'} />
			<Text
				x={index < 10 ? -5.5 : -11}
				y={-7}
				fontSize={20}
				fontStyle="bold"
				fill="#afcfe4"
				text={index}
			/>
		</Group>
	);
}

export default Node;
