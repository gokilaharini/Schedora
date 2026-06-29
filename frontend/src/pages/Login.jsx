import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {

    HiOutlineCalendarDays,

    HiOutlineEnvelope,

    HiOutlineLockClosed

} from "react-icons/hi2";



import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import Button from "../components/ui/Button";

import { FormInput, FormLabel } from "../components/ui/FormField";



export default function Login() {



    const navigate = useNavigate();



    const { login } = useAuth();



    const [email, setEmail] = useState("");



    const [password, setPassword] = useState("");



    const [loading, setLoading] = useState(false);



    const [error, setError] = useState("");



    async function handleLogin(e) {



        e.preventDefault();



        setLoading(true);



        setError("");



        try {



            const response = await api.post("/login", {



                email,

                password



            });



            const loggedInUser = response.data.user;



            login(

                response.data.token,

                loggedInUser

            );



            toast.success(`Welcome back, ${loggedInUser.name}!`);



            if (loggedInUser.role === "admin") {

                navigate("/admin/rooms", { replace: true });

            } else {

                navigate("/", { replace: true });

            }



        }



        catch (err) {



            const message =

                err.response?.data?.message ||

                "Login failed.";



            setError(message);



            toast.error(message);



        }



        finally {



            setLoading(false);



        }



    }



    return (



        <div className="flex min-h-screen items-center justify-center bg-[#faf6f4] px-4 py-12">



            <div className="w-full max-w-md">



                <div className="mb-8 text-center">



                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">



                        <HiOutlineCalendarDays className="h-7 w-7" aria-hidden="true" />



                    </div>



                    <h1 className="text-2xl font-bold tracking-tight text-stone-900">



                        Schedora



                    </h1>



                    <p className="mt-2 text-sm text-stone-500">



                    Sign in to manage your meetings effortlessly.



                    </p>



                </div>



                <form



                    onSubmit={handleLogin}



                    className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/40"



                    noValidate



                >



                    {error && (



                        <div

                            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"

                            role="alert"

                        >



                            {error}



                        </div>



                    )}



                    <div className="mb-5">



                        <FormLabel htmlFor="email" required>



                            Email address



                        </FormLabel>



                        <div className="relative">



                            <HiOutlineEnvelope

                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"

                                aria-hidden="true"

                            />



                            <FormInput

                                id="email"

                                type="email"

                                placeholder="you@company.com"

                                value={email}

                                onChange={(e) => setEmail(e.target.value)}

                                className="pl-10"

                                required

                                autoComplete="email"

                            />



                        </div>



                    </div>



                    <div className="mb-6">



                        <FormLabel htmlFor="password" required>



                            Password



                        </FormLabel>



                        <div className="relative">



                            <HiOutlineLockClosed

                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"

                                aria-hidden="true"

                            />



                            <FormInput

                                id="password"

                                type="password"

                                placeholder="Enter your password"

                                value={password}

                                onChange={(e) => setPassword(e.target.value)}

                                className="pl-10"

                                required

                                autoComplete="current-password"

                            />



                        </div>



                    </div>



                    <Button

                        type="submit"

                        className="w-full"

                        size="lg"

                        loading={loading}

                    >



                        Sign in



                    </Button>



                    <p className="mt-6 text-center text-sm text-stone-500">



                        Don&apos;t have an account?{" "}



                        <Link

                            to="/signup"

                            className="font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:underline"

                        >



                            Sign Up



                        </Link>



                    </p>



                </form>



            </div>



        </div>



    );



}


