import {
    HiOutlinePencilSquare,
    HiOutlineXMark
} from "react-icons/hi2";

import { formatDisplayDate } from "../utils/datetime";
import { BookingStatusBadge } from "./ui/Badge";
import Button from "./ui/Button";

export default function BookingTable({

    bookings,
    showUser = false,
    showActions = true,
    onEdit,
    onCancel

}) {

    return (

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

                <table className="min-w-full divide-y divide-stone-200">

                    <thead className="sticky top-0 z-10 bg-stone-50">

                        <tr>

                            {showUser && (

                                <th
                                    scope="col"
                                    className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                                >

                                    User

                                </th>

                            )}

                            <th
                                scope="col"
                                className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                            >

                                Meeting Title

                            </th>

                            <th
                                scope="col"
                                className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                            >

                                Room

                            </th>

                            <th
                                scope="col"
                                className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                            >

                                Start Time

                            </th>

                            <th
                                scope="col"
                                className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                            >

                                End Time

                            </th>

                            <th
                                scope="col"
                                className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                            >

                                Status

                            </th>

                            {showActions && (

                                <th
                                    scope="col"
                                    className="whitespace-nowrap px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6"
                                >

                                    Actions

                                </th>

                            )}

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-stone-100">

                        {bookings.map((booking, index) => (

                            <tr

                                key={booking.booking_id}

                                className={`transition-colors hover:bg-brand-50/40 ${
                                    index % 2 === 1 ? "bg-stone-50/60" : "bg-white"
                                }`}

                            >

                                {showUser && (

                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-stone-700 sm:px-6">

                                        {booking.user_name}

                                    </td>

                                )}

                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-stone-900 sm:px-6">

                                    {booking.title}

                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-sm text-stone-700 sm:px-6">

                                    {booking.room_name}

                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-sm text-stone-600 sm:px-6">

                                    {formatDisplayDate(booking.start_time)}

                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-sm text-stone-600 sm:px-6">

                                    {formatDisplayDate(booking.end_time)}

                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-center sm:px-6">

                                    <BookingStatusBadge status={booking.status} />

                                </td>

                                {showActions && (

                                    <td className="whitespace-nowrap px-4 py-4 text-center sm:px-6">

                                        {booking.status === "confirmed" ? (

                                            <div className="flex flex-wrap items-center justify-center gap-2">

                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => onEdit(booking)}
                                                    aria-label={`Edit ${booking.title}`}
                                                >

                                                    <HiOutlinePencilSquare className="h-3.5 w-3.5" />

                                                    Edit

                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onCancel(booking)}
                                                    aria-label={`Cancel ${booking.title}`}
                                                >

                                                    <HiOutlineXMark className="h-3.5 w-3.5" />

                                                    Cancel

                                                </Button>

                                            </div>

                                        ) : (

                                            <span className="text-sm text-stone-400">

                                                —

                                            </span>

                                        )}

                                    </td>

                                )}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}
