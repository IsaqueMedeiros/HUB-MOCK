import { NextRequest, NextResponse } from 'next/server';
import { getMockDealWithContact } from '@/data/mockData';
import { calculateJourneyPosition } from '@/lib/journeyEngine';
import { JourneyApiResponse, ClientJourneyData } from '@/types/hubspot';

/**
 * GET /api/journey/[id]
 * Returns journey position for a specific deal ID
 * 
 * This endpoint simulates real HubSpot API integration by:
 * 1. Fetching deal data with associated contact
 * 2. Applying business rules to determine journey position
 * 3. Returning structured JSON response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<JourneyApiResponse>> {
  try {
    const dealId = params.id;
    
    if (!dealId) {
      return NextResponse.json({
        success: false,
        data: {} as ClientJourneyData,
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Simulate HubSpot API call - in real implementation, this would be:
    // const deal = await hubspotClient.crm.deals.basicApi.getById(dealId, undefined, undefined, ['contacts']);
    // const contact = await hubspotClient.crm.contacts.basicApi.getById(contactId);
    
    const result = getMockDealWithContact(dealId);
    
    if (!result) {
      return NextResponse.json({
        success: false,
        data: {} as ClientJourneyData,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    const { deal, contact } = result;
    
    // Apply business rules to determine journey position
    const journeyPosition = calculateJourneyPosition(deal, contact);
    
    const responseData: ClientJourneyData = {
      contactId: contact.id,
      dealId: deal.id,
      contact,
      deal,
      journeyPosition
    };

    const response: JourneyApiResponse = {
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Journey API Error:', error);
    
    return NextResponse.json({
      success: false,
      data: {} as ClientJourneyData,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * GET /api/journey (without ID) - Returns all clients with their journey positions
 */
export async function GET_ALL(): Promise<NextResponse> {
  try {
    // This would typically require pagination in a real HubSpot integration
    const { getAllMockDealsWithContacts } = await import('@/data/mockData');
    const allDealsWithContacts = getAllMockDealsWithContacts();
    
    const allJourneyData = allDealsWithContacts.map(({ deal, contact }) => {
      const journeyPosition = calculateJourneyPosition(deal, contact);
      
      return {
        contactId: contact.id,
        dealId: deal.id,
        contact,
        deal,
        journeyPosition
      } as ClientJourneyData;
    });

    return NextResponse.json({
      success: true,
      data: allJourneyData,
      timestamp: new Date().toISOString(),
      count: allJourneyData.length
    });
    
  } catch (error) {
    console.error('Journey API Error:', error);
    return NextResponse.json({
      success: false,
      data: [],
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}