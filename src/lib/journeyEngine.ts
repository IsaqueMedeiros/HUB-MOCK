import { HubSpotContact, HubSpotDeal, JourneyPosition, JourneyStage, JourneySubStage, JourneyMetadata } from '@/types/hubspot';

/**
 * Pure function that determines journey position based on HubSpot Deal and Contact data
 * Implements the business rules specified in the technical test document
 * 
 * Rules Priority (Highest to Lowest):
 * 1. Relacionamento: whatsapp_cadence_active = true AND last_meeting_date <= 90 days
 * 2. Onboarding: dealstage ∈ {contractsent, closedwon} AND first_deposit_date != null
 * 3. Prospecção: dealstage ∈ {appointmentscheduled, presentationscheduled}
 */
export function calculateJourneyPosition(
  deal: HubSpotDeal,
  contact: HubSpotContact
): JourneyPosition {
  const now = new Date();
  
  // Calculate days since last meeting
  const daysSinceLastMeeting = contact.properties.last_meeting_date 
    ? Math.floor((now.getTime() - new Date(contact.properties.last_meeting_date).getTime()) / (1000 * 60 * 60 * 24))
    : undefined;
  
  // Calculate days in current stage based on deal's last modified date
  const daysInCurrentStage = Math.floor(
    (now.getTime() - new Date(deal.properties.hs_lastmodifieddate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Build metadata object
  const metadata: JourneyMetadata = {
    // Deal properties
    dealStage: deal.properties.dealstage,
    dealPipeline: deal.properties.pipeline,
    dealAmount: deal.properties.amount ? parseFloat(deal.properties.amount) : undefined,
    proposalSent: deal.properties.proposal_sent === 'true',
    firstDepositDate: deal.properties.first_deposit_date,
    allocationDone: deal.properties.allocation_done === 'true',
    
    // Contact properties
    whatsappCadenceActive: contact.properties.whatsapp_cadence_active === 'true',
    lastMeetingDate: contact.properties.last_meeting_date,
    daysSinceLastMeeting,
    leadStatus: contact.properties.hs_lead_status,
    lifecycleStage: contact.properties.lifecyclestage,
    
    // Calculated fields
    stageTransitions: [], // This would be populated from historical data in a real system
    riskFactors: calculateRiskFactors(deal, contact, daysSinceLastMeeting),
    nextActions: generateNextActions(deal, contact, daysSinceLastMeeting)
  };

  // Apply business rules in priority order

  // Rule 1: Relacionamento (Highest Priority)
  if (isRelacionamentoStage(contact, daysSinceLastMeeting)) {
    return {
      stage: 'relacionamento',
      subStage: determineRelacionamentoSubStage(contact, daysSinceLastMeeting),
      confidence: calculateConfidence('relacionamento', metadata),
      priority: determinePriority('relacionamento', metadata),
      lastUpdated: now.toISOString(),
      daysInCurrentStage,
      metadata
    };
  }

  // Rule 2: Onboarding (Medium Priority)
  if (isOnboardingStage(deal)) {
    return {
      stage: 'onboarding',
      subStage: determineOnboardingSubStage(deal),
      confidence: calculateConfidence('onboarding', metadata),
      priority: determinePriority('onboarding', metadata),
      lastUpdated: now.toISOString(),
      daysInCurrentStage,
      metadata
    };
  }

  // Rule 3: Prospecção (Lowest Priority / Default)
  if (isProspeccaoStage(deal)) {
    return {
      stage: 'prospeccao',
      subStage: determineProspeccaoSubStage(deal),
      confidence: calculateConfidence('prospeccao', metadata),
      priority: determinePriority('prospeccao', metadata),
      lastUpdated: now.toISOString(),
      daysInCurrentStage,
      metadata
    };
  }

  // Fallback - if no rules match, assume early prospection stage
  return {
    stage: 'prospeccao',
    subStage: 'proposta_pendente',
    confidence: 0.5,
    priority: 'low',
    lastUpdated: now.toISOString(),
    daysInCurrentStage,
    metadata
  };
}

/**
 * Check if client is in Relacionamento stage
 * whatsapp_cadence_active = true AND last_meeting_date <= 90 days
 */
function isRelacionamentoStage(contact: HubSpotContact, daysSinceLastMeeting?: number): boolean {
  const whatsappActive = contact.properties.whatsapp_cadence_active === 'true';
  const recentMeeting = daysSinceLastMeeting !== undefined && daysSinceLastMeeting <= 90;
  
  return whatsappActive && recentMeeting;
}

/**
 * Check if client is in Onboarding stage
 * dealstage ∈ {contractsent, closedwon} AND first_deposit_date != null
 */
function isOnboardingStage(deal: HubSpotDeal): boolean {
  const validDealStages = ['contractsent', 'closedwon'];
  const hasDeposit = deal.properties.first_deposit_date != null && deal.properties.first_deposit_date !== '';
  
  return validDealStages.includes(deal.properties.dealstage) && hasDeposit;
}

/**
 * Check if client is in Prospecção stage
 * dealstage ∈ {appointmentscheduled, presentationscheduled}
 */
function isProspeccaoStage(deal: HubSpotDeal): boolean {
  const validDealStages = ['appointmentscheduled', 'presentationscheduled'];
  
  return validDealStages.includes(deal.properties.dealstage);
}

/**
 * Determine specific sub-stage for Relacionamento
 */
function determineRelacionamentoSubStage(contact: HubSpotContact, daysSinceLastMeeting?: number): JourneySubStage {
  if (daysSinceLastMeeting !== undefined) {
    if (daysSinceLastMeeting <= 7) {
      return 'reuniao_recente';
    } else if (daysSinceLastMeeting <= 30) {
      return 'cadencia_ativa';
    } else {
      return 'seguimento_necessario';
    }
  }
  
  return 'cadencia_ativa';
}

/**
 * Determine specific sub-stage for Onboarding
 */
function determineOnboardingSubStage(deal: HubSpotDeal): JourneySubStage {
  if (deal.properties.dealstage === 'closedwon') {
    if (deal.properties.allocation_done === 'true') {
      return 'alocacao_feita';
    } else {
      return 'alocacao_pendente';
    }
  } else if (deal.properties.dealstage === 'contractsent') {
    if (deal.properties.first_deposit_date) {
      return 'deposito_realizado';
    } else {
      return 'contrato_enviado';
    }
  }
  
  return 'deposito_realizado';
}

/**
 * Determine specific sub-stage for Prospecção
 */
function determineProspeccaoSubStage(deal: HubSpotDeal): JourneySubStage {
  if (deal.properties.dealstage === 'appointmentscheduled') {
    return 'agendamento_marcado';
  } else if (deal.properties.dealstage === 'presentationscheduled') {
    if (deal.properties.proposal_sent === 'true') {
      return 'proposta_enviada';
    } else {
      return 'apresentacao_agendada';
    }
  }
  
  if (deal.properties.proposal_sent === 'true') {
    return 'proposta_enviada';
  }
  
  return 'proposta_pendente';
}

/**
 * Calculate confidence score based on data quality and stage certainty
 */
function calculateConfidence(stage: JourneyStage, metadata: JourneyMetadata): number {
  let baseConfidence = 0.7;
  
  // Stage-specific confidence adjustments
  switch (stage) {
    case 'relacionamento':
      if (metadata.whatsappCadenceActive && metadata.daysSinceLastMeeting !== undefined) {
        baseConfidence = 0.95;
        if (metadata.daysSinceLastMeeting > 60) {
          baseConfidence -= 0.1;
        }
      }
      break;
      
    case 'onboarding':
      if (metadata.firstDepositDate && metadata.dealStage === 'closedwon') {
        baseConfidence = 0.9;
        if (metadata.allocationDone) {
          baseConfidence = 0.95;
        }
      } else if (metadata.dealStage === 'contractsent') {
        baseConfidence = 0.85;
      }
      break;
      
    case 'prospeccao':
      if (metadata.proposalSent) {
        baseConfidence = 0.85;
      } else {
        baseConfidence = 0.75;
      }
      
      // Reduce confidence if no recent activity
      if (metadata.daysSinceLastMeeting && metadata.daysSinceLastMeeting > 30) {
        baseConfidence -= 0.1;
      }
      break;
  }
  
  // Data quality adjustments
  let dataQualityScore = 0;
  const requiredFields = [
    metadata.dealStage,
    metadata.lifecycleStage,
    metadata.leadStatus
  ].filter(Boolean).length;
  
  dataQualityScore = requiredFields / 3;
  
  // Apply data quality multiplier
  const finalConfidence = baseConfidence * (0.8 + 0.2 * dataQualityScore);
  
  return Math.min(Math.max(finalConfidence, 0.5), 1.0);
}

/**
 * Determine priority based on stage, risk factors, and business value
 */
function determinePriority(stage: JourneyStage, metadata: JourneyMetadata): 'high' | 'medium' | 'low' {
  // High priority conditions
  if (metadata.riskFactors.length > 0) {
    return 'high';
  }
  
  if (metadata.dealAmount && metadata.dealAmount > 200000) {
    return 'high';
  }
  
  if (stage === 'onboarding' && !metadata.allocationDone) {
    return 'high';
  }
  
  if (stage === 'relacionamento' && metadata.daysSinceLastMeeting && metadata.daysSinceLastMeeting > 45) {
    return 'high';
  }
  
  // Medium priority conditions
  if (stage === 'prospeccao' && metadata.proposalSent) {
    return 'medium';
  }
  
  if (metadata.dealAmount && metadata.dealAmount > 100000) {
    return 'medium';
  }
  
  if (stage === 'onboarding') {
    return 'medium';
  }
  
  // Default to low priority
  return 'low';
}

/**
 * Calculate risk factors based on client data and behavior
 */
function calculateRiskFactors(
  deal: HubSpotDeal, 
  contact: HubSpotContact, 
  daysSinceLastMeeting?: number
): string[] {
  const riskFactors: string[] = [];
  
  // Communication risks
  if (daysSinceLastMeeting !== undefined) {
    if (daysSinceLastMeeting > 60) {
      riskFactors.push('Sem contato há mais de 60 dias');
    } else if (daysSinceLastMeeting > 30) {
      riskFactors.push('Sem contato há mais de 30 dias');
    }
  }
  
  if (contact.properties.whatsapp_cadence_active === 'false') {
    riskFactors.push('Cadência do WhatsApp inativa');
  }
  
  // Deal stage risks
  if (deal.properties.dealstage === 'contractsent' && !deal.properties.first_deposit_date) {
    const contractDate = new Date(deal.properties.hs_lastmodifieddate);
    const daysSinceContract = Math.floor((Date.now() - contractDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceContract > 14) {
      riskFactors.push('Contrato enviado há mais de 14 dias sem depósito');
    }
  }
  
  if (deal.properties.dealstage === 'closedwon' && deal.properties.allocation_done === 'false') {
    riskFactors.push('Negócio fechado mas alocação pendente');
  }
  
  // Lifecycle stage misalignment
  if (deal.properties.dealstage === 'closedwon' && contact.properties.lifecyclestage !== 'customer') {
    riskFactors.push('Lifecycle stage não atualizado');
  }
  
  // High value deal risks
  const dealAmount = deal.properties.amount ? parseFloat(deal.properties.amount) : 0;
  if (dealAmount > 300000 && daysSinceLastMeeting && daysSinceLastMeeting > 21) {
    riskFactors.push('Alto valor sem contato recente');
  }
  
  // Lead status risks
  if (contact.properties.hs_lead_status === 'BAD_TIMING' || contact.properties.hs_lead_status === 'UNQUALIFIED') {
    riskFactors.push('Status de lead negativo');
  }
  
  return riskFactors;
}

/**
 * Generate next actions based on current stage and client data
 */
function generateNextActions(
  deal: HubSpotDeal, 
  contact: HubSpotContact, 
  daysSinceLastMeeting?: number
): string[] {
  const actions: string[] = [];
  const dealStage = deal.properties.dealstage;
  
  // Stage-specific actions
  switch (dealStage) {
    case 'appointmentscheduled':
      actions.push('Confirmar agendamento da reunião');
      actions.push('Preparar material de apresentação');
      break;
      
    case 'presentationscheduled':
      if (deal.properties.proposal_sent !== 'true') {
        actions.push('Enviar proposta comercial');
      } else {
        actions.push('Fazer follow-up da proposta');
      }
      actions.push('Agendar reunião de fechamento');
      break;
      
    case 'contractsent':
      if (!deal.properties.first_deposit_date) {
        actions.push('Acompanhar assinatura do contrato');
        actions.push('Orientar sobre processo de depósito');
      } else {
        actions.push('Iniciar processo de onboarding');
      }
      break;
      
    case 'closedwon':
      if (deal.properties.allocation_done !== 'true') {
        actions.push('Completar alocação dos recursos');
        actions.push('Enviar relatório inicial');
      } else {
        actions.push('Agendar reunião de acompanhamento');
        actions.push('Ativar cadência de relacionamento');
      }
      break;
  }
  
  // Communication-based actions
  if (daysSinceLastMeeting !== undefined) {
    if (daysSinceLastMeeting > 30) {
      actions.push('Agendar reunião urgente');
    } else if (daysSinceLastMeeting > 14) {
      actions.push('Fazer contato telefônico');
    }
  }
  
  if (contact.properties.whatsapp_cadence_active === 'false') {
    actions.push('Reativar cadência do WhatsApp');
  }
  
  // Lifecycle management actions
  if (dealStage === 'closedwon' && contact.properties.lifecyclestage !== 'customer') {
    actions.push('Atualizar lifecycle stage para customer');
  }
  
  // Proactive relationship actions
  if (dealStage === 'closedwon' && deal.properties.allocation_done === 'true') {
    actions.push('Revisar performance do portfolio');
    actions.push('Identificar oportunidades de upsell');
  }
  
  return actions.slice(0, 5); // Limit to top 5 actions
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
    agendamento_marcado: 'Agendamento Marcado',
    apresentacao_agendada: 'Apresentação Agendada',
    proposta_enviada: 'Proposta Enviada',
    proposta_pendente: 'Proposta Pendente',
    contrato_enviado: 'Contrato Enviado',
    negocio_fechado: 'Negócio Fechado',
    deposito_realizado: 'Depósito Realizado',
    alocacao_feita: 'Alocação Concluída',
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
    // Prospecção progression
    'prospeccao:proposta_pendente': 20,
    'prospeccao:agendamento_marcado': 35,
    'prospeccao:apresentacao_agendada': 50,
    'prospeccao:proposta_enviada': 65,
    
    // Onboarding progression
    'onboarding:contrato_enviado': 70,
    'onboarding:deposito_realizado': 80,
    'onboarding:alocacao_pendente': 85,
    'onboarding:alocacao_feita': 90,
    
    // Relacionamento progression
    'relacionamento:cadencia_ativa': 95,
    'relacionamento:reuniao_recente': 98,
    'relacionamento:seguimento_necessario': 92,
  };
  
  return progressMap[`${stage}:${subStage}`] || 15;
}

/**
 * Calculate health score based on multiple factors
 */
export function calculateHealthScore(
  deal: HubSpotDeal,
  contact: HubSpotContact,
  journeyPosition: JourneyPosition
): number {
  let score = 50; // Base score
  
  // Journey stage health
  switch (journeyPosition.stage) {
    case 'relacionamento':
      score += 30;
      break;
    case 'onboarding':
      score += 20;
      break;
    case 'prospeccao':
      score += 10;
      break;
  }
  
  // Communication health
  if (journeyPosition.metadata.whatsappCadenceActive) {
    score += 15;
  }
  
  if (journeyPosition.metadata.daysSinceLastMeeting !== undefined) {
    if (journeyPosition.metadata.daysSinceLastMeeting <= 7) {
      score += 20;
    } else if (journeyPosition.metadata.daysSinceLastMeeting <= 30) {
      score += 10;
    } else if (journeyPosition.metadata.daysSinceLastMeeting <= 60) {
      score -= 10;
    } else {
      score -= 25;
    }
  }
  
  // Deal progression health
  if (journeyPosition.metadata.proposalSent) {
    score += 10;
  }
  
  if (journeyPosition.metadata.allocationDone) {
    score += 15;
  }
  
  // Risk factor penalties
  score -= journeyPosition.metadata.riskFactors.length * 8;
  
  // Confidence bonus
  score += (journeyPosition.confidence - 0.5) * 20;
  
  // Ensure score is within valid range
  return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * Utility function to validate HubSpot data integrity
 */
export function validateHubSpotData(deal: HubSpotDeal, contact: HubSpotContact): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required field validation
  if (!deal.id || !contact.id) {
    errors.push('Missing required IDs');
  }
  
  if (!deal.properties.dealstage) {
    errors.push('Missing deal stage');
  }
  
  if (!contact.properties.email) {
    errors.push('Missing contact email');
  }
  
  // Data consistency warnings
  if (deal.properties.dealstage === 'closedwon' && contact.properties.lifecyclestage !== 'customer') {
    warnings.push('Lifecycle stage inconsistent with deal stage');
  }
  
  if (deal.properties.first_deposit_date && !deal.properties.amount) {
    warnings.push('Deposit date exists but deal amount is missing');
  }
  
  if (contact.properties.whatsapp_cadence_active === 'true' && !contact.properties.phone) {
    warnings.push('WhatsApp cadence active but no phone number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}