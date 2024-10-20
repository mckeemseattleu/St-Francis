import { Visit } from '@/models/index';

export type VisitWithClientId = Visit & { clientId: string };
