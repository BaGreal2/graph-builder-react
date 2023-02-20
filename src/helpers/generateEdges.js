import { v4 as uuid } from 'uuid';
import getConnectorPoints from './getConnectorPoints';

export default function generateEdges(nodesArr, type, setEdges) {
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
