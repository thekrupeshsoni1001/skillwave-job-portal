import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import SkillWaveLogo from '../../assets/SkillWave2Original.png';
import JobSeekers from './JobSeekers'; // Import the JobSeekers component

const AdminDashboard = () => {
    const navigate = useNavigate(); // React Router's hook to navigate

    // Logout function
    const handleLogout = async () => {
        try {
            // Call the logout API to clear the authentication token
            const response = await fetch('http://localhost:8000/api/v1/user/logout', {
                method: 'GET',
                credentials: 'include', // Send cookies with the request
            });

            if (response.ok) {
                // Redirect to the main page after successful logout
                navigate('/');
            } else {
                console.error('Failed to log out');
            }
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
                <div className="flex items-center justify-center h-20 bg-gray-800 shadow-md">
                    <img src={SkillWaveLogo} alt="SkillWave Logo" className="h-16" />
                </div>
                <nav className="flex-grow mt-4">
                    <ul>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/job-seekers" className="flex items-center">
                                <span>Job Seekers</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/recruiters" className="flex items-center">
                                <span>Recruiters</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/update-user" className="flex items-center">
                                <span>Update User</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/delete-user" className="flex items-center">
                                <span>Delete User</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/update-job" className="flex items-center">
                                <span>Update Job</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/delete-job" className="flex items-center">
                                <span>Delete Job</span>
                            </Link>
                        </li>
                        <li className="px-4 py-3 hover:bg-gray-700 transition-all rounded-md mx-2">
                            <Link to="/admin/delete-applicants" className="flex items-center">
                                <span>Delete Applicants</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-grow p-8 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Routing for Admin Activities */}
                <Routes>
                    <Route path="/job-seekers" element={<JobSeekers />} />
                    {/* Add more routes for other activities here */}
                    <Route path="/recruiters" element={<div>Recruiter Activities</div>} />
                    <Route path="/update-user" element={<div>Update User Activity</div>} />
                    <Route path="/delete-user" element={<div>Delete User Activity</div>} />
                    <Route path="/update-job" element={<div>Update Job Activity</div>} />
                    <Route path="/delete-job" element={<div>Delete Job Activity</div>} />
                    <Route path="/delete-applicants" element={<div>Delete Applicants Activity</div>} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
