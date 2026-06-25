import { useApp } from '../store';

export default function Modal() {
  const { state, dispatch } = useApp();
  const modal = state.modal;
  if (!modal) return null;

  const close = () => dispatch({ type: 'CLOSE_MODAL' });

  return (
    <div
      className={`modal-overlay ${modal.centered ? 'center' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{modal.title}</div>
          <button className="modal-close" onClick={close}>✕</button>
        </div>
        <div className="modal-body">{modal.body}</div>
        {modal.actions && modal.actions.length > 0 && (
          <div className="modal-footer">
            {modal.actions.map((a, i) => (
              <button
                key={i}
                className={a.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => {
                  if (a.onClick) a.onClick();
                  if (a.closeAfter !== false) close();
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
