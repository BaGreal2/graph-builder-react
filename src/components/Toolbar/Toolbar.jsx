import { useState } from 'react';
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
	nodesColor,
	setNodesColor,
	edgesColor,
	setEdgesColor,
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
			if (
				node2.connections.some((connection) => {
					return connection[0] === node1.index;
				}) &&
				node1.connections.some((connection) => {
					return connection[0] === node2.index;
				})
			) {
				continue;
			}

			nodesCopy.find((node, idx) => {
				if (node.index === node1.index) {
					nodesCopy[idx].connections.push([node2.index, '']);
					return true;
				}
			});
			if (type === 'undirect') {
				nodesCopy.find((node, idx) => {
					if (node.index === node2.index) {
						nodesCopy[idx].connections.push([node1.index, '']);
						return true;
					}
				});
			}
		}

		nodesCopy.forEach((node) => (node.selected = false));
		setNodesSelected([]);
		generateEdges(nodesCopy, type, setEdges);
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
			type,
			nodesColor,
			edgesColor,
			nodes,
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
					setNodesColor={setNodesColor}
					setEdgesColor={setEdgesColor}
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
				<div className={styles.colorInputWrapper}>
					<input
						className={styles.colorNodesInput}
						type="color"
						onChange={(e) => setNodesColor(e.target.value)}
						value={nodesColor}
					/>
					<input
						className={styles.colorEdgesInput}
						type="color"
						onChange={(e) => setEdgesColor(e.target.value)}
						value={edgesColor}
					/>
					<button
						className={styles.defaultColor}
						onClick={() => {
							setNodesColor('#2a507e');
							setEdgesColor('#ffffff');
						}}
					>
						Set Default
					</button>
				</div>
			)}
		</div>
	);
}

export default Toolbar;
