import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import "./index.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <BrowserRouter>

            <AuthProvider>

                <App />

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            borderRadius: "0.75rem",
                            background: "#0f172a",
                            color: "#f8fafc",
                            fontSize: "0.875rem"
                        },
                        success: {
                            iconTheme: {
                                primary: "#34d399",
                                secondary: "#0f172a"
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: "#f87171",
                                secondary: "#0f172a"
                            }
                        }
                    }}
                />

            </AuthProvider>

        </BrowserRouter>

    </React.StrictMode>

);
