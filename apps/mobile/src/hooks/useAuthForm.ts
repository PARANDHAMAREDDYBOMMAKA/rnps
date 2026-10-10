import { useState } from "react";
import type { ZodSchema } from "zod";

export const useAuthForm = <T extends object>(schema: ZodSchema<T>, submit: (input: T) => Promise<void>) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof T & string) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = async () => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid input");
    setError(null);
    setLoading(true);
    try {
      await submit(parsed.data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { values, set, error, loading, onSubmit };
};
