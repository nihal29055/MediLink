import React, { useState, useEffect } from 'react';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Assuming an endpoint like '/api/users' that returns all users with their roles
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Assuming an endpoint like '/api/users/:id/role' for updating user roles
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Update the user's role in the local state
      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));

      console.log(`User ${userId} role updated to ${newRole}`);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error updating user role:', error);
      // Optionally, show an error message to the user
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Role Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                  {/* Add other roles as needed */}
                  <option value="admin">Admin</option>
                  <option value="nurse">Nurse</option>
                  <option value="lab tech">Lab Tech</option>
                </select>
              </td>
              <td>
                {/* Add other actions like delete user if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleManagement;