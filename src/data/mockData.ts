import { HubSpotContact, HubSpotDeal, HubSpotApiResponse } from '@/types/hubspot';

/**
 * Mock data that faithfully follows HubSpot API structure
 * Based on official HubSpot API documentation:
 * - Contacts: https://developers.hubspot.com/docs/api/crm/contacts
 * - Deals: https://developers.hubspot.com/docs/api/crm/deals
 * 
 * This mock data includes realistic scenarios for all journey stages
 */

// Mock Contacts Data with comprehensive HubSpot properties
export const mockContacts: HubSpotContact[] = [
  {
    id: "51",
    properties: {
      firstname: "Maria",
      lastname: "Silva",
      email: "maria.silva@silvainvestimentos.com.br",
      phone: "+55 11 99999-1111",
      company: "Silva Investimentos Ltda",
      website: "www.silvainvestimentos.com.br",
      createdate: "2024-01-15T10:30:00.000Z",
      lastmodifieddate: "2024-11-08T14:22:00.000Z",
      hs_lead_status: "CONNECTED",
      lifecyclestage: "customer",
      hubspot_owner_id: "12345",
      hs_object_id: "51",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-11-05T15:00:00.000Z",
      lead_source: "Website",
      job_title: "CEO",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      annual_revenue: "2500000",
      num_employees: "15",
      industry: "Financial Services"
    },
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-11-08T14:22:00.000Z",
    archived: false
  },
  {
    id: "52",
    properties: {
      firstname: "João",
      lastname: "Santos",
      email: "joao.santos@santosassociados.com.br",
      phone: "+55 21 98888-2222",
      company: "Santos & Associados",
      website: "www.santosassociados.com.br",
      createdate: "2024-02-20T09:15:00.000Z",
      lastmodifieddate: "2024-11-09T11:45:00.000Z",
      hs_lead_status: "OPEN_DEAL",
      lifecyclestage: "opportunity",
      hubspot_owner_id: "12346",
      hs_object_id: "52",
      whatsapp_cadence_active: "false",
      last_meeting_date: "2024-09-15T16:30:00.000Z",
      lead_source: "Referral",
      job_title: "Empresário",
      city: "Rio de Janeiro",
      state: "RJ",
      country: "Brasil",
      annual_revenue: "5000000",
      num_employees: "45",
      industry: "Technology"
    },
    createdAt: "2024-02-20T09:15:00.000Z",
    updatedAt: "2024-11-09T11:45:00.000Z",
    archived: false
  },
  {
    id: "53",
    properties: {
      firstname: "Ana",
      lastname: "Costa",
      email: "ana.costa@techcorp.io",
      phone: "+55 11 97777-3333",
      company: "TechCorp Startup",
      website: "www.techcorp.io",
      createdate: "2024-03-10T14:20:00.000Z",
      lastmodifieddate: "2024-11-10T08:15:00.000Z",
      hs_lead_status: "IN_PROGRESS",
      lifecyclestage: "salesqualifiedlead",
      hubspot_owner_id: "12347",
      hs_object_id: "53",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-11-08T10:00:00.000Z",
      lead_source: "LinkedIn",
      job_title: "CTO & Co-founder",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      annual_revenue: "1200000",
      num_employees: "8",
      industry: "Technology"
    },
    createdAt: "2024-03-10T14:20:00.000Z",
    updatedAt: "2024-11-10T08:15:00.000Z",
    archived: false
  },
  {
    id: "54",
    properties: {
      firstname: "Carlos",
      lastname: "Oliveira",
      email: "carlos.oliveira@oliveiraholdings.com",
      phone: "+55 11 96666-4444",
      company: "Oliveira Holdings",
      website: "www.oliveiraholdings.com",
      createdate: "2024-04-05T16:45:00.000Z",
      lastmodifieddate: "2024-11-08T12:30:00.000Z",
      hs_lead_status: "OPEN_DEAL",
      lifecyclestage: "opportunity",
      hubspot_owner_id: "12348",
      hs_object_id: "54",
      whatsapp_cadence_active: "false",
      last_meeting_date: "2024-08-20T14:00:00.000Z",
      lead_source: "Event",
      job_title: "Chairman",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      annual_revenue: "15000000",
      num_employees: "120",
      industry: "Investment Management"
    },
    createdAt: "2024-04-05T16:45:00.000Z",
    updatedAt: "2024-11-08T12:30:00.000Z",
    archived: false
  },
  {
    id: "55",
    properties: {
      firstname: "Patricia",
      lastname: "Lima",
      email: "patricia.lima@limaconsultoria.com.br",
      phone: "+55 21 95555-5555",
      company: "Lima Consultoria",
      website: "www.limaconsultoria.com.br",
      createdate: "2024-05-12T11:00:00.000Z",
      lastmodifieddate: "2024-11-09T17:20:00.000Z",
      hs_lead_status: "CONNECTED",
      lifecyclestage: "customer",
      hubspot_owner_id: "12349",
      hs_object_id: "55",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-11-01T09:30:00.000Z",
      lead_source: "Google Ads",
      job_title: "Consultora Sênior",
      city: "Rio de Janeiro",
      state: "RJ",
      country: "Brasil",
      annual_revenue: "800000",
      num_employees: "3",
      industry: "Professional Services"
    },
    createdAt: "2024-05-12T11:00:00.000Z",
    updatedAt: "2024-11-09T17:20:00.000Z",
    archived: false
  },
  {
    id: "56",
    properties: {
      firstname: "Roberto",
      lastname: "Fernandes",
      email: "roberto.fernandes@fernandestech.com",
      phone: "+55 11 94444-6666",
      company: "Fernandes Tech Solutions",
      website: "www.fernandestech.com",
      createdate: "2024-06-08T13:45:00.000Z",
      lastmodifieddate: "2024-11-10T10:30:00.000Z",
      hs_lead_status: "IN_PROGRESS",
      lifecyclestage: "salesqualifiedlead",
      hubspot_owner_id: "12350",
      hs_object_id: "56",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-11-09T14:00:00.000Z",
      lead_source: "Webinar",
      job_title: "CEO",
      city: "Campinas",
      state: "SP",
      country: "Brasil",
      annual_revenue: "3200000",
      num_employees: "25",
      industry: "Technology"
    },
    createdAt: "2024-06-08T13:45:00.000Z",
    updatedAt: "2024-11-10T10:30:00.000Z",
    archived: false
  },
  {
    id: "57",
    properties: {
      firstname: "Luciana",
      lastname: "Mendes",
      email: "luciana.mendes@mendeslaw.com.br",
      phone: "+55 31 93333-7777",
      company: "Mendes Advocacia",
      createdate: "2024-07-15T09:20:00.000Z",
      lastmodifieddate: "2024-11-07T15:45:00.000Z",
      hs_lead_status: "ATTEMPTED_TO_CONTACT",
      lifecyclestage: "lead",
      hubspot_owner_id: "12351",
      hs_object_id: "57",
      whatsapp_cadence_active: "false",
      last_meeting_date: "2024-07-20T16:00:00.000Z",
      lead_source: "Cold Email",
      job_title: "Advogada Sócia",
      city: "Belo Horizonte",
      state: "MG",
      country: "Brasil",
      annual_revenue: "1500000",
      num_employees: "12",
      industry: "Legal Services"
    },
    createdAt: "2024-07-15T09:20:00.000Z",
    updatedAt: "2024-11-07T15:45:00.000Z",
    archived: false
  }
];

// Mock Deals Data with comprehensive HubSpot properties
export const mockDeals: HubSpotDeal[] = [
  {
    id: "401",
    properties: {
      dealname: "Investimento Conservador - Maria Silva",
      amount: "150000",
      dealstage: "closedwon",
      pipeline: "default",
      closedate: "2024-10-15T00:00:00.000Z",
      createdate: "2024-01-15T10:30:00.000Z",
      hs_lastmodifieddate: "2024-11-08T14:22:00.000Z",
      hubspot_owner_id: "12345",
      hs_object_id: "401",
      dealtype: "existingbusiness",
      description: "Cliente interessada em portfolio conservador com foco em renda fixa e fundos DI",
      hs_deal_stage_probability: "100",
      hs_forecast_amount: "150000",
      hs_closed_amount: "150000",
      proposal_sent: "true",
      first_deposit_date: "2024-10-20T00:00:00.000Z",
      allocation_done: "true",
      investment_type: "conservative",
      risk_profile: "low",
      portfolio_value: "150000",
      last_contact_date: "2024-11-05T15:00:00.000Z",
      next_followup_date: "2024-12-05T15:00:00.000Z"
    },
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-11-08T14:22:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "51", type: "deal_to_contact" }]
      }
    }
  },
  {
    id: "402",
    properties: {
      dealname: "Portfolio Diversificado - João Santos",
      amount: "300000",
      dealstage: "contractsent",
      pipeline: "default",
      closedate: "2024-11-30T00:00:00.000Z",
      createdate: "2024-02-20T09:15:00.000Z",
      hs_lastmodifieddate: "2024-11-09T11:45:00.000Z",
      hubspot_owner_id: "12346",
      hs_object_id: "402",
      dealtype: "newbusiness",
      description: "Cliente empresário busca diversificação com mix de renda fixa, ações e fundos multimercado",
      hs_deal_stage_probability: "80",
      hs_forecast_amount: "300000",
      proposal_sent: "true",
      first_deposit_date: "2024-11-05T00:00:00.000Z",
      allocation_done: "false",
      investment_type: "moderate",
      risk_profile: "medium",
      portfolio_value: "300000",
      last_contact_date: "2024-09-15T16:30:00.000Z",
      next_followup_date: "2024-11-15T10:00:00.000Z"
    },
    createdAt: "2024-02-20T09:15:00.000Z",
    updatedAt: "2024-11-09T11:45:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "52", type: "deal_to_contact" }]
      }
    }
  },
  {
    id: "403",
    properties: {
      dealname: "Startup Investment - Ana Costa",
      amount: "75000",
      dealstage: "presentationscheduled",
      pipeline: "default",
      createdate: "2024-03-10T14:20:00.000Z",
      hs_lastmodifieddate: "2024-11-10T08:15:00.000Z",
      hubspot_owner_id: "12347",
      hs_object_id: "403",
      dealtype: "newbusiness",
      description: "Fundadora de startup tech interessada em investimentos para pessoa física com perfil arrojado",
      hs_deal_stage_probability: "60",
      hs_forecast_amount: "75000",
      proposal_sent: "true",
      investment_type: "aggressive",
      risk_profile: "high",
      portfolio_value: "75000",
      last_contact_date: "2024-11-08T10:00:00.000Z",
      next_followup_date: "2024-11-12T14:00:00.000Z"
    },
    createdAt: "2024-03-10T14:20:00.000Z",
    updatedAt: "2024-11-10T08:15:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "53", type: "deal_to_contact" }]
      }
    }
  },
  {
    id: "404",
    properties: {
      dealname: "Wealth Management - Carlos Oliveira",
      amount: "500000",
      dealstage: "appointmentscheduled",
      pipeline: "default",
      createdate: "2024-04-05T16:45:00.000Z",
      hs_lastmodifieddate: "2024-11-08T12:30:00.000Z",
      hubspot_owner_id: "12348",
      hs_object_id: "404",
      dealtype: "existingbusiness",
      description: "Cliente de alto patrimônio buscando gestão profissional com estratégia conservadora-moderada",
      hs_deal_stage_probability: "40",
      hs_forecast_amount: "500000",
      proposal_sent: "false",
      investment_type: "moderate",
      risk_profile: "medium",
      portfolio_value: "500000",
      last_contact_date: "2024-08-20T14:00:00.000Z",
      next_followup_date: "2024-11-15T16:00:00.000Z"
    },
    createdAt: "2024-04-05T16:45:00.000Z",
    updatedAt: "2024-11-08T12:30:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "54", type: "deal_to_contact" }]
      }
    }
  },
  {
    id: "405",
    properties: {
      dealname: "Consultoria Personalizada - Patricia Lima",
      amount: "200000",
      dealstage: "closedwon",
      pipeline: "default",
      closedate: "2024-11-01T00:00:00.000Z",
      createdate: "2024-05-12T11:00:00.000Z",
      hs_lastmodifieddate: "2024-11-09T17:20:00.000Z",
      hubspot_owner_id: "12349",
      hs_object_id: "405",
      dealtype: "newbusiness",
      description: "Consultora independente busca assessoria para investimentos pessoais com perfil moderado",
      hs_deal_stage_probability: "100",
      hs_forecast_amount: "200000",
      hs_closed_amount: "200000",
      proposal_sent: "true",
      first_deposit_date: "2024-11-03T00:00:00.000Z",
      allocation_done: "true",
      investment_type: "moderate",
      risk_profile: "medium",
      portfolio_value: "200000",
      last_contact_date: "2024-11-01T09:30:00.000Z",
      next_followup_date: "2024-12-01T10:00:00.000Z"
    },
    createdAt: "2024-05-12T11:00:00.000Z",
    updatedAt: "2024-11-09T17:20:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "55", type: "deal_to_contact" }]
      }
    }
  },
  {
    id: "406",
    properties: {
      dealname: "Tech Solutions Investment - Roberto Fernandes",
      amount: "180000",
      dealstage: "presentationscheduled",
      pipeline: "default",
      createdate: "2024-06-08T13:45:00.000Z",
      hs_lastmodifieddate: "2024-11-10T10:30:00.000Z",
      hubspot_owner_id: "12350",
      hs_object_id: "406",
      dealtype: "newbusiness",
      description: "CEO de empresa de tecnologia buscando investimentos corporativos e pessoais",
      hs_deal_stage_probability: "70",
      hs_forecast_amount: "180000",
      proposal_sent: "false",
      investment_type: "moderate",
      risk_profile: "medium",
      portfolio_value: "180000",
      last_contact_date: "2024-11-09T14:00:00.000Z",
      next_followup_date: "2024-11-11T15:00:00.000Z"
    },
    createdAt: "2024-06-08T13:45:00.000Z",
    updatedAt: "2024-11-10T10:30:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "56", type: "deal_to_contact" }]
      }
    }
  },
  {
    id: "407",
    properties: {
      dealname: "Legal Services Investment - Luciana Mendes",
      amount: "95000",
      dealstage: "appointmentscheduled",
      pipeline: "default",
      createdate: "2024-07-15T09:20:00.000Z",
      hs_lastmodifieddate: "2024-11-07T15:45:00.000Z",
      hubspot_owner_id: "12351",
      hs_object_id: "407",
      dealtype: "newbusiness",
      description: "Advogada sócia interessada em diversificação de investimentos com perfil conservador",
      hs_deal_stage_probability: "30",
      hs_forecast_amount: "95000",
      proposal_sent: "false",
      investment_type: "conservative",
      risk_profile: "low",
      portfolio_value: "95000",
      last_contact_date: "2024-07-20T16:00:00.000Z",
      next_followup_date: "2024-11-20T10:00:00.000Z"
    },
    createdAt: "2024-07-15T09:20:00.000Z",
    updatedAt: "2024-11-07T15:45:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "57", type: "deal_to_contact" }]
      }
    }
  }
];

/**
 * Mock API response structure matching HubSpot API
 */
export const mockContactsApiResponse: HubSpotApiResponse<HubSpotContact> = {
  results: mockContacts,
  total: mockContacts.length,
  paging: {
    next: {
      after: "57",
      link: "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&after=57&properties=firstname,lastname,email,phone,company"
    }
  }
};

export const mockDealsApiResponse: HubSpotApiResponse<HubSpotDeal> = {
  results: mockDeals,
  total: mockDeals.length,
  paging: {
    next: {
      after: "407",
      link: "https://api.hubapi.com/crm/v3/objects/deals?limit=10&after=407&properties=dealname,amount,dealstage,pipeline"
    }
  }
};

/**
 * Simulate HubSpot API endpoints with realistic response structure
 */

/**
 * GET /crm/v3/objects/contacts/{contactId}
 * Simulates HubSpot Contacts API individual record retrieval
 */
export function getMockContactById(id: string): HubSpotContact | undefined {
  return mockContacts.find(contact => contact.id === id);
}

/**
 * GET /crm/v3/objects/deals/{dealId}
 * Simulates HubSpot Deals API individual record retrieval
 */
export function getMockDealById(id: string): HubSpotDeal | undefined {
  return mockDeals.find(deal => deal.id === id);
}

/**
 * GET /crm/v3/objects/deals/{dealId}?associations=contacts
 * Simulates HubSpot API call with associations
 */
export function getMockDealWithContact(dealId: string): { deal: HubSpotDeal; contact: HubSpotContact } | null {
  const deal = getMockDealById(dealId);
  if (!deal || !deal.associations?.contacts?.results?.length) {
    return null;
  }
  
  const contactId = deal.associations.contacts.results[0].id;
  const contact = getMockContactById(contactId);
  
  if (!contact) {
    return null;
  }
  
  return { deal, contact };
}

/**
 * GET /crm/v3/objects/deals?associations=contacts
 * Get all deals with their associated contacts
 */
export function getAllMockDealsWithContacts(): Array<{ deal: HubSpotDeal; contact: HubSpotContact }> {
  return mockDeals.map(deal => {
    const result = getMockDealWithContact(deal.id);
    return result!;
  }).filter(Boolean);
}

/**
 * POST /crm/v3/objects/contacts/search
 * Simulates HubSpot Search API for contacts
 */
export function searchMockContacts(
  query: string, 
  properties?: string[]
): HubSpotApiResponse<HubSpotContact> {
  const filteredContacts = mockContacts.filter(contact => 
    contact.properties.firstname.toLowerCase().includes(query.toLowerCase()) ||
    contact.properties.lastname.toLowerCase().includes(query.toLowerCase()) ||
    contact.properties.email.toLowerCase().includes(query.toLowerCase()) ||
    (contact.properties.company && contact.properties.company.toLowerCase().includes(query.toLowerCase()))
  );
  
  return {
    results: filteredContacts,
    total: filteredContacts.length
  };
}

/**
 * POST /crm/v3/objects/deals/search
 * Simulates HubSpot Search API for deals
 */
export function searchMockDeals(
  stage?: string,
  pipeline?: string,
  minAmount?: number,
  maxAmount?: number
): HubSpotApiResponse<HubSpotDeal> {
  let filteredDeals = mockDeals;
  
  if (stage) {
    filteredDeals = filteredDeals.filter(deal => deal.properties.dealstage === stage);
  }
  
  if (pipeline) {
    filteredDeals = filteredDeals.filter(deal => deal.properties.pipeline === pipeline);
  }
  
  if (minAmount !== undefined) {
    filteredDeals = filteredDeals.filter(deal => 
      deal.properties.amount && parseFloat(deal.properties.amount) >= minAmount
    );
  }
  
  if (maxAmount !== undefined) {
    filteredDeals = filteredDeals.filter(deal => 
      deal.properties.amount && parseFloat(deal.properties.amount) <= maxAmount
    );
  }
  
  return {
    results: filteredDeals,
    total: filteredDeals.length
  };
}

/**
 * GET /crm/v3/pipelines/deals
 * Simulates HubSpot Pipelines API
 */
export function getMockDealPipelines() {
  return {
    results: [
      {
        id: "default",
        label: "Sales Pipeline",
        stages: [
          {
            id: "appointmentscheduled",
            label: "Appointment Scheduled",
            displayOrder: 0,
            probability: 0.2,
            closed: false,
            won: false
          },
          {
            id: "presentationscheduled",
            label: "Presentation Scheduled",
            displayOrder: 1,
            probability: 0.4,
            closed: false,
            won: false
          },
          {
            id: "decisionmakerboughtin",
            label: "Decision Maker Bought-In",
            displayOrder: 2,
            probability: 0.6,
            closed: false,
            won: false
          },
          {
            id: "contractsent",
            label: "Contract Sent",
            displayOrder: 3,
            probability: 0.8,
            closed: false,
            won: false
          },
          {
            id: "closedwon",
            label: "Closed Won",
            displayOrder: 4,
            probability: 1.0,
            closed: true,
            won: true
          },
          {
            id: "closedlost",
            label: "Closed Lost",
            displayOrder: 5,
            probability: 0.0,
            closed: true,
            won: false
          }
        ],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ]
  };
}

/**
 * GET /crm/v3/properties/contacts
 * Simulates HubSpot Properties API for contacts
 */
export function getMockContactProperties() {
  return {
    results: [
      {
        name: "firstname",
        label: "First Name",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation"
      },
      {
        name: "lastname",
        label: "Last Name",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation"
      },
      {
        name: "email",
        label: "Email",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation"
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation"
      },
      {
        name: "company",
        label: "Company Name",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation"
      },
      {
        name: "whatsapp_cadence_active",
        label: "WhatsApp Cadence Active",
        type: "bool",
        fieldType: "booleancheckbox",
        groupName: "dealinformation"
      },
      {
        name: "last_meeting_date",
        label: "Last Meeting Date",
        type: "datetime",
        fieldType: "date",
        groupName: "dealinformation"
      }
    ]
  };
}

/**
 * Utility function to generate realistic timestamps
 */
export function generateRealisticTimestamp(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

/**
 * Utility function to simulate API response delays
 */
export function simulateApiDelay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Error simulation for testing error handling
 */
export function simulateApiError(errorType: 'network' | 'auth' | 'rate_limit' | 'server') {
  const errors = {
    network: { status: 0, message: 'Network error' },
    auth: { status: 401, message: 'Unauthorized' },
    rate_limit: { status: 429, message: 'Rate limit exceeded' },
    server: { status: 500, message: 'Internal server error' }
  };
  
  throw new Error(JSON.stringify(errors[errorType]));
}