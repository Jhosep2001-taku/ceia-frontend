import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const useFetchData = (endpoint) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(endpoint);
                setData(response.data);
            } catch (error) {
                console.error(`Error fetching data from ${endpoint}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, isLoading, setData };
};

export default useFetchData;
