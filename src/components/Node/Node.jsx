import React, { useCallback } from 'react';
import { Circle, Group, Text } from 'react-konva';

const Node = React.memo(
	({
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
	}) => {
		const onSelect = useCallback(() => {
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
		}, [index, nodes, nodesSelected, setNodes, setNodesSelected]);

		const onScale = useCallback(
			(mode) => {
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
			},
			[index, nodes, setNodes]
		);

		const onDelete = useCallback(() => {
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
		}, [edges, index, nodes, setEdges, setNodes]);

		const onDragMove = useCallback(
			(e, index) => {
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
					edge.points = getConnectorPoints(
						nodesCopy.find((node) => node.index === edge.from),
						nodesCopy.find((node) => node.index === edge.to)
					);
				});
				setNodes([...nodesCopy]);
				setEdges([...edgesCopy]);
			},
			[edges, getConnectorPoints, index, nodes, setEdges, setNodes]
		);

		const onClick = useCallback(() => {
			if (scaleMode) {
				onScale(scaleMode);
				return;
			}
			if (deleteMode) {
				onDelete();
				return;
			}
			onSelect();
		}, [deleteMode, onScale, onDelete, onSelect, scaleMode]);

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
);

export default Node;
