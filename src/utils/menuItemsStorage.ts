import { DocumentMenuItem, DOCUMENT_MENU_ITEMS } from '../data/menuNavigationItems';

const STORAGE_KEY = 'bhp_custom_menu_items_v3';
export const MENU_ITEMS_UPDATED_EVENT = 'bhp_menu_items_updated';

/**
 * Get all 3-line menu items from localStorage, or return default items
 */
export function getStoredMenuItems(): DocumentMenuItem[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check previous storage key if present
      const oldRaw = localStorage.getItem('bhp_custom_menu_items_v2');
      if (oldRaw) {
        raw = oldRaw;
      } else {
        // First time initialization: store defaults
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DOCUMENT_MENU_ITEMS));
        return DOCUMENT_MENU_ITEMS;
      }
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Normalize any subMenu ending in " C" to " See"
      let hasChanges = false;
      const normalized = parsed.map((item: DocumentMenuItem) => {
        if (item.subMenu && (item.subMenu.endsWith(' C') || item.subMenu.endsWith(' c'))) {
          hasChanges = true;
          return {
            ...item,
            subMenu: item.subMenu.slice(0, -2) + ' See',
          };
        }
        return item;
      });

      if (hasChanges || !localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }
      return normalized;
    }
  } catch (err) {
    console.warn('Failed to parse stored menu items from localStorage:', err);
  }
  return DOCUMENT_MENU_ITEMS;
}

/**
 * Save menu items list to localStorage and dispatch update event
 */
export function saveStoredMenuItems(items: DocumentMenuItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(MENU_ITEMS_UPDATED_EVENT, { detail: items }));
    }
  } catch (err) {
    console.error('Failed to save menu items to localStorage:', err);
  }
}

/**
 * Add a new 3-line menu item
 */
export function addStoredMenuItem(newItem: Omit<DocumentMenuItem, 'id'> & { id?: string }): DocumentMenuItem {
  const current = getStoredMenuItems();
  const id = newItem.id?.trim() || `menu-doc-${Date.now()}`;

  const item: DocumentMenuItem = {
    ...newItem,
    id,
  };

  const updated = [item, ...current];
  saveStoredMenuItems(updated);
  return item;
}

/**
 * Update an existing 3-line menu item
 */
export function updateStoredMenuItem(id: string, updates: Partial<DocumentMenuItem>): boolean {
  const current = getStoredMenuItems();
  const idx = current.findIndex((item) => item.id === id);
  if (idx === -1) return false;

  current[idx] = {
    ...current[idx],
    ...updates,
  };

  saveStoredMenuItems(current);
  return true;
}

/**
 * Delete a 3-line menu item by ID
 */
export function deleteStoredMenuItem(id: string): boolean {
  const current = getStoredMenuItems();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) return false;

  saveStoredMenuItems(filtered);
  return true;
}

/**
 * Reorder 3-line menu item (Move up or down)
 */
export function moveStoredMenuItem(id: string, direction: 'up' | 'down'): boolean {
  const current = [...getStoredMenuItems()];
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return false;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= current.length) return false;

  const temp = current[index];
  current[index] = current[targetIndex];
  current[targetIndex] = temp;

  saveStoredMenuItems(current);
  return true;
}

/**
 * Reset all 3-line menu items back to default
 */
export function resetStoredMenuItems(): DocumentMenuItem[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DOCUMENT_MENU_ITEMS));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(MENU_ITEMS_UPDATED_EVENT, { detail: DOCUMENT_MENU_ITEMS }));
    }
  } catch (err) {
    console.error('Failed to reset menu items:', err);
  }
  return DOCUMENT_MENU_ITEMS;
}
