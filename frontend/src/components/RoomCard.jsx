import {
    HiOutlineUsers,
    HiOutlineMapPin,
    HiOutlineCalendarDays
} from "react-icons/hi2";

import { RoomStatusBadge } from "./ui/Badge";
import Button from "./ui/Button";

export default function RoomCard({ room, onBook }) {

    return (

        <article className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md">

            <div className="mb-4 flex items-start justify-between gap-3">

                <h2 className="text-lg font-semibold text-stone-900 group-hover:text-brand-700">

                    {room.room_name}

                </h2>

                <RoomStatusBadge status={room.status} />

            </div>

            <ul className="mb-6 flex-1 space-y-3 text-sm text-stone-600">

                <li className="flex items-center gap-2.5">

                    <HiOutlineUsers className="h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />

                    <span>

                        <span className="font-medium text-stone-700">Capacity:</span>{" "}

                        {room.capacity} people

                    </span>

                </li>

                <li className="flex items-center gap-2.5">

                    <HiOutlineMapPin className="h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />

                    <span>

                        <span className="font-medium text-stone-700">Location:</span>{" "}

                        {room.location || "Not specified"}

                    </span>

                </li>

            </ul>

            <Button
                onClick={() => onBook(room)}
                className="w-full"
                aria-label={`Book ${room.room_name}`}
            >

                <HiOutlineCalendarDays className="h-4 w-4" />

                Book Room

            </Button>

        </article>

    );

}
