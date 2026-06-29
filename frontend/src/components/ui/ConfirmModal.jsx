import { HiOutlineExclamationTriangle } from "react-icons/hi2";

import Button from "./Button";

export default function ConfirmModal({

    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel

}) {

    if (!isOpen) return null;

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >

            <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">

                <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">

                        <HiOutlineExclamationTriangle className="h-5 w-5" aria-hidden="true" />

                    </div>

                    <div className="flex-1">

                        <h2
                            id="confirm-modal-title"
                            className="text-lg font-semibold text-stone-900"
                        >

                            {title}

                        </h2>

                        <p className="mt-2 text-sm text-slate-600">

                            {message}

                        </p>

                    </div>

                </div>

                <div className="mt-6 flex justify-end gap-3">

                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >

                        {cancelLabel}

                    </Button>

                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >

                        {confirmLabel}

                    </Button>

                </div>

            </div>

        </div>

    );

}
