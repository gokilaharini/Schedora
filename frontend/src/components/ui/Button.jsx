import Spinner from "./Spinner";

const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 disabled:bg-brand-400",
    secondary: "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 focus-visible:ring-stone-400 disabled:bg-stone-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-400",
    warning: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 disabled:bg-amber-400",
    ghost: "text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-400"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-full",
    md: "px-4 py-2 text-sm rounded-full",
    lg: "px-5 py-2.5 text-base rounded-full"
};

export default function Button({

    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    children,
    ...props

}) {

    return (

        <button

            disabled={disabled || loading}

            className={`inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}

            {...props}

        >

            {loading && <Spinner size="sm" className="border-white/30 border-t-white" />}

            {children}

        </button>

    );

}
