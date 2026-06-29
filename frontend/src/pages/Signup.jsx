import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    HiOutlineCalendarDays,
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser
} from "react-icons/hi2";

import api from "../services/api";
import Button from "../components/ui/Button";
import { FormInput, FormLabel } from "../components/ui/FormField";

export default function Signup() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSignup(e) {

        e.preventDefault();

        setError("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/signup", {
                name: name.trim(),
                email: email.trim(),
                password
            });

            toast.success("Account created! Please sign in.");

            navigate("/login", { replace: true });

        }

        catch (err) {

            const message =
                err.response?.data?.message ||
                "Signup failed.";

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

                        Create your account

                    </h1>

                    <p className="mt-2 text-sm text-stone-500">

                        Join Schedora to book meeting rooms

                    </p>

                </div>

                <form

                    onSubmit={handleSignup}

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

                        <FormLabel htmlFor="name" required>

                            Full Name

                        </FormLabel>

                        <div className="relative">

                            <HiOutlineUser
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />

                            <FormInput
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                required
                                autoComplete="name"
                            />

                        </div>

                    </div>

                    <div className="mb-5">

                        <FormLabel htmlFor="signup-email" required>

                            Email address

                        </FormLabel>

                        <div className="relative">

                            <HiOutlineEnvelope
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />

                            <FormInput
                                id="signup-email"
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

                    <div className="mb-5">

                        <FormLabel htmlFor="signup-password" required>

                            Password

                        </FormLabel>

                        <div className="relative">

                            <HiOutlineLockClosed
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />

                            <FormInput
                                id="signup-password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                                autoComplete="new-password"
                            />

                        </div>

                    </div>

                    <div className="mb-6">

                        <FormLabel htmlFor="confirm-password" required>

                            Confirm Password

                        </FormLabel>

                        <div className="relative">

                            <HiOutlineLockClosed
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />

                            <FormInput
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10"
                                required
                                autoComplete="new-password"
                            />

                        </div>

                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        loading={loading}
                    >

                        Create Account

                    </Button>

                    <p className="mt-6 text-center text-sm text-stone-500">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:underline"
                        >

                            Sign in

                        </Link>

                    </p>

                </form>

            </div>

        </div>

    );

}
