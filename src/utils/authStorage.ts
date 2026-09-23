import { AuthUser } from '../types/auth';

export const BHP_USERS_DB_KEY = 'bhp_registered_users_database';
export const BHP_AUTH_SESSION_KEY = 'bhp_authenticated_session';
export const BHP_AUTH_STATE_EVENT = 'bhp_auth_state_changed';
export const BHP_USERS_UPDATED_EVENT = 'bhp_users_database_updated';

// Pre-seeded accounts: default username saymon67 and password saymon6750
export const DEFAULT_USERS: AuthUser[] = [
  {
    id: 'user-saymon67',
    username: 'saymon67',
    email: 'saymon67@bhp.com',
    password: 'saymon6750',
    fullName: 'Saymon (Super Admin)',
    role: 'admin',
    createdAt: '2026-03-01T00:00:00Z',
    lastLoginAt: '2026-03-23T11:00:00Z',
  },
  {
    id: 'user-admin-01',
    username: 'admin',
    email: 'admin@bhp.com',
    password: 'admin',
    fullName: 'System Administrator',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'user-bhp-02',
    username: 'bhp_user',
    email: 'user@bhp.com',
    password: 'bhp2026',
    fullName: 'BHP Verified Member',
    role: 'user',
    createdAt: '2026-02-15T00:00:00Z',
  },
];

/**
 * Get all registered users from localStorage database
 */
export function getRegisteredUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(BHP_USERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(BHP_USERS_DB_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure saymon67 is present
      const hasSaymon = parsed.some(
        (u) => u.username?.toLowerCase() === 'saymon67'
      );
      if (!hasSaymon) {
        const merged = [DEFAULT_USERS[0], ...parsed];
        localStorage.setItem(BHP_USERS_DB_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return DEFAULT_USERS;
  } catch (err) {
    console.error('Failed to load registered users:', err);
    return DEFAULT_USERS;
  }
}

/**
 * Save users list to database
 */
export function saveRegisteredUsers(users: AuthUser[]): void {
  try {
    localStorage.setItem(BHP_USERS_DB_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent(BHP_USERS_UPDATED_EVENT, { detail: users }));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

/**
 * Register a new user into database from public Sign Up form
 */
export function registerUser(
  username: string,
  email: string,
  password: string
): { success: boolean; message: string; user?: AuthUser } {
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername) {
    return { success: false, message: 'Username is required' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, message: 'Valid email address is required' };
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long' };
  }

  const existingUsers = getRegisteredUsers();

  // Check username uniqueness (case-insensitive)
  const usernameTaken = existingUsers.some(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );
  if (usernameTaken) {
    return { success: false, message: 'This username is already registered. Please choose another or login.' };
  }

  // Check email uniqueness
  const emailTaken = existingUsers.some(
    (u) => u.email.toLowerCase() === cleanEmail
  );
  if (emailTaken) {
    return { success: false, message: 'This email is already registered. Please login.' };
  }

  const newUser: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    email: cleanEmail,
    password: cleanPassword,
    fullName: cleanUsername,
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  const updatedList = [newUser, ...existingUsers];
  saveRegisteredUsers(updatedList);

  return { success: true, message: 'Account created successfully!', user: newUser };
}

/**
 * Create a new user manually by Admin
 */
export function createUserByAdmin(params: {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  role?: 'admin' | 'user' | 'employee';
}): { success: boolean; message: string; user?: AuthUser } {
  const cleanUsername = params.username.trim();
  const cleanPassword = params.password.trim();
  const cleanEmail = (params.email?.trim() || `${cleanUsername.toLowerCase()}@bhp.com`).toLowerCase();

  if (!cleanUsername) {
    return { success: false, message: 'Username is required' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!cleanPassword || cleanPassword.length < 3) {
    return { success: false, message: 'Password must be at least 3 characters long' };
  }

  const existingUsers = getRegisteredUsers();

  // Check if username already exists
  const usernameTaken = existingUsers.some(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );
  if (usernameTaken) {
    return { success: false, message: `Username "${cleanUsername}" is already in use.` };
  }

  const newUser: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    email: cleanEmail,
    password: cleanPassword,
    fullName: params.fullName?.trim() || cleanUsername,
    role: params.role || 'user',
    createdAt: new Date().toISOString(),
  };

  const updated = [newUser, ...existingUsers];
  saveRegisteredUsers(updated);

  return { success: true, message: `User "${cleanUsername}" created successfully!`, user: newUser };
}

/**
 * Update user details by Admin
 */
export function updateUserByAdmin(
  id: string,
  updates: {
    username?: string;
    password?: string;
    email?: string;
    fullName?: string;
    role?: 'admin' | 'user' | 'employee';
  }
): { success: boolean; message: string; user?: AuthUser } {
  const users = getRegisteredUsers();
  const targetIndex = users.findIndex((u) => u.id === id);

  if (targetIndex === -1) {
    return { success: false, message: 'User not found in database.' };
  }

  const currentUser = users[targetIndex];

  // If username changed, ensure unique
  if (updates.username && updates.username.trim().toLowerCase() !== currentUser.username.toLowerCase()) {
    const cleanUsername = updates.username.trim();
    const taken = users.some(
      (u) => u.id !== id && u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (taken) {
      return { success: false, message: `Username "${cleanUsername}" already taken by another account.` };
    }
  }

  const updatedUser: AuthUser = {
    ...currentUser,
    username: updates.username?.trim() || currentUser.username,
    email: updates.email?.trim().toLowerCase() || currentUser.email,
    password: updates.password?.trim() || currentUser.password,
    fullName: updates.fullName?.trim() || currentUser.fullName,
    role: updates.role || currentUser.role,
  };

  users[targetIndex] = updatedUser;
  saveRegisteredUsers(users);

  // If the updated user is currently logged in, sync session
  const currentSession = getCurrentAuthUser();
  if (currentSession && currentSession.id === id) {
    setCurrentAuthUser(updatedUser);
  }

  return { success: true, message: 'User credentials updated successfully!', user: updatedUser };
}

/**
 * Delete / Remove user by Admin
 * If removed, that username and password can NO LONGER log in!
 */
export function deleteUserByAdmin(id: string): { success: boolean; message: string } {
  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: 'User not found.' };
  }

  // Filter out target user
  const updated = users.filter((u) => u.id !== id);
  saveRegisteredUsers(updated);

  // If deleted user is currently logged in, terminate their active session
  const currentSession = getCurrentAuthUser();
  if (currentSession && (currentSession.id === id || currentSession.username.toLowerCase() === target.username.toLowerCase())) {
    logoutAuthUser();
  }

  return { success: true, message: `User "${target.username}" has been removed. Access revoked.` };
}

/**
 * Authenticate login against registered users database
 */
export function authenticateUser(
  username: string,
  password: string
): { success: boolean; message: string; user?: AuthUser } {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername) {
    return { success: false, message: 'Please enter your username' };
  }
  if (!cleanPassword) {
    return { success: false, message: 'Please enter your password' };
  }

  const users = getRegisteredUsers();

  // Find user by username or email
  const matched = users.find(
    (u) =>
      u.username.toLowerCase() === cleanUsername ||
      u.email.toLowerCase() === cleanUsername
  );

  if (!matched) {
    return { success: false, message: 'No account found with this username. Please register or contact admin.' };
  }

  if (matched.password !== cleanPassword) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  // Update last login
  const updatedUser: AuthUser = {
    ...matched,
    lastLoginAt: new Date().toISOString(),
  };

  const updatedUsers = users.map((u) => (u.id === matched.id ? updatedUser : u));
  saveRegisteredUsers(updatedUsers);

  return { success: true, message: 'Login successful!', user: updatedUser };
}

/**
 * Get currently logged in user session
 */
export function getCurrentAuthUser(): AuthUser | null {
  try {
    const local = localStorage.getItem(BHP_AUTH_SESSION_KEY);
    if (local) {
      return JSON.parse(local);
    }
    const session = sessionStorage.getItem(BHP_AUTH_SESSION_KEY);
    if (session) {
      return JSON.parse(session);
    }
    return null;
  } catch (err) {
    console.error('Failed to get current auth user:', err);
    return null;
  }
}

/**
 * Save logged in user session
 */
export function setCurrentAuthUser(user: AuthUser | null, rememberMe: boolean = true): void {
  try {
    if (!user) {
      localStorage.removeItem(BHP_AUTH_SESSION_KEY);
      sessionStorage.removeItem(BHP_AUTH_SESSION_KEY);
    } else {
      const sanitized: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || user.username,
        role: user.role || 'user',
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem(BHP_AUTH_SESSION_KEY, JSON.stringify(sanitized));
        sessionStorage.removeItem(BHP_AUTH_SESSION_KEY);
      } else {
        sessionStorage.setItem(BHP_AUTH_SESSION_KEY, JSON.stringify(sanitized));
        localStorage.removeItem(BHP_AUTH_SESSION_KEY);
      }
    }

    window.dispatchEvent(new CustomEvent(BHP_AUTH_STATE_EVENT, { detail: user }));
  } catch (err) {
    console.error('Failed to set current auth user:', err);
  }
}

/**
 * Log out user
 */
export function logoutAuthUser(): void {
  setCurrentAuthUser(null);
}
