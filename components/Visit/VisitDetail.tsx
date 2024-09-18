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
        clothingOther,
        clothingGirl,
        clothingKids,
        mensQ,
        womensQ,
        otherQ,
        kidsQ,
        backpack,
        sleepingBag,
        food,
        busTicket,
        orcaCard,
        diaper,
        giftCard,
        financialAssistance,
        household,
        notes,
        householdItem,
    } = visitData;
    return (
        <div>
            <h2>Clothing</h2>
            {clothingMen ||
            clothingWomen ||
            clothingOther ||
            clothingBoy ||
            clothingGirl ||
            clothingKids ? (
                <div className={styles.rowContainer}>
                    <div className={styles.row}>
                        <p>{clothingMen && `Men: ${mensQ}`}</p>
                        <p>{clothingWomen && `Women: ${womensQ}`}</p>
                        <p>{clothingOther && `Women: ${otherQ}`}</p>
                        <p>
                            {(clothingGirl || clothingBoy || clothingKids) &&
                                `Kids: ${kidsQ}`}
                        </p>
                    </div>
                </div>
            ) : (
                <p>None</p>
            )}

            <h2>Special Requests</h2>
            {backpack ||
            sleepingBag ||
            food ||
            busTicket ||
            orcaCard ||
            giftCard ||
            diaper ||
            householdItem ||
            financialAssistance ? (
                <div className={styles.rowContainer}>
                    <div className={styles.row}>
                        {backpack ? <p>{'Backpack ✔️'}</p> : ''}
                        {sleepingBag ? <p>{'Sleeping Bag ✔️'}</p> : ''}
                        {food ? <p>{'Food ✔️'}</p> : ''}
                        {householdItem ? <p>{'Household Items ✔️'}</p> : ''}
                    </div>
                    <div className={styles.row}>
                        {busTicket ? <p>Bus Tickets: {busTicket}</p> : ''}
                        {orcaCard ? <p>Orca Cards: {orcaCard}</p> : ''}
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
