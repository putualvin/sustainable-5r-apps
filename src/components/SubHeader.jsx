import { useNavigate } from 'react-router-dom';

export default function SubHeader({ title, action, onAction, back = -1 }) {
  const navigate = useNavigate();
  return (
    <div className="sub-header">
      <button className="back-btn" onClick={() => navigate(back)}>‹</button>
      <span className="sub-header-title">{title}</span>
      {action && (
        <button className="sub-header-action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
