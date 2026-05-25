import { useApp } from '../store';

export default function OfflineBanner() {
  const { state } = useApp();
  if (state.isOnline) return null;
  return (
    <div className="offline-banner">
      <span className="pulse-dot"></span>
      <span>
        <strong>Mode Offline</strong> — Data akan disinkronkan saat online
      </span>
    </div>
  );
}
