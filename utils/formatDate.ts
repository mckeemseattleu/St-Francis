import { Timestamp } from 'firebase/firestore';

/**
 * Converts a firebase Timestamp object to a date string in the format 'MMM DD, YYYY'
 * @param timestamp - firebase Timestamp object
 * @param utc - if true, returns date in UTC format
 * @returns - date string in the format 'MMM DD, YYYY'
 */
export function formatDate(timestamp: Timestamp, utc = false) {
    if (!timestamp) return '';
    try {
        // if (utc) return timestamp.toDate().toUTCString().substring(5, 16);
        if (utc) return timestamp.toDate().toUTCString().substring(5, 16);
        return timestamp.toDate().toDateString().substring(4, 16);
    } catch (err) {
        return '';
    }
}

/**
 * Converts a firebase Timestamp object to a UTC date string with timezone offset
 * @param timestamp - firebase Timestamp object
 * @returns - date string in the format 'YYYY-MM-DD'
 */
export function toUTCDateString(timestamp: Timestamp | undefined | null) {
    if (!timestamp) return '';
    return timestamp.toDate().toISOString().split('T')[0];
}

/**
 * Converts a firebase Timestamp object to a UTC date string with timezone offset
 * @param timestamp - firebase Timestamp object
 * @returns - date string in the format 'MM/DD/YYYY'
 */
export function toLicenseDateString(timestamp: Timestamp | undefined | null) {
    if (!timestamp) return '';
    const date = toUTCDateString(timestamp).split('-');
    return `${date[1]}/${date[2]}/${date[0]}`;
}
