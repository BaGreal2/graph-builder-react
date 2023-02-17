import React from 'react';
import styles from './ToolBtn.module.css';

function ToolBtn({ onClick, active, children, pressed = false }) {
	return (
		<div
			className={`${styles.tool} ${active && styles.active} ${
				pressed && styles.pressed
			}`}
			onClick={() => onClick()}
		>
			{children}
		</div>
	);
}
export default ToolBtn;
