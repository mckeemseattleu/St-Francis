'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrintoutForm, {
    FormItem,
} from '../../../../../../components/PrintoutForm/PrintoutForm';
import { firestore } from '../../../../../../firebase/firebase';
import { VisitDoc } from '../../../../../checkin/[userId]/page';
import { ClientDoc } from '../../../page';

interface PrintoutProps {
    params: { visitId: string; userId: string };
}

export default function Printout({ params }: PrintoutProps) {
    const router = useRouter();
    const [visitData, setVisitData] = useState<VisitDoc>();
    const [clientData, setClientData] = useState<ClientDoc>();
    const [formData, setFormData] = useState<Array<FormItem>>();

    // Get visit data on component load
    useEffect(() => {
        getClientData();
        getVisitData();
    }, []);

    // TODO: Convert to waiting for both to finish using Promises to prevent doing this twice
    useEffect(() => {
        formatData();
    }, [visitData, clientData]);

    // Gets the client's document from firestore based on route's clientId
    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        if (clientDoc.exists()) {
            setClientData(clientDoc.data() as ClientDoc);
        } else {
            router.push('/');
        }
    };

    // Gets the visit's document from firestore based on route's visitId
    const getVisitData = async () => {
        const visitDoc = await getDoc(
            doc(firestore, 'clients', params.userId, 'visits', params.visitId)
        );

        if (visitDoc.exists()) {
            setVisitData(visitDoc.data() as VisitDoc);
        } else {
            router.push(`/profile/${params.userId}`);
        }
    };

    // Formats the data into a form <PrintoutForm /> expects
    const formatData = () => {
        if (!visitData) return;

        // Keys we consider "Special Requests"
        const specialRequestItemKeys = [
            'backpack',
            'sleepingBag',
            'busTicket',
            'giftCard',
            'financialAssistance',
        ];

        // What we want the form to label each checkbox
        const itemLabels = {
            clothingMen: 'Mens',
            clothingWomen: 'Womens',
            clothingBoy: 'Kids (Boy)',
            clothingGirl: 'Kids (Girl)',
            backpack: 'Backpack',
            sleepingBag: 'Sleeping Bag',
            busTicket: 'Bus Ticket',
            giftCard: 'Gift Card',
            diaper: '',
            financialAssistance: 'Financial Assistance',
        };

        let ans: typeof formData = [];

        // Get clothing items to show
        let clothingItems: Array<string> = [];

        Object.keys(visitData).forEach((key) => {
            if (
                key.startsWith('clothing') &&
                visitData[key as keyof typeof visitData]
            ) {
                clothingItems.push(itemLabels[key as keyof typeof itemLabels]);
            }
        });

        // Get special request items to show
        let specialRequestItems: Array<string> = [];

        Object.keys(visitData).forEach((key) => {
            if (
                specialRequestItemKeys.includes(key) &&
                visitData[key as keyof typeof visitData] != 0
            ) {
                specialRequestItems.push(
                    itemLabels[key as keyof typeof itemLabels]
                );
            }
        });

        // Add clothing items
        if (clothingItems.length != 0) {
            ans.push({
                title: 'Clothing',
                type: 'checkbox',
                items: clothingItems,
            });
        }

        // Add special request items
        if (specialRequestItems.length != 0) {
            ans.push({
                title: 'Special Requests',
                type: 'checkbox',
                items: specialRequestItems,
            });
        }

        // Add household items if present
        if (visitData.household.length > 0) {
            ans.push({
                title: 'Household',
                type: 'text',
                items: [visitData.household],
            });
        }

        // Add diapers if present
        if (visitData.diaper != 0) {
            ans.push({ title: 'Diapers', type: 'checkbox', items: [''] });
        }

        // Add notes if present
        if (visitData.notes.length > 0) {
            ans.push({
                title: 'Notes',
                type: 'text',
                items: [visitData.notes],
            });
        }

        setFormData(ans);
    };

    return clientData && visitData && formData ? (
        <PrintoutForm
            clientData={clientData}
            visitData={visitData}
            data={formData}
        />
    ) : null;
}
