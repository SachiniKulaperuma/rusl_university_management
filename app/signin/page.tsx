'use client';

import { useState } from 'react';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center px-4 py-8" id="signin-page">
            <div className="w-full max-w-md" id="signin-card" role="main">
                {/* Sign In Card */}
                <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-10">
                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-8" id="signin-heading">
                        Sign In
                    </h1>

                    {/* Error Alert */}
                    {error && (
                        <div
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                            id="signin-error"
                            role="alert"
                            aria-live="polite"
                        >
                            <i className="fas fa-circle-exclamation text-red-600 mt-0.5"></i>
                            <span id="error-text" className="text-red-700 text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div
                            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                            id="signin-success"
                            role="status"
                            aria-live="polite"
                        >
                            <i className="fas fa-circle-check text-green-600 mt-0.5"></i>
                            <span id="success-text" className="text-green-700 text-sm">{success}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form id="signin-form" noValidate onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                type="email"
                                id="username"
                                name="username"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition"
                                placeholder="example@gmail.com"
                                autoComplete="username"
                                required
                                aria-required="true"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent transition pr-10"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    aria-required="true"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                    id="toggle-password"
                                    aria-label="Show or hide password"
                                    title="Toggle password visibility"
                                >
                                    <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} id="toggle-icon"></i>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer" htmlFor="remember-me">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    name="remember"
                                    className="w-4 h-4 rounded border-gray-300 text-red-900 focus:ring-red-900 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">Remember Me</span>
                            </label>
                            <a
                                href="#"
                                className="text-sm text-red-900 hover:text-red-700 font-medium transition"
                                id="forgot-password-link"
                            >
                                Forgot Password
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-4 py-3 mt-7 bg-red-900 hover:bg-red-800 text-white font-semibold rounded-lg transition duration-200 active:scale-95 shadow-md hover:shadow-lg"
                            id="signin-button"
                        >
                            SIGN IN
                        </button>

                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't you have an account?
                            <a
                                href="#"
                                className="ml-1 text-red-900 hover:text-red-700 font-medium transition"
                                id="register-link"
                            >
                                Register
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}