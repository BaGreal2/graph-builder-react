import getConnectorPoints from './getConnectorPoints';

export default function generateEdges(nodesArr, setEdges) {
	const newEdges = [];
	nodesArr.map((node) => {
		node.connections.map((connection) => {
			const node1 = node;
			const node2 = nodesArr.find((node) => node.index === connection[0]);
			if (!node2) {
				return;
			}
			let index1 = node1.connections.length > 0 ? node1.connections.length : 1;
			let index2 = node2.connections.length > 0 ? node2.connections.length : 1;

			let thisType = 'direct';
			if (
				node2.connections.some((connection) => {
					return connection[0] === node1.index;
				})
			) {
				thisType = 'undirect';
			}

			const newEdge = {
				from: node1.index,
				to: node2.index,
				index1: index1,
				index2: index2,
				weight: connection[1],
				points: getConnectorPoints(node1, node2),
				type: thisType,
			};
			newEdges.push(newEdge);
		});
	});
	setEdges(newEdges);
}
