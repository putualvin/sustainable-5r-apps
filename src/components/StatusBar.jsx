import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar">
      <span>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11 }}>
        <span>●●●●</span>
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

function formatTime(d) {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
