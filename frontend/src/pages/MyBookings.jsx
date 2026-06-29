import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

import api from "../services/api";

import BookingTable from "../components/BookingTable";
import BookRoomModal from "../components/BookRoomModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import LoadingPage from "../components/ui/LoadingPage";
import PageHeader from "../components/ui/PageHeader";

export default function MyBookings() {

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    async function fetchBookings() {

        try {

            const response = await api.get("/bookings");

            setBookings(response.data.bookings);

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to load bookings."
            );

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        fetchBookings();

    }, []);

    function handleEdit(booking) {

        setSelectedBooking(booking);
        setShowModal(true);

    }

    function handleCloseModal() {

        setSelectedBooking(null);
        setShowModal(false);

    }

    function handleCancelRequest(booking) {

        setCancelTarget(booking);

    }

    async function handleConfirmCancel() {

        if (!cancelTarget) return;

        setCancelling(true);

        try {

            await api.put(`/booking/cancel/${cancelTarget.booking_id}`);

            toast.success("Booking cancelled successfully.");

            setCancelTarget(null);

            fetchBookings();

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to cancel booking."
            );

        }

        finally {

            setCancelling(false);

        }

    }

    if (loading) {

        return <LoadingPage message="Loading your bookings..." />;

    }

    return (

        <div>

            <PageHeader
                title="My Bookings"
                description="View and manage your scheduled meetings."
            />

            {bookings.length === 0 ? (

                <EmptyState
                    icon={HiOutlineClipboardDocumentList}
                    title="No bookings found"
                    description="You haven't booked any meeting rooms yet. Browse available rooms to schedule your first meeting."
                />

            ) : (

                <BookingTable

                    bookings={bookings}

                    onEdit={handleEdit}

                    onCancel={handleCancelRequest}

                />

            )}

            {showModal && (

                <BookRoomModal

                    mode="edit"

                    booking={selectedBooking}

                    rooms={[]}

                    isOpen={showModal}

                    onClose={handleCloseModal}

                    onSuccess={fetchBookings}

                />

            )}

            <ConfirmModal
                isOpen={Boolean(cancelTarget)}
                title="Cancel booking"
                message={`Are you sure you want to cancel "${cancelTarget?.title}"? This action cannot be undone.`}
                confirmLabel="Cancel booking"
                cancelLabel="Keep booking"
                loading={cancelling}
                onConfirm={handleConfirmCancel}
                onCancel={() => setCancelTarget(null)}
            />

        </div>

    );

}
