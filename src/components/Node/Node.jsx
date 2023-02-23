import React from 'react';
import { Circle, Group, Text } from 'react-konva';
import { generateEdges, getConnectorPoints } from '../../helpers';

const Node = React.memo(
	({
		index,
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
	}) => {
		// normal: #2a507e
		// selected: #c28547
		// text: #afcfe4
		const { x, y, radius, selected } = node;
		const selectColorDiff = 0x2a507e - 0xc28547;
		const textColorDiff = 0x2a507e - 0xafcfe4;

		function onSelect() {
			const nodesCopy = [...nodes];
			const nodesSelectedCopy = [...nodesSelected];

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
			const validRad = nodesCopy[index - 1].radius + delta >= 20;
			nodesCopy[index - 1].radius += validRad ? delta : 0;
			setNodes([...nodesCopy]);
		}

		function onDelete() {
			const nodesCopy = [...nodes];

			nodesCopy.splice(index - 1, 1);
			nodesCopy.forEach((node) => {
				node.connections = node.connections.filter(
					(connection) => !connection.includes(index - 1)
				);
			});

			generateEdges(nodesCopy, type, setEdges);
			setNodes([...nodesCopy]);
		}

		function onDragMove(e) {
			document.body.style.cursor = 'grabbing';
			const nodesCopy = [...nodes];

			nodesCopy[index - 1].x = e.target.attrs.x;
			nodesCopy[index - 1].y = e.target.attrs.y;

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
				<Circle
					radius={radius}
					fill={
						selected
							? (
									'#' +
									Math.abs(
										parseInt(nodesColor.substring(1), 16) - selectColorDiff
									).toString(16)
							  ).substring(0, 7)
							: nodesColor
					}
				/>
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
