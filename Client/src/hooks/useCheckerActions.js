const useCheckerActions = (data, sendActionRequest, lobbyId) => {
	const isChecker = data?.gameInfo?.playerID === data?.gameInfo?.checkerID;

	const handleCheck = () => {
		const playerID = data?.gameInfo?.playerID;
		const turnPlayerID = data?.gameInfo?.currentPlayerID;
		sendActionRequest({
			url: `/game/${lobbyId}/check`,
			method: 'POST',
			payload: {
				checkerID: playerID,
				turnPlayerID: turnPlayerID,
			},
		});
	};

	const handleDeclineCheck = () => {
		const playerID = data?.gameInfo?.playerID;
		const turnPlayerID = data?.gameInfo?.currentPlayerID;

		sendActionRequest({
			url: `/game/${lobbyId}/decline`,
			method: 'POST',
			payload: {
				checkerID: playerID,
				turnPlayerID: turnPlayerID,
			},
		});
	};

	return { isChecker, handleCheck, handleDeclineCheck };
};

export default useCheckerActions;
