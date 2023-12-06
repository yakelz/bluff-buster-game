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
		} catch (err) {
			setError(err.response?.data?.message || err.message);
			toast.error(err.response?.data?.message || err.message);
			if (onError) onError(err.response?.data?.message || err.message);
		} finally {
			setLoading(false);
		}
	};

	return { data, error, loading, sendRequest };
};

export default useApi;
