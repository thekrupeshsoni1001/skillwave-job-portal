1. Home.jsx:

Opening:
User opens the application's main URL or clicks the "Home" link/button.
Working:
The framework's routing system detects the home page request.
Home.jsx is loaded and rendered, displaying the homepage content (e.g., hero section, featured jobs, latest job openings etc..).
2. Jobs.jsx:

Opening:
User clicks the "Jobs" link/button or navigates to the jobs page URL.
Working:
The routing system detects the jobs page request.
Jobs.jsx is loaded and rendered, displaying a list of available jobs, filters, search functionality, and job details.
3. Login.jsx:

Opening:
User clicks the "Login" link/button or navigates to the login page URL.
Working:
The routing system detects the login page request.
Login.jsx is loaded and rendered, displaying a login form with fields for username/email and password.
User enters credentials and submits the form.
The form data is sent to the backend for authentication.
Upon successful authentication, the user is redirected to the dashboard or another appropriate page.
4. Signup.jsx:

Opening:
User clicks the "Signup" link/button or navigates to the registration page URL.
Working:
The routing system detects the registration page request.
Register.jsx is loaded and rendered, displaying a registration form with fields for name, email, password, etc.
User enters information and submits the form.
The form data is sent to the backend to create a new user account.
Upon successful registration, the user is redirected to the login page or another appropriate page.

5. For Database:

We are using MongoDB Atlas for storing the data, there are 4 schemas applications, companies, jobs and users.

inside applications schema you can see the applications of job seekers.
inside companies schema you can see how many companies are registerd.
inside the jobs schema you can see which kind of jobs are available for the job seekers based on their skills.
inside the users schema you can see the job seeker, recruiters and admin registration details.
