import { useApp } from '../store';

export default function Loader() {
  const { state } = useApp();
  if (!state.loading) return null;
  return (
    <div className="loader">
      <div className="spinner"></div>
      <div style={{ fontSize: 12, color: '#666' }}>Memuat...</div>
    </div>
  );
}
