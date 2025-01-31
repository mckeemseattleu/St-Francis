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
        backpack, sleepingBag, food, busTicket, orcaCard, 
        giftCard, financialAssistance, diaper, householdItem
    } = visitData;

    return (
        <div className={styles.container}>
            {/* Title Section */}
            <div className={styles.title}>
                <h1>Shopping List</h1>
            </div>

            <div className={styles.body} style={{ border: 'none' }}>
                {/* Special Requests Section */}
                <div>
                    <h1 style={{
                        fontSize: '24px',
                        textTransform: 'uppercase',
                        borderBottom: '2px solid black',
                        marginBottom: '20px'
                    }}>Special Requests</h1>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '20px',
                        padding: '20px'
                    }}>
                        {busTicket && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Bus Tickets: {busTicket}</span>
                                <div style={{ width: '25px', height: '25px', border: '1px solid black' }} />
                            </div>
                        )}
                        {orcaCard && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Orca Cards: {orcaCard}</span>
                                <div style={{ width: '25px', height: '25px', border: '1px solid black' }} />
                            </div>
                        )}
                        {giftCard && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Gift Card: {giftCard}</span>
                                <div style={{ width: '25px', height: '25px', border: '1px solid black' }} />
                            </div>
                        )}
                        {diaper && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Diapers: {diaper}</span>
                                <div style={{ width: '25px', height: '25px', border: '1px solid black' }} />
                            </div>
                        )}
                        {financialAssistance && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Financial Assistance: {financialAssistance}</span>
                                <div style={{ width: '25px', height: '25px', border: '1px solid black' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className={styles.printFooter}>
                <div className={styles.buttons}>
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
        </div>
    );
}


