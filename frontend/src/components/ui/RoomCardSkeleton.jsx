import Skeleton from "./Skeleton";

export default function RoomCardSkeleton({ count = 6 }) {

    return (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {Array.from({ length: count }).map((_, index) => (

                <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                    <Skeleton className="mb-4 h-6 w-2/3" />

                    <Skeleton className="mb-3 h-4 w-1/2" />

                    <Skeleton className="mb-3 h-4 w-3/5" />

                    <Skeleton className="mb-6 h-4 w-1/3" />

                    <Skeleton className="h-10 w-full" />

                </div>

            ))}

        </div>

    );

}
