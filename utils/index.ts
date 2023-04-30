import type { DocFilter } from './fetchData';
import { fetchData, mutateData } from './fetchData';
import {
    createClient,
    updateClient,
    createVisit,
    updateVisit,
    updateSettings,
} from './mutations';
import {
    getClient,
    listClients,
    listVisits,
    getVisit,
    getSettings,
} from './queries';

export type { DocFilter };
export {
    fetchData,
    mutateData,
    listClients,
    getClient,
    createClient,
    updateClient,
    listVisits,
    getVisit,
    createVisit,
    updateVisit,
    getSettings,
    updateSettings,
};
