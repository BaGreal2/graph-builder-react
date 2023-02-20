import React, { useCallback, useEffect, useState } from 'react';
import { Arrow, Group, Line, Text } from 'react-konva';

const Edge = React.memo(
	({
		fill,
		weightMode,
		deleteMode,
		nodes,
		setNodes,
		from,
		to,
		index1,
		index2,
		weight,
		points,
		type,
		generateEdges,
	}) => {
		const [weightCurr, setWeightCurr] = useState(weight);

		const addWeight = useCallback(() => {
			if (!weightMode) {
				return;
			}
			const nodesCopy = [...nodes];
			let userWeight = prompt('Enter weight:');

			if (isNaN(userWeight)) {
				alert('Enter a valid number!');
				return;
			}

			if (userWeight === '') {
				nodesCopy.find((node) => {
					if (node.index === from) {
						node.connections[index1 - 1][1] = null;
					}
				});
				if (type === 'undirect') {
					nodesCopy.find((node) => {
						if (node.index === to) {
							node.connections[index2 - 1][1] = null;
						}
					});
				}
				setWeightCurr('');
				return;
			}

			userWeight = Number(userWeight);

			nodesCopy.find((node) => {
				if (node.index === from) {
					node.connections[index1 - 1][1] = userWeight;
				}
			});
			if (type === 'undirect') {
				nodesCopy.find((node) => {
					if (node.index === to) {
						node.connections[index2 - 1][1] = userWeight;
					}
				});
			}
			setWeightCurr(userWeight);
			setNodes([...nodesCopy]);
		}, [weightMode, nodes, from, to, index1, index2, setNodes]);

		const onDelete = useCallback(() => {
			if (!deleteMode) {
				return;
			}
			const nodesCopy = [...nodes];
			nodesCopy.forEach((node) => {
				node.connections = node.connections.filter(
					(connection) => !connection.includes(from) && !connection.includes(to)
				);
			});
			generateEdges(nodesCopy, type);
			setNodes([...nodesCopy]);
		}, [deleteMode, nodes, from, to, generateEdges, setNodes]);

		const onClick = useCallback(() => {
			addWeight();
			onDelete();
		}, [addWeight, onDelete]);

		useEffect(() => {}, [weight]);

		return (
			<Group
				width={100}
				height={Math.abs(points[0] - points[2])}
				onMouseEnter={() =>
					(document.body.style.cursor =
						weightMode || deleteMode ? 'pointer' : 'default')
				}
				onMouseLeave={() => (document.body.style.cursor = 'default')}
				onClick={() => onClick()}
			>
				{type === 'undirect' && (
					<Line
						fill={fill}
						stroke={fill}
						strokeWidth={weightMode || deleteMode ? 5 : 2}
						hitStrokeWidth={35}
						points={points}
					/>
				)}

				{type === 'direct' && (
					<Arrow
						fill={fill}
						stroke={fill}
						strokeWidth={weightMode || deleteMode ? 5 : 2}
						hitStrokeWidth={35}
						points={points}
					/>
				)}

				{weightCurr !== '' && (
					<Text
						x={(points[0] + points[2]) / 2}
						y={(points[1] + points[3]) / 2}
						fontSize={22}
						fill="#c28547"
						text={weightCurr}
						verticalAlign="middle"
						align="center"
						offset={{ x: 50, y: 50 }}
						width={100}
						height={100}
					/>
				)}
			</Group>
		);
	}
);

export default Edge;
