import { NextRequest, NextResponse } from 'next/server';
import { 
  getMockDealWithContact, 
  getAllMockDealsWithContacts,
  simulateApiDelay 
} from '@/data/mockData';
import { 
  calculateJourneyPosition, 
  calculateHealthScore,
  validateHubSpotData 
} from '@/lib/journeyEngine';
import { JourneyApiResponse, ClientJourneyData } from '@/types/hubspot';

/**
 * GET /api/journey
 * Returns all clients with their journey positions or a specific client by dealId query param
 * 
 * Query Parameters:
 * - dealId: Get specific client by deal ID
 * - stage: Filter by journey stage (prospeccao, onboarding, relacionamento)
 * - priority: Filter by priority (high, medium, low)
 * - health_score_min: Filter by minimum health score
 * - health_score_max: Filter by maximum health score
 * - limit: Number of results to return (default: 50, max: 100)
 * - offset: Number of results to skip for pagination
 * - sort: Sort field (created_date, amount, health_score, stage)
 * - order: Sort order (asc, desc)
 */
export async function GET(request: NextRequest): Promise<NextResponse<JourneyApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('dealId');
    
    // If dealId is provided, return single client
    if (dealId) {
      return getSingleClient(dealId);
    }
    
    // Otherwise return all clients with filters
    return getAllClients(searchParams);
    
  } catch (error) {
    console.error('Journey API Error:', error);
    
    return NextResponse.json({
      success: false,
      data: {} as ClientJourneyData,
      timestamp: new Date().toISOString(),
      errors: [{
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing the request',
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }]
    }, { status: 500 });
  }
}

/**
 * Get single client by deal ID
 */
async function getSingleClient(dealId: string): Promise<NextResponse<JourneyApiResponse>> {
  // Simulate API response time
  await simulateApiDelay(150);
  
  // Validate input
  if (!dealId || dealId.trim() === '') {
    return NextResponse.json({
      success: false,
      data: {} as ClientJourneyData,
      timestamp: new Date().toISOString(),
      errors: [{
        code: 'INVALID_DEAL_ID',
        message: 'Deal ID is required and must be a valid string',
        details: { providedId: dealId }
      }]
    }, { status: 400 });
  }

  const result = getMockDealWithContact(dealId);
  
  if (!result) {
    return NextResponse.json({
      success: false,
      data: {} as ClientJourneyData,
      timestamp: new Date().toISOString(),
      errors: [{
        code: 'DEAL_NOT_FOUND',
        message: `Deal with ID ${dealId} not found`,
        details: { dealId }
      }]
    }, { status: 404 });
  }

  const { deal, contact } = result;
  
  // Validate HubSpot data integrity
  const validation = validateHubSpotData(deal, contact);
  if (!validation.isValid) {
    return NextResponse.json({
      success: false,
      data: {} as ClientJourneyData,
      timestamp: new Date().toISOString(),
      errors: validation.errors.map(error => ({
        code: 'DATA_VALIDATION_ERROR',
        message: error,
        details: { dealId, contactId: contact.id }
      }))
    }, { status: 422 });
  }
  
  // Apply business rules to determine journey position
  const journeyPosition = calculateJourneyPosition(deal, contact);
  
  // Calculate health score
  const healthScore = calculateHealthScore(deal, contact, journeyPosition);
  
  // Get owner name
  const ownerName = getOwnerName(deal.properties.hubspot_owner_id);
  
  const responseData: ClientJourneyData = {
    contactId: contact.id,
    dealId: deal.id,
    contact,
    deal,
    journeyPosition,
    healthScore,
    lastActivity: deal.properties.hs_lastmodifieddate,
    ownerName
  };

  const response: JourneyApiResponse = {
    success: true,
    data: responseData,
    timestamp: new Date().toISOString()
  };

  // Add warnings if any
  if (validation.warnings.length > 0) {
    response.errors = validation.warnings.map(warning => ({
      code: 'DATA_WARNING',
      message: warning,
      details: { severity: 'warning' }
    }));
  }

  return NextResponse.json(response);
}

/**
 * Get all clients with filtering and pagination
 */
async function getAllClients(searchParams: URLSearchParams): Promise<NextResponse<JourneyApiResponse>> {
  // Simulate API response time for bulk operations
  await simulateApiDelay(300);
  
  // Parse query parameters
  const filters = {
    stage: searchParams.get('stage'),
    priority: searchParams.get('priority'),
    healthScoreMin: searchParams.get('health_score_min') ? parseInt(searchParams.get('health_score_min')!) : undefined,
    healthScoreMax: searchParams.get('health_score_max') ? parseInt(searchParams.get('health_score_max')!) : undefined,
    limit: Math.min(parseInt(searchParams.get('limit') || '50'), 100),
    offset: parseInt(searchParams.get('offset') || '0'),
    sort: searchParams.get('sort') || 'created_date',
    order: searchParams.get('order') || 'desc'
  };
  
  const allDealsWithContacts = getAllMockDealsWithContacts();
  
  // Process all journey data
  let allJourneyData = allDealsWithContacts.map(({ deal, contact }) => {
    const journeyPosition = calculateJourneyPosition(deal, contact);
    const healthScore = calculateHealthScore(deal, contact, journeyPosition);
    const ownerName = getOwnerName(deal.properties.hubspot_owner_id);
    
    return {
      contactId: contact.id,
      dealId: deal.id,
      contact,
      deal,
      journeyPosition,
      healthScore,
      lastActivity: deal.properties.hs_lastmodifieddate,
      ownerName
    } as ClientJourneyData;
  });

  // Apply filters
  if (filters.stage) {
    allJourneyData = allJourneyData.filter(client => 
      client.journeyPosition.stage === filters.stage
    );
  }
  
  if (filters.priority) {
    allJourneyData = allJourneyData.filter(client => 
      client.journeyPosition.priority === filters.priority
    );
  }
  
  if (filters.healthScoreMin !== undefined) {
    allJourneyData = allJourneyData.filter(client => 
      client.healthScore >= filters.healthScoreMin!
    );
  }
  
  if (filters.healthScoreMax !== undefined) {
    allJourneyData = allJourneyData.filter(client => 
      client.healthScore <= filters.healthScoreMax!
    );
  }

  // Apply sorting
  allJourneyData.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (filters.sort) {
      case 'amount':
        aValue = parseFloat(a.deal.properties.amount || '0');
        bValue = parseFloat(b.deal.properties.amount || '0');
        break;
      case 'health_score':
        aValue = a.healthScore;
        bValue = b.healthScore;
        break;
      case 'stage':
        aValue = a.journeyPosition.stage;
        bValue = b.journeyPosition.stage;
        break;
      case 'created_date':
      default:
        aValue = new Date(a.deal.createdAt).getTime();
        bValue = new Date(b.deal.createdAt).getTime();
        break;
    }
    
    if (filters.order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Apply pagination
  const total = allJourneyData.length;
  const paginatedData = allJourneyData.slice(filters.offset, filters.offset + filters.limit);

  const response: JourneyApiResponse = {
    success: true,
    data: paginatedData,
    timestamp: new Date().toISOString(),
    meta: {
      total,
      page: Math.floor(filters.offset / filters.limit) + 1,
      limit: filters.limit
    }
  };

  return NextResponse.json(response);
}

/**
 * POST /api/journey
 * Updates journey position manually (for testing and manual overrides)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { dealId, stage, subStage, notes } = body;
    
    // Validate request body
    if (!dealId || !stage || !subStage) {
      return NextResponse.json({
        success: false,
        message: 'dealId, stage and subStage are required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // Simulate the update
    await simulateApiDelay(200);
    
    return NextResponse.json({
      success: true,
      message: 'Journey position updated successfully',
      data: {
        dealId,
        newStage: stage,
        newSubStage: subStage,
        updatedAt: new Date().toISOString(),
        notes
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Journey Update Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update journey position',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Helper function to get owner name by ID
 */
function getOwnerName(ownerId?: string): string {
  const owners: Record<string, string> = {
    '12345': 'João Assessor',
    '12346': 'Maria Assessora',
    '12347': 'Carlos Assessor',
    '12348': 'Ana Assessora',
    '12349': 'Pedro Assessor',
    '12350': 'Lucia Assessora',
    '12351': 'Roberto Assessor'
  };
  
  return owners[ownerId || ''] || 'Assessor Não Definido';
}