import type { DocFilter } from './fetchData';
import { fetchData, mutateData } from './fetchData';
import { createClient, updateClient, updateSettings } from './mutations';
import { getClient, listClients, getSettings } from './queries';

export type { DocFilter };
export {
    fetchData,
    mutateData,
    listClients,
    getClient,
    createClient,
    updateClient,
    getSettings,
    updateSettings,
};
