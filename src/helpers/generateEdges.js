import { v4 as uuid } from 'uuid';
import getConnectorPoints from './getConnectorPoints';

export default function generateEdges(nodesArr, type, setEdges) {
	const newEdges = [];
	nodesArr.map((node) => {
		node.connections.map((connection) => {
			let _id = uuid();
			const node1 = node;
			const node2 = nodesArr.find((node) => node.index - 1 === connection[0]);
			let isMulti = false;

			if (type === 'direct') {
				isMulti = node2.connections.some((connection) => {
					if (connection.includes(node1.index - 1)) {
						newEdges.forEach((edge) => {
							if (edge.from === node2.index) {
								edge.points = getConnectorPoints(node2, node1, true, true);
								edge.isMulti = true;
								edge.second = true;
							}
						});

						return true;
					}
				});
				console.log(isMulti);
			}

			const newEdge = {
				_id: _id,
				from: node1.index,
				to: node2.index,
				index1: node1.connections.length,
				index2: node2.connections.length,
				weight: connection[1],
				points: getConnectorPoints(node1, node2, isMulti),
				type: type,
				isMulti: isMulti,
				second: false,
			};
			newEdges.push(newEdge);
		});
	});
	setEdges(newEdges);
}
