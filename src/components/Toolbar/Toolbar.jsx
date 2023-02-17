import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ArrowDownIcon from '../../assets/icons/ArrowDownIcon';
import ArrowUpIcon from '../../assets/icons/ArrowUpIcon';
import ConnectionsIcon from '../../assets/icons/ConnectionsIcon';
import HashIcon from '../../assets/icons/HashIcon';
import PointerIcon from '../../assets/icons/PointerIcon';
import SaveIcon from '../../assets/icons/SaveIcon';
import TrashIcon from '../../assets/icons/TrashIcon';
import UploadIcon from '../../assets/icons/UploadIcon';
import styles from './Toolbar.module.css';
import ToolBtn from './ToolBtn';
import UploadBtn from './UploadBtn';

function Toolbar({
	nodes,
	nodesSelected,
	setNodesSelected,
	setNodes,
	setEdges,
	deleteMode,
	setDeleteMode,
	selectMode,
	setSelectMode,
	weightMode,
	setWeightMode,
	scaleModeUp,
	scaleModeDown,
	setScaleMode,
	getConnectorPoints,
	connectionActive,
	generateEdges,
}) {
	const [downloadUrl, setDownloadUrl] = useState(null);

	function onConnect() {
		const nodesCopy = [...nodes];
		for (let i = 0; i < nodesSelected.length - 1; i++) {
			const node1 = nodesSelected[i];
			const node2 = nodesSelected[i + 1];
			let _id = uuid();
			const newEdge = {
				_id: _id,
				from: node1.index,
				to: node2.index,
				index1: node1.connections.length + 1,
				index2: node2.connections.length + 1,
				weight: '',
				points: getConnectorPoints(node1, node2),
			};
			nodesCopy[node1.index - 1].connections.push([node2.index - 1]);
			nodesCopy[node2.index - 1].connections.push([node1.index - 1]);
			setEdges((prev) => [...prev, newEdge]);
		}
		nodesCopy.map((node) => (node.selected = false));
		setNodesSelected([]);
		setNodes([...nodesCopy]);
	}

	function onScale(mode) {
		setSelectMode(false);
		setWeightMode(false);
		setDeleteMode(false);
		setScaleMode(mode);
	}

	function onWeightMode() {
		setSelectMode(false);
		setScaleMode('');
		setDeleteMode(false);
		setWeightMode((prev) => !prev);
	}

	function onSelectMode() {
		setScaleMode('');
		setWeightMode(false);
		setDeleteMode(false);
		setSelectMode((prev) => !prev);
	}
	function onDeleteMode() {
		setScaleMode('');
		setWeightMode(false);
		setSelectMode(false);
		setDeleteMode((prev) => !prev);
	}

	function onSaveGraph() {
		const fileData = JSON.stringify(nodes);
		const blob = new Blob([fileData], { type: 'text/plain' });
		setDownloadUrl(URL.createObjectURL(blob));
	}

	useEffect(() => {}, [downloadUrl]);

	return (
		<div className={styles.toolbar}>
			<div className={styles.toolsWrapper}>
				<ToolBtn onClick={onSelectMode} active={true} pressed={selectMode}>
					<PointerIcon />
				</ToolBtn>
				<ToolBtn onClick={onWeightMode} active={true} pressed={weightMode}>
					<HashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => onScale('up')}
					active={true}
					pressed={scaleModeUp}
				>
					<ArrowUpIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => onScale('down')}
					active={true}
					pressed={scaleModeDown}
				>
					<ArrowDownIcon />
				</ToolBtn>
				<ToolBtn onClick={onConnect} active={connectionActive}>
					<ConnectionsIcon />
				</ToolBtn>
				<ToolBtn onClick={onDeleteMode} active={true} pressed={deleteMode}>
					<TrashIcon />
				</ToolBtn>
			</div>
			<div className={styles.save}>
				<UploadBtn
					setNodes={setNodes}
					generateEdges={generateEdges}
					active={true}
				>
					<UploadIcon />
				</UploadBtn>

				<a download={'graph.json'} href={downloadUrl}>
					<ToolBtn onClick={onSaveGraph} active={true}>
						<SaveIcon />
					</ToolBtn>
				</a>
			</div>
		</div>
	);
}

export default Toolbar;
