import type { DocFilter } from './fetchData';
import { fetchData, mutateData } from './fetchData';
import { createClient, updateClient } from './mutations';
import { getClient, listClients } from './queries';

export type { DocFilter };
export {
    fetchData,
    mutateData,
    listClients,
    getClient,
    createClient,
    updateClient,
};
