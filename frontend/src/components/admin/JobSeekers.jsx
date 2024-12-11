import React, { useState, useEffect } from 'react';

const JobSeekers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error state for handling API errors
    const [deleting, setDeleting] = useState(false); // State to track deleting process

    // Fetch job seekers from the API
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/user/admin/job-seekers', {
                method: 'GET',
                credentials: 'include', // Include credentials for authentication
            });

            if (!response.ok) {
                throw new Error('Failed to fetch job seekers');
            }
            const data = await response.json();
            setUsers(data.jobSeekers);
        } catch (err) {
            console.error("Error fetching users:", err); // Log the error for debugging
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDeleteUser = async (id) => {
        setDeleting(true); // Start deleting process
        try {
            const response = await fetch(`http://localhost:8000/api/v1/user/admin/delete-job-seeker/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Update state to remove deleted user from list
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Error deleting user:", err); // Log the error for debugging
            setError(err.message);
        } finally {
            setDeleting(false); // End deleting process
        }
    };

    // Loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Error state
    if (error) {
        return <div className="text-red-500">{error}</div>; // Display error message
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Job Seekers Activities</h2>

            <h3 className="text-lg font-medium">User List</h3>
            {users.length === 0 ? (
                <p>No job seekers found.</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user._id} className="flex justify-between items-center border-b py-2">
                            <div>
                                <strong>{user.fullname}</strong> - {user.email} - {user.phoneNumber}
                            </div>
                            <button
                                onClick={() => handleDeleteUser(user._id)} // Use _id for deletion
                                className="text-red-500 hover:text-red-700"
                                disabled={deleting} // Disable the button while deleting
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobSeekers;
