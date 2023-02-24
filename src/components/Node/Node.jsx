import React from 'react';
import { Circle, Group, Text } from 'react-konva';
import { countColor, generateEdges } from '../../helpers';

const Node = React.memo(
	({
		node,
		nodesSelected,
		setNodesSelected,
		nodes,
		setNodes,
		setEdges,
		scaleMode,
		deleteMode,
		nodesColor,
		type,
		viewVisited,
		viewDead,
	}) => {
		// normal: #2a507e
		// selected: #c28547
		// text: #afcfe4
		const { index, x, y, radius } = node;
		const selectColorDiff = 0x2a507e - 0xc28547;
		const textColorDiff = 0x2a507e - 0xafcfe4;
		const visitedColorDiff = 0x2a507e - 0xba7245;
		const deadColorDiff = 0x2a507e - 0x4d4d4f;
		const selected = nodesSelected.includes(node);
		let currFill = nodesColor;
		if (selected) {
			currFill = countColor(nodesColor, selectColorDiff);
		}
		if (viewVisited[index - 1]) {
			currFill = countColor(nodesColor, visitedColorDiff);
		}
		if (viewDead[index - 1]) {
			currFill = countColor(nodesColor, deadColorDiff);
		}

		function onSelect() {
			const nodesCopy = [...nodes];
			const nodesSelectedCopy = [...nodesSelected];

			if (!selected) {
				nodesSelectedCopy.push(node);
			} else {
				nodesSelectedCopy.splice(nodesSelectedCopy.indexOf(node), 1);
			}

			setNodesSelected([...nodesSelectedCopy]);
			setNodes([...nodesCopy]);
		}

		function onScale(mode) {
			const nodesCopy = [...nodes];
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
			const validRad = node.radius + delta >= 20;
			nodesCopy[index - 1].radius += validRad ? delta : 0;
			setNodes([...nodesCopy]);
		}

		function onDelete() {
			const nodesCopy = [...nodes];

			nodesCopy.splice(index - 1, 1);
			nodesCopy.forEach((node) => {
				node.connections = node.connections.filter(
					(connection) => connection[0] !== index
				);
			});
			nodesCopy.forEach((node, idx) => {
				node.index = idx + 1;
				node.connections.forEach((connection) => {
					if (connection[0] >= index) {
						connection[0]--;
					}
				});
			});

			generateEdges(nodesCopy, type, setEdges);
			setNodes([...nodesCopy]);
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

		function onDragMove(e) {
			document.body.style.cursor = 'grabbing';
			const nodesCopy = [...nodes];

			nodesCopy[index - 1].x = e.target.attrs.x;
			nodesCopy[index - 1].y = e.target.attrs.y;

			generateEdges(nodesCopy, type, setEdges);
			setNodes([...nodesCopy]);
		}

		function dragBoundFunc(pos) {
			const stageWidth = window.innerWidth - 50;
			const stageHeight = window.innerHeight;

			const maxX = stageWidth - radius;
			const maxY = stageHeight - radius;

			const x = Math.max(radius, Math.min(pos.x, maxX));
			const y = Math.max(radius, Math.min(pos.y, maxY));

			return { x, y };
		}

		return (
			<Group
				x={x}
				y={y}
				width={radius * 2}
				height={radius * 2}
				draggable
				dragBoundFunc={dragBoundFunc}
				onDragMove={(e) => onDragMove(e)}
				onMouseEnter={() => (document.body.style.cursor = 'grab')}
				onDragEnd={() => (document.body.style.cursor = 'grab')}
				onMouseLeave={() => (document.body.style.cursor = 'default')}
				onClick={() => onClick()}
			>
				<Circle radius={radius} fill={currFill} />
				<Text
					x={index < 10 ? -5.5 : -11}
					y={-7}
					fontSize={20}
					fontStyle="bold"
					fill={(
						'#' +
						Math.abs(
							parseInt(nodesColor.substring(1), 16) - textColorDiff
						).toString(16)
					).substring(0, 7)}
					text={index}
				/>
			</Group>
		);
	}
);

export default Node;
