import { User } from '../models/user.model.js'; // Adjust the path as necessary

const getJobSeekerId = async (phoneNumber) => {
    try {
        const jobSeeker = await User.findOne({ phoneNumber }); // Fetch job seeker by phone number
        return jobSeeker ? jobSeeker._id : null; // Return ID or null if not found
    } catch (error) {
        console.error('Error fetching job seeker ID:', error);
        throw new Error('Database query failed');
    }
};

export default getJobSeekerId; // Export the function if you want to use it in other files
