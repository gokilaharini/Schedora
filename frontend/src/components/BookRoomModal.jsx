import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";

import api from "../services/api";
import {
    toApiDatetime,
    toDatetimeLocalValue
} from "../utils/datetime";
import Button from "./ui/Button";
import { FormInput, FormLabel, FormSelect } from "./ui/FormField";

export default function BookRoomModal({

    mode = "create",
    booking = null,
    rooms = [],
    isOpen,
    onClose,
    onSuccess

}) {

    const [selectedRoom, setSelectedRoom] = useState("");

    const [title, setTitle] = useState("");

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [editRooms, setEditRooms] = useState([]);

    const [loadingRooms, setLoadingRooms] = useState(false);

    const initialTimesRef = useRef({ start: "", end: "" });

    const fetchRoomsTimerRef = useRef(null);



    useEffect(() => {

        if (!isOpen) return;

        if (mode === "edit" && booking) {

            const start = toDatetimeLocalValue(booking.start_time);

            const end = toDatetimeLocalValue(booking.end_time);

            setSelectedRoom(String(booking.room_id));

            setTitle(booking.title);

            setStartTime(start);

            setEndTime(end);

            initialTimesRef.current = { start, end };

            setEditRooms([
                {
                    room_id: booking.room_id,
                    room_name: booking.room_name
                }
            ]);

        }

        else {

            setSelectedRoom("");

            setTitle("");

            setStartTime("");

            setEndTime("");

            initialTimesRef.current = { start: "", end: "" };

            setEditRooms([]);

        }

        setError("");

    }, [booking, mode, isOpen]);



    useEffect(() => {

        if (!isOpen || mode !== "edit" || !booking) {
            return;
        }

        if (!startTime || !endTime) {
            return;
        }

        const timesUnchanged =
            startTime === initialTimesRef.current.start &&
            endTime === initialTimesRef.current.end;

        if (timesUnchanged) {
            return;
        }

        if (fetchRoomsTimerRef.current) {
            clearTimeout(fetchRoomsTimerRef.current);
        }

        fetchRoomsTimerRef.current = setTimeout(async () => {

            setLoadingRooms(true);

            try {

                const response = await api.get("/rooms/available", {

                    params: {
                        start_time: toApiDatetime(startTime),
                        end_time: toApiDatetime(endTime)
                    }

                });

                const available = response.data.data || response.data.rooms || [];

                const currentRoomId = Number(booking.room_id);

                const hasCurrentRoom = available.some(
                    (room) => Number(room.room_id) === currentRoomId
                );

                setEditRooms(
                    hasCurrentRoom
                        ? available
                        : [
                            {
                                room_id: booking.room_id,
                                room_name: booking.room_name
                            },
                            ...available
                        ]
                );

            }

            catch {

                setEditRooms([
                    {
                        room_id: booking.room_id,
                        room_name: booking.room_name
                    }
                ]);

            }

            finally {

                setLoadingRooms(false);

            }

        }, 600);



        return () => {

            if (fetchRoomsTimerRef.current) {
                clearTimeout(fetchRoomsTimerRef.current);
            }

        };

    }, [isOpen, mode, booking, startTime, endTime]);



    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        const formattedStart = toApiDatetime(startTime);

        const formattedEnd = toApiDatetime(endTime);

        try {

            if (mode === "create") {

                await api.post("/book", {

                    room_id: selectedRoom,

                    title: title,

                    start_time: formattedStart,

                    end_time: formattedEnd

                });

                toast.success("Booking created successfully.");

            }

            else {

                await api.put(

                    `/booking/edit/${booking.booking_id}`,

                    {
                        room_id: selectedRoom,
                        start_time: formattedStart,
                        end_time: formattedEnd
                    }

                );

                toast.success("Booking updated successfully.");

            }

            if (onSuccess) {
                await onSuccess();
            }

            onClose();

        }

        catch (err) {

            const message =
                err.response?.data?.message ||
                "Something went wrong.";

            setError(message);

            toast.error(message);

        }

        finally {

            setLoading(false);

        }

    }

    const roomOptions = mode === "edit" ? editRooms : rooms;

    if (!isOpen) return null;

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-room-modal-title"
        >

            <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white shadow-xl">

                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">

                    <h2
                        id="book-room-modal-title"
                        className="text-lg font-semibold text-stone-900"
                    >

                        {mode === "create" ? "Book Room" : "Edit Booking"}

                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        aria-label="Close modal"
                    >

                        <HiOutlineXMark className="h-5 w-5" />

                    </button>

                </div>

                <form onSubmit={handleSubmit} className="p-6">

                    {error && (

                        <div
                            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            role="alert"
                        >

                            {error}

                        </div>

                    )}

                    <div className="mb-4">

                        <FormLabel htmlFor="booking-title" required>

                            Meeting Title

                        </FormLabel>

                        <FormInput
                            id="booking-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Weekly team sync"
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <FormLabel htmlFor="booking-room" required>

                            Room

                        </FormLabel>

                        <FormSelect
                            id="booking-room"
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            required
                            disabled={mode === "edit" && loadingRooms}
                        >

                            <option value="">

                                {loadingRooms ? "Loading rooms..." : "Select Room"}

                            </option>

                            {roomOptions.map(room => (

                                <option
                                    key={room.room_id}
                                    value={room.room_id}
                                >

                                    {room.room_name}

                                </option>

                            ))}

                        </FormSelect>

                    </div>

                    <div className="mb-4">

                        <FormLabel htmlFor="booking-start" required>

                            Start Time

                        </FormLabel>

                        <FormInput
                            id="booking-start"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />

                    </div>

                    <div className="mb-6">

                        <FormLabel htmlFor="booking-end" required>

                            End Time

                        </FormLabel>

                        <FormInput
                            id="booking-end"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >

                            Close

                        </Button>

                        <Button
                            type="submit"
                            loading={loading}
                        >

                            {mode === "create" ? "Book Room" : "Save Changes"}

                        </Button>

                    </div>

                </form>

            </div>

        </div>

    );

}
