import React from 'react';
import styles from './UploadBtn.module.css';

function UploadBtn({
	setNodes,
	setType,
	setConnectClicks,
	generateEdges,
	active,
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
	function onReaderLoad(e) {
		let graphArr = JSON.parse(e.target.result).nodes;
		let savedType = JSON.parse(e.target.result).type;
		setNodes(graphArr);
		setType(savedType);
		setConnectClicks((prev) => prev + 1);
		generateEdges(graphArr, savedType);
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
