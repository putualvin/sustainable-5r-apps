import { createContext, useContext, useEffect, useReducer } from 'react';
import { SEED_DATA } from './data';

const STORAGE_KEY = '5r_app_data';
const AppContext = createContext(null);

// ============ LOAD INITIAL STATE ============
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...SEED_DATA, ...JSON.parse(saved), toast: null, modal: null, loading: false };
    }
  } catch (_) {
    /* fall through */
  }
  return { ...SEED_DATA, toast: null, modal: null, loading: false };
}

// ============ REDUCER ============
function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };

    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'TOGGLE_OFFLINE':
      return { ...state, isOnline: !state.isOnline };

    case 'ADD_AUDIT':
      return { ...state, audits: [action.payload, ...state.audits] };
    case 'UPDATE_AUDIT':
      return {
        ...state,
        audits: state.audits.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload } : a)),
      };

    case 'ADD_REDTAG':
      return { ...state, redTags: [action.payload, ...state.redTags] };
    case 'UPDATE_REDTAG':
      return {
        ...state,
        redTags: state.redTags.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t)),
      };

    case 'SAVE_CHECKLIST':
      return {
        ...state,
        checklist: { ...state.checklist, [action.payload.date]: action.payload.values },
      };

    case 'MARK_NOTIF_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case 'SYNC':
      return { ...state, lastSync: new Date().toISOString() };

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };

    case 'SHOW_MODAL':
      return { ...state, modal: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, modal: null };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'RESET':
      return { ...SEED_DATA, toast: null, modal: null, loading: false };

    default:
      return state;
  }
}

// ============ PROVIDER ============
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Persist to localStorage on every change (except transient UI state)
  useEffect(() => {
    const { toast, modal, loading, ...persisted } = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch (_) {
      /* storage full or disabled */
    }
  }, [state]);

  // Browser online/offline events
  useEffect(() => {
    const onOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const onOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

// ============ HOOK ============
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ============ ACTION HELPERS ============
export function showToast(dispatch, message) {
  dispatch({ type: 'SHOW_TOAST', payload: message });
}

export function showLoader(dispatch, show) {
  dispatch({ type: 'SET_LOADING', payload: show });
}
