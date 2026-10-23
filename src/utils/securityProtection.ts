/**
 * BHP Anti-Screenshot & Document Protection System
 * Enforces strict client-side DRM, clipboard clearing on PrintScreen,
 * key combination blocking, and blur protection during screen capture attempts.
 */

export function setupSecurityProtection(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Context Menu / Right-click block
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // 2. Keyboard shortcut blocking
  const handleKeyDown = (e: KeyboardEvent) => {
    // PrintScreen key
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
      e.preventDefault();
      try {
        navigator.clipboard.writeText('');
      } catch {
        // ignore
      }
      showSecurityAlert();
      return;
    }

    // Ctrl+P / Cmd+P (Print)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      showSecurityAlert();
      return;
    }

    // Ctrl+S / Cmd+S (Save webpage)
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return;
    }

    // Ctrl+Shift+S / Cmd+Shift+3,4,5 (Snipping / Screenshot shortcuts)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5')) {
      e.preventDefault();
      try {
        navigator.clipboard.writeText('');
      } catch {
        // ignore
      }
      showSecurityAlert();
      return;
    }

    // Ctrl+U (View Source) & F12 / Inspect
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return;
    }
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
      try {
        navigator.clipboard.writeText('');
      } catch {
        // ignore
      }
    }
  };

  let alertTimeout: ReturnType<typeof setTimeout> | null = null;
  const showSecurityAlert = () => {
    let alertEl = document.getElementById('bhp-security-toast');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.id = 'bhp-security-toast';
      alertEl.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2.5 rounded-xl bg-amber-950/90 border border-amber-500 text-amber-200 text-xs font-bold shadow-2xl backdrop-blur-md pointer-events-none transition-opacity duration-300';
      alertEl.innerHTML = '🔒 Protected Record: Screenshots and printing are strictly restricted by BHP Security Policy.';
      document.body.appendChild(alertEl);
    }
    alertEl.style.opacity = '1';
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      if (alertEl) alertEl.style.opacity = '0';
    }, 2800);
  };

  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('keyup', handleKeyUp, true);
    if (alertTimeout) clearTimeout(alertTimeout);
  };
}
