import { useEffect, useState } from 'react';
import { Group, Line, Rect, Text } from 'react-konva';

function Edge({
	fill,
	weightMode,
	nodes,
	setNodes,
	from,
	to,
	index1,
	index2,
	weight,
	points,
}) {
	const [weightCurr, setWeightCurr] = useState(weight);
	function addWeight() {
		if (!weightMode) {
			return;
		}
		const userWeight = Number(prompt('Enter weight:'));
		if (isNaN(userWeight)) {
			alert('Enter a valid number!');
			return;
		}
		const nodesCopy = [...nodes];
		nodesCopy[from - 1].connections[index1 - 1].push(userWeight);
		nodesCopy[to - 1].connections[index2 - 1].push(userWeight);
		setWeightCurr(userWeight);
		setNodes([...nodesCopy]);
	}
	useEffect(() => {}, [weight]);
	return (
		<Group
			width={100}
			height={Math.abs(points[0] - points[2])}
			onMouseEnter={() =>
				(document.body.style.cursor = weightMode ? 'pointer' : 'default')
			}
			onMouseLeave={() => (document.body.style.cursor = 'default')}
			onClick={() => addWeight()}
		>
			<Line
				fill={fill}
				stroke={fill}
				strokeWidth={weightMode ? 5 : 2}
				hitStrokeWidth={35}
				points={points}
			/>
			{weightCurr !== '' && (
				// <Group x={(points[0] + points[2]) / 2} y={(points[1] + points[3]) / 2}>
				// 	<Rect
				// 		x={-15}
				// 		y={-10}
				// 		width={30}
				// 		height={20}
				// 		fill={'white'}
				// 		cornerRadius={5}
				// 	/>
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
				// </Group>
			)}
		</Group>
	);
}

export default Edge;
