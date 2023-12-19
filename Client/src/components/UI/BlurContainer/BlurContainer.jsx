import React from 'react';
import styles from './BlurContainer.module.css';

function BlurContainer({ style, children }) {
	return <div className={`${styles.container} ${style}`}>{children}</div>;
}

export default BlurContainer;
