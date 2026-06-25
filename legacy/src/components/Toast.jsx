import { useEffect } from 'react';
import { useApp } from '../store';

export default function Toast() {
  const { state, dispatch } = useApp();
  const toast = state.toast;

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2500);
    return () => clearTimeout(id);
  }, [toast, dispatch]);

  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}
