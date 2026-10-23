import { useState, useCallback } from 'react';
import { aiAPI } from '../api/client';

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiConfigured, setAiConfigured] = useState(true);

  const analyze = useCallback(async ({ jobDescription, resumeText, applicationId }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiAPI.analyze({ jobDescription, resumeText, applicationId });
      setAnalysis(res.data);
      setAiConfigured(res.aiConfigured);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rewrite = useCallback(async (bullets, jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiAPI.rewrite({ bullets, jobDescription });
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, aiConfigured, analyze, rewrite, reset, setAnalysis };
}
