// file: lib/utils/deepClean.ts
export function deepClean<T>(obj: T): T {
  const isPlain = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

  const clean = (v: any): any => {
    if (Array.isArray(v)) {
      const arr = v.map(clean).filter(x => x !== undefined);
      return arr.length ? arr : undefined;
    }
    if (isPlain(v)) {
      const out: Record<string, any> = {};
      for (const [k, val] of Object.entries(v)) {
        const c = clean(val);
        if (c !== undefined) out[k] = c;
      }
      return Object.keys(out).length ? out : undefined;
    }
    if (v === '' || v === null || v === undefined || v === 'undefined') return undefined;
    return v;
  };

  return (clean(obj) ?? {}) as T;
}

