import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

import api from "../services/api";

import BookingTable from "../components/BookingTable";
import EmptyState from "../components/ui/EmptyState";
import LoadingPage from "../components/ui/LoadingPage";
import PageHeader from "../components/ui/PageHeader";

export default function AdminBookings() {

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    async function fetchBookings() {

        try {

            const response = await api.get("/admin/bookings");

            setBookings(response.data.data);

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

    if (loading) {

        return <LoadingPage message="Loading all bookings..." />;

    }

    return (

        <div>

            <PageHeader
                title="All Bookings"
                description="Overview of every booking across the organization."
            />

            {bookings.length === 0 ? (

                <EmptyState
                    icon={HiOutlineClipboardDocumentList}
                    title="No bookings found"
                    description="There are no bookings in the system yet. Bookings will appear here once users schedule meetings."
                />

            ) : (

                <BookingTable

                    bookings={bookings}

                    showUser={true}

                    showActions={false}

                />

            )}

        </div>

    );

}
