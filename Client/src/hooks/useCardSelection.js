import { useState } from 'react';

const useCardSelection = (data, sendActionRequest, lobbyId) => {
	const [selectedCards, setSelectedCards] = useState([]);
	const toggleCardSelection = (cardId, canPlay) => {
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

	const submitSelectedCards = () => {
		const playerID = data?.gameInfo?.playerID;

		if (selectedCards.length === 0) {
			console.log('no cards selected');
			return;
		}

		const payload = {
			playerID,
			selectedCards,
		};

		sendActionRequest({
			url: `/game/${lobbyId}/`,
			method: 'PUT',
			payload: payload,
		});
		setSelectedCards([]);
	};

	return { selectedCards, toggleCardSelection, submitSelectedCards };
};

export default useCardSelection;
