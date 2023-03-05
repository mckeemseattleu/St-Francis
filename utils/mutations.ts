import { DocFilter, mutateData } from './fetchData';

export async function createClient(clientData: DocFilter) {
    return await mutateData(clientData, 'clients');
}

export async function updateClient(clientData: DocFilter) {
    return await mutateData(clientData, 'clients');
}
