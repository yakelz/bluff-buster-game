import { useState } from 'react';

const useCardSelection = (data, sendActionRequest, lobbyId) => {
	const [selectedCards, setSelectedCards] = useState([]);
	console.log(selectedCards);
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

		const payload = {
			playerID,
			selectedCards,
		};

		sendActionRequest({
			url: `/game/${lobbyId}/`,
			method: 'PUT',
			payload: payload,
		});
	};

	return { selectedCards, toggleCardSelection, submitSelectedCards };
};

export default useCardSelection;
