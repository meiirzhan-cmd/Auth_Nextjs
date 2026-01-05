import { verifySession, getUser } from "@/lib/dal";
import { getOwnProfileDTO } from "@/lib/dto";

/**
 * Example: Protected Server Component using DAL
 *
 * This component demonstrates:
 * 1. Auth verification using verifySession()
 * 2. Data fetching using getUser()
 * 3. Using DTOs for safe data exposure
 *
 * Usage in a page:
 * import ProtectedComponent from "@/components/examples/ProtectedComponent"
 *
 * export default function Page() {
 *   return <ProtectedComponent />
 * }
 */
export default async function ProtectedComponent() {
  // Auth check - redirects to login if not authenticated
  const session = await verifySession();

  // Fetch user data from database
  const user = await getUser();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Protected Content</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">User ID:</span> {session.userId}
        </p>
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-sm text-gray-500">
          This component is only accessible to authenticated users.
        </p>
      </div>
    </div>
  );
}

/**
 * Example: Admin-only component
 *
 * Demonstrates role-based access control
 */
export async function AdminOnlyComponent() {
  const session = await verifySession();

  // TODO: Add role checking when you implement roles
  // const userRole = session.role
  // if (userRole !== 'admin') {
  //   return null
  // }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Admin Controls
      </h3>
      <p className="text-red-700">
        This section is only visible to administrators.
      </p>
      <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Admin Action
      </button>
    </div>
  );
}

/**
 * Example: User profile with DTO
 *
 * Demonstrates using DTOs for permission-based data exposure
 */
export async function UserProfileComponent() {
  // Use DTO to get profile with proper field visibility
  const profile = await getOwnProfileDTO();

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">My Profile</h3>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-blue-700">Name</dt>
          <dd className="text-blue-900">{profile.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-blue-700">Email</dt>
          <dd className="text-blue-900">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-blue-700">Member Since</dt>
          <dd className="text-blue-900">
            {profile.createdAt?.toLocaleDateString()}
          </dd>
        </div>
      </dl>
    </div>
  );
}
