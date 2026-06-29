const roomStatusStyles = {
    available: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
    maintenance: "bg-amber-100 text-amber-800 ring-amber-600/20",
    closed: "bg-red-100 text-red-800 ring-red-600/20"
};

const bookingStatusStyles = {
    confirmed: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
    completed: "bg-blue-100 text-blue-800 ring-blue-600/20",
    cancelled: "bg-red-100 text-red-800 ring-red-600/20"
};

function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);

}

export function RoomStatusBadge({ status }) {

    const styles = roomStatusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-600/20";

    return (

        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${styles}`}
        >

            {capitalize(status)}

        </span>

    );

}

export function BookingStatusBadge({ status }) {

    const styles = bookingStatusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-600/20";

    return (

        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${styles}`}
        >

            {capitalize(status)}

        </span>

    );

}
