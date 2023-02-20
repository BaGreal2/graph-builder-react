import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ConnectionsIcon,
	FillIcon,
	HashIcon,
	PointerIcon,
	SaveIcon,
	TrashIcon,
	UploadIcon,
} from '../../assets/icons';
import { generateEdges, getConnectorPoints } from '../../helpers';
import Choice from '../Choice';
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
	colorMode,
	setColorMode,
	selectedColor,
	setSelectedColor,
	connectionActive,
	type,
	setType,
}) {
	const [downloadUrl, setDownloadUrl] = useState(null);
	const [showChoice, setShowChoice] = useState(false);
	const [connectClicks, setConnectClicks] = useState(0);

	// connecting selected edges
	function onConnect(type) {
		// showing modal dialog only once
		setConnectClicks((prev) => prev + 1);
		if (connectClicks === 0) {
			setShowChoice(true);
			return;
		}
		setShowChoice(false);
		if (type === '') {
			return;
		}

		const nodesCopy = [...nodes];
		for (let i = 0; i < nodesSelected.length - 1; i++) {
			const node1 = nodesSelected[i];
			const node2 = nodesSelected[i + 1];
			const _id = uuid();
			const newEdge = {
				_id,
				from: node1.index,
				to: node2.index,
				index1: node1.connections.length + 1,
				index2: node2.connections.length + 1,
				weight: '',
				points: getConnectorPoints(node1, node2),
				type: type,
			};
			nodesCopy.find((node, idx) => {
				if (node.index === node1.index) {
					nodesCopy[idx].connections.push([node2.index - 1]);
					return true;
				}
			});
			if (type === 'undirect') {
				nodesCopy.find((node, idx) => {
					if (node.index === node2.index) {
						nodesCopy[idx].connections.push([node1.index - 1]);
						return true;
					}
				});
			}
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
		setScaleMode('');
		setSelectMode(false);
		setDeleteMode(false);
		setColorMode(false);
		setWeightMode((prev) => !prev);
	}

	function onSelectMode() {
		setScaleMode('');
		setWeightMode(false);
		setDeleteMode(false);
		setColorMode(false);
		setSelectMode((prev) => !prev);
	}
	function onDeleteMode() {
		setScaleMode('');
		setWeightMode(false);
		setSelectMode(false);
		setColorMode(false);
		setDeleteMode((prev) => !prev);
	}
	function onColorMode() {
		setScaleMode('');
		setWeightMode(false);
		setSelectMode(false);
		setDeleteMode(false);
		setColorMode((prev) => !prev);
	}

	function onSaveGraph() {
		const saveObj = {
			type: type,
			nodes: nodes,
		};
		const fileData = JSON.stringify(saveObj);
		const blob = new Blob([fileData], { type: 'text/plain' });
		setDownloadUrl(URL.createObjectURL(blob));
	}

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
				<ToolBtn onClick={onDeleteMode} active={true} pressed={deleteMode}>
					<TrashIcon />
				</ToolBtn>
				<ToolBtn onClick={onColorMode} active={true} pressed={colorMode}>
					<FillIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => connectionActive && onConnect(type)}
					active={connectionActive}
				>
					<ConnectionsIcon />
					{showChoice && (
						<Choice
							setType={setType}
							setShowChoice={setShowChoice}
							onConnect={onConnect}
						/>
					)}
				</ToolBtn>
			</div>
			<div className={styles.save}>
				<UploadBtn
					setNodes={setNodes}
					setEdges={setEdges}
					setType={setType}
					setConnectClicks={setConnectClicks}
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
			{colorMode && (
				<input
					className={styles.colorInput}
					type="color"
					onChange={(e) => setSelectedColor(e.target.value)}
					value={selectedColor}
				/>
			)}
		</div>
	);
}

export default Toolbar;
