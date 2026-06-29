export function FormLabel({ htmlFor, children, required }) {

    return (

        <label
            htmlFor={htmlFor}
            className="mb-1.5 block text-sm font-medium text-stone-700"
        >

            {children}

            {required && (

                <span className="ml-0.5 text-red-500" aria-hidden="true">

                    *

                </span>

            )}

        </label>

    );

}

const inputClasses =
    "w-full rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm transition-colors placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-stone-50";

export function FormInput({ id, error, className = "", ...props }) {

    return (

        <div>

            <input
                id={id}
                className={`${inputClasses} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""} ${className}`}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            />

            {error && (

                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-sm text-red-600"
                    role="alert"
                >

                    {error}

                </p>

            )}

        </div>

    );

}

export function FormSelect({ id, error, className = "", children, ...props }) {

    return (

        <div>

            <select
                id={id}
                className={`${inputClasses} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""} ${className}`}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            >

                {children}

            </select>

            {error && (

                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-sm text-red-600"
                    role="alert"
                >

                    {error}

                </p>

            )}

        </div>

    );

}
