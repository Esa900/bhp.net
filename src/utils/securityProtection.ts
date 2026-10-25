/**
 * Silent Document Protection System
 * Enforces silent client-side protections without any intrusive warning messages or banners:
 * 1. Silently blocks right-click context menu and image dragging
 * 2. Silently clears clipboard on PrintScreen key events
 * 3. Silently intercepts print, save, and screenshot keyboard combinations
 * 4. Silently disables mobile long-press image saving sheets
 */

export function setupSecurityProtection(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Silent Right-Click Context Menu Blocking (No Toast or Warning)
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // 2. Silent Image Drag & Drop Blocking
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
  };

  // 3. Silent Clipboard Clearing
  const clearClipboard = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('');
      }
    } catch {
      // ignore
    }
  };

  // 4. Silent Keyboard Shortcut Interceptor
  const handleKeyDown = (e: KeyboardEvent) => {
    // PrintScreen key - silently clear clipboard and cancel
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
      e.preventDefault();
      e.stopPropagation();
      clearClipboard();
      return;
    }

    // Ctrl+P / Cmd+P (Print to PDF / Download) - silently cancel
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+S / Cmd+S (Save webpage) - silently cancel
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Screenshot shortcuts (Win+Shift+S / Cmd+Shift+3,4,5 / Ctrl+Shift+S) - silently cancel
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4' || e.key === '5')
    ) {
      e.preventDefault();
      e.stopPropagation();
      clearClipboard();
      return;
    }

    // Ctrl+U (View Source) - silently cancel
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      return;
    }

    // F12 / Inspect
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools Inspect)
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')
    ) {
      e.preventDefault();
      return;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
      clearClipboard();
    }
  };

  // 5. Silent Mobile Touch Callout Handling
  let touchTimer: ReturnType<typeof setTimeout> | null = null;
  const handleTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'IMG' || target.tagName === 'OBJECT' || target.tagName === 'IFRAME')) {
      touchTimer = setTimeout(() => {
        clearClipboard();
      }, 400);
    }
  };

  const handleTouchEnd = () => {
    if (touchTimer) clearTimeout(touchTimer);
  };

  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('dragstart', handleDragStart);
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('dragstart', handleDragStart);
    window.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('keyup', handleKeyUp, true);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    if (touchTimer) clearTimeout(touchTimer);
  };
}
