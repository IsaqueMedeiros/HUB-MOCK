import { NextRequest, NextResponse } from 'next/server';
import { 
  getMockDealWithContact, 
  getAllMockDealsWithContacts,
  searchMockDeals,
  simulateApiDelay 
} from '@/data/mockData';
import { 
  calculateJourneyPosition, 
  calculateHealthScore,
  validateHubSpotData 
} from '@/lib/journeyEngine';
import { JourneyApiResponse, ClientJourneyData } from '@/types/hubspot';

/**
 * GET /api/journey/[id]
 * Returns journey position for a specific deal ID
 * 
 * This endpoint faithfully simulates real HubSpot API integration by:
 * 1. Validating input parameters
 * 2. Fetching deal data with associated contact (simulates HubSpot associations)
 * 3. Applying business rules to determine journey position
 * 4. Calculating health score and risk factors
 * 5. Returning structured JSON response matching HubSpot API patterns
 * 
 * Real implementation would use:
 * const deal = await hubspotClient.crm.deals.basicApi.getById(
 *   dealId, 
 *   ['dealname', 'amount', 'dealstage', 'proposal_sent', 'first_deposit_date', 'allocation_done'],
 *   undefined,
 *   ['contacts']
 * );
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<JourneyApiResponse>> {
  try {
    // Simulate API response time
    await simulateApiDelay(150);
    
    const dealId = params.id;
    
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

    // Simulate HubSpot API call with associations
    // In real implementation:
    // const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, properties, undefined, ['contacts']);
    // const contactId = deal.associations.contacts.results[0].id;
    // const contact = await hubspotClient.crm.contacts.basicApi.getById(contactId, contactProperties);
    
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
    
    // Get owner name (in real implementation, this would be another API call)
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
 * GET /api/journey (without ID) - Returns all clients with their journey positions
 * Supports query parameters for filtering and pagination
 * 
 * Query Parameters:
 * - stage: Filter by journey stage (prospeccao, onboarding, relacionamento)
 * - priority: Filter by priority (high, medium, low)
 * - health_score_min: Filter by minimum health score
 * - health_score_max: Filter by maximum health score
 * - limit: Number of results to return (default: 50, max: 100)
 * - offset: Number of results to skip for pagination
 * - sort: Sort field (created_date, amount, health_score, stage)
 * - order: Sort order (asc, desc)
 */
export async function GET_ALL(request: NextRequest): Promise<NextResponse<JourneyApiResponse>> {
  try {
    // Simulate API response time for bulk operations
    await simulateApiDelay(300);
    
    const { searchParams } = new URL(request.url);
    
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
    
    // This would typically require pagination in a real HubSpot integration
    // Real implementation would use HubSpot's search API:
    // const searchRequest = {
    //   filterGroups: [
    //     {
    //       filters: [
    //         {
    //           propertyName: 'dealstage',
    //           operator: 'IN',
    //           value: ['appointmentscheduled', 'presentationscheduled', 'contractsent', 'closedwon']
    //         }
    //       ]
    //     }
    //   ],
    //   sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
    //   properties: ['dealname', 'amount', 'dealstage', 'proposal_sent', 'first_deposit_date'],
    //   limit: 100
    // };
    // const deals = await hubspotClient.crm.deals.searchApi.doSearch(searchRequest);
    
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
    
  } catch (error) {
    console.error('Journey API Error:', error);
    return NextResponse.json({
      success: false,
      data: [],
      timestamp: new Date().toISOString(),
      errors: [{
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing the bulk request',
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }]
    }, { status: 500 });
  }
}

/**
 * POST /api/journey/[id]/update
 * Updates journey position manually (for testing and manual overrides)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const dealId = params.id;
    const body = await request.json();
    
    // Validate request body
    const { stage, subStage, notes } = body;
    
    if (!stage || !subStage) {
      return NextResponse.json({
        success: false,
        message: 'Stage and subStage are required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // In real implementation, this would update HubSpot custom properties
    // await hubspotClient.crm.deals.basicApi.update(dealId, {
    //   properties: {
    //     journey_stage: stage,
    //     journey_substage: subStage,
    //     journey_updated_manually: 'true',
    //     journey_manual_notes: notes
    //   }
    // });
    
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
 * In real implementation, this would call HubSpot Owners API
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

/**
 * GET /api/journey/analytics
 * Returns analytics and insights about the journey data
 */
export async function GET_ANALYTICS(request: NextRequest): Promise<NextResponse> {
  try {
    await simulateApiDelay(400);
    
    const allDealsWithContacts = getAllMockDealsWithContacts();
    
    // Process all journey data for analytics
    const allJourneyData = allDealsWithContacts.map(({ deal, contact }) => {
      const journeyPosition = calculateJourneyPosition(deal, contact);
      const healthScore = calculateHealthScore(deal, contact, journeyPosition);
      
      return {
        contactId: contact.id,
        dealId: deal.id,
        contact,
        deal,
        journeyPosition,
        healthScore,
        lastActivity: deal.properties.hs_lastmodifieddate
      } as ClientJourneyData;
    });

    // Calculate analytics
    const analytics = {
      summary: {
        totalClients: allJourneyData.length,
        totalPipelineValue: allJourneyData.reduce((sum, client) => 
          sum + parseFloat(client.deal.properties.amount || '0'), 0
        ),
        averageHealthScore: Math.round(
          allJourneyData.reduce((sum, client) => sum + client.healthScore, 0) / allJourneyData.length
        ),
        averageDealSize: Math.round(
          allJourneyData.reduce((sum, client) => 
            sum + parseFloat(client.deal.properties.amount || '0'), 0
          ) / allJourneyData.length
        )
      },
      
      stageDistribution: {
        prospeccao: {
          count: allJourneyData.filter(c => c.journeyPosition.stage === 'prospeccao').length,
          value: allJourneyData
            .filter(c => c.journeyPosition.stage === 'prospeccao')
            .reduce((sum, c) => sum + parseFloat(c.deal.properties.amount || '0'), 0),
          averageHealthScore: Math.round(
            allJourneyData
              .filter(c => c.journeyPosition.stage === 'prospeccao')
              .reduce((sum, c) => sum + c.healthScore, 0) /
            Math.max(allJourneyData.filter(c => c.journeyPosition.stage === 'prospeccao').length, 1)
          )
        },
        onboarding: {
          count: allJourneyData.filter(c => c.journeyPosition.stage === 'onboarding').length,
          value: allJourneyData
            .filter(c => c.journeyPosition.stage === 'onboarding')
            .reduce((sum, c) => sum + parseFloat(c.deal.properties.amount || '0'), 0),
          averageHealthScore: Math.round(
            allJourneyData
              .filter(c => c.journeyPosition.stage === 'onboarding')
              .reduce((sum, c) => sum + c.healthScore, 0) /
            Math.max(allJourneyData.filter(c => c.journeyPosition.stage === 'onboarding').length, 1)
          )
        },
        relacionamento: {
          count: allJourneyData.filter(c => c.journeyPosition.stage === 'relacionamento').length,
          value: allJourneyData
            .filter(c => c.journeyPosition.stage === 'relacionamento')
            .reduce((sum, c) => sum + parseFloat(c.deal.properties.amount || '0'), 0),
          averageHealthScore: Math.round(
            allJourneyData
              .filter(c => c.journeyPosition.stage === 'relacionamento')
              .reduce((sum, c) => sum + c.healthScore, 0) /
            Math.max(allJourneyData.filter(c => c.journeyPosition.stage === 'relacionamento').length, 1)
          )
        }
      },
      
      priorityDistribution: {
        high: allJourneyData.filter(c => c.journeyPosition.priority === 'high').length,
        medium: allJourneyData.filter(c => c.journeyPosition.priority === 'medium').length,
        low: allJourneyData.filter(c => c.journeyPosition.priority === 'low').length
      },
      
      healthScoreDistribution: {
        excellent: allJourneyData.filter(c => c.healthScore >= 90).length,
        good: allJourneyData.filter(c => c.healthScore >= 70 && c.healthScore < 90).length,
        attention: allJourneyData.filter(c => c.healthScore >= 50 && c.healthScore < 70).length,
        critical: allJourneyData.filter(c => c.healthScore < 50).length
      },
      
      riskFactors: {
        totalClientsWithRisk: allJourneyData.filter(c => c.journeyPosition.metadata.riskFactors.length > 0).length,
        commonRisks: getTopRiskFactors(allJourneyData),
        highRiskClients: allJourneyData
          .filter(c => c.journeyPosition.metadata.riskFactors.length > 1 || c.healthScore < 50)
          .map(c => ({
            dealId: c.dealId,
            clientName: `${c.contact.properties.firstname} ${c.contact.properties.lastname}`,
            company: c.contact.properties.company,
            healthScore: c.healthScore,
            riskFactors: c.journeyPosition.metadata.riskFactors,
            stage: c.journeyPosition.stage
          }))
      },
      
      conversion: {
        prospeccaoToOnboarding: calculateConversionRate(allJourneyData, 'prospeccao', 'onboarding'),
        onboardingToRelacionamento: calculateConversionRate(allJourneyData, 'onboarding', 'relacionamento'),
        overallConversionRate: calculateOverallConversionRate(allJourneyData)
      },
      
      timeInStage: {
        prospeccao: calculateAverageTimeInStage(allJourneyData, 'prospeccao'),
        onboarding: calculateAverageTimeInStage(allJourneyData, 'onboarding'),
        relacionamento: calculateAverageTimeInStage(allJourneyData, 'relacionamento')
      }
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
      meta: {
        generatedAt: new Date().toISOString(),
        dataPoints: allJourneyData.length,
        analysisVersion: '1.0'
      }
    });
    
  } catch (error) {
    console.error('Journey Analytics Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate analytics',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Helper function to get top risk factors
 */
function getTopRiskFactors(journeyData: ClientJourneyData[]): Array<{ risk: string; count: number }> {
  const riskCounts: Record<string, number> = {};
  
  journeyData.forEach(client => {
    client.journeyPosition.metadata.riskFactors.forEach(risk => {
      riskCounts[risk] = (riskCounts[risk] || 0) + 1;
    });
  });
  
  return Object.entries(riskCounts)
    .map(([risk, count]) => ({ risk, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * Helper function to calculate conversion rate between stages
 */
function calculateConversionRate(
  journeyData: ClientJourneyData[], 
  fromStage: string, 
  toStage: string
): number {
  const fromCount = journeyData.filter(c => c.journeyPosition.stage === fromStage).length;
  const toCount = journeyData.filter(c => c.journeyPosition.stage === toStage).length;
  
  if (fromCount === 0) return 0;
  return Math.round((toCount / (fromCount + toCount)) * 100);
}

/**
 * Helper function to calculate overall conversion rate
 */
function calculateOverallConversionRate(journeyData: ClientJourneyData[]): number {
  const totalClients = journeyData.length;
  const convertedClients = journeyData.filter(c => 
    c.journeyPosition.stage === 'relacionamento' ||
    c.deal.properties.dealstage === 'closedwon'
  ).length;
  
  if (totalClients === 0) return 0;
  return Math.round((convertedClients / totalClients) * 100);
}

/**
 * Helper function to calculate average time in stage
 */
function calculateAverageTimeInStage(journeyData: ClientJourneyData[], stage: string): number {
  const stageClients = journeyData.filter(c => c.journeyPosition.stage === stage);
  
  if (stageClients.length === 0) return 0;
  
  const totalDays = stageClients.reduce((sum, client) => 
    sum + client.journeyPosition.daysInCurrentStage, 0
  );
  
  return Math.round(totalDays / stageClients.length);
}

/**
 * GET /api/journey/health-check
 * Returns API health status and system metrics
 */
export async function GET_HEALTH_CHECK(): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Simulate some health checks
    await simulateApiDelay(50);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
      dependencies: {
        hubspot: {
          status: 'connected',
          lastCheck: new Date().toISOString(),
          responseTime: 120
        },
        database: {
          status: 'connected',
          lastCheck: new Date().toISOString(),
          responseTime: 15
        }
      },
      metrics: {
        totalRequests: 1000,
        successRate: 99.5,
        averageResponseTime: 150,
        errorRate: 0.5
      }
    };
    
    return NextResponse.json(healthStatus);
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
}