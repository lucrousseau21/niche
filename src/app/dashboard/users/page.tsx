"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { useDashboardTheme } from "../ThemeContext";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  grade: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export default function UsersPage() {
  const { isDark } = useDashboardTheme();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [userActionFeedback, setUserActionFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      } else {
        console.error("Erreur users:", data.error);
      }
    } catch (err) {
      console.error("Erreur réseau users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (user: AdminUser) => {
    if (user.isSuperAdmin) return;
    const newIsAdmin = !user.isAdmin;
    setUpdatingUserId(user.id);
    setUserActionFeedback(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, makeAdmin: newIsAdmin }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? { ...u, isAdmin: newIsAdmin, grade: newIsAdmin ? "admin" : "Débutant" }
              : u
          )
        );
        setUserActionFeedback({
          message: newIsAdmin
            ? `L'utilisateur ${user.email} est désormais Administrateur.`
            : `Le rôle Administrateur a été retiré à ${user.email}.`,
          type: "success",
        });
      } else {
        setUserActionFeedback({
          message: `Erreur: ${data.error || "Impossible de modifier le rôle"}`,
          type: "error",
        });
      }
    } catch (err: any) {
      setUserActionFeedback({
        message: `Erreur: ${err.message || "Erreur de connexion"}`,
        type: "error",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.email.toLowerCase().includes(userSearch.toLowerCase());
      if (!matchesSearch) return false;
      if (roleFilter === "admin") return u.isAdmin;
      if (roleFilter === "user") return !u.isAdmin;
      return true;
    });
  }, [users, userSearch, roleFilter]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Jamais";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-4">
      {/* Feedback Message */}
      {userActionFeedback && (
        <div
          className={`p-4 rounded-xl flex-none flex items-center gap-3 text-sm font-medium shadow-sm transition ${
            userActionFeedback.type === "success"
              ? isDark
                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : isDark
              ? "bg-red-950/70 text-red-300 border border-red-800"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {userActionFeedback.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-500 flex-none" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-none" />
          )}
          <span>{userActionFeedback.message}</span>
        </div>
      )}

      {/* Header section avec Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-none">
        <div
          className={`p-5 rounded-2xl border shadow-sm transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-gray-400"
            }`}
          >
            Total Utilisateurs
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-[#1A3D3B]"
              }`}
            >
              {users.length}
            </span>
            <span className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              comptes inscrits
            </span>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-sm transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Administrateurs
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${
                isDark ? "text-emerald-400" : "text-emerald-700"
              }`}
            >
              {users.filter((u) => u.isAdmin).length}
            </span>
            <span className="text-xs text-emerald-500/80">avec droits admin</span>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border shadow-sm transition ${
            isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? "text-slate-400" : "text-gray-400"
            }`}
          >
            Utilisateurs Standards
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${
                isDark ? "text-slate-200" : "text-gray-700"
              }`}
            >
              {users.filter((u) => !u.isAdmin).length}
            </span>
            <span className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              membres
            </span>
          </div>
        </div>
      </div>

      {/* Filtres & Recherche */}
      <div
        className={`p-3.5 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between flex-none transition ${
          isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
        }`}
      >
        <div className="relative w-full sm:w-96">
          <Search
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            placeholder="Rechercher par adresse email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
              isDark
                ? "bg-[#0E1722] border border-[#223347] text-white placeholder-slate-500 focus:ring-emerald-500/30 focus:border-emerald-500"
                : "bg-gray-50 border border-gray-200 text-gray-900 focus:ring-[#1A3D3B]/20 focus:border-[#1A3D3B]"
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span
            className={`text-xs font-medium mr-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Rôle :
          </span>
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              roleFilter === "all"
                ? isDark
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-[#1A3D3B] text-white"
                : isDark
                ? "bg-[#1B293A] text-slate-300 hover:bg-[#23354B]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tous ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              roleFilter === "admin"
                ? isDark
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-[#1A3D3B] text-white"
                : isDark
                ? "bg-[#1B293A] text-slate-300 hover:bg-[#23354B]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admins ({users.filter((u) => u.isAdmin).length})
          </button>
          <button
            onClick={() => setRoleFilter("user")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              roleFilter === "user"
                ? isDark
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-[#1A3D3B] text-white"
                : isDark
                ? "bg-[#1B293A] text-slate-300 hover:bg-[#23354B]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Membres ({users.filter((u) => !u.isAdmin).length})
          </button>

          <button
            onClick={fetchUsers}
            disabled={usersLoading}
            className={`ml-2 p-2 rounded-lg border transition ${
              isDark
                ? "border-[#223347] text-slate-300 hover:bg-[#1B293A]"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table des Utilisateurs */}
      <div
        className={`flex-1 min-h-0 rounded-2xl border shadow-sm overflow-hidden flex flex-col transition ${
          isDark ? "bg-[#14202E] border-[#223347]" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full text-left text-sm">
            <thead
              className={`sticky top-0 z-10 border-b text-xs uppercase font-semibold tracking-wider ${
                isDark
                  ? "bg-[#101924] border-[#223347] text-slate-400"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <tr>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Inscription</th>
                <th className="px-6 py-4">Dernière Connexion</th>
                <th className="px-6 py-4">Grade / Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-[#1B293A]" : "divide-gray-100"}`}>
              {usersLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-6 py-12 text-center ${
                      isDark ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                      <span>Chargement des utilisateurs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-6 py-12 text-center ${
                      isDark ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isUpdating = updatingUserId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className={`transition ${
                        isDark ? "hover:bg-[#1B293A]/50" : "hover:bg-gray-50/80"
                      }`}
                    >
                      {/* Email & ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                              u.isSuperAdmin
                                ? isDark
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-amber-100 text-amber-700"
                                : u.isAdmin
                                ? isDark
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-emerald-100 text-emerald-700"
                                : isDark
                                ? "bg-[#1E2E40] text-slate-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div
                              className={`font-semibold text-sm ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {u.email}
                            </div>
                            <div
                              className={`text-xs font-mono ${
                                isDark ? "text-slate-500" : "text-gray-400"
                              }`}
                            >
                              {u.id.substring(0, 16)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date de création */}
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDark ? "text-slate-300" : "text-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar
                            className={`w-3.5 h-3.5 ${
                              isDark ? "text-slate-500" : "text-gray-400"
                            }`}
                          />
                          {formatDate(u.created_at)}
                        </div>
                      </td>

                      {/* Dernière connexion */}
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          isDark ? "text-slate-300" : "text-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock
                            className={`w-3.5 h-3.5 ${
                              isDark ? "text-slate-500" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={
                              u.last_sign_in_at
                                ? isDark
                                  ? "text-slate-200"
                                  : "text-gray-700"
                                : isDark
                                ? "text-slate-500 italic"
                                : "text-gray-400 italic"
                            }
                          >
                            {formatDate(u.last_sign_in_at)}
                          </span>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.isSuperAdmin ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              isDark
                                ? "bg-amber-950/60 text-amber-300 border-amber-800/80"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            SuperAdmin
                          </span>
                        ) : u.isAdmin ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                              isDark
                                ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            Administrateur
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              isDark
                                ? "bg-[#1F2F42] text-slate-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {u.grade || "Utilisateur"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {u.isSuperAdmin ? (
                          <span
                            className={`text-xs italic font-medium ${
                              isDark ? "text-slate-500" : "text-gray-400"
                            }`}
                          >
                            Créateur (Protégé)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                              u.isAdmin
                                ? isDark
                                  ? "bg-red-950/50 text-red-300 hover:bg-red-900/60 border border-red-800/80"
                                  : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                : isDark
                                ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                                : "bg-[#1A3D3B] text-white hover:bg-[#142f2d] shadow-sm"
                            } disabled:opacity-50`}
                          >
                            {isUpdating ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : u.isAdmin ? (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Retirer Admin
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Passer Admin
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
