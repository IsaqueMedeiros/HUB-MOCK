import { HubSpotContact, HubSpotDeal, JourneyPosition, JourneyStage, JourneySubStage } from '@/types/hubspot';

/**
 * Pure function that determines journey position based on HubSpot Deal and Contact data
 * Implements the business rules specified in the technical test
 */
export function calculateJourneyPosition(
  deal: HubSpotDeal,
  contact: HubSpotContact
): JourneyPosition {
  const now = new Date();
  const metadata = {
    dealStage: deal.properties.dealstage,
    proposalSent: deal.properties.proposal_sent === 'true',
    firstDepositDate: deal.properties.first_deposit_date,
    allocationDone: deal.properties.allocation_done === 'true',
    whatsappCadenceActive: contact.properties.whatsapp_cadence_active === 'true',
    lastMeetingDate: contact.properties.last_meeting_date,
    daysSinceLastMeeting: contact.properties.last_meeting_date 
      ? Math.floor((now.getTime() - new Date(contact.properties.last_meeting_date).getTime()) / (1000 * 60 * 60 * 24))
      : undefined
  };

  // Rule 1: Relacionamento - Highest Priority
  // whatsapp_cadence_active = true AND last_meeting_date <= 90 days
  if (isRelacionamentoStage(contact, metadata.daysSinceLastMeeting)) {
    return {
      stage: 'relacionamento',
      subStage: metadata.daysSinceLastMeeting !== undefined && metadata.daysSinceLastMeeting <= 30 
        ? 'reuniao_recente' 
        : 'cadencia_ativa',
      confidence: 0.95,
      lastUpdated: now.toISOString(),
      metadata
    };
  }

  // Rule 2: Onboarding - Medium Priority
  // dealstage ∈ {contractsent, closedwon} AND first_deposit_date != null
  if (isOnboardingStage(deal)) {
    return {
      stage: 'onboarding',
      subStage: metadata.allocationDone ? 'alocacao_feita' : 'deposito_realizado',
      confidence: 0.9,
      lastUpdated: now.toISOString(),
      metadata
    };
  }

  // Rule 3: Prospecção - Lowest Priority (default)
  // dealstage ∈ {appointmentscheduled, presentationscheduled}
  if (isProspeccaoStage(deal)) {
    return {
      stage: 'prospeccao',
      subStage: metadata.proposalSent ? 'proposta_enviada' : 'proposta_pendente',
      confidence: 0.85,
      lastUpdated: now.toISOString(),
      metadata
    };
  }

  // Fallback - if no rules match, assume early prospection stage
  return {
    stage: 'prospeccao',
    subStage: 'proposta_pendente',
    confidence: 0.6,
    lastUpdated: now.toISOString(),
    metadata
  };
}

/**
 * Check if client is in Relacionamento stage
 */
function isRelacionamentoStage(contact: HubSpotContact, daysSinceLastMeeting?: number): boolean {
  const whatsappActive = contact.properties.whatsapp_cadence_active === 'true';
  const recentMeeting = daysSinceLastMeeting !== undefined && daysSinceLastMeeting <= 90;
  
  return whatsappActive && recentMeeting;
}

/**
 * Check if client is in Onboarding stage
 */
function isOnboardingStage(deal: HubSpotDeal): boolean {
  const validDealStages = ['contractsent', 'closedwon'];
  const hasDeposit = deal.properties.first_deposit_date != null;
  
  return validDealStages.includes(deal.properties.dealstage) && hasDeposit;
}

/**
 * Check if client is in Prospecção stage
 */
function isProspeccaoStage(deal: HubSpotDeal): boolean {
  const validDealStages = ['appointmentscheduled', 'presentationscheduled'];
  
  return validDealStages.includes(deal.properties.dealstage);
}

/**
 * Get human-readable stage name
 */
export function getStageDisplayName(stage: JourneyStage): string {
  const names: Record<JourneyStage, string> = {
    prospeccao: 'Prospecção',
    onboarding: 'Onboarding',
    relacionamento: 'Relacionamento'
  };
  
  return names[stage];
}

/**
 * Get human-readable substage name
 */
export function getSubStageDisplayName(subStage: JourneySubStage): string {
  const names: Record<JourneySubStage, string> = {
    proposta_enviada: 'Proposta Enviada',
    proposta_pendente: 'Proposta Pendente',
    contrato_enviado: 'Contrato Enviado',
    deposito_realizado: 'Depósito Realizado',
    alocacao_feita: 'Alocação Feita',
    alocacao_pendente: 'Alocação Pendente',
    cadencia_ativa: 'Cadência Ativa',
    reuniao_recente: 'Reunião Recente',
    seguimento_necessario: 'Seguimento Necessário'
  };
  
  return names[subStage];
}

/**
 * Get stage color theme
 */
export function getStageColor(stage: JourneyStage): string {
  const colors: Record<JourneyStage, string> = {
    prospeccao: 'bg-blue-500',
    onboarding: 'bg-amber-500',
    relacionamento: 'bg-emerald-500'
  };
  
  return colors[stage];
}

/**
 * Get stage progress percentage (0-100)
 */
export function getStageProgress(stage: JourneyStage, subStage: JourneySubStage): number {
  const progressMap: Record<string, number> = {
    // Prospecção
    'prospeccao:proposta_pendente': 25,
    'prospeccao:proposta_enviada': 50,
    
    // Onboarding
    'onboarding:deposito_realizado': 60,
    'onboarding:alocacao_feita': 80,
    
    // Relacionamento
    'relacionamento:cadencia_ativa': 90,
    'relacionamento:reuniao_recente': 95,
  };
  
  return progressMap[`${stage}:${subStage}`] || 10;
}