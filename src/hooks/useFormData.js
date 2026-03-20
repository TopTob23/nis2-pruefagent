import { useState, useCallback, useMemo } from "react";
import { INITIAL_FORM_DATA } from "../constants/formDefaults";
import { berechneErgebnis } from "../logic/prueflogik";

export function useFormData() {
  const [data, setData] = useState(INITIAL_FORM_DATA);

  const setField = useCallback(
    (field, value) => setData((prev) => ({ ...prev, [field]: value })),
    []
  );

  const toggleArrayItem = useCallback(
    (field, id) =>
      setData((prev) => {
        const arr = prev[field];
        return {
          ...prev,
          [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
        };
      }),
    []
  );

  const mergeData = useCallback(
    (partial) =>
      setData((prev) => {
        const updated = { ...prev };
        for (const [key, value] of Object.entries(partial)) {
          if (key in prev && value !== undefined) {
            updated[key] = value;
          }
        }
        return updated;
      }),
    []
  );

  const result = useMemo(() => berechneErgebnis(data), [data]);

  return { data, setField, toggleArrayItem, mergeData, result };
}
