import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  RefreshCw,
  Users as UsersIcon,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getUsers } from "../../services/userService";

const Users = () => {
  // Stores the currently selected role filter
  const [selectedRole, setSelectedRole] = useState("ALL");

  // Get users from the backend
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Available role filter buttons
  const roles = [
    { label: "All Users", value: "ALL" },
    { label: "Admin", value: "ADMIN" },
    { label: "Doctor", value: "DOCTOR" },
    { label: "Receptionist", value: "RECEPTIONIST" },
    { label: "Pharmacist", value: "PHARMACIST" },
    { label: "Accountant", value: "ACCOUNTANT" },
    { label: "Patient", value: "PATIENT" },
  ];

  // Filter users according to the selected role
  const filteredUsers =
    selectedRole === "ALL"
      ? users
      : users.filter((user) => user.role === selectedRole);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-slate-600"
            size={28}
          />

          <p className="mt-3 text-gray-600">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load users
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.response?.data?.detail ||
            "Something went wrong while loading users."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage system users and their roles.
          </p>
        </div>

        <div className="flex gap-2">
          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />

            Refresh
          </button>

          {/* Add user button */}
          <Link
            to="/users/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <UserPlus size={16} />

            Add User
          </Link>
        </div>
      </div>

      {/* Role filter buttons */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedRole === role.value
                ? "bg-slate-900 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* User count */}
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-700">
          {filteredUsers.length}
        </span>{" "}
        {filteredUsers.length === 1 ? "user" : "users"}
      </div>

      {/* No users found */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <UsersIcon
            size={40}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            No users found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            No users found for the selected role.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop/tablet table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Username
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          @{user.username}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {`${user.first_name || ""} ${
                          user.last_name || ""
                        }`.trim() || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {filteredUsers.map((user) => {
              const name =
                `${user.first_name || ""} ${
                  user.last_name || ""
                }`.trim() || user.username;

              return (
                <div
                  key={user.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {name}
                      </h2>

                      <p className="text-sm text-gray-500">
                        @{user.username}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {user.role}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">
                      Email:
                    </span>{" "}
                    {user.email || "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Users;

