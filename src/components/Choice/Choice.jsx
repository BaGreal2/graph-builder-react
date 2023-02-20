import React from 'react';

import styles from './Choice.module.css';

function Choice({ setType, setShowChoice, onConnect }) {
	function onDirect() {
		setType('direct');
		setShowChoice(false);
		onConnect('direct');
	}
	function onUndirect() {
		setType('undirect');
		setShowChoice(false);
		onConnect('undirect');
	}
	return (
		<div className={styles.choiceContainer}>
			<div className={styles.choice} onClick={() => onDirect()}>
				Directed
			</div>
			<div className={styles.choice} onClick={() => onUndirect()}>
				Undirected
			</div>
		</div>
	);
}

export default Choice;
