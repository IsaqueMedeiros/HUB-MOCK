'use client';

import React, { useState, useEffect } from 'react';
import { ClientJourneyData, JourneyStage } from '@/types/hubspot';
import { 
  getStageDisplayName, 
  getSubStageDisplayName, 
  getStageColor, 
  getStageProgress 
} from '@/lib/journeyEngine';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Briefcase,
  MessageSquare
} from 'lucide-react';

interface JourneyBoardProps {
  selectedDealId?: string;
}

interface StageColumn {
  stage: JourneyStage;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  clients: ClientJourneyData[];
}

// Helper functions moved outside component to be accessible by child components
const formatCurrency = (amount: string) => {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export default function JourneyBoard({ selectedDealId }: JourneyBoardProps) {
  const [journeyData, setJourneyData] = useState<ClientJourneyData[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientJourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJourneyData();
  }, []);

  useEffect(() => {
    if (selectedDealId && journeyData.length > 0) {
      const client = journeyData.find(data => data.dealId === selectedDealId);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [selectedDealId, journeyData]);

  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real implementation, this would fetch from /api/journey
      const { getAllMockDealsWithContacts } = await import('@/data/mockData');
      const { calculateJourneyPosition } = await import('@/lib/journeyEngine');
      
      const allData = getAllMockDealsWithContacts();
      const processedData = allData.map(({ deal, contact }) => ({
        contactId: contact.id,
        dealId: deal.id,
        contact,
        deal,
        journeyPosition: calculateJourneyPosition(deal, contact)
      }));
      
      setJourneyData(processedData);
    } catch (err) {
      setError('Erro ao carregar dados da jornada');
      console.error('Error fetching journey data:', err);
    } finally {
      setLoading(false);
    }
  };

  const organizeDataByStage = (): StageColumn[] => {
    const stages: StageColumn[] = [
      {
        stage: 'prospeccao',
        title: 'Prospecção',
        description: 'Clientes em processo de apresentação e proposta',
        color: 'bg-blue-500',
        icon: <Target className="h-6 w-6" />,
        clients: []
      },
      {
        stage: 'onboarding',
        title: 'Onboarding',
        description: 'Clientes com contrato enviado ou fechado',
        color: 'bg-amber-500',
        icon: <Briefcase className="h-6 w-6" />,
        clients: []
      },
      {
        stage: 'relacionamento',
        title: 'Relacionamento',
        description: 'Clientes ativos com cadência de contato',
        color: 'bg-emerald-500',
        icon: <Users className="h-6 w-6" />,
        clients: []
      }
    ];

    // Organize clients by stage
    journeyData.forEach(client => {
      const stageColumn = stages.find(s => s.stage === client.journeyPosition.stage);
      if (stageColumn) {
        stageColumn.clients.push(client);
      }
    });

    return stages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-journey-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-hubspot-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando jornada dos clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-journey-bg">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">⚠️ {error}</p>
          <button 
            onClick={fetchJourneyData}
            className="px-4 py-2 bg-hubspot-500 text-white rounded hover:bg-hubspot-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const stageColumns = organizeDataByStage();
  const totalClients = journeyData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-journey-bg to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-journey-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-hubspot-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Journey Board</h1>
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                Powered by HubSpot CRM
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{totalClients}</span> clientes ativos
              </div>
              <button 
                onClick={fetchJourneyData}
                className="px-3 py-1 text-sm bg-hubspot-500 text-white rounded hover:bg-hubspot-600 transition-colors"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stageColumns.map((column) => (
            <div key={column.stage} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Column Header */}
              <div className={`${column.color} px-6 py-4 text-white`}>
                <div className="flex items-center space-x-3">
                  {column.icon}
                  <div>
                    <h3 className="text-lg font-semibold">{column.title}</h3>
                    <p className="text-sm opacity-90">{column.description}</p>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-2xl font-bold">{column.clients.length}</span>
                  <span className="text-sm opacity-90 ml-1">clientes</span>
                </div>
              </div>

              {/* Client Cards */}
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {column.clients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📋</div>
                    <p>Nenhum cliente nesta etapa</p>
                  </div>
                ) : (
                  column.clients.map((client) => (
                    <ClientCard
                      key={client.dealId}
                      client={client}
                      isSelected={selectedClient?.dealId === client.dealId}
                      onClick={() => setSelectedClient(client)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <ClientDetailModal 
            client={selectedClient} 
            onClose={() => setSelectedClient(null)} 
          />
        )}
      </div>
    </div>
  );
}

// Client Card Component
interface ClientCardProps {
  client: ClientJourneyData;
  isSelected: boolean;
  onClick: () => void;
}

function ClientCard({ client, isSelected, onClick }: ClientCardProps) {
  const progress = getStageProgress(client.journeyPosition.stage, client.journeyPosition.subStage);
  const stageColor = getStageColor(client.journeyPosition.stage);
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-hubspot-500 bg-hubspot-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Client Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {client.contact.properties.firstname} {client.contact.properties.lastname}
            </h4>
            <p className="text-sm text-gray-600">{client.contact.properties.company}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-green-600">
            {client.deal.properties.amount ? 
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(parseFloat(client.deal.properties.amount)) 
              : 'N/A'
            }
          </div>
        </div>
      </div>

      {/* Sub-stage */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">
            {getSubStageDisplayName(client.journeyPosition.subStage)}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(client.journeyPosition.confidence * 100)}% confiança
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${stageColor.replace('bg-', 'bg-').replace('-500', '-400')}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick Info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>Atualizado {formatDate(client.journeyPosition.lastUpdated)}</span>
        </div>
        <div className="flex items-center space-x-1">
          {client.journeyPosition.metadata?.whatsappCadenceActive ? (
            <MessageSquare className="h-3 w-3 text-green-500" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
        </div>
      </div>
    </div>
  );
}

// Client Detail Modal
interface ClientDetailModalProps {
  client: ClientJourneyData;
  onClose: () => void;
}

function ClientDetailModal({ client, onClose }: ClientDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {client.contact.properties.firstname} {client.contact.properties.lastname}
            </h2>
            <p className="text-sm text-gray-600">{client.contact.properties.company}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Journey Position */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Posição na Jornada</h3>
            <div className={`p-4 rounded-lg ${getStageColor(client.journeyPosition.stage)} bg-opacity-10 border border-opacity-20`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {getStageDisplayName(client.journeyPosition.stage)}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(client.journeyPosition.confidence * 100)}% confiança
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                Sub-etapa: {getSubStageDisplayName(client.journeyPosition.subStage)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getStageColor(client.journeyPosition.stage)}`}
                  style={{ 
                    width: `${getStageProgress(client.journeyPosition.stage, client.journeyPosition.subStage)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Informações de Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{client.contact.properties.email}</span>
                </div>
                {client.contact.properties.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{client.contact.properties.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{client.contact.properties.company}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Deal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {client.deal.properties.amount ? formatCurrency(client.deal.properties.amount) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700 capitalize">
                    {client.deal.properties.dealstage.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                {client.deal.properties.closedate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Fechamento: {formatDate(client.deal.properties.closedate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          {client.journeyPosition.metadata && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Detalhes da Jornada</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Proposta Enviada:</span>
                    <span className="ml-2 text-gray-600">
                      {client.journeyPosition.metadata.proposalSent ? '✅ Sim' : '❌ Não'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cadência WhatsApp:</span>
                    <span className="ml-2 text-gray-600">
                      {client.journeyPosition.metadata.whatsappCadenceActive ? '✅ Ativa' : '❌ Inativa'}
                    </span>
                  </div>
                  {client.journeyPosition.metadata.firstDepositDate && (
                    <div>
                      <span className="font-medium text-gray-700">Primeiro Depósito:</span>
                      <span className="ml-2 text-gray-600">
                        {formatDate(client.journeyPosition.metadata.firstDepositDate)}
                      </span>
                    </div>
                  )}
                  {client.journeyPosition.metadata.lastMeetingDate && (
                    <div>
                      <span className="font-medium text-gray-700">Última Reunião:</span>
                      <span className="ml-2 text-gray-600">
                        {formatDate(client.journeyPosition.metadata.lastMeetingDate)}
                        {client.journeyPosition.metadata.daysSinceLastMeeting && 
                          ` (${client.journeyPosition.metadata.daysSinceLastMeeting} dias atrás)`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}