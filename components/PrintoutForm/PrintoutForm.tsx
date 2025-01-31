import { Client, Visit } from '@/models/index';
import { Button } from '@/components/UI';
import styles from './PrintoutForm.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PrintoutFormProps {
    // TODO: We can ask for form title instead of clientData and update
    // component doc
    clientData: Client;
    // TODO: We can ask for date instead of visitData and update component
    // comment
    visitData: Visit;
    data: Array<FormItem>;
}

export interface FormItem {
    title: string;
    type: 'checkbox' | 'text';
    items: Array<string>;
}

/**
 * Takes in data in the form of an array of FormItem objects and generates a
 * printout based of that. A FormItem object might look like the below for a
 * section with a title of 'Clothing' and two checkboxes 'Mens' and 'Womens':
 * {
 *   title: 'Clothing',
 *   type: 'checkbox',
 *   items: ['Mens', 'Womens']
 * }
 *
 * @param clientData Only used for form title
 * @param visitData Only used for date in title section
 * @param data An array of FormItem objects to generate the printout from
 */
export default function PrintoutForm({
    clientData,
    visitData,
    data,
}: PrintoutFormProps) {
    const router = useRouter();
    
    const {
        clothingMen, clothingWomen, clothingKids, mensQ, womensQ, kidsQ,
        backpack, sleepingBag, food, busTicket, orcaCard, 
        giftCard, financialAssistance, diaper, householdItem,
        household, notes
    } = visitData;

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Shopping List</h1>
            </div>

            {/* Clothing Section */}
            {(clothingMen || clothingWomen || clothingKids) && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>CLOTHING</h2>
                    <div className={styles.sectionContent}>
                        {clothingMen && (
                            <div className={styles.itemContainer}>
                                <span className={styles.itemText}>Men: {mensQ}</span>
                            </div>
                        )}
                        {clothingWomen && (
                            <div className={styles.itemContainer}>
                                <span className={styles.itemText}>Women: {womensQ}</span>
                            </div>
                        )}
                        {clothingKids && (
                            <div className={styles.itemContainer}>
                                <span className={styles.itemText}>Kids: {kidsQ}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Special Requests Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>SPECIAL REQUESTS</h2>
                <div className={styles.sectionContent}>
                    {backpack && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Backpack ✓</span>
                        </div>
                    )}
                    {sleepingBag && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Sleeping Bag ✓</span>
                        </div>
                    )}
                    {food && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Food ✓</span>
                        </div>
                    )}
                    {busTicket && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Bus Tickets: {busTicket}</span>
                        </div>
                    )}
                    {orcaCard && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Orca Cards: {orcaCard}</span>
                        </div>
                    )}
                    {giftCard && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Gift Card: {giftCard}</span>
                        </div>
                    )}
                    {diaper && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Diapers: {diaper}</span>
                        </div>
                    )}
                    {financialAssistance && (
                        <div className={styles.itemContainer}>
                            <span className={styles.itemText}>Financial Assistance: ${financialAssistance}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Household Items Section */}
            {household && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>HOUSEHOLD ITEMS</h2>
                    <div className={styles.textContent}>{household}</div>
                </div>
            )}

            {/* Notes Section */}
            {notes && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>NOTES</h2>
                    <div className={styles.textContent}>{notes}</div>
                </div>
            )}

            <div className={styles.printFooter}>
                <Button
                    className={styles.printBtn}
                    onClick={() => router.push(`/checkout/${clientData.id}`)}
                >
                    Checkout
                </Button>
                <Button
                    className={styles.printBtn}
                    onClick={window.print}
                >
                    Print 🖨️
                </Button>
            </div>
        </div>
    );
}


