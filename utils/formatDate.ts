import { Timestamp } from 'firebase/firestore';

/**
 * Converts a firebase Timestamp object to a date string in the format 'MMM DD, YYYY'
 * @param date - firebase Timestamp object
 * @param utc - if true, returns date in UTC format
 * @returns - date string in the format 'MMM DD, YYYY'
 */
export function formatDate(timestamp: Timestamp, utc = false) {
    if (!timestamp) return '';
    try {
        if (utc) return timestamp.toDate().toUTCString().substring(5, 16);
        return timestamp.toDate().toDateString().substring(4, 16);
    } catch (err) {
        return '';
    }
}

/**
 * Converts a firebase Timestamp object to a UTC date string with timezone offset
 * @param birthday - firebase Timestamp object
 * @returns - date string in the format 'YYYY-MM-DD'
 */
export function toUTCDateString(timestamp: Timestamp | undefined | null) {
    if (!timestamp) return '';
    return timestamp.toDate().toISOString().split('T')[0];
}
