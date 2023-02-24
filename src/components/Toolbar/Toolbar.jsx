import { saveAs } from 'file-saver';
import { useState } from 'react';
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ConnectionsIcon,
	FillIcon,
	HashIcon,
	PointerIcon,
	TrashIcon,
} from '../../assets/icons';
import { generateEdges } from '../../helpers';
import Choice from '../Choice';
import ColorSelection from '../ColorSelection';
import SaveBtn from './SaveBtn';
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
	scaleMode,
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
	const [showChoiceColor, setShowChoiceColor] = useState(false);
	const [showChoiceSave, setShowChoiceSave] = useState(false);
	const [firstClick, setFirstClick] = useState(true);
	const scaleModeUp = scaleMode === 'up';
	const scaleModeDown = scaleMode === 'down';

	// connecting selected edges
	function onConnect(type) {
		// showing modal dialog only once
		setFirstClick(false);
		if (firstClick) {
			setShowChoiceColor(true);
			return;
		}
		setShowChoiceColor(false);
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

			nodesCopy[node1.index - 1].connections.push([node2.index, null]);

			if (type === 'undirect') {
				nodesCopy[node2.index - 1].connections.push([node1.index, null]);
			}
		}

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

	function onSaveGraphJSON() {
		const saveObj = {
			type,
			nodesColor,
			edgesColor,
			nodes,
		};
		const fileData = JSON.stringify(saveObj);
		let userFileName = prompt('Enter filename:');
		if (!userFileName) {
			userFileName = 'graph';
		}
		const blob = new Blob([fileData], { type: 'text/plain' });
		saveAs(blob, userFileName + '.json');
	}

	function onSaveGraphTXT() {
		const saveNodesArr = nodes.map((node) => node.connections);
		const saveObj = {
			type,
			nodes: saveNodesArr,
		};
		const fileData = JSON.stringify(saveObj);
		let userFileName = prompt('Enter filename:');
		if (!userFileName) {
			userFileName = 'graph';
		}
		const blob = new Blob([fileData], { type: 'text/plain' });
		saveAs(blob, userFileName + '.txt');
	}

	function onDirect() {
		setType('direct');
		setShowChoiceColor(false);
		onConnect('direct');
	}
	function onUndirect() {
		setType('undirect');
		setShowChoiceColor(false);
		onConnect('undirect');
	}

	return (
		<div className={styles.toolbar}>
			<div className={styles.toolsWrapper}>
				<ToolBtn
					onClick={onSelectMode}
					tooltipText="Create mode"
					active={true}
					pressed={selectMode}
				>
					<PointerIcon />
				</ToolBtn>
				<ToolBtn
					onClick={onWeightMode}
					tooltipText="Weight mode"
					active={true}
					pressed={weightMode}
				>
					<HashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => onScale('up')}
					tooltipText="Upscale mode"
					active={true}
					pressed={scaleModeUp}
				>
					<ArrowUpIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => onScale('down')}
					tooltipText="Downscale mode"
					active={true}
					pressed={scaleModeDown}
				>
					<ArrowDownIcon />
				</ToolBtn>
				<ToolBtn
					onClick={onDeleteMode}
					tooltipText="Delete mode"
					active={true}
					pressed={deleteMode}
				>
					<TrashIcon />
				</ToolBtn>
				<ToolBtn
					onClick={onColorMode}
					tooltipText="Color mode"
					active={true}
					pressed={colorMode}
				>
					<FillIcon />
				</ToolBtn>
				<ToolBtn
					onClick={() => connectionActive && onConnect(type)}
					tooltipText="Connect mode"
					active={connectionActive}
				>
					<ConnectionsIcon />
					{showChoiceColor && (
						<Choice
							choices={[
								{
									text: 'Directed',
									func: onDirect,
								},
								{
									text: 'Undirected',
									func: onUndirect,
								},
							]}
						/>
					)}
				</ToolBtn>
			</div>
			<div className={styles.save}>
				<UploadBtn
					tooltipText="Upload saved graph"
					setNodes={setNodes}
					setEdges={setEdges}
					setNodesColor={setNodesColor}
					setEdgesColor={setEdgesColor}
					setType={setType}
					setFirstClick={setFirstClick}
					active={true}
				/>

				<SaveBtn
					tooltipText="Save graph"
					onShowChoice={() => setShowChoiceSave((prev) => !prev)}
				>
					{showChoiceSave && (
						<Choice
							choices={[
								{
									text: '.json',
									func: onSaveGraphJSON,
									tooltip: 'Save with full settings',
								},
								{
									text: '.txt',
									func: onSaveGraphTXT,
									tooltip: 'Save only array',
								},
							]}
							upper
						/>
					)}
				</SaveBtn>
			</div>
			{colorMode && (
				<ColorSelection
					edgesColor={edgesColor}
					nodesColor={nodesColor}
					setEdgesColor={setEdgesColor}
					setNodesColor={setNodesColor}
				/>
			)}
		</div>
	);
}

export default Toolbar;
