import Spinner from "./Spinner";

export default function LoadingPage({ message = "Loading..." }) {

    return (

        <div
            className="flex min-h-[320px] flex-col items-center justify-center gap-4"
            role="status"
            aria-live="polite"
        >

            <Spinner size="lg" />

            <p className="text-sm font-medium text-slate-500">

                {message}

            </p>

        </div>

    );

}
