import axios from "axios";
import { useState } from "react";
import { UNEXPECTED_ERROR_MESSAGE } from "../constants/messages";

const API_BASE_URL = import.meta.env.VITE_FRED_API_BASE_URL;
const API_KEY = import.meta.env.VITE_FRED_API_KEY;

export const useFredAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any): string => {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 400) {
        return err.response?.data?.error_message;
      }
    }
    return UNEXPECTED_ERROR_MESSAGE;
  };

  const clearError = () => {
    setError(null);
  };

  const fetchFredData = async (seriesId: string, frequency: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/series/observations`, {
        params: {
          series_id: seriesId,
          api_key: API_KEY,
          file_type: "json",
          frequency,
        },
      });
      return response.data;
    } catch (err) {
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const searchFredSeries = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/series/search`, {
        params: {
          search_text: query,
          api_key: API_KEY,
          file_type: "json",
        },
      });
      return response.data?.seriess || [];
    } catch (err) {
      const message = handleError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchFredData, searchFredSeries, loading, error, clearError };
};
