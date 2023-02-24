export default function deepFirstSearch(
	nodes,
	visited,
	deadEnds,
	setViewVisited,
	setViewDead,
	startNode
) {
	const stack = [];
	// pushing to stack initial node
	stack.push(startNode);

	function dfsLoop() {
		setTimeout(function () {
			// getting last node in stack
			const curr = stack.pop();
			// if all connected edges are visited -> dead end
			if (curr.connections.every((connection) => visited[connection[0] - 1])) {
				deadEnds[curr.index - 1] = true;
				setViewDead([...deadEnds]);
			}

			// if current node is not visited -> visit and push to stack it's unvisited neighbours
			if (!visited[curr.index - 1]) {
				visited[curr.index - 1] = true;
				setViewVisited([...visited]);

				for (let connection of curr.connections) {
					// if (!visited[connection[0] - 1]) {
					stack.push(nodes[connection[0] - 1]);
					// }
				}
			}

			// continue until stack is empty
			if (stack.length !== 0) {
				dfsLoop();
			}
		}, 500);
	}

	dfsLoop();
}

// export default function deepFirstSearch(
// 	nodes,
// 	visited,
// 	setViewVisited,
// 	deadEnds,
// 	startNode
// ) {
// 	console.log(visited, startNode);
// 	const stack = [];
// 	stack.push(startNode);
// 	visited[startNode] = true;
// 	function dfsLoop() {
// 		setTimeout(function () {
// 			// stack.pop();
// 			let i = 0;
// 			while (i <= nodes.length && visited[i]) {
// 				i++;
// 			}
// 			if (i > nodes.length - 1) {
// 				stack.pop();
// 			} else {
// 				stack.push(i);
// 				visited[i] = true;
// 				setViewVisited([...visited]);
// 			}
// 			// continue until stack is empty
// 			if (stack.length !== 0) {
// 				dfsLoop();
// 			}
// 		}, 500);
// 	}
// 	dfsLoop();
// }

// export default function deepFirstSearch(
// 	nodes,
// 	visited,
// 	deadEnds,
// 	setViewVisited,
// 	setViewDead,
// 	start
// ) {
// 	// Keep track of the maximum stack size.
// 	let max = 0;

// 	// Start with the first node.
// 	const stack = [start];
// 	console.log(`Starting with stack: [${stack}]`);

// 	function dfsLoop() {
// 		setTimeout(function () {
// 			// Get the next node to search.
// 			const node = stack.pop();
// 			console.log(`Popping ${node} off the stack: [${stack}]`);

// 			if (node.connections.every((connection) => visited[connection[0] - 1])) {
// 				deadEnds[node.index - 1] = true;
// 				setViewDead([...deadEnds]);
// 			}

// 			// Ignore the node if we've visited it before.
// 			if (visited[node.index - 1]) {
// 				console.log(`Already visited ${node}: [${stack}]`);
// 				dfsLoop();
// 				return;
// 			}

// 			// Mark the node as visited.
// 			visited[node.index - 1] = true;
// 			setViewVisited([...visited]);

// 			// Add its children to the stack.
// 			nodes[node.index - 1].connections.forEach((child) => {
// 				stack.push(nodes[child[0] - 1]);
// 				max = Math.max(max, stack.length);
// 				console.log(`Pushed child ${child[0]} on to the stack. [${stack}]`);
// 			});
// 			// continue until stack is empty
// 			if (stack.length > 0) {
// 				dfsLoop();
// 			}
// 		}, 500);
// 	}

// 	dfsLoop();
// 	console.log('Longest stack:', max);
// }
