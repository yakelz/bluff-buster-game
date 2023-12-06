import { useState } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const useApi = () => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const sendRequest = async ({ url, method, payload, onSuccess, onError }) => {
		setLoading(true);
		try {
			const response = await axios({ url, method, data: payload });
			setData(response.data);
			if (onSuccess) onSuccess(response.data);
			//toast.success(response.data.message);
		} catch (err) {
			// Обработка ошибки
			let errorMessage = 'Client: ' + err.message;
			if (err.response?.data?.error) {
				errorMessage = Array.isArray(err.response.data.error)
					? 'Database: ' + err.response.data.error[0]
					: 'Server: ' + err.response.data.error;
			}

			setError(errorMessage);
			toast.error(errorMessage);
			if (onError) onError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { data, error, loading, sendRequest };
};

export default useApi;
