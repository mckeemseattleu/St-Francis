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
    const bodyItems = data.map((section: any, i: number) => {
        const content =
            // TODO: Refactor from tertiary to switch case in case we have more
            // than 2 possible values for section.type in the future
            section.type === 'checkbox'
                ? section.items
                      .sort((a: any, b: any) => a.length - b.length)
                      .map((item: any, i: number) => (
                          <div key={i} className={styles.item}>
                              <label>{item}</label>
                              <span />
                          </div>
                      ))
                : section.items.map((item: any, i: number) => (
                      <div key={i} className={styles.item}>
                          <p>{item}</p>
                      </div>
                  ));
        return (
            <div key={i}>
                <h1>{section.title}</h1>
                <hr />
                <div className={styles.section}>{content}</div>
            </div>
        );
    });

    useEffect(() => {
        // immediately print the page when it loads
        window.print();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>{`${clientData?.firstName} ${clientData?.lastName}'s Shopping List`}</h1>
                <h1>
                    {
                        // Uses timestamp, if undefined uses today's date
                        visitData?.createdAt?.toDate()?.toDateString() ||
                            new Date().toDateString()
                    }
                </h1>
            </div>
            <div className={styles.buttons}>
                <Button
                    className={`noprint ${styles.printBtn}`}
                    onClick={() => {
                        router.push(`/checkout/${clientData.id}`);
                    }}
                >
                    Checkout
                </Button>
                <Button
                    className={`noprint ${styles.printBtn}`}
                    onClick={window.print}
                >
                    Print 🖨️
                </Button>
            </div>
            <div className={styles.items}>{bodyItems}</div>
        </div>
    );
}
