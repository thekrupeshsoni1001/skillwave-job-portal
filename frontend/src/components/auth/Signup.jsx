import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: "",
        company: "", // New field for recruiters
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (input.role === 'job-seeker') {
            // Validate resume file for job-seekers (only PDFs)
            if (file && file.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed for resume upload');
                return;
            }
        } else if (input.role === 'recruiter') {
            // Validate recruiter proof for recruiters (any valid proof document)
            if (file && !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                toast.error('Only PDF, JPG, or PNG files are allowed for recruiter proof upload');
                return;
            }
        }
        setInput({ ...input, file: file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate inputs based on the role
        if (input.role === 'recruiter' && !input.company) {
            toast.error('Please select your company');
            return;
        }
        if (input.role === 'recruiter' && !input.file) {
            toast.error('Please upload your recruiter proof');
            return;
        }

        const formData = new FormData(); // FormData object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }
        if (input.role === 'recruiter') {
            formData.append("company", input.company);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);

                // Redirect based on role
                if (input.role === 'job-seeker') {
                    navigate("/login"); // Redirect to Job Seeker login page
                } else if (input.role === 'recruiter') {
                    navigate("/recruiters/companies"); // Redirect to Recruiter/Company page
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter Your Name"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your mail ID"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter the Password"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="job-seeker"
                                    checked={input.role === 'job-seeker'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label htmlFor="r1">Job Seeker</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        {input.role === 'recruiter' ? (
                            <div className='flex flex-col gap-2'>
                                <Label>Recruiter Proof</Label>
                                <Input
                                    accept=".pdf, .jpg, .png"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                                <Label>Company</Label>
                                <Input
                                    type="text"
                                    value={input.company}
                                    name="company"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your company name"
                                />
                            </div>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Label>Resume</Label>
                                <Input
                                    accept=".pdf"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                            </div>
                        )}
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup;
