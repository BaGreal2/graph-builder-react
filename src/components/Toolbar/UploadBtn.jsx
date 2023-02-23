import { generateEdges } from '../../helpers';
import styles from './UploadBtn.module.css';

function UploadBtn({
	setNodes,
	setEdges,
	setType,
	setConnectClicks,
	active,
	setNodesColor,
	setEdgesColor,
	children,
	pressed = false,
}) {
	function onChange(e) {
		if (e.target.files) {
			const file = e.target.files[0];
			let reader = new FileReader();
			reader.onload = onReaderLoad;
			reader.readAsText(file);
		}
	}
	// updating states to loaded file
	function onReaderLoad(e) {
		const res = JSON.parse(e.target.result);
		const { type, nodesColor, edgesColor, nodes } = res;
		setNodes([...nodes]);
		setType(type);
		setNodesColor(nodesColor);
		setEdgesColor(edgesColor);
		setConnectClicks((prev) => prev + 1);
		generateEdges(nodes, type, setEdges);
	}
	return (
		<div className={styles.toolContainer}>
			<label
				className={`${styles.tool} ${active && styles.active} ${
					pressed && styles.pressed
				}`}
				htmlFor="upload-file"
			>
				{children}
			</label>
			<input
				id="upload-file"
				className={styles.input}
				type={'file'}
				onChange={(e) => onChange(e)}
			/>
		</div>
	);
}
export default UploadBtn;
