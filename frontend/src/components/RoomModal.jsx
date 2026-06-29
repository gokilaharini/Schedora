import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";

import api from "../services/api";
import Button from "./ui/Button";
import { FormInput, FormLabel, FormSelect } from "./ui/FormField";

export default function RoomModal({

    mode = "create",
    room = null,
    isOpen,
    onClose,
    onSuccess

}) {

    const [roomName, setRoomName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("available");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!isOpen) return;

        if (mode === "edit" && room) {

            setRoomName(room.room_name);
            setCapacity(room.capacity);
            setLocation(room.location || "");
            setStatus(room.status);

        } else {

            setRoomName("");
            setCapacity("");
            setLocation("");
            setStatus("available");

        }

        setError("");

    }, [mode, room, isOpen]);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);
        setError("");

        const payload = {

            room_name: roomName,
            capacity: Number(capacity),
            location,
            status

        };

        try {

            if (mode === "create") {

                await api.post("/rooms", payload);

                toast.success("Room created successfully.");

            } else {

                await api.put(

                    `/rooms/${room.room_id}`,
                    payload

                );

                toast.success("Room updated successfully.");

            }

            onSuccess();
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

    if (!isOpen) return null;

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-modal-title"
        >

            <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white shadow-xl">

                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">

                    <h2
                        id="room-modal-title"
                        className="text-lg font-semibold text-stone-900"
                    >

                        {mode === "create" ? "Add New Room" : "Edit Room"}

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
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            role="alert"
                        >

                            {error}

                        </div>

                    )}

                    <div className="mb-4">

                        <FormLabel htmlFor="room-name" required>

                            Room Name

                        </FormLabel>

                        <FormInput
                            id="room-name"
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Conference Room A"
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <FormLabel htmlFor="room-capacity" required>

                            Capacity

                        </FormLabel>

                        <FormInput
                            id="room-capacity"
                            type="number"
                            min="1"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="10"
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <FormLabel htmlFor="room-location">

                            Location

                        </FormLabel>

                        <FormInput
                            id="room-location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Building 1, Floor 2"
                        />

                    </div>

                    <div className="mb-6">

                        <FormLabel htmlFor="room-status" required>

                            Status

                        </FormLabel>

                        <FormSelect
                            id="room-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >

                            <option value="available">Available</option>

                            <option value="maintenance">Maintenance</option>

                            <option value="closed">Closed</option>

                        </FormSelect>

                    </div>

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >

                            Cancel

                        </Button>

                        <Button
                            type="submit"
                            loading={loading}
                        >

                            {mode === "create" ? "Add Room" : "Save Changes"}

                        </Button>

                    </div>

                </form>

            </div>

        </div>

    );

}
