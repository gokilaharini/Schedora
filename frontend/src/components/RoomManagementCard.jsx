import {
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineUsers,
    HiOutlineMapPin
} from "react-icons/hi2";

import { RoomStatusBadge } from "./ui/Badge";
import Button from "./ui/Button";

export default function RoomManagementCard({

    room,
    onEdit,
    onDelete

}) {

    return (

        <article className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md">

            <div className="mb-4 flex items-start justify-between gap-3">

                <h2 className="text-lg font-semibold text-stone-900">

                    {room.room_name}

                </h2>

                <RoomStatusBadge status={room.status} />

            </div>

            <ul className="mb-6 flex-1 space-y-3 text-sm text-slate-600">

                <li className="flex items-center gap-2.5">

                    <HiOutlineUsers className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />

                    <span>

                        <span className="font-medium text-slate-700">Capacity:</span>{" "}

                        {room.capacity}

                    </span>

                </li>

                <li className="flex items-center gap-2.5">

                    <HiOutlineMapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />

                    <span>

                        <span className="font-medium text-slate-700">Location:</span>{" "}

                        {room.location || "Not specified"}

                    </span>

                </li>

            </ul>

            <div className="flex gap-3">

                <Button
                    variant="warning"
                    className="flex-1"
                    onClick={() => onEdit(room)}
                    aria-label={`Edit ${room.room_name}`}
                >

                    <HiOutlinePencilSquare className="h-4 w-4" />

                    Edit

                </Button>

                <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => onDelete(room)}
                    aria-label={`Delete ${room.room_name}`}
                >

                    <HiOutlineTrash className="h-4 w-4" />

                    Delete

                </Button>

            </div>

        </article>

    );

}
