import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import api from "../services/api";

import RoomCard from "../components/RoomCard";
import BookRoomModal from "../components/BookRoomModal";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import RoomCardSkeleton from "../components/ui/RoomCardSkeleton";

export default function Rooms() {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);

    async function fetchRooms() {

        try {

            const response = await api.get("/rooms");

            setRooms(response.data.rooms);

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to load rooms."
            );

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        fetchRooms();

    }, []);

    function handleBook(room) {

        setSelectedRoom(room);
        setShowModal(true);

    }

    function handleCloseModal() {

        setSelectedRoom(null);
        setShowModal(false);

    }

    if (loading) {

        return (

            <div>

                <PageHeader
                    title="All Rooms"
                    description="Browse all meeting rooms and book a slot."
                />

                <RoomCardSkeleton />

            </div>

        );

    }

    return (

        <div>

            <PageHeader
                title="All Rooms"
                description="Browse all meeting rooms and book a slot."
            />

            {rooms.length === 0 ? (

                <EmptyState
                    icon={HiOutlineBuildingOffice2}
                    title="No rooms available"
                    description="There are no meeting rooms in the system yet. Please check back later."
                />

            ) : (

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {rooms.map(room => (

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

                    rooms={rooms}

                    booking={null}

                    isOpen={showModal}

                    onClose={handleCloseModal}

                    onSuccess={fetchRooms}

                />

            )}

        </div>

    );

}
