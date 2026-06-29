/**
 * Converts an API/MySQL/ISO datetime string to a value for <input type="datetime-local">.
 */
export function toDatetimeLocalValue(dateString) {

    if (!dateString) return "";

    const normalized = String(dateString).trim();

    if (normalized.includes("T")) {
        return normalized.slice(0, 16);
    }

    return normalized.replace(" ", "T").slice(0, 16);

}

/**
 * Converts a datetime-local value to the API format: YYYY-MM-DD HH:MM
 * Never pass the raw datetime-local value (with "T") to the API.
 */
export function toApiDatetime(datetimeLocalValue) {

    if (!datetimeLocalValue) return "";

    const trimmed = String(datetimeLocalValue).trim();

    if (trimmed.includes("T")) {
        const [datePart, timePart] = trimmed.split("T");
        return `${datePart} ${timePart.slice(0, 5)}`;
    }

    if (trimmed.includes(" ")) {
        const [datePart, timePart] = trimmed.split(" ");
        return `${datePart} ${timePart.slice(0, 5)}`;
    }

    return trimmed;

}

export function formatDisplayDate(dateString) {

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleString("en-IN", {

        dateStyle: "medium",
        timeStyle: "short"

    });

}

/**
 * Normalizes any supported datetime string to YYYY-MM-DD HH:MM for comparison.
 */
export function toApiDatetimeFromStored(dateString) {

    return toApiDatetime(toDatetimeLocalValue(dateString));

}
