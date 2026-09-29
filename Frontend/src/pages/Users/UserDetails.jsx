import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "../../services/userService";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get the user from the backend.
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading user...
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load user
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error?.response?.data?.detail ||
            "Something went wrong while loading the user."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/users")}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>
      </div>
    );
  }

  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.username;

  const details = [
    { label: "Username", value: `@${user?.username || "—"}` },
    { label: "Full Name", value: fullName },
    { label: "Email", value: user?.email || "—" },
    { label: "Role", value: user?.role || "—" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            title="Back to users"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              User Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Account information for @{user?.username}.
            </p>
          </div>
        </div>

        <Link
          to={`/users/${user?.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Pencil size={16} />
          Edit User
        </Link>
      </div>

      {/* Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {(user?.username || "?").slice(0, 1).toUpperCase()}
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              {fullName}
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {user?.role}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {detail.label}
              </dt>

              <dd className="mt-1 text-sm text-slate-800">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default UserDetails;
