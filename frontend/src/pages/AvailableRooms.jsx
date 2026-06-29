import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineCheckCircle } from "react-icons/hi2";

import api from "../services/api";
import { toApiDatetime } from "../utils/datetime";

import RoomCard from "../components/RoomCard";
import BookRoomModal from "../components/BookRoomModal";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { FormInput, FormLabel } from "../components/ui/FormField";
import PageHeader from "../components/ui/PageHeader";
import RoomCardSkeleton from "../components/ui/RoomCardSkeleton";

export default function AvailableRooms() {

    const [availableRooms, setAvailableRooms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);

    async function fetchAvailableRooms(start = "", end = "") {

        setLoading(true);

        try {

            const params = {};

            if (start && end) {
                params.start_time = start;
                params.end_time = end;
            }

            const response = await api.get("/rooms/available", { params });

            setAvailableRooms(response.data.data || response.data.rooms || []);

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to load available rooms."
            );

        }

        finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        fetchAvailableRooms();


    }, []);

    function handleSearch(e) {

        e.preventDefault();

        if (!startTime || !endTime) {
            toast.error("Please select both start and end time.");
            return;
        }

        fetchAvailableRooms(
            toApiDatetime(startTime),
            toApiDatetime(endTime)
        );

    }

    function handleReset() {

        setStartTime("");
        setEndTime("");
        fetchAvailableRooms();

    }

    function handleBook(room) {

        setSelectedRoom(room);
        setShowModal(true);

    }

    function handleCloseModal() {

        setSelectedRoom(null);
        setShowModal(false);

    }

    function handleFetchAfterBook() {

        if (startTime && endTime) {
            fetchAvailableRooms(
                toApiDatetime(startTime),
                toApiDatetime(endTime)
            );
        } else {
            fetchAvailableRooms();
        }

    }

    const hasTimeFilter = Boolean(startTime && endTime);

    return (

        <div>

            <PageHeader
                title="Available Rooms"
                description="Find meeting rooms available for your preferred time slot."
            />

            <form
                onSubmit={handleSearch}
                className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">

                    <div>

                        <FormLabel htmlFor="filter-start" required>

                            Start Time

                        </FormLabel>

                        <FormInput
                            id="filter-start"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />

                    </div>

                    <div>

                        <FormLabel htmlFor="filter-end" required>

                            End Time

                        </FormLabel>

                        <FormInput
                            id="filter-end"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />

                    </div>

                    <div className="flex flex-wrap gap-2 md:col-span-2 lg:justify-end">

                        <Button type="submit">

                            Search Availability

                        </Button>

                        {hasTimeFilter && (

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleReset}
                            >

                                Show Available Now

                            </Button>

                        )}

                    </div>

                </div>

                <p className="mt-3 text-xs text-stone-500">

                    {hasTimeFilter
                        ? "Showing rooms available for the selected time range."
                        : "No time range selected — showing rooms available right now."}

                </p>

            </form>

            {loading ? (

                <RoomCardSkeleton />

            ) : availableRooms.length === 0 ? (

                <EmptyState
                    icon={HiOutlineCheckCircle}
                    title="No rooms are currently available"
                    description={
                        hasTimeFilter
                            ? "No rooms are free for the selected time range. Try a different slot or check all rooms."
                            : "All rooms may be booked, under maintenance, or closed. Try again later or view all rooms."
                    }
                />

            ) : (

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {availableRooms.map(room => (

                        <RoomCard

                            key={room.room_id}

                            room={room}

                            onBook={handleBook}

                        />

                    ))}

                </div>

            )}

            {showModal && (

                <BookRoomModal

                    mode="create"

                    rooms={availableRooms}

                    booking={null}

                    isOpen={showModal}

                    onClose={handleCloseModal}

                    onSuccess={handleFetchAfterBook}

                />

            )}

        </div>

    );

}
