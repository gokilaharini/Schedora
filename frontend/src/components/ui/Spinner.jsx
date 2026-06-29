export default function Spinner({ size = "md", className = "" }) {

    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-[3px]",
        lg: "h-12 w-12 border-4"
    };

    return (

        <div
            role="status"
            aria-label="Loading"
            className={`inline-block animate-spin rounded-full border-stone-200 border-t-brand-600 ${sizeClasses[size]} ${className}`}
        />

    );

}
