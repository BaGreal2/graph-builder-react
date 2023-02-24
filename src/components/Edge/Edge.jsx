import React, { useState } from 'react';
import { Arrow, Group, Line, Text } from 'react-konva';
import { generateEdges } from '../../helpers';

const Edge = React.memo(
	({ edge, weightMode, deleteMode, edgesColor, nodes, setNodes, setEdges }) => {
		const { from, to, index1, index2, weight, points, type } = edge;
		const [weightCurr, setWeightCurr] = useState(weight);
		const weightColorDiff = 0xffffff - 0xc28547;

		function addWeight() {
			const nodesCopy = [...nodes];
			const userWeight = prompt('Enter weight:');
			let weight = null;

			if (isNaN(userWeight)) {
				alert('Enter a valid number!');
				return;
			}
			if (userWeight !== '') {
				weight = Number(userWeight);
			}

			nodesCopy[from - 1].connections[index1 - 1][1] = weight;
			if (nodesCopy[to - 1].connections[index2 - 1][0] === from) {
				nodesCopy[to - 1].connections[index2 - 1][1] = weight;
			}

			console.log(nodesCopy);
			setWeightCurr(userWeight);
			setNodes([...nodesCopy]);
		}

		function onDelete() {
			const nodesCopy = [...nodes];
			nodesCopy.forEach((node) => {
				node.connections = node.connections.filter(
					(connection) => connection[0] !== from && connection[0] !== to
				);
			});
			generateEdges(nodesCopy, type, setEdges);
			setNodes([...nodesCopy]);
		}

		function onClick() {
			if (weightMode) {
				addWeight();
				return;
			}
			if (deleteMode) {
				onDelete();
				return;
			}
		}

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
						fill={edgesColor}
						stroke={edgesColor}
						strokeWidth={weightMode || deleteMode ? 5 : 2}
						hitStrokeWidth={35}
						points={points}
					/>
				)}

				{type === 'direct' && (
					<Arrow
						fill={edgesColor}
						stroke={edgesColor}
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
						fill={(
							'#' +
							Math.abs(
								parseInt(edgesColor.substring(1), 16) - weightColorDiff
							).toString(16)
						).substring(0, 7)}
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
