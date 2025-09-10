import { HubSpotContact, HubSpotDeal, HubSpotApiResponse } from '@/types/hubspot';

/**
 * Mock data that faithfully follows HubSpot API structure
 * Based on official HubSpot API documentation:
 * - Contacts: https://developers.hubspot.com/docs/api/crm/contacts
 * - Deals: https://developers.hubspot.com/docs/api/crm/deals
 */

// Mock Contacts Data
export const mockContacts: HubSpotContact[] = [
  {
    id: "51",
    properties: {
      firstname: "Maria",
      lastname: "Silva",
      email: "maria.silva@email.com",
      phone: "+55 11 99999-1111",
      company: "Silva Investimentos",
      createdate: "2024-01-15T10:30:00.000Z",
      lastmodifieddate: "2024-11-08T14:22:00.000Z",
      hs_lead_status: "CONNECTED",
      lifecyclestage: "opportunity",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-10-25T15:00:00.000Z"
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
      email: "joao.santos@empresa.com.br",
      phone: "+55 21 98888-2222",
      company: "Santos & Associados",
      createdate: "2024-02-20T09:15:00.000Z",
      lastmodifieddate: "2024-11-09T11:45:00.000Z",
      hs_lead_status: "OPEN_DEAL",
      lifecyclestage: "customer",
      whatsapp_cadence_active: "false",
      last_meeting_date: "2024-09-15T16:30:00.000Z"
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
      email: "ana.costa@startup.io",
      phone: "+55 11 97777-3333",
      company: "TechCorp Startup",
      createdate: "2024-03-10T14:20:00.000Z",
      lastmodifieddate: "2024-11-10T08:15:00.000Z",
      hs_lead_status: "IN_PROGRESS",
      lifecyclestage: "salesqualifiedlead",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-11-05T10:00:00.000Z"
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
      email: "carlos.oliveira@corporativo.com",
      phone: "+55 11 96666-4444",
      company: "Oliveira Holdings",
      createdate: "2024-04-05T16:45:00.000Z",
      lastmodifieddate: "2024-11-08T12:30:00.000Z",
      hs_lead_status: "OPEN_DEAL",
      lifecyclestage: "opportunity",
      whatsapp_cadence_active: "false",
      last_meeting_date: "2024-08-20T14:00:00.000Z"
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
      email: "patricia.lima@consultoria.com.br",
      phone: "+55 21 95555-5555",
      company: "Lima Consultoria",
      createdate: "2024-05-12T11:00:00.000Z",
      lastmodifieddate: "2024-11-09T17:20:00.000Z",
      hs_lead_status: "CONNECTED",
      lifecyclestage: "customer",
      whatsapp_cadence_active: "true",
      last_meeting_date: "2024-11-01T09:30:00.000Z"
    },
    createdAt: "2024-05-12T11:00:00.000Z",
    updatedAt: "2024-11-09T17:20:00.000Z",
    archived: false
  }
];

// Mock Deals Data
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
      dealtype: "existingbusiness",
      description: "Cliente interessada em portfolio conservador com foco em renda fixa",
      proposal_sent: "true",
      first_deposit_date: "2024-10-20T00:00:00.000Z",
      allocation_done: "true"
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
      dealtype: "newbusiness",
      description: "Cliente empresário busca diversificação de investimentos",
      proposal_sent: "true",
      first_deposit_date: "2024-11-05T00:00:00.000Z",
      allocation_done: "false"
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
      dealtype: "newbusiness",
      description: "Fundadora de startup tech interessada em investimentos para pessoa física",
      proposal_sent: "true"
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
      dealtype: "existingbusiness",
      description: "Cliente de alto patrimônio buscando gestão profissional",
      proposal_sent: "false"
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
      dealtype: "newbusiness",
      description: "Consultora independente busca assessoria para investimentos pessoais",
      proposal_sent: "true",
      first_deposit_date: "2024-11-03T00:00:00.000Z",
      allocation_done: "true"
    },
    createdAt: "2024-05-12T11:00:00.000Z",
    updatedAt: "2024-11-09T17:20:00.000Z",
    archived: false,
    associations: {
      contacts: {
        results: [{ id: "55", type: "deal_to_contact" }]
      }
    }
  }
];

/**
 * Mock API response structure matching HubSpot API
 */
export const mockContactsApiResponse: HubSpotApiResponse<HubSpotContact> = {
  results: mockContacts,
  paging: {
    next: {
      after: "55",
      link: "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&after=55"
    }
  }
};

export const mockDealsApiResponse: HubSpotApiResponse<HubSpotDeal> = {
  results: mockDeals,
  paging: {
    next: {
      after: "405",
      link: "https://api.hubapi.com/crm/v3/objects/deals?limit=10&after=405"
    }
  }
};

/**
 * Helper function to get contact by ID (simulates HubSpot API call)
 */
export function getMockContactById(id: string): HubSpotContact | undefined {
  return mockContacts.find(contact => contact.id === id);
}

/**
 * Helper function to get deal by ID (simulates HubSpot API call)
 */
export function getMockDealById(id: string): HubSpotDeal | undefined {
  return mockDeals.find(deal => deal.id === id);
}

/**
 * Helper function to get deal with associated contact (simulates HubSpot API call with associations)
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
 * Get all deals with their associated contacts
 */
export function getAllMockDealsWithContacts(): Array<{ deal: HubSpotDeal; contact: HubSpotContact }> {
  return mockDeals.map(deal => {
    const result = getMockDealWithContact(deal.id);
    return result!;
  }).filter(Boolean);
}