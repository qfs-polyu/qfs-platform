'use client';

import {useEffect, useState} from 'react';

declare global {
  interface Window {
    loadPyodide?: (opts: {indexURL: string}) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: {batched: (s: string) => void}) => void;
  setStderr: (opts: {batched: (s: string) => void}) => void;
}

const PYODIDE_VERSION = '0.28.3';
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function usePyodide() {
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle'
  );

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    const get = async (): Promise<PyodideInterface> => {
      await loadScript(`${CDN}pyodide.js`);
      if (!window.loadPyodide) throw new Error('pyodide.js loaded but loadPyodide missing');
      return window.loadPyodide({indexURL: CDN});
    };
    if (!pyodidePromise) pyodidePromise = get();
    pyodidePromise
      .then(() => {
        if (!cancelled) setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const run = async (code: string): Promise<{stdout: string; error?: string}> => {
    if (!pyodidePromise) throw new Error('pyodide not loaded');
    const py = await pyodidePromise;
    let out = '';
    let err = '';
    py.setStdout({batched: (s) => (out += s + '\n')});
    py.setStderr({batched: (s) => (err += s + '\n')});
    try {
      await py.runPythonAsync(code);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return {stdout: out.trim(), error: msg.trim()};
    }
    return {stdout: out.trim(), error: err.trim() || undefined};
  };

  return {state, run};
}
