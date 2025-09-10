// HubSpot CRM API Types - Based on official HubSpot API documentation
// Reference: https://developers.hubspot.com/docs/api/crm/deals
// Reference: https://developers.hubspot.com/docs/api/crm/contacts

export interface HubSpotContact {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    company?: string;
    createdate: string;
    lastmodifieddate: string;
    hs_lead_status?: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'OPEN_DEAL' | 'UNQUALIFIED' | 'ATTEMPTED_TO_CONTACT' | 'CONNECTED' | 'BAD_TIMING';
    lifecyclestage?: 'subscriber' | 'lead' | 'marketingqualifiedlead' | 'salesqualifiedlead' | 'opportunity' | 'customer' | 'evangelist' | 'other';
    whatsapp_cadence_active?: string; // Custom property - boolean as string
    last_meeting_date?: string; // Custom property - ISO date string
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: 'appointmentscheduled' | 'presentationscheduled' | 'decisionmakerboughtin' | 'contractsent' | 'closedwon' | 'closedlost';
    pipeline: string;
    closedate?: string;
    createdate: string;
    hs_lastmodifieddate: string;
    hubspot_owner_id?: string;
    dealtype?: string;
    description?: string;
    // Custom properties based on journey rules
    proposal_sent?: string; // boolean as string
    first_deposit_date?: string; // ISO date string
    allocation_done?: string; // boolean as string
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  associations?: {
    contacts?: {
      results: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

export interface HubSpotApiResponse<T> {
  results: T[];
  paging?: {
    next?: {
      after: string;
      link: string;
    };
    prev?: {
      before: string;
      link: string;
    };
  };
}

// Journey Stage Types
export type JourneyStage = 'prospeccao' | 'onboarding' | 'relacionamento';
export type JourneySubStage = 
  | 'proposta_enviada' 
  | 'proposta_pendente'
  | 'contrato_enviado'
  | 'deposito_realizado'
  | 'alocacao_feita'
  | 'alocacao_pendente'
  | 'cadencia_ativa'
  | 'reuniao_recente'
  | 'seguimento_necessario';

export interface JourneyPosition {
  stage: JourneyStage;
  subStage: JourneySubStage;
  confidence: number; // 0-1 confidence score
  lastUpdated: string;
  metadata?: {
    dealStage?: string;
    proposalSent?: boolean;
    firstDepositDate?: string;
    allocationDone?: boolean;
    whatsappCadenceActive?: boolean;
    lastMeetingDate?: string;
    daysSinceLastMeeting?: number;
  };
}

export interface ClientJourneyData {
  contactId: string;
  dealId: string;
  contact: HubSpotContact;
  deal: HubSpotDeal;
  journeyPosition: JourneyPosition;
}

// API Response Types
export interface JourneyApiResponse {
  success: boolean;
  data: ClientJourneyData;
  timestamp: string;
}