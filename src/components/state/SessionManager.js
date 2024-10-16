import { logout } from './Logout';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const initializeSessionManager = () => {
    let timeoutId;

    const resetTimeout = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(logout, SESSION_TIMEOUT);
    };

    // イベントリスナーを設定
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
        document.addEventListener(eventType, resetTimeout);
    });

    // 初回のタイムアウトを設定
    resetTimeout();
};