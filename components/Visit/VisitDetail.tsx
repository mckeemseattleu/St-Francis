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
        mensQ,
        womensQ,
        kidsQ,
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
            {clothingMen || clothingWomen || clothingBoy || clothingGirl ? (
                <div className={styles.rowContainer}>
                    <div className={styles.row}>
                        <p>{clothingMen && `Men: ${mensQ}`}</p>
                        <p>{clothingWomen && `Women: ${womensQ}`}</p>
                        <p>
                            {(clothingGirl || clothingBoy) && `Kids: ${kidsQ}`}
                        </p>
                    </div>
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
                    <div className={styles.row}>
                        {backpack ? <p>{'Backpack ✔️'}</p> : ''}
                        {sleepingBag ? <p>{'Sleeping Bag ✔️'}</p> : ''}
                    </div>
                    <div className={styles.row}>
                        {busTicket ? <p>Bus Tickets: {busTicket}</p> : ''}
                        {giftCard ? <p>Gift Card: {giftCard}</p> : ''}
                        {diaper ? <p>Diapers: {diaper}</p> : ''}
                        {financialAssistance ? (
                            <p>Financial Assistance: {financialAssistance}</p>
                        ) : (
                            ''
                        )}
                    </div>
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
