import React from 'react';
import { Circle, Group, Text } from 'react-konva';
import { getConnectorPoints } from '../../helpers';

const Node = React.memo(
	({
		node,
		nodesSelected,
		setNodesSelected,
		nodes,
		setNodes,
		edges,
		setEdges,
		scaleMode,
		deleteMode,
		colorMode,
		selectedColor,
	}) => {
		const { x, y, radius, index, selected, color } = node;
		// normal: #2a507e
		// yellow: #c28547
		// text: #afcfe4
		const selectColorDiff = 0x2a507e - 0xc28547;
		const textColorDiff = 0x2a507e - 0xafcfe4;

		function onSelect() {
			const nodesCopy = [...nodes];
			const nodesSelectedCopy = [...nodesSelected];

			nodesCopy.find((node, idx) => {
				if (node.index === index) {
					nodesCopy[idx].selected = !nodesCopy[idx].selected;

					if (nodesCopy[idx].selected) {
						nodesSelectedCopy.push(nodesCopy[idx]);
					} else {
						nodesSelectedCopy.splice(
							nodesSelectedCopy.indexOf(nodesCopy[idx]),
							1
						);
					}

					return true;
				}
			});

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
			let foundIndex;
			const nodesCopy = nodes.filter((node) => {
				if (node.index !== index) {
					return true;
				} else {
					foundIndex = node.index;
				}
			});
			nodesCopy.forEach((node) => {
				node.connections = node.connections.filter(
					(connection) => !connection.includes(foundIndex - 1)
				);
			});
			const edgesCopy = edges.filter(
				(edge) => edge.from !== index && edge.to !== index
			);
			setEdges([...edgesCopy]);
			setNodes([...nodesCopy]);
		}

		function onDragMove(e) {
			document.body.style.cursor = 'grabbing';
			const nodesCopy = [...nodes];
			const edgesCopy = [...edges];

			nodesCopy.find((node, idx) => {
				if (node.index === index) {
					nodesCopy[idx].x = e.target.attrs.x;
					nodesCopy[idx].y = e.target.attrs.y;
					return true;
				}
			});

			edgesCopy.map((edge) => {
				if (edge.isMulti) {
					edge.points = getConnectorPoints(
						nodesCopy.find((node) => node.index === edge.from),
						nodesCopy.find((node) => node.index === edge.to),
						edge.isMulti,
						edge.second
					);
				} else {
					edge.points = getConnectorPoints(
						nodesCopy.find((node) => node.index === edge.from),
						nodesCopy.find((node) => node.index === edge.to)
					);
				}
			});
			setNodes([...nodesCopy]);
			setEdges([...edgesCopy]);
		}

		function onChangeColor() {
			const nodesCopy = [...nodes];
			nodesCopy.filter((node, idx) => {
				if (node.index === index) {
					nodesCopy[idx].color = selectedColor;
				}
			});
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
			if (colorMode) {
				onChangeColor();
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
									(parseInt(color.substring(1), 16) - selectColorDiff).toString(
										16
									)
							  ).substring(0, 7)
							: color
					}
				/>
				<Text
					x={index < 10 ? -5.5 : -11}
					y={-7}
					fontSize={20}
					fontStyle="bold"
					fill={(
						'#' +
						(parseInt(color.substring(1), 16) - textColorDiff).toString(16)
					).substring(0, 7)}
					text={index}
				/>
			</Group>
		);
	}
);

export default Node;
