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
  Settings,
  ChevronDown,
  BarChart3,
  Zap,
  X
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
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-100';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200 ring-blue-100';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200 ring-amber-100';
    return 'text-red-700 bg-red-50 border-red-200 ring-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-200';
      case 'low': return 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-200';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-200';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const organizeDataByStage = (): StageColumn[] => {
    const stages: StageColumn[] = [
      {
        stage: 'prospeccao',
        title: 'Prospecção',
        description: 'Leads em processo de qualificação e proposta',
        color: 'text-blue-700',
        bgColor: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
        borderColor: 'border-blue-200',
        icon: <Target className="h-6 w-6" />,
        clients: [],
        targetCount: 15
      },
      {
        stage: 'onboarding',
        title: 'Onboarding',
        description: 'Clientes com contratos fechados em processo de ativação',
        color: 'text-amber-700',
        bgColor: 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500',
        borderColor: 'border-amber-200',
        icon: <Briefcase className="h-6 w-6" />,
        clients: [],
        targetCount: 10
      },
      {
        stage: 'relacionamento',
        title: 'Relacionamento',
        description: 'Clientes ativos com gestão contínua de portfolio',
        color: 'text-emerald-700',
        bgColor: 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600',
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin mx-auto mb-6">
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 text-xl font-semibold mb-2">Carregando Dashboard</p>
          <p className="text-gray-500">Sincronizando dados da jornada...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Título */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Journey Board
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    CRM Analytics • <span className="text-blue-600">HubSpot Integration</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Users className="h-5 w-5 text-blue-600" />
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {totalClients}
                    </p>
                  </div>
                  <p className="text-gray-600 font-medium text-sm">Clientes Ativos</p>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {formatCurrency(totalValue).replace('R$', '').trim()}
                    </p>
                  </div>
                  <p className="text-gray-600 font-medium text-sm">Pipeline Total</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="hidden md:flex items-center space-x-2 px-4 py-2.5 text-sm bg-white/70 backdrop-blur-sm text-gray-700 rounded-xl border border-white/30 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isRefreshing ? 'Sincronizando...' : 'Atualizar'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar clientes, empresas..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-12 pr-4 py-3.5 border-2 border-white/30 bg-white/70 backdrop-blur-sm rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 w-full sm:w-96 text-gray-700 placeholder-gray-500 shadow-lg hover:shadow-xl"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={filters.stage || ''}
                onChange={(e) => setFilters({ ...filters, stage: e.target.value as JourneyStage || undefined })}
                className="px-4 py-3 border-2 border-white/30 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <option value="">🎯 Todas as etapas</option>
                <option value="prospeccao">🔍 Prospecção</option>
                <option value="onboarding">📋 Onboarding</option>
                <option value="relacionamento">🤝 Relacionamento</option>
              </select>
              
              <select
                value={filters.priority || ''}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as any || undefined })}
                className="px-4 py-3 border-2 border-white/30 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <option value="">⚡ Todas as prioridades</option>
                <option value="high">🔴 Alta prioridade</option>
                <option value="medium">🟡 Média prioridade</option>
                <option value="low">🟢 Baixa prioridade</option>
              </select>
              
              <button
                onClick={() => setViewMode(viewMode === 'board' ? 'list' : 'board')}
                className="p-3 border-2 border-white/30 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                title={viewMode === 'board' ? 'Visualização em Lista' : 'Visualização em Board'}
              >
                {viewMode === 'board' ? 
                  <BarChart3 className="h-5 w-5 text-gray-600" /> : 
                  <Target className="h-5 w-5 text-gray-600" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'board' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stageColumns.map((column, index) => (
              <div
                key={column.stage}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <StageColumn 
                  column={column}
                  onClientSelect={setSelectedClient}
                  selectedClientId={selectedClient?.dealId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            <ClientListView 
              clients={journeyData}
              onClientSelect={setSelectedClient}
              selectedClientId={selectedClient?.dealId}
            />
          </div>
        )}
      </main>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
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
    <div className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white">
      {/* Column Header */}
      <div className={`${column.bgColor} px-8 py-7 text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                {column.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">{column.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed max-w-sm">{column.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black">{column.clients.length}</span>
              {column.targetCount && (
                <span className="text-lg opacity-75">/ {column.targetCount}</span>
              )}
              <span className="text-sm opacity-75 ml-2">clientes</span>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Pipeline Total</div>
              <div className="text-xl font-bold">
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm opacity-90">
                <span className="font-medium">Meta de Clientes</span>
                <span className="font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs opacity-75">
                <span>0</span>
                <span>{column.targetCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Cards */}
      <div className="p-6 space-y-4 max-h-[calc(100vh-450px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {column.clients.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="relative mb-6">
              <div className="text-8xl opacity-20 animate-pulse">📋</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-xl font-bold mb-2 text-gray-700">Nenhum cliente</p>
            <p className="text-sm text-gray-500">Aguardando novos leads para esta etapa</p>
          </div>
        ) : (
          column.clients.map((client, index) => (
            <div
              key={client.dealId}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ClientCard
                client={client}
                isSelected={selectedClientId === client.dealId}
                onClick={() => onClientSelect(client)}
              />
            </div>
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
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-100';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200 ring-blue-100';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200 ring-amber-100';
    return 'text-red-700 bg-red-50 border-red-200 ring-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-200';
      case 'low': return 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-200';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-200';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 transform ${
        isSelected 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl ring-4 ring-blue-200/50 scale-105' 
          : 'border-gray-200/50 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:bg-white'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Zap className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full shadow-lg ${getPriorityColor(client.journeyPosition.priority)}`}></div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-gray-900 truncate text-lg group-hover:text-blue-700 transition-colors">
              {client.contact.properties.firstname} {client.contact.properties.lastname}
            </h4>
            <p className="text-sm text-gray-600 truncate font-medium">{client.contact.properties.company}</p>
            <p className="text-xs text-gray-500 truncate">{client.contact.properties.job_title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1.5 rounded-xl text-sm font-bold border ${getHealthScoreColor(client.healthScore)} shadow-sm`}>
            {client.healthScore}
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Deal Amount */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
        <div className="text-2xl font-black text-green-700 mb-1">
          {formatCurrency(client.deal.properties.amount || '0')}
        </div>
        <div className="text-xs text-green-600 font-semibold capitalize">
          {client.deal.properties.dealtype?.replace(/([A-Z])/g, ' $1').trim()} • {client.deal.properties.investment_type}
        </div>
      </div>

      {/* Journey Progress */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700 capitalize">
            {client.journeyPosition.subStage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
            {Math.round(client.journeyPosition.confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${client.journeyPosition.confidence * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200/50">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span className="font-medium">{formatDate(client.journeyPosition.lastUpdated)}</span>
        </div>
        <div className="flex items-center space-x-3">
          {client.journeyPosition.metadata.whatsappCadenceActive && (
            <div className="flex items-center space-x-1 text-green-600">
              <MessageSquare className="h-3 w-3" />
              <span className="text-xs font-semibold">WhatsApp</span>
            </div>
          )}
          {client.journeyPosition.metadata.riskFactors.length > 0 && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-3 w-3 animate-pulse" />
              <span className="text-xs font-semibold">Risco</span>
            </div>
          )}
          <div className="text-right">
            <div className="font-bold text-gray-700">{client.journeyPosition.daysInCurrentStage}d</div>
            <div className="text-xs text-gray-500">na etapa</div>
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
    if (score >= 90) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    if (score >= 70) return 'text-blue-700 bg-blue-100 border-blue-200';
    if (score >= 50) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  const getStageColor = (stage: JourneyStage) => {
    switch (stage) {
      case 'prospeccao': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'onboarding': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'relacionamento': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Lista de Clientes</h2>
            <p className="text-gray-600">Visualização detalhada de todos os clientes</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-semibold text-sm">
              {clients.length} clientes
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Etapa</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Saúde</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Assessor</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/30">
            {clients.map((client, index) => (
              <tr 
                key={client.dealId}
                className={`hover:bg-blue-50/50 cursor-pointer transition-all duration-300 ${
                  selectedClientId === client.dealId ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-lg' : ''
                } animate-slide-in`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onClientSelect(client)}
              >
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        {client.contact.properties.firstname} {client.contact.properties.lastname}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{client.contact.properties.company}</div>
                      <div className="text-xs text-gray-500">{client.contact.properties.job_title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl border ${getStageColor(client.journeyPosition.stage)}`}>
                    {client.journeyPosition.stage.charAt(0).toUpperCase() + client.journeyPosition.stage.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-lg font-black text-green-700">
                  {formatCurrency(client.deal.properties.amount || '0')}
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl border ${getHealthScoreColor(client.healthScore)}`}>
                    {client.healthScore}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                  {client.ownerName}
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200">
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
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-white/20 animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black mb-2">
                  {client.contact.properties.firstname} {client.contact.properties.lastname}
                </h2>
                <p className="text-blue-100 text-lg font-medium mb-1">{client.contact.properties.company}</p>
                <p className="text-sm text-blue-200">{client.contact.properties.job_title} • {client.contact.properties.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-3 rounded-2xl border-2 ${getHealthScoreColor(client.healthScore)} shadow-lg`}>
                <div className="text-sm font-bold mb-1">Health Score</div>
                <div className="text-3xl font-black">{client.healthScore}</div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 text-3xl font-bold p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)] space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Journey Position */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-3 bg-blue-600 rounded-2xl mr-4 shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                Posição na Jornada
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-900 text-xl capitalize">
                      {client.journeyPosition.stage}
                    </span>
                    <span className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                      {Math.round(client.journeyPosition.confidence * 100)}% confiança
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 capitalize font-medium">
                    {client.journeyPosition.subStage.replace(/_/g, ' ')}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${client.journeyPosition.confidence * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-white rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-black text-gray-900 mb-2">{client.journeyPosition.daysInCurrentStage}</div>
                    <div className="text-sm text-gray-600 font-medium">Dias na etapa</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-black text-blue-600 mb-2">{client.journeyPosition.priority.toUpperCase()}</div>
                    <div className="text-sm text-gray-600 font-medium">Prioridade</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-3 bg-green-600 rounded-2xl mr-4 shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                Informações de Contato
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{client.contact.properties.email}</span>
                </div>
                {client.contact.properties.phone && (
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{client.contact.properties.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{client.contact.properties.company}</span>
                </div>
                {client.contact.properties.city && (
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <span className="text-green-600 text-lg">📍</span>
                    </div>
                    <span className="text-gray-700 font-medium">{client.contact.properties.city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Information */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-3 bg-emerald-600 rounded-2xl mr-4 shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                Informações do Negócio
              </h3>
              
              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-sm text-gray-600 font-medium mb-2">Valor do Deal</div>
                  <div className="text-4xl font-black text-emerald-600">
                    {formatCurrency(client.deal.properties.amount || '0')}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Status</div>
                    <div className="font-bold capitalize text-gray-900">
                      {client.deal.properties.dealstage.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Tipo</div>
                    <div className="font-bold capitalize text-gray-900">
                      {client.deal.properties.dealtype}
                    </div>
                  </div>
                </div>
                
                {client.deal.properties.closedate && (
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Data de Fechamento</div>
                    <div className="font-bold text-gray-900">{formatDate(client.deal.properties.closedate)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Journey Metadata */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-200/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-3 bg-purple-600 rounded-2xl mr-4 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                Detalhes da Jornada
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-purple-200/50 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Proposta Enviada</div>
                    <div className="text-3xl">
                      {client.journeyPosition.metadata.proposalSent ? '✅' : '❌'}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-purple-200/50 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Cadência WhatsApp</div>
                    <div className="text-3xl">
                      {client.journeyPosition.metadata.whatsappCadenceActive ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
                
                {client.journeyPosition.metadata.firstDepositDate && (
                  <div className="p-4 bg-white rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Primeiro Depósito</div>
                    <div className="font-bold text-gray-900">{formatDate(client.journeyPosition.metadata.firstDepositDate)}</div>
                  </div>
                )}
                
                {client.journeyPosition.metadata.lastMeetingDate && (
                  <div className="p-4 bg-white rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-2">Última Reunião</div>
                    <div className="font-bold text-gray-900">
                      {formatDate(client.journeyPosition.metadata.lastMeetingDate)}
                      {client.journeyPosition.metadata.daysSinceLastMeeting && 
                        <span className="text-gray-500 text-sm ml-2 font-normal">
                          ({client.journeyPosition.metadata.daysSinceLastMeeting} dias atrás)
                        </span>
                      }
                    </div>
                  </div>
                )}

                {/* Next Actions */}
                {client.journeyPosition.metadata.nextActions.length > 0 && (
                  <div className="p-4 bg-white rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-sm text-gray-600 font-medium mb-3">Próximas Ações</div>
                    <ul className="space-y-2">
                      {client.journeyPosition.metadata.nextActions.map((action, index) => (
                        <li key={index} className="text-sm flex items-center font-medium">
                          <ArrowRight className="h-4 w-4 text-purple-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Factors */}
                {client.journeyPosition.metadata.riskFactors.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200 shadow-lg">
                    <div className="text-sm text-red-700 mb-3 flex items-center font-bold">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Fatores de Risco
                    </div>
                    <ul className="space-y-2">
                      {client.journeyPosition.metadata.riskFactors.map((risk, index) => (
                        <li key={index} className="text-sm text-red-700 font-medium">
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
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200/50 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-3 bg-yellow-500 rounded-2xl mr-4 shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                Informações do Assessor
              </h3>
              <div className="bg-white rounded-2xl p-6 border border-yellow-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {client.ownerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">{client.ownerName}</div>
                    <div className="text-gray-600 font-medium">Assessor Responsável</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Ativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 flex items-center justify-between border-t border-gray-200/50">
          <div className="text-sm text-gray-600 font-medium">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Última atualização: {formatDate(client.journeyPosition.lastUpdated)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-3 text-sm bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105">
              Editar Cliente
            </button>
            <button className="px-6 py-3 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105">
              Agendar Reunião
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
          opacity: 0;
        }

        /* Custom scrollbar */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-300 {
          scrollbar-color: #d1d5db transparent;
        }
        
        .scrollbar-track-gray-100 {
          scrollbar-track-color: #f3f4f6;
        }
        
        /* Webkit scrollbar for better browser support */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}