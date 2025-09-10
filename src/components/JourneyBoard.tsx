'use client';

import React, { useState, useEffect } from 'react';
import { ClientJourneyData, JourneyStage } from '@/types/hubspot';
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
  MessageSquare,
  Filter,
  Search,
  MoreVertical,
  ArrowRight,
  AlertCircle,
  Star,
  Activity,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

interface JourneyBoardProps {
  selectedDealId?: string;
}

interface StageColumn {
  stage: JourneyStage;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  clients: ClientJourneyData[];
  targetCount?: number;
}

interface FilterState {
  search: string;
  stage?: JourneyStage;
  owner?: string;
  priority?: 'high' | 'medium' | 'low';
  healthScore?: 'excellent' | 'good' | 'attention' | 'critical';
}

// Dados mock para demonstração
const mockJourneyData: ClientJourneyData[] = [
  {
    contactId: "51",
    dealId: "401",
    contact: {
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
        lifecyclestage: "customer",
        whatsapp_cadence_active: "true",
        last_meeting_date: "2024-11-05T15:00:00.000Z",
        hs_object_id: "51",
        job_title: "CEO",
        city: "São Paulo",
        industry: "Financial Services"
      },
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-11-08T14:22:00.000Z",
      archived: false
    },
    deal: {
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
        description: "Cliente interessada em portfolio conservador",
        proposal_sent: "true",
        first_deposit_date: "2024-10-20T00:00:00.000Z",
        allocation_done: "true",
        hs_object_id: "401",
        investment_type: "conservative",
        portfolio_value: "150000"
      },
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-11-08T14:22:00.000Z",
      archived: false
    },
    journeyPosition: {
      stage: 'relacionamento',
      subStage: 'cadencia_ativa',
      confidence: 0.95,
      priority: 'high',
      lastUpdated: new Date().toISOString(),
      daysInCurrentStage: 25,
      metadata: {
        dealStage: "closedwon",
        dealPipeline: "default",
        dealAmount: 150000,
        proposalSent: true,
        firstDepositDate: "2024-10-20T00:00:00.000Z",
        allocationDone: true,
        whatsappCadenceActive: true,
        lastMeetingDate: "2024-11-05T15:00:00.000Z",
        daysSinceLastMeeting: 5,
        leadStatus: "CONNECTED",
        lifecycleStage: "customer",
        stageTransitions: [],
        riskFactors: [],
        nextActions: ["Agendar reunião de acompanhamento", "Revisar performance do portfolio"]
      }
    },
    healthScore: 92,
    lastActivity: "2024-11-08T14:22:00.000Z",
    ownerName: "João Assessor"
  },
  {
    contactId: "52",
    dealId: "402",
    contact: {
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
        lifecyclestage: "opportunity",
        whatsapp_cadence_active: "false",
        last_meeting_date: "2024-09-15T16:30:00.000Z",
        hs_object_id: "52",
        job_title: "Empresário",
        city: "Rio de Janeiro",
        industry: "Technology"
      },
      createdAt: "2024-02-20T09:15:00.000Z",
      updatedAt: "2024-11-09T11:45:00.000Z",
      archived: false
    },
    deal: {
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
        description: "Cliente empresário busca diversificação",
        proposal_sent: "true",
        first_deposit_date: "2024-11-05T00:00:00.000Z",
        allocation_done: "false",
        hs_object_id: "402",
        investment_type: "moderate",
        portfolio_value: "300000"
      },
      createdAt: "2024-02-20T09:15:00.000Z",
      updatedAt: "2024-11-09T11:45:00.000Z",
      archived: false
    },
    journeyPosition: {
      stage: 'onboarding',
      subStage: 'deposito_realizado',
      confidence: 0.9,
      priority: 'high',
      lastUpdated: new Date().toISOString(),
      daysInCurrentStage: 14,
      metadata: {
        dealStage: "contractsent",
        dealPipeline: "default",
        dealAmount: 300000,
        proposalSent: true,
        firstDepositDate: "2024-11-05T00:00:00.000Z",
        allocationDone: false,
        whatsappCadenceActive: false,
        lastMeetingDate: "2024-09-15T16:30:00.000Z",
        daysSinceLastMeeting: 55,
        leadStatus: "OPEN_DEAL",
        lifecycleStage: "opportunity",
        stageTransitions: [],
        riskFactors: ["Sem contato há mais de 30 dias"],
        nextActions: ["Completar alocação", "Agendar reunião de onboarding"]
      }
    },
    healthScore: 78,
    lastActivity: "2024-11-09T11:45:00.000Z",
    ownerName: "Maria Assessora"
  },
  {
    contactId: "53",
    dealId: "403",
    contact: {
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
        last_meeting_date: "2024-11-08T10:00:00.000Z",
        hs_object_id: "53",
        job_title: "CTO",
        city: "São Paulo",
        industry: "Technology"
      },
      createdAt: "2024-03-10T14:20:00.000Z",
      updatedAt: "2024-11-10T08:15:00.000Z",
      archived: false
    },
    deal: {
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
        description: "Fundadora de startup tech",
        proposal_sent: "true",
        hs_object_id: "403",
        investment_type: "aggressive",
        portfolio_value: "75000"
      },
      createdAt: "2024-03-10T14:20:00.000Z",
      updatedAt: "2024-11-10T08:15:00.000Z",
      archived: false
    },
    journeyPosition: {
      stage: 'prospeccao',
      subStage: 'proposta_enviada',
      confidence: 0.85,
      priority: 'medium',
      lastUpdated: new Date().toISOString(),
      daysInCurrentStage: 7,
      metadata: {
        dealStage: "presentationscheduled",
        dealPipeline: "default",
        dealAmount: 75000,
        proposalSent: true,
        allocationDone: false,
        whatsappCadenceActive: true,
        lastMeetingDate: "2024-11-08T10:00:00.000Z",
        daysSinceLastMeeting: 2,
        leadStatus: "IN_PROGRESS",
        lifecycleStage: "salesqualifiedlead",
        stageTransitions: [],
        riskFactors: [],
        nextActions: ["Acompanhar apresentação", "Validar interesse"]
      }
    },
    healthScore: 85,
    lastActivity: "2024-11-10T08:15:00.000Z",
    ownerName: "Carlos Assessor"
  }
];

export default function JourneyBoard({ selectedDealId }: JourneyBoardProps) {
  const [journeyData, setJourneyData] = useState<ClientJourneyData[]>(mockJourneyData);
  const [selectedClient, setSelectedClient] = useState<ClientJourneyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ search: '' });
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const organizeDataByStage = (): StageColumn[] => {
    const stages: StageColumn[] = [
      {
        stage: 'prospeccao',
        title: 'Prospecção',
        description: 'Clientes em processo de apresentação e proposta',
        color: 'text-blue-700',
        bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
        borderColor: 'border-blue-200',
        icon: <Target className="h-6 w-6" />,
        clients: [],
        targetCount: 15
      },
      {
        stage: 'onboarding',
        title: 'Onboarding',
        description: 'Clientes com contrato enviado ou fechado',
        color: 'text-amber-700',
        bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
        borderColor: 'border-amber-200',
        icon: <Briefcase className="h-6 w-6" />,
        clients: [],
        targetCount: 10
      },
      {
        stage: 'relacionamento',
        title: 'Relacionamento',
        description: 'Clientes ativos com cadência de contato',
        color: 'text-emerald-700',
        bgColor: 'bg-gradient-to-br from-emerald-500 to-green-500',
        borderColor: 'border-emerald-200',
        icon: <Users className="h-6 w-6" />,
        clients: [],
        targetCount: 25
      }
    ];

    // Filtrar e organizar clientes
    let filteredData = journeyData;
    
    if (filters.search) {
      filteredData = filteredData.filter(client => 
        client.contact.properties.firstname.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.contact.properties.lastname.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.contact.properties.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.deal.properties.dealname.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.stage) {
      filteredData = filteredData.filter(client => client.journeyPosition.stage === filters.stage);
    }

    if (filters.priority) {
      filteredData = filteredData.filter(client => client.journeyPosition.priority === filters.priority);
    }

    filteredData.forEach(client => {
      const stageColumn = stages.find(s => s.stage === client.journeyPosition.stage);
      if (stageColumn) {
        stageColumn.clients.push(client);
      }
    });

    return stages;
  };

  const stageColumns = organizeDataByStage();
  const totalClients = journeyData.length;
  const totalValue = journeyData.reduce((sum, client) => 
    sum + (parseFloat(client.deal.properties.amount || '0')), 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando jornada dos clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
    <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8">
      <div className="flex items-center justify-between h-14 sm:h-16">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Journey Board</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">CRM Analytics • HubSpot Integration</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Stats - Hidden on mobile, show on tablet+ */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm">
            <div className="text-center">
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalClients}</p>
              <p className="text-gray-500 text-xs lg:text-sm">Clientes</p>
            </div>
            <div className="text-center">
              <p className="text-xl lg:text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
              <p className="text-gray-500 text-xs lg:text-sm">Pipeline</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Exportar</span>
            </button>
            <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  {/* Filters */}
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
      <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <select
            value={filters.stage || ''}
            onChange={(e) => setFilters({ ...filters, stage: e.target.value as JourneyStage || undefined })}
            className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
          >
            <option value="">Todas as etapas</option>
            <option value="prospeccao">Prospecção</option>
            <option value="onboarding">Onboarding</option>
            <option value="relacionamento">Relacionamento</option>
          </select>
          
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value as any || undefined })}
            className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
          >
            <option value="">Todas prioridades</option>
            <option value="high">Alta prioridade</option>
            <option value="medium">Média prioridade</option>
            <option value="low">Baixa prioridade</option>
          </select>
          
          <button
            onClick={() => setViewMode(viewMode === 'board' ? 'list' : 'board')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0"
          >
            {viewMode === 'board' ? <Activity className="h-4 w-4" /> : <Target className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <main className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
    {viewMode === 'board' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {stageColumns.map((column) => (
          <StageColumn 
            key={column.stage}
            column={column}
            onClientSelect={setSelectedClient}
            selectedClientId={selectedClient?.dealId}
          />
        ))}
      </div>
    ) : (
      <ClientListView 
        clients={journeyData}
        onClientSelect={setSelectedClient}
        selectedClientId={selectedClient?.dealId}
      />
    )}
  </main>

  {/* Client Detail Modal */}
  {selectedClient && (
    <ClientDetailModal 
      client={selectedClient} 
      onClose={() => setSelectedClient(null)} 
    />
  )}
</div>

  );
}

// Stage Column Component
interface StageColumnProps {
  column: StageColumn;
  onClientSelect: (client: ClientJourneyData) => void;
  selectedClientId?: string;
}

function StageColumn({ column, onClientSelect, selectedClientId }: StageColumnProps) {
  const progressPercentage = column.targetCount ? (column.clients.length / column.targetCount) * 100 : 0;
  
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
  {/* Column Header */}
  <div className={`${column.bgColor} px-4 sm:px-6 py-4 sm:py-5 text-white relative overflow-hidden`}>
    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg flex-shrink-0">
            {column.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold truncate">{column.title}</h3>
            <p className="text-xs sm:text-sm opacity-90 truncate">{column.description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl sm:text-3xl font-bold">{column.clients.length}</span>
          {column.targetCount && (
            <span className="text-sm opacity-90 ml-2">/ {column.targetCount}</span>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs sm:text-sm opacity-90">Pipeline</div>
          <div className="text-sm sm:text-lg font-semibold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: 'compact'
            }).format(
              column.clients.reduce((sum, client) => 
                sum + parseFloat(client.deal.properties.amount || '0'), 0
              )
            )}
          </div>
        </div>
      </div>
      
      {column.targetCount && (
        <div className="mt-3">
          <div className="flex justify-between text-xs opacity-90 mb-1">
            <span>Progresso da meta</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Client Cards */}
  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-400px)] overflow-y-auto">
    {column.clients.length === 0 ? (
      <div className="text-center py-8 sm:py-12 text-gray-500">
        <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 opacity-50">📋</div>
        <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Nenhum cliente</p>
        <p className="text-sm">Nesta etapa da jornada</p>
      </div>
    ) : (
      column.clients.map((client) => (
        <ClientCard
          key={client.dealId}
          client={client}
          isSelected={selectedClientId === client.dealId}
          onClick={() => onClientSelect(client)}
        />
      ))
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
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
  onClick={onClick}
  className={`group p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
    isSelected 
      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
      : 'border-gray-200 bg-white hover:border-gray-300'
  }`}
>
  {/* Header */}
  <div className="flex items-start justify-between mb-2 sm:mb-3">
    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </div>
        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${getPriorityColor(client.journeyPosition.priority)}`}></div>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
          {client.contact.properties.firstname} {client.contact.properties.lastname}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 truncate">{client.contact.properties.company}</p>
      </div>
    </div>
    
    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
      <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getHealthScoreColor(client.healthScore)}`}>
        {client.healthScore}
      </div>
      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600" />
    </div>
  </div>

  {/* Deal Amount */}
  <div className="mb-2 sm:mb-3">
    <div className="text-base sm:text-lg font-bold text-green-600">
      {formatCurrency(client.deal.properties.amount || '0')}
    </div>
    <div className="text-xs text-gray-500 capitalize truncate">
      {client.deal.properties.dealtype?.replace(/([A-Z])/g, ' $1').trim()}
    </div>
  </div>

  {/* Journey Info */}
  <div className="space-y-2 mb-2 sm:mb-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-gray-700 truncate">
        {client.journeyPosition.subStage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
      <span className="text-xs text-gray-500 ml-2">
        {Math.round(client.journeyPosition.confidence * 100)}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div 
        className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${client.journeyPosition.confidence * 100}%` }}
      />
    </div>
  </div>

  {/* Footer */}
  <div className="flex items-center justify-between text-xs text-gray-500">
    <div className="flex items-center space-x-1 min-w-0">
      <Calendar className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">{formatDate(client.journeyPosition.lastUpdated)}</span>
    </div>
    <div className="flex items-center space-x-2 flex-shrink-0">
      {client.journeyPosition.metadata.whatsappCadenceActive && (
        <MessageSquare className="h-3 w-3 text-green-500" />
      )}
      {client.journeyPosition.metadata.riskFactors.length > 0 && (
        <AlertCircle className="h-3 w-3 text-red-500" />
      )}
      <div className="text-right">
        <div>{client.journeyPosition.daysInCurrentStage}d</div>
      </div>
    </div>
  </div>
</div>
  );
}

// Client List View Component
interface ClientListViewProps {
  clients: ClientJourneyData[];
  onClientSelect: (client: ClientJourneyData) => void;
  selectedClientId?: string;
}

function ClientListView({ clients, onClientSelect, selectedClientId }: ClientListViewProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStageColor = (stage: JourneyStage) => {
    switch (stage) {
      case 'prospeccao': return 'bg-blue-100 text-blue-800';
      case 'onboarding': return 'bg-amber-100 text-amber-800';
      case 'relacionamento': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Lista de Clientes</h2>
  </div>
  
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Etapa</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Saúde</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Assessor</th>
          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {clients.map((client) => (
          <tr 
            key={client.dealId}
            className={`hover:bg-gray-50 cursor-pointer ${
              selectedClientId === client.dealId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => onClientSelect(client)}
          >
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {client.contact.properties.firstname} {client.contact.properties.lastname}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">{client.contact.properties.company}</div>
                </div>
              </div>
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(client.journeyPosition.stage)}`}>
                {client.journeyPosition.stage.charAt(0).toUpperCase() + client.journeyPosition.stage.slice(1)}
              </span>
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-green-600">
              {formatCurrency(client.deal.properties.amount || '0')}
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthScoreColor(client.healthScore)}`}>
                {client.healthScore}
              </span>
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell truncate">
              {client.ownerName}
            </td>
            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}

// Client Detail Modal Component
interface ClientDetailModalProps {
  client: ClientJourneyData;
  onClose: () => void;
}

function ClientDetailModal({ client, onClose }: ClientDetailModalProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4">
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 sm:py-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold truncate">
              {client.contact.properties.firstname} {client.contact.properties.lastname}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base truncate">{client.contact.properties.company}</p>
            <p className="text-xs sm:text-sm text-blue-200 truncate">{client.contact.properties.job_title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg border ${getHealthScoreColor(client.healthScore)}`}>
            <div className="text-xs sm:text-sm font-medium">Health Score</div>
            <div className="text-lg sm:text-2xl font-bold">{client.healthScore}</div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl sm:text-2xl font-bold p-1 sm:p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-160px)] sm:max-h-[calc(90vh-200px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Journey Position */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            Posição na Jornada
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                  {client.journeyPosition.stage}
                </span>
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {Math.round(client.journeyPosition.confidence * 100)}% confiança
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 capitalize">
                {client.journeyPosition.subStage.replace(/_/g, ' ')}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${client.journeyPosition.confidence * 100}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{client.journeyPosition.daysInCurrentStage}</div>
                <div className="text-xs sm:text-sm text-gray-500">Dias na etapa</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{client.journeyPosition.priority.toUpperCase()}</div>
                <div className="text-xs sm:text-sm text-gray-500">Prioridade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            Informações de Contato
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-700 truncate">{client.contact.properties.email}</span>
            </div>
            {client.contact.properties.phone && (
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">{client.contact.properties.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-700 truncate">{client.contact.properties.company}</span>
            </div>
            {client.contact.properties.city && (
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <span className="text-gray-400 flex-shrink-0">📍</span>
                <span className="text-sm sm:text-base text-gray-700 truncate">{client.contact.properties.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Deal Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
            Informações do Negócio
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="p-3 sm:p-4 bg-white rounded-lg border">
              <div className="text-xs sm:text-sm text-gray-500">Valor do Deal</div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(client.deal.properties.amount || '0')}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-500">Status</div>
                <div className="font-medium capitalize text-xs sm:text-sm truncate">
                  {client.deal.properties.dealstage.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-500">Tipo</div>
                <div className="font-medium capitalize text-xs sm:text-sm truncate">
                  {client.deal.properties.dealtype}
                </div>
              </div>
            </div>
            
            {client.deal.properties.closedate && (
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-500">Data de Fechamento</div>
                <div className="font-medium text-xs sm:text-sm">{formatDate(client.deal.properties.closedate)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Journey Metadata */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
            Detalhes da Jornada
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-3 bg-white rounded-lg border text-center">
                <div className="text-xs sm:text-sm text-gray-500">Proposta Enviada</div>
                <div className="text-base sm:text-lg">
                  {client.journeyPosition.metadata.proposalSent ? '✅' : '❌'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border text-center">
                <div className="text-xs sm:text-sm text-gray-500">Cadência WhatsApp</div>
                <div className="text-base sm:text-lg">
                  {client.journeyPosition.metadata.whatsappCadenceActive ? '✅' : '❌'}
                </div>
              </div>
            </div>
            
            {client.journeyPosition.metadata.firstDepositDate && (
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-500">Primeiro Depósito</div>
                <div className="font-medium text-xs sm:text-sm">{formatDate(client.journeyPosition.metadata.firstDepositDate)}</div>
              </div>
            )}
            
            {client.journeyPosition.metadata.lastMeetingDate && (
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-500">Última Reunião</div>
                <div className="font-medium text-xs sm:text-sm">
                  {formatDate(client.journeyPosition.metadata.lastMeetingDate)}
                  {client.journeyPosition.metadata.daysSinceLastMeeting && 
                    <span className="text-gray-500 text-xs ml-1 sm:ml-2 block sm:inline">
                      ({client.journeyPosition.metadata.daysSinceLastMeeting} dias atrás)
                    </span>
                  }
                </div>
              </div>
            )}

            {/* Next Actions */}
            {client.journeyPosition.metadata.nextActions.length > 0 && (
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs sm:text-sm text-gray-500 mb-2">Próximas Ações</div>
                <ul className="space-y-1">
                  {client.journeyPosition.metadata.nextActions.map((action, index) => (
                    <li key={index} className="text-xs sm:text-sm flex items-start">
                      <ArrowRight className="h-3 w-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Factors */}
            {client.journeyPosition.metadata.riskFactors.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-xs sm:text-sm text-red-600 mb-2 flex items-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Fatores de Risco
                </div>
                <ul className="space-y-1">
                  {client.journeyPosition.metadata.riskFactors.map((risk, index) => (
                    <li key={index} className="text-xs sm:text-sm text-red-700">
                      • {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Owner Information */}
      {client.ownerName && (
        <div className="mt-4 sm:mt-6 bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
            Informações do Assessor
          </h3>
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-xs sm:text-sm">
                  {client.ownerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.ownerName}</div>
                <div className="text-xs sm:text-sm text-gray-500">Assessor Responsável</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between border-t space-y-3 sm:space-y-0">
      <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
        Última atualização: {formatDate(client.journeyPosition.lastUpdated)}
      </div>
      <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3">
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Editar Cliente
        </button>
        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Agendar Reunião
        </button>
      </div>
    </div>
  </div>
</div>
  );
}