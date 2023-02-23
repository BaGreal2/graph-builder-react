import getConnectorPoints from './getConnectorPoints';

export default function generateEdges(nodesArr, type, setEdges) {
	const newEdges = [];
	nodesArr.map((node) => {
		node.connections.map((connection) => {
			const node1 = node;
			const node2 = nodesArr.find((node) => node.index === connection[0]);
			if (!node2) {
				return;
			}

			const newEdge = {
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
