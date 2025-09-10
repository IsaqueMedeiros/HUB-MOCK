// HubSpot CRM API Types - Estrutura fiel à API oficial
// Referência: https://developers.hubspot.com/docs/api/crm/

export interface HubSpotPropertyValue {
  value: string;
  timestamp: string;
  source: string;
  sourceId: string;
}

export interface HubSpotContact {
  id: string;
  properties: {
    // Propriedades padrão do HubSpot
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;
    createdate: string;
    lastmodifieddate: string;
    hs_lead_status?: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'OPEN_DEAL' | 'UNQUALIFIED' | 'ATTEMPTED_TO_CONTACT' | 'CONNECTED' | 'BAD_TIMING';
    lifecyclestage?: 'subscriber' | 'lead' | 'marketingqualifiedlead' | 'salesqualifiedlead' | 'opportunity' | 'customer' | 'evangelist' | 'other';
    hubspot_owner_id?: string;
    hs_object_id: string;
    
    // Propriedades customizadas para jornada
    whatsapp_cadence_active?: string; // "true" | "false"
    last_meeting_date?: string; // ISO 8601
    lead_source?: string;
    job_title?: string;
    city?: string;
    state?: string;
    country?: string;
    annual_revenue?: string;
    num_employees?: string;
    industry?: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  archivedAt?: string;
}

export interface HubSpotDeal {
  id: string;
  properties: {
    // Propriedades padrão do HubSpot Deals
    dealname: string;
    amount?: string;
    dealstage: 'appointmentscheduled' | 'presentationscheduled' | 'decisionmakerboughtin' | 'contractsent' | 'closedwon' | 'closedlost';
    pipeline: 'default' | string;
    closedate?: string;
    createdate: string;
    hs_lastmodifieddate: string;
    hubspot_owner_id?: string;
    hs_object_id: string;
    dealtype?: 'newbusiness' | 'existingbusiness' | 'upsell' | 'downsell';
    description?: string;
    hs_deal_stage_probability?: string;
    hs_forecast_amount?: string;
    hs_closed_amount?: string;
    hs_projected_amount?: string;
    num_contacted_notes?: string;
    num_notes?: string;
    
    // Propriedades customizadas específicas para o negócio
    proposal_sent?: string; // "true" | "false"
    first_deposit_date?: string; // ISO 8601
    allocation_done?: string; // "true" | "false"
    investment_type?: string; // "conservative" | "moderate" | "aggressive"
    risk_profile?: string; // "low" | "medium" | "high"
    portfolio_value?: string;
    last_contact_date?: string;
    next_followup_date?: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  archivedAt?: string;
  associations?: {
    contacts?: {
      results: Array<{
        id: string;
        type: 'deal_to_contact';
      }>;
    };
    companies?: {
      results: Array<{
        id: string;
        type: 'deal_to_company';
      }>;
    };
  };
}

export interface HubSpotPipeline {
  id: string;
  label: string;
  stages: HubSpotPipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotPipelineStage {
  id: string;
  label: string;
  displayOrder: number;
  probability: number;
  closed: boolean;
  won: boolean;
}

export interface HubSpotApiResponse<T> {
  results: T[];
  total?: number;
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

export interface HubSpotSearchRequest {
  filterGroups: Array<{
    filters: Array<{
      propertyName: string;
      operator: 'EQ' | 'NEQ' | 'LT' | 'LTE' | 'GT' | 'GTE' | 'BETWEEN' | 'IN' | 'NOT_IN' | 'HAS_PROPERTY' | 'NOT_HAS_PROPERTY' | 'CONTAINS_TOKEN' | 'NOT_CONTAINS_TOKEN';
      value: string;
    }>;
  }>;
  sorts?: Array<{
    propertyName: string;
    direction: 'ASCENDING' | 'DESCENDING';
  }>;
  properties?: string[];
  limit?: number;
  after?: string;
}

// Journey Types específicos para a aplicação
export type JourneyStage = 'prospeccao' | 'onboarding' | 'relacionamento';

export type JourneySubStage = 
  | 'agendamento_marcado'      // appointmentscheduled
  | 'apresentacao_agendada'    // presentationscheduled
  | 'proposta_enviada'         // proposal_sent = true
  | 'proposta_pendente'        // proposal_sent = false
  | 'contrato_enviado'         // contractsent
  | 'negocio_fechado'          // closedwon
  | 'deposito_realizado'       // first_deposit_date exists
  | 'alocacao_feita'           // allocation_done = true
  | 'alocacao_pendente'        // allocation_done = false
  | 'cadencia_ativa'           // whatsapp_cadence_active = true
  | 'reuniao_recente'          // last_meeting_date <= 30 days
  | 'seguimento_necessario';   // last_meeting_date > 30 days

export interface JourneyMetadata {
  // Deal properties
  dealStage: string;
  dealPipeline: string;
  dealAmount?: number;
  proposalSent: boolean;
  firstDepositDate?: string;
  allocationDone: boolean;
  
  // Contact properties
  whatsappCadenceActive: boolean;
  lastMeetingDate?: string;
  daysSinceLastMeeting?: number;
  leadStatus?: string;
  lifecycleStage?: string;
  
  // Calculated fields
  stageTransitions: Array<{
    fromStage: string;
    toStage: string;
    timestamp: string;
    reason?: string;
  }>;
  riskFactors: string[];
  nextActions: string[];
}

export interface JourneyPosition {
  stage: JourneyStage;
  subStage: JourneySubStage;
  confidence: number; // 0-1
  priority: 'high' | 'medium' | 'low';
  lastUpdated: string;
  previousStage?: JourneyStage;
  daysInCurrentStage: number;
  metadata: JourneyMetadata;
}

export interface ClientJourneyData {
  contactId: string;
  dealId: string;
  contact: HubSpotContact;
  deal: HubSpotDeal;
  journeyPosition: JourneyPosition;
  healthScore: number; // 0-100
  lastActivity: string;
  ownerName?: string;
}

// API Response Types
export interface JourneyApiResponse {
  success: boolean;
  data: ClientJourneyData | ClientJourneyData[];
  timestamp: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  errors?: Array<{
    code: string;
    message: string;
    details?: any;
  }>;
}

// Event Types para tracking
export interface JourneyEvent {
  id: string;
  contactId: string;
  dealId: string;
  eventType: 'stage_change' | 'substage_change' | 'meeting_scheduled' | 'proposal_sent' | 'contract_sent' | 'deposit_received' | 'allocation_completed';
  timestamp: string;
  details: Record<string, any>;
  source: 'hubspot' | 'system' | 'manual';
}