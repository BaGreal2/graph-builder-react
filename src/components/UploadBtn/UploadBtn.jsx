import { UploadIcon } from '../../assets/icons';
import { generateEdges, getRandomInt } from '../../helpers';
import styles from './UploadBtn.module.css';

function UploadBtn({
	tooltipText,
	setNodes,
	setEdges,
	setType,
	setFirstClick,
	active,
	setNodesColor,
	setEdgesColor,
	pressed = false,
}) {
	// loading file
	function onChange(e) {
		if (e.target.files) {
			const file = e.target.files[0];
			const isTXT = file.name.includes('.txt');
			const reader = new FileReader();
			reader.onload = isTXT ? onReaderLoadTXT : onReaderLoadJSON;
			reader.readAsText(file);
		}
	}

	// updating states to loaded .txt file
	function onReaderLoadTXT(e) {
		const res = JSON.parse(e.target.result);
		const nodesRaw = res.nodes;
		const nodesNew = nodesRaw.map((node, idx) => {
			return {
				index: idx + 1,
				x: getRandomInt(200, window.innerWidth - 150),
				y: getRandomInt(150, window.innerHeight - 150),
				radius: 20,
				connections: node,
			};
		});
		const type = res.type;
		if (type === '') {
			setFirstClick(true);
		} else {
			setFirstClick(false);
		}
		setNodes([...nodesNew]);
		setType(type);
		setNodesColor('#2a507e');
		setEdgesColor('#ffffff');
		generateEdges(nodesNew, type, setEdges);
	}

	// updating states to loaded .json file
	function onReaderLoadJSON(e) {
		const res = JSON.parse(e.target.result);
		const { type, nodesColor, edgesColor, nodes } = res;
		if (type === '') {
			setFirstClick(true);
		} else {
			setFirstClick(false);
		}
		setNodes([...nodes]);
		setType(type);
		setNodesColor(nodesColor);
		setEdgesColor(edgesColor);
		generateEdges(nodes, type, setEdges);
	}
	return (
		<div
			className={styles.toolContainer}
			data-tooltip-content={tooltipText}
			data-tooltip-id="my-tooltip"
			data-tooltip-place="right"
		>
			<label
				className={`${styles.tool} ${active && styles.active} ${
					pressed && styles.pressed
				}`}
				htmlFor="upload-file"
			>
				<UploadIcon />
			</label>
			<input
				id="upload-file"
				className={styles.input}
				type={'file'}
				accept={'.json, .txt'}
				onChange={(e) => onChange(e)}
			/>
		</div>
	);
}
export default UploadBtn;
