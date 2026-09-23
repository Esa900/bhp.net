import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Key,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  User,
  Mail,
  Lock,
  Calendar,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { AuthUser } from '../../types/auth';
import {
  getRegisteredUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  BHP_USERS_UPDATED_EVENT,
} from '../../utils/authStorage';

interface AdminUserManagerProps {
  showToast: (msg: string) => void;
}

export const AdminUserManager: React.FC<AdminUserManagerProps> = ({ showToast }) => {
  const [users, setUsers] = useState<AuthUser[]>(() => getRegisteredUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'admin' | 'user'>('ALL');

  // Password visibility map (userId -> boolean)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  // Form State - Create User
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [showNewPassword, setShowNewPassword] = useState(true);

  // Form State - Edit User
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Sync users in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setUsers(getRegisteredUsers());
    };
    window.addEventListener(BHP_USERS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(BHP_USERS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  // Handle Create User Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createUserByAdmin({
      username: newUsername,
      password: newPassword,
      email: newEmail,
      fullName: newFullName,
      role: newRole,
    });

    if (res.success) {
      showToast(res.message);
      setUsers(getRegisteredUsers());
      setShowCreateModal(false);
      // Reset form
      setNewUsername('');
      setNewPassword('');
      setNewEmail('');
      setNewFullName('');
      setNewRole('user');
    } else {
      showToast(`Error: ${res.message}`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: AuthUser) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditPassword(user.password || '');
    setEditEmail(user.email || '');
    setEditFullName(user.fullName || '');
    setEditRole((user.role as 'user' | 'admin') || 'user');
    setShowEditPassword(false);
    setShowEditModal(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const res = updateUserByAdmin(selectedUser.id, {
      username: editUsername,
      password: editPassword,
      email: editEmail,
      fullName: editFullName,
      role: editRole,
    });

    if (res.success) {
      showToast(res.message);
      setUsers(getRegisteredUsers());
      setShowEditModal(false);
      setSelectedUser(null);
    } else {
      showToast(`Error: ${res.message}`);
    }
  };

  // Handle Delete User
  const handleDeleteUser = (user: AuthUser) => {
    const isProtected = user.username.toLowerCase() === 'saymon67' && users.length <= 1;
    if (isProtected) {
      showToast('Cannot delete the primary root administrator account.');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to remove user "${user.username}"?\n\nThis user will be permanently deleted from the database and will NO LONGER be able to login with their username and password!`
      )
    ) {
      const res = deleteUserByAdmin(user.id);
      if (res.success) {
        showToast(res.message);
        setUsers(getRegisteredUsers());
      } else {
        showToast(`Error: ${res.message}`);
      }
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.fullName && u.fullName.toLowerCase().includes(q));

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchQuery && matchRole;
  });

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const standardCount = users.filter((u) => u.role !== 'admin').length;

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2D35] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6b47ff] to-[#9962ff] flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                User List & Security Access (ইউজার তালিকা)
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                সকল নিবন্ধিত ইউজার দেখুন, নতুন ইউজার তৈরি করুন অথবা ব্যবহারকারীর পাসওয়ার্ড ও ইউজারনেম নিয়ন্ত্রণ করুন।
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewUsername('');
            setNewPassword('');
            setNewEmail('');
            setNewFullName('');
            setNewRole('user');
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6b47ff] to-[#9962ff] hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/30 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create User (নতুন ইউজার তৈরি)</span>
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#1C1E23] border border-[#2D313A] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Registered</span>
            <div className="text-2xl font-extrabold text-white mt-1">{users.length}</div>
            <span className="text-[11px] text-gray-500">Live in Database</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#252830] flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1C1E23] border border-[#2D313A] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-gray-400 font-medium">Admin Accounts</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{adminCount}</div>
            <span className="text-[11px] text-amber-500/70">Full System Access</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/30 border border-amber-800/30 flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1C1E23] border border-[#2D313A] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-gray-400 font-medium">Standard Users</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{standardCount}</div>
            <span className="text-[11px] text-emerald-500/70">Protected Portal Users</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-800/30 flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#17191D] p-3 rounded-xl border border-[#282B33]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search username, email or full name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1E2026] border border-[#30343F] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6b47ff]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">Role:</span>
          {(['ALL', 'admin', 'user'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-gradient-to-r from-[#6b47ff] to-[#9962ff] text-white shadow-sm'
                  : 'bg-[#1E2026] text-gray-400 hover:text-white border border-[#30343F]'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1C1E23] rounded-xl border border-[#2D313A] overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 border-b border-[#2D313A] flex items-center justify-between bg-[#17191D]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Registered Users Database
            </span>
            <span className="text-[11px] font-mono bg-[#282B33] text-gray-300 px-2 py-0.5 rounded">
              {filteredUsers.length} shown
            </span>
          </div>
          <div className="text-[11px] text-gray-400">
            Sign-ups from frontend auto-sync here
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-gray-600" />
            <p className="text-sm font-semibold text-gray-300">কোনো ইউজার পাওয়া যায়নি</p>
            <p className="text-xs text-gray-500">
              অনুসন্ধানের সাথে মিল রেখে কোনো রেকর্ড নেই অথবা এখনও কোনো ইউজার তৈরি করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#15171A] text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#282B33]">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Username (লগইন আইডি)</th>
                  <th className="py-3 px-4">Password (পাসওয়ার্ড)</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions (নিয়ন্ত্রণ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26282E]">
                {filteredUsers.map((u) => {
                  const isPassVisible = !!visiblePasswords[u.id];
                  const isPrimaryAdmin = u.username.toLowerCase() === 'saymon67';

                  return (
                    <tr key={u.id} className="hover:bg-[#22252C] transition-colors">
                      {/* User Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6b47ff] to-[#9962ff] flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-sm">
                            {u.username.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.fullName || u.username}</span>
                              {isPrimaryAdmin && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Root
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gray-500" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-[#15171A] px-2.5 py-1 rounded border border-[#2E323D] text-[#a78bfa]">
                            {u.username}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(u.username, 'Username')}
                            className="text-gray-500 hover:text-gray-300 p-1 rounded transition-colors cursor-pointer"
                            title="Copy Username"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#15171A] px-2.5 py-1 rounded border border-[#2E323D] text-emerald-400 font-semibold min-w-[90px]">
                            {isPassVisible ? (
                              <span>{u.password || '******'}</span>
                            ) : (
                              <span className="tracking-widest">••••••••</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            title={isPassVisible ? 'Hide Password' : 'Show Password'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {u.password && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(u.password!, 'Password')}
                              className="text-gray-500 hover:text-gray-300 p-1 rounded transition-colors cursor-pointer"
                              title="Copy Password"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            u.role === 'admin'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-700/40'
                          }`}
                        >
                          {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          <span>{u.role || 'user'}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                        <div className="text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        {u.lastLoginAt && (
                          <div className="text-[10px] text-gray-500">
                            Active: {new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons: Edit & Remove */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#262A33] hover:bg-[#343945] text-amber-300 rounded-lg transition-colors cursor-pointer border border-[#3A3F4C] text-xs font-semibold"
                            title="Edit username and password"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit</span>
                          </button>

                          {/* Delete / Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg transition-colors cursor-pointer border border-red-800/40 text-xs font-semibold"
                            title="Remove user (তারা আর লগইন করতে পারবে না)"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: CREATE USER (নতুন ইউজার তৈরি)
         ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#8b5cf6]" />
                <h4 className="font-bold text-base text-white">Create New User (নতুন ইউজার তৈরি)</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#282C36] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              এখানে আপনার নির্ধারিত নির্দিষ্ট ইউজারনেম ও পাসওয়ার্ড দিয়ে ইউজার তৈরি করুন। ইউজার এই নির্দিষ্ট তথ্য দিয়ে ওয়েবসাইটে লগইন করতে পারবে।
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-1">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Username (লগইন ইউজারনেম) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. user2026 or employee_john"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Password (লগইন পাসওয়ার্ড) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter user password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Email Address (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address (ইমেইল - ঐচ্ছিক)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="user@bhp.com (খালি রাখলে স্বয়ংক্রিয় বসবে)"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Account Role (ইউজার পদবী)
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
                  className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
                >
                  <option value="user">Standard User (সাধারণ ব্যবহারকারী)</option>
                  <option value="admin">Administrator (এডমিনিস্ট্রেটর)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2C303B]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#6b47ff] to-[#9962ff] hover:brightness-110 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-purple-900/30"
                >
                  Create User Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT USER (ইউজার এডিট)
         ========================================================================= */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1E23] border border-[#3A3F4C] text-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2C303B] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-base text-white">
                  Edit User: {selectedUser.username}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#282C36] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 pt-1">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Username (ইউজারনেম) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Password (পাসওয়ার্ড পরিবর্তন) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email Address (ইমেইল)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
                  className="w-full bg-[#15171A] border border-[#2D313A] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8b5cf6] cursor-pointer"
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2C303B]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-[#252830] hover:bg-[#323640] text-gray-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
