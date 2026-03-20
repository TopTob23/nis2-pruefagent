import { useState, useCallback, useMemo } from "react";
import { analyzeAndPrefill } from "../services/analysisService";

export function useAnalysis() {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([""]);
  const [useFiles, setUseFiles] = useState(true);
  const [useWebsites, setUseWebsites] = useState(true);
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const validUrls = useMemo(() => urls.filter((u) => u.trim().length > 5), [urls]);

  const hasAnySources = useMemo(
    () => (useFiles && files.length > 0) || (useWebsites && validUrls.length > 0) || useWebSearch,
    [useFiles, useWebsites, useWebSearch, files, validUrls]
  );

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const newFiles = [...e.dataTransfer.files].filter((f) => f.size < 10 * 1024 * 1024);
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const newFiles = [...e.target.files];
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  }, []);

  const removeFile = useCallback(
    (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx)),
    []
  );

  const setUrl = useCallback(
    (idx, val) =>
      setUrls((prev) => {
        const n = [...prev];
        n[idx] = val;
        return n;
      }),
    []
  );

  const addUrl = useCallback(() => setUrls((prev) => [...prev, ""]), []);

  const removeUrl = useCallback(
    (idx) => setUrls((prev) => (prev.length <= 1 ? [""] : prev.filter((_, i) => i !== idx))),
    []
  );

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setSources([]);
    try {
      const { data, quellen } = await analyzeAndPrefill({
        useFiles,
        useWebsites,
        useWebSearch,
        files,
        validUrls,
      });
      setSources(quellen);
      return data;
    } catch (e) {
      console.error("Analyse-Fehler:", e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [useFiles, useWebsites, useWebSearch, files, validUrls]);

  return {
    files,
    urls,
    useFiles,
    setUseFiles,
    useWebsites,
    setUseWebsites,
    useWebSearch,
    setUseWebSearch,
    sources,
    loading,
    dragOver,
    setDragOver,
    validUrls,
    hasAnySources,
    handleDrop,
    handleFileSelect,
    removeFile,
    setUrl,
    addUrl,
    removeUrl,
    runAnalysis,
  };
}
