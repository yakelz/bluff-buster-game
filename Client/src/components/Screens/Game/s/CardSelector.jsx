import React from 'react';
import styles from './CardSelector.module.css';

const CardSelector = ({ playerCards, selectedCards, setSelectedCards, canPlay }) => {
	const toggleCardSelection = (cardId) => {
		if (!canPlay) return;
		setSelectedCards((prevSelected) => {
			const isSelected = prevSelected.includes(cardId);
			if (isSelected) {
				return prevSelected.filter((id) => id !== cardId);
			} else {
				return prevSelected.length < 4 ? [...prevSelected, cardId] : prevSelected;
			}
		});
	};

	return (
		<div className='cards'>
			{playerCards.map((card) => (
				<div
					key={card.card_id}
					className={`card ${
						canPlay && selectedCards.includes(card.card_id) ? styles.selected : ''
					}`}
					onClick={() => toggleCardSelection(card.card_id)}
				>
					{card.rank} – {card.suit}
				</div>
			))}
		</div>
	);
};

export default CardSelector;
