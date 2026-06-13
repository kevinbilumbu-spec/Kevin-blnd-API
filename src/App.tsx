import React, { useState, useEffect } from 'react';
import { Agent, Complaint, ComplaintStatus } from './types';
import { INITIAL_AGENTS, INITIAL_COMPLAINTS } from './data/mockData';

// import subcomponents
import AgentList from './components/AgentList';
import AgentForm from './components/AgentForm';
import PayslipModal from './components/PayslipModal';
import PayrollManager from './components/PayrollManager';
import ComplaintManager from './components/ComplaintManager';
import BankCommunicator from './components/BankCommunicator';
import ReportGenerator from './components/ReportGenerator';

import { 
  Users, 
  CreditCard, 
  Landmark, 
  Files, 
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Load State from LocalStorage or Fallback to seeds
  const [agents, setAgents] = useState<Agent[]>(() => {
    const local = localStorage.getItem('paie_agents');
    return local ? JSON.parse(local) : INITIAL_AGENTS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const local = localStorage.getItem('paie_complaints');
    return local ? JSON.parse(local) : INITIAL_COMPLAINTS;
  });

  // Navigation: matches 5 required tasks
  const [activeTab, setActiveTab] = useState<'agents' | 'payroll' | 'complaints' | 'bank' | 'reports'>('agents');

  // Trigger states
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingPayslip, setViewingPayslip] = useState<Agent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('paie_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('paie_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Statistics counters
  const totalSalaries = agents.reduce((acc, a) => acc + a.total, 0);
  const activeCount = agents.filter(a => a.statut === 'Actif').length;
  const pendingIncidents = complaints.filter(c => c.statut !== 'Résolu').length;

  // Actions handlers
  const handleSaveAgent = (savedAgent: Agent) => {
    setAgents(prev => {
      const exists = prev.some(a => a.matricule === savedAgent.matricule);
      if (exists) {
        // Editing existing
        return prev.map(a => a.matricule === savedAgent.matricule ? savedAgent : a);
      } else {
        // Adding new
        return [savedAgent, ...prev];
      }
    });
    setEditingAgent(null);
    setIsFormOpen(false);
  };

  const handleDeleteAgent = (matricule: string) => {
    setAgents(prev => prev.filter(a => a.matricule !== matricule));
  };

  const handleAddComplaint = (newClaim: Complaint) => {
    setComplaints(prev => [newClaim, ...prev]);
  };

  const handleUpdateComplaintStatus = (id: string, statut: ComplaintStatus, commentaire: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, statut, commentaire } : c));
  };

  const handleDeleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none print:bg-white print:text-black">
      
      {/* GOVERNMENT OFFICIAL DECORUM RAIL (Hidden during print) */}
      <div className="bg-[#0f172a] text-xs text-slate-300 px-6 py-2 border-b border-slate-800 flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="font-semibold tracking-wider text-[10px] uppercase text-slate-400">
            MINISTÈRE DE L'INTÉGRATION RÉGIONALE RDC • PORTAIL DE LA PAIE & SECRÉTARIAT GÉNÉRAL
          </span>
        </div>
        <div className="font-mono text-[10px] text-zinc-400">
          Système Sécurisé • Session : Admin Publique v1.8
        </div>
      </div>

      {/* PRIMARY HEADER SECTION (Hidden during print) */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 print:hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-blue-950 rounded-xl flex items-center justify-center text-white shadow-md relative overflow-hidden">
              <Landmark className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">PAIE-GOUV</h1>
                <span className="text-[9px] font-bold tracking-widest text-[#0f172a] bg-yellow-500/20 px-1 py-0.5 rounded border border-yellow-500/25">RDC</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Gestion Centralisée de la Paie des Fonctionnaires</p>
            </div>
          </div>

          {/* Core Mini statistics banners */}
          <div className="flex flex-wrap items-center gap-6 text-xs mt-2 md:mt-0">
            <div className="text-center md:text-right border-r border-slate-200 pr-5">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Agents répertoriés</p>
              <div className="flex items-center md:justify-end space-x-1 mt-0.5">
                <span className="font-black text-slate-900 text-base">{agents.length}</span>
                <span className="text-green-600 font-extrabold font-mono text-[10px]">({activeCount} Actifs)</span>
              </div>
            </div>

            <div className="text-center md:text-right border-r border-slate-200 pr-5">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Masse Globale</p>
              <p className="font-black text-slate-900 text-base mt-0.5 font-mono">
                {totalSalaries.toLocaleString('fr-FR')} <span className="text-[11px] font-black">FC</span>
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Litiges Actifs</p>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-black mt-1 ${
                pendingIncidents > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
              }`}>
                {pendingIncidents} En attente
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:p-0 print:m-0 print:border-none">
        
        {/* TASK TABS SELECTOR CARDS (Hidden during print) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 print:hidden">
          
          <button
            onClick={() => setActiveTab('agents')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'agents' 
                ? 'bg-blue-950 text-white border-blue-950 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-1.5 rounded-lg ${activeTab === 'agents' ? 'bg-blue-800 text-white' : 'bg-slate-100'}`}>
                <Users className="w-5 h-5" />
              </span>
            </div>
            <p className="font-extrabold text-sm tracking-tight">1. Gérer les Agents</p>
            <p className={`text-[10px] mt-1 ${activeTab === 'agents' ? 'text-blue-200' : 'text-slate-400'}`}>
              Identification civile & matricules
            </p>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'payroll' 
                ? 'bg-blue-950 text-white border-blue-950 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-1.5 rounded-lg ${activeTab === 'payroll' ? 'bg-blue-800 text-white' : 'bg-slate-100'}`}>
                <CreditCard className="w-5 h-5" />
              </span>
            </div>
            <p className="font-extrabold text-sm tracking-tight">2. Salaires & Paie</p>
            <p className={`text-[10px] mt-1 ${activeTab === 'payroll' ? 'text-blue-200' : 'text-slate-400'}`}>
              Calculs & virement mensuel
            </p>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'complaints' 
                ? 'bg-blue-950 text-white border-blue-950 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-1.5 rounded-lg ${activeTab === 'complaints' ? 'bg-blue-800 text-white' : 'bg-slate-100'}`}>
                <AlertCircle className="w-5 h-5" />
              </span>
            </div>
            <p className="font-extrabold text-sm tracking-tight">3. Contentieux (RH)</p>
            <p className={`text-[10px] mt-1 ${activeTab === 'complaints' ? 'text-blue-200' : 'text-slate-400'}`}>
              Retards, erreurs de compte
            </p>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'bank' 
                ? 'bg-blue-950 text-white border-blue-950 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-1.5 rounded-lg ${activeTab === 'bank' ? 'bg-blue-800 text-white' : 'bg-slate-100'}`}>
                <Landmark className="w-5 h-5" />
              </span>
            </div>
            <p className="font-extrabold text-sm tracking-tight">4. Liaison Banque</p>
            <p className={`text-[10px] mt-1 ${activeTab === 'bank' ? 'text-blue-200' : 'text-slate-400'}`}>
              Fichiers Excel, API virement
            </p>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'reports' 
                ? 'bg-blue-950 text-white border-blue-950 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-1.5 rounded-lg ${activeTab === 'reports' ? 'bg-blue-800 text-white' : 'bg-slate-100'}`}>
                <Files className="w-5 h-5" />
              </span>
            </div>
            <p className="font-extrabold text-sm tracking-tight">5. Rapports & Décisions</p>
            <p className={`text-[10px] mt-1 ${activeTab === 'reports' ? 'text-blue-200' : 'text-slate-400'}`}>
              Édition PDF & transmission
            </p>
          </button>

        </div>

        {/* DYNAMIC WORKSPACE COMPONENT PANEL */}
        <div className="bg-slate-50 rounded-2xl min-h-[500px]">
          
          {/* TAB 1: GÉRER LES AGENTS */}
          {activeTab === 'agents' && (
            <div id="tab-agents-wrapper" className="space-y-4 animate-fade-in print:hidden">
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Fichier du Personnel (Fonctionnaires)</h2>
                  <p className="text-xs text-slate-500">Mettre à jour l'enrôlement civil, les grades, ministères de tutelle et traitements financiers.</p>
                </div>
              </div>

              <AgentList
                agents={agents}
                onEdit={(agent) => {
                  setEditingAgent(agent);
                  setIsFormOpen(true);
                }}
                onDelete={(matricule) => handleDeleteAgent(matricule)}
                onAddClick={() => {
                  setEditingAgent(null);
                  setIsFormOpen(true);
                }}
                onViewPayslip={(agent) => setViewingPayslip(agent)}
              />
            </div>
          )}

          {/* TAB 2: SALAIRES ET PAIEMENTS */}
          {activeTab === 'payroll' && (
            <div id="tab-payroll-wrapper" className="animate-fade-in print:hidden">
              <PayrollManager 
                agents={agents} 
                onTriggerBankLink={() => setActiveTab('bank')}
              />
            </div>
          )}

          {/* TAB 3: SUIVRE LES COMPLAINTES */}
          {activeTab === 'complaints' && (
            <div id="tab-complaints-wrapper" className="animate-fade-in print:hidden">
              <ComplaintManager
                complaints={complaints}
                agents={agents}
                onAddComplaint={handleAddComplaint}
                onUpdateComplaintStatus={handleUpdateComplaintStatus}
                onDeleteComplaint={handleDeleteComplaint}
              />
            </div>
          )}

          {/* TAB 4: COMMUNIQUER AVEC LA BANQUE */}
          {activeTab === 'bank' && (
            <div id="tab-bank-wrapper" className="animate-fade-in print:hidden">
              <BankCommunicator agents={agents} />
            </div>
          )}

          {/* TAB 5: COMPTES ET RAPPORTS ADMINISTRATIFS */}
          {activeTab === 'reports' && (
            <div id="tab-reports-wrapper" className="animate-fade-in">
              <ReportGenerator agents={agents} complaints={complaints} />
            </div>
          )}

        </div>

      </main>

      {/* OVERLAY MODALS & SCREENS */}

      {/* MODAL 1: FORMULAIRE CREATION OU MODIFICATION AGENT */}
      {isFormOpen && (
        <AgentForm
          agent={editingAgent}
          onSave={handleSaveAgent}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAgent(null);
          }}
        />
      )}

      {/* MODAL 2: BULLET DE PAIE IMPRIMABLE SPECIFIQUE (Only visible when active, prints perfectly) */}
      {viewingPayslip && (
        <PayslipModal
          agent={viewingPayslip}
          onClose={() => setViewingPayslip(null)}
        />
      )}

      {/* OFFICIAL CONGOLÈSE MINISTERIAL FOOTER (Hidden during print) */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 border-t border-slate-800 text-xs mt-12 print:hidden space-y-2">
        <p className="font-semibold text-slate-300">Portail Officiel d'Ordonnancement • République Démocratique du Congo</p>
        <p className="text-[10px] text-slate-500 font-mono">Conforme aux directives comptables COPA-2026. Cryptage des transmissions de bout en bout.</p>
        <div className="flex justify-center space-x-3 text-[10px] pt-1">
          <span className="text-blue-500 font-bold hover:underline cursor-pointer">Assistance administrative</span>
          <span>•</span>
          <span className="text-blue-500 font-bold hover:underline cursor-pointer">Textes de loi budgétaires</span>
          <span>•</span>
          <span className="text-blue-500 font-bold hover:underline cursor-pointer">Directives Commission de Paie</span>
        </div>
      </footer>

    </div>
  );
}
