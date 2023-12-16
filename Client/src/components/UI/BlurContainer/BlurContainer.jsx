import React from 'react';
import styles from './BlurContainer.module.css';

function BlurContainer({ children }) {
	return <div className={styles.container}>{children}</div>;
}

export default BlurContainer;
