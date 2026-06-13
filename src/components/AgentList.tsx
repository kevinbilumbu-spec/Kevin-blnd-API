import React, { useState } from 'react';
import { Agent, StatutAgentType } from '../types';
import { MINISTE_LIST, BANQUES_LIST } from '../data/mockData';
import { Search, Filter, Edit, Trash2, FileText, Plus, UserCheck, ShieldAlert, Award, CreditCard, ChevronRight } from 'lucide-react';

interface AgentListProps {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDelete: (matricule: string) => void;
  onAddClick: () => void;
  onViewPayslip: (agent: Agent) => void;
}

export default function AgentList({ agents, onEdit, onDelete, onAddClick, onViewPayslip }: AgentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistere, setSelectedMinistere] = useState('Tous');
  const [selectedStatut, setSelectedStatut] = useState<string>('Tous');

  // Dynamic set of ministries containing defaults and any custom typed ministries
  const dynamicMinistries = Array.from(new Set([
    ...MINISTE_LIST,
    ...agents.map(a => a.ministere)
  ])).filter(Boolean).sort();

  // Filter logic
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.postNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinistere = selectedMinistere === 'Tous' || agent.ministere === selectedMinistere;
    const matchesStatut = selectedStatut === 'Tous' || agent.statut === selectedStatut;

    return matchesSearch && matchesMinistere && matchesStatut;
  });

  return (
    <div id="agent-list-section" className="space-y-6">
      
      {/* Search and Filters panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par Nom, Post-nom, Matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-sm py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" /> Min:
            </span>
            <select
              value={selectedMinistere}
              onChange={(e) => setSelectedMinistere(e.target.value)}
              className="bg-white text-slate-800 text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 max-w-[200px]"
            >
              <option value="Tous">Tous les Ministères</option>
              {dynamicMinistries.map((min, idx) => (
                <option key={idx} value={min}>{min}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Statut:</span>
            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value)}
              className="bg-white text-slate-800 text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Tous">Tous</option>
              <option value="Actif">Actif</option>
              <option value="Suspendu">Suspendu</option>
              <option value="Retraité">Retraité</option>
            </select>
          </div>

          <button
            onClick={onAddClick}
            className="p-2 md:py-2 md:px-4 bg-blue-950 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs transition-colors flex items-center space-x-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Nouvel Agent</span>
          </button>
        </div>

      </div>

      {/* Agents Table / Card Area */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Matricule & Agent</th>
                <th className="py-4 px-5">Ministère & Poste</th>
                <th className="py-4 px-5">Rémunération Mensuelle</th>
                <th className="py-4 px-5">Compte Bancaire</th>
                <th className="py-4 px-5 text-center">Statut</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-medium text-slate-500">Aucun agent répertorié</p>
                    <p className="text-xs">Modifiez les filtres de recherche ou créez un nouvel agent.</p>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  let statusBg = "bg-green-50 text-green-700 border-green-200/60";
                  if (agent.statut === "Suspendu") statusBg = "bg-amber-50 text-amber-700 border-amber-200/60";
                  if (agent.statut === "Retraité") statusBg = "bg-slate-50 text-slate-600 border-slate-200/60";

                  return (
                    <tr key={agent.matricule} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Name & Matricule */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/40 font-bold flex items-center justify-center text-slate-700 text-sm">
                            {agent.nom.charAt(0)}{agent.postNom.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-900">{agent.nom}</span>
                              <span className="text-slate-800 font-medium">{agent.postNom}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-semibold font-mono text-blue-600 bg-blue-50/70 border border-blue-100/40 px-1.5 py-0.5 rounded mt-0.5 w-max">
                              {agent.matricule}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ministry and Post */}
                      <td className="py-4 px-5 max-w-[240px]">
                        <div className="font-semibold text-slate-900 text-xs truncate" title={agent.ministere}>
                          {agent.ministere}
                        </div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          {agent.fonction}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider flex items-center">
                          <Award className="w-3 h-3 mr-0.5 text-blue-600" />
                          {agent.grade}
                        </div>
                      </td>

                      {/* Payroll salary details */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">{agent.total.toLocaleString('fr-FR')} FC</div>
                        <div className="text-[10px] text-slate-400 font-semibold space-x-1.5 mt-0.5">
                          <span>Base: {(agent.salaireBase).toLocaleString('fr-FR')}</span>
                          <span>•</span>
                          <span>Primes: {(agent.prime).toLocaleString('fr-FR')}</span>
                        </div>
                      </td>

                      {/* Bank information */}
                      <td className="py-4 px-5">
                        <div className="text-xs font-bold text-slate-900 flex items-center">
                          <CreditCard className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {agent.banque}
                        </div>
                        <div className="text-xs font-mono font-medium text-slate-500 mt-1">
                          {agent.numeroCompte}
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="py-4 px-5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusBg}`}>
                          {agent.statut}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            title="Fiche de paie détaillée"
                            onClick={() => onViewPayslip(agent)}
                            className="p-1 px-2 text-blue-800 bg-blue-50 border border-blue-200/50 hover:bg-blue-100 hover:border-blue-300 rounded-md transition-colors flex items-center text-xs font-semibold"
                          >
                            <FileText className="w-4 h-4 mr-0.5" />
                            Paie
                          </button>
                          
                          <button
                            title="Modifier la fiche agent"
                            onClick={() => onEdit(agent)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            title="Supprimer l'agent"
                            onClick={() => {
                              if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'agent ${agent.nom} ${agent.postNom} (Matricule ${agent.matricule}) ?`)) {
                                onDelete(agent.matricule);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Counter footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-500">
          <div>
            Affichage de <span className="font-bold text-slate-700">{filteredAgents.length}</span> agents sur <span className="font-bold text-slate-700">{agents.length}</span> au total
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
            <span className="font-semibold text-slate-700">
              {agents.filter(a => a.statut === 'Actif').length} Actifs
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
