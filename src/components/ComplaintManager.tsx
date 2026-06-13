import React, { useState } from 'react';
import { Agent, Complaint, ComplaintStatus } from '../types';
import { ClipboardList, Plus, CheckCircle2, RotateCw, AlertTriangle, MessageSquare, Trash } from 'lucide-react';

interface ComplaintManagerProps {
  complaints: Complaint[];
  agents: Agent[];
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateComplaintStatus: (id: string, statut: ComplaintStatus, commentaire: string) => void;
  onDeleteComplaint: (id: string) => void;
}

export default function ComplaintManager({
  complaints,
  agents,
  onAddComplaint,
  onUpdateComplaintStatus,
  onDeleteComplaint
}: ComplaintManagerProps) {
  
  // States
  const [activeTab, setActiveTab] = useState<'Tous' | 'En cours' | 'En attente' | 'Résolu'>('Tous');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingComplaintId, setEditingComplaintId] = useState<string | null>(null);

  // New complaint form states
  const [selectedAgentMatricule, setSelectedAgentMatricule] = useState(agents[0]?.matricule || '');
  const [probleme, setProbleme] = useState('Salaire de Juin non reçu sur le compte');
  const [commentaire, setCommentaire] = useState('En attente de confirmation du virement补偿 de la banque.');
  const [dateSignalement, setDateSignalement] = useState(new Date().toISOString().split('T')[0]);
  const [statut, setStatut] = useState<ComplaintStatus>('En cours');

  // Edit status comment state
  const [tempCommentaire, setTempCommentaire] = useState('');
  const [tempStatut, setTempStatut] = useState<ComplaintStatus>('En cours');

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'Tous') return true;
    return c.statut === activeTab;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedAgent = agents.find(a => a.matricule === selectedAgentMatricule);
    if (!targetedAgent) {
      alert("Veuillez sélectionner un agent valide.");
      return;
    }

    const newClaim: Complaint = {
      id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      agentMatricule: targetedAgent.matricule,
      agentNomComplet: `${targetedAgent.nom} ${targetedAgent.postNom}`,
      probleme,
      dateSignalement,
      statut,
      commentaire
    };

    onAddComplaint(newClaim);
    setShowAddForm(false);
    // Reset defaults
    setProbleme('Salaire non reçu');
    setCommentaire('');
  };

  const handleStartEdit = (comp: Complaint) => {
    setEditingComplaintId(comp.id);
    setTempCommentaire(comp.commentaire);
    setTempStatut(comp.statut);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateComplaintStatus(id, tempStatut, tempCommentaire);
    setEditingComplaintId(null);
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'Résolu':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'En cours':
        return <RotateCw className="w-5 h-5 text-blue-600 animate-spin-slow" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColors = (status: ComplaintStatus) => {
    switch (status) {
      case 'Résolu':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'En cours':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div id="complaint-manager-dashboard" className="space-y-6">
      
      {/* Header bar and Add controller */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Suivi des Problèmes & Réclamations</h2>
          <p className="text-xs text-slate-500">Traiter les retards de transfert, erreurs de coordonnées (RIB) et signalements d'agents</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="self-start py-2 px-4 bg-blue-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Fermer le formulaire" : "Déposer une Réclamation"}</span>
        </button>
      </div>

      {/* Add Complaint Inline Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 max-w-2xl">
          <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Formulaire d'enregistrement de contentieux</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sélectionner l'Agent concerné</label>
              <select
                value={selectedAgentMatricule}
                onChange={(e) => setSelectedAgentMatricule(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {agents.map((agent) => (
                  <option key={agent.matricule} value={agent.matricule}>
                    [{agent.matricule}] {agent.nom} {agent.postNom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type de Problème / Énoncé</label>
              <input
                type="text"
                value={probleme}
                onChange={(e) => setProbleme(e.target.value)}
                required
                placeholder="e.g. Salaire non reçu ou Erreur de calcul"
                className="w-full bg-white text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date du Signalement</label>
              <input
                type="date"
                value={dateSignalement}
                onChange={(e) => setDateSignalement(e.target.value)}
                required
                className="w-full bg-white text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Statut Initial</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as ComplaintStatus)}
                className="w-full bg-white text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="En cours">En cours de traitement</option>
                <option value="En attente">En attente (Banque/RH)</option>
                <option value="Résolu">Résolu et apuré</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Commentaires et consignes d'instruction</label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={2}
                placeholder="Indiquez par exemple: En attente de confirmation de la banque..."
                className="w-full bg-white text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-4 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-5 bg-blue-950 hover:bg-slate-900 rounded-lg text-xs font-semibold text-white"
            >
              Créer le ticket réclamation
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200/60 font-semibold text-xs text-slate-500 overflow-x-auto">
        {(['Tous', 'En cours', 'En attente', 'Résolu'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-blue-950 text-blue-950' 
                : 'border-transparent hover:text-slate-800 hover:border-slate-200'
            }`}
          >
            {tab} {tab === 'Tous' ? `(${complaints.length})` : `(${complaints.filter(c=>c.statut === tab).length})`}
          </button>
        ))}
      </div>

      {/* Complaint List Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-600">Aucun litige ou réclamation</p>
            <p className="text-xs">Tous les dossiers sont apurés pour la sélection actuelle.</p>
          </div>
        ) : (
          filteredComplaints.map((comp) => (
            <div 
              key={comp.id} 
              className={`bg-white border p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow relative ${
                editingComplaintId === comp.id ? 'ring-2 ring-blue-600' : 'border-slate-200/70'
              }`}
            >
              {/* Header inside ticket */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/40">
                      {comp.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusColors(comp.statut)}`}>
                      {comp.statut}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{comp.probleme}</h4>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Agent: {comp.agentNomComplet} ({comp.agentMatricule})</p>
                </div>
                
                <div className="flex items-center space-x-1 shrink-0">
                  {getStatusIcon(comp.statut)}
                </div>
              </div>

              {/* Body inside ticket */}
              <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/10 text-xs text-slate-600 flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Commentaire Officiel</p>
                  {editingComplaintId === comp.id ? (
                    <div className="space-y-2 mt-1">
                      <select
                        value={tempStatut}
                        onChange={(e) => setTempStatut(e.target.value as ComplaintStatus)}
                        className="w-full bg-white text-xs border border-slate-200 rounded p-1"
                      >
                        <option value="En cours">En cours de traitement</option>
                        <option value="En attente">En attente</option>
                        <option value="Résolu">Résolu</option>
                      </select>
                      <textarea
                        value={tempCommentaire}
                        onChange={(e) => setTempCommentaire(e.target.value)}
                        rows={2}
                        className="w-full bg-white text-xs border border-slate-200 rounded p-1.5 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-slate-700 italic font-medium leading-relaxed">
                      {comp.commentaire || "Aucun commentaire disponible de la commission de paie."}
                    </p>
                  )}
                </div>
              </div>

              {/* Status footer inside ticket */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-100 pt-3">
                <span>Signalé le: {new Date(comp.dateSignalement).toLocaleDateString('fr-FR')}</span>
                
                <div className="flex items-center space-x-2">
                  {editingComplaintId === comp.id ? (
                    <>
                      <button
                        onClick={() => setEditingComplaintId(null)}
                        className="text-slate-500 hover:text-slate-800 px-2 py-1 hover:bg-slate-100 rounded"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comp.id)}
                        className="text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded"
                      >
                        Sauvegarder
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(comp)}
                        className="text-blue-800 hover:text-blue-950 hover:underline"
                      >
                        Traiter le litige
                      </button>
                      <span>•</span>
                      <button
                        title="Supprimer le ticket"
                        onClick={() => onDeleteComplaint(comp.id)}
                        className="text-slate-400 hover:text-red-700 p-1"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
