'use client';

import { Visit as VisitModel } from '@/models/index';
import styles from './VisitDetail.module.css';

interface VisitDetailProps {
    visitData: VisitModel;
}
function VisitDetail(props: VisitDetailProps) {
    const { visitData } = props;
    if (!visitData) return <h3>No Visit Data</h3>;
    const {
        clothingBoy,
        clothingMen,
        clothingWomen,
        clothingGirl,
        backpack,
        sleepingBag,
        busTicket,
        diaper,
        giftCard,
        financialAssistance,
        household,
        notes,
    } = visitData;
    return (
        <div>
            <h2>Clothing</h2>
            {clothingBoy || clothingWomen || clothingBoy || clothingGirl ? (
                <div className={styles.rowContainer}>
                    <p>{clothingMen && 'Men ✔️'}</p>
                    <p>{clothingWomen && 'Women ✔️'}</p>
                    <p>{clothingBoy && 'Kids (boy) ✔️'}</p>
                    <p>{clothingGirl && 'Kids (girl) ✔️'}</p>
                </div>
            ) : (
                <p>None</p>
            )}

            <h2>Special Requests</h2>
            {backpack ||
            sleepingBag ||
            busTicket ||
            giftCard ||
            diaper ||
            financialAssistance ? (
                <div className={styles.rowContainer}>
                    {backpack ? <p>{'Backpack ✔️'}</p> : ''}
                    {sleepingBag ? <p>{'Sleeping Bag ✔️'}</p> : ''}
                    {busTicket ? <p>Bus Tickets: {busTicket}</p> : ''}
                    {giftCard ? <p>Gift Card: {giftCard}</p> : ''}
                    {diaper ? <p>Diapers: {diaper}</p> : ''}
                    {financialAssistance ? (
                        <p>Financial Assistance: {financialAssistance}</p>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                <p>None</p>
            )}

            <h2>Household items</h2>
            <p>{household || 'None'}</p>

            <h2>Notes</h2>
            <p>{notes || 'None'}</p>
        </div>
    );
}

export default VisitDetail;
