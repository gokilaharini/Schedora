import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineBuildingOffice2 } from "react-icons/hi2";

import api from "../services/api";

import RoomManagementCard from "../components/RoomManagementCard";
import RoomModal from "../components/RoomModal";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import RoomCardSkeleton from "../components/ui/RoomCardSkeleton";

export default function AdminRooms() {

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [modalMode, setModalMode] = useState("create");

    const [selectedRoom, setSelectedRoom] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);



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



    function handleAddRoom() {

        setModalMode("create");

        setSelectedRoom(null);

        setShowModal(true);

    }



    function handleEditRoom(room) {

        setModalMode("edit");

        setSelectedRoom(room);

        setShowModal(true);

    }



    function handleCloseModal() {

        setShowModal(false);

        setSelectedRoom(null);

    }



    function handleDeleteRequest(room) {

        setDeleteTarget(room);

    }



    async function handleConfirmDelete() {

        if (!deleteTarget) return;

        setDeleting(true);

        try {

            await api.delete(
                `/rooms/${deleteTarget.room_id}`
            );

            toast.success(`"${deleteTarget.room_name}" deleted successfully.`);

            setDeleteTarget(null);

            fetchRooms();

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to delete room."
            );

        }

        finally {

            setDeleting(false);

        }

    }



    if (loading) {

        return (

            <div>

                <PageHeader title="Manage Rooms" />

                <RoomCardSkeleton />

            </div>

        );

    }



    return (

        <div>

            <PageHeader
                title="Manage Rooms"
                description="Create, update, and remove meeting rooms."
                action={(
                    <Button onClick={handleAddRoom}>

                        <HiOutlinePlus className="h-4 w-4" />

                        Add Room

                    </Button>
                )}
            />

            {rooms.length === 0 ? (

                <EmptyState
                    icon={HiOutlineBuildingOffice2}
                    title="No rooms found"
                    description="Get started by adding your first meeting room to the system."
                    action={(
                        <Button onClick={handleAddRoom}>

                            <HiOutlinePlus className="h-4 w-4" />

                            Add Room

                        </Button>
                    )}
                />

            ) : (

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {rooms.map(room => (

                        <RoomManagementCard

                            key={room.room_id}

                            room={room}

                            onEdit={handleEditRoom}

                            onDelete={handleDeleteRequest}

                        />

                    ))}

                </div>

            )}

            {showModal && (

                <RoomModal

                    mode={modalMode}

                    room={selectedRoom}

                    isOpen={showModal}

                    onClose={handleCloseModal}

                    onSuccess={fetchRooms}

                />

            )}

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete room"
                message={`Are you sure you want to delete "${deleteTarget?.room_name}"? All associated data will be permanently removed.`}
                confirmLabel="Delete room"
                loading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

        </div>

    );

}
