import React, { useState, useEffect } from 'react';
import { Agent, SexeType, EtatCivilType, StatutAgentType } from '../types';
import { MINISTE_LIST, GRADES_LIST, BANQUES_LIST } from '../data/mockData';
import { X, Plus, Sparkles } from 'lucide-react';

interface AgentFormProps {
  agent?: Agent | null; // If editing
  onSave: (agent: Agent) => void;
  onClose: () => void;
}

export default function AgentForm({ agent, onSave, onClose }: AgentFormProps) {
  const [matricule, setMatricule] = useState('');
  const [nom, setNom] = useState('');
  const [postNom, setPostNom] = useState('');
  const [sexe, setSexe] = useState<SexeType>('M');
  const [dateNaissance, setDateNaissance] = useState('');
  const [etatCivil, setEtatCivil] = useState<EtatCivilType>('Marié');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');

  const [ministere, setMinistere] = useState(MINISTE_LIST[0]);
  const [secretariatGeneral, setSecretariatGeneral] = useState('');
  const [serviceRH, setServiceRH] = useState('');
  const [fonction, setFonction] = useState('');
  const [grade, setGrade] = useState(GRADES_LIST[0]);
  const [dateEngagement, setDateEngagement] = useState('');
  const [statut, setStatut] = useState<StatutAgentType>('Actif');

  const [salaireBase, setSalaireBase] = useState<number>(300000);
  const [prime, setPrime] = useState<number>(50000);
  const [indemnites, setIndemnites] = useState<number>(40000);
  const [banque, setBanque] = useState(BANQUES_LIST[1]); // Default to Rawbank
  const [numeroCompte, setNumeroCompte] = useState('');

  // Total calculated
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal((Number(salaireBase) || 0) + (Number(prime) || 0) + (Number(indemnites) || 0));
  }, [salaireBase, prime, indemnites]);

  // Load agent if editing
  useEffect(() => {
    if (agent) {
      setMatricule(agent.matricule);
      setNom(agent.nom);
      setPostNom(agent.postNom);
      setSexe(agent.sexe);
      setDateNaissance(agent.dateNaissance);
      setEtatCivil(agent.etatCivil);
      setTelephone(agent.telephone);
      setAdresse(agent.adresse);
      setMinistere(agent.ministere);
      setSecretariatGeneral(agent.secretariatGeneral);
      setServiceRH(agent.serviceRH);
      setFonction(agent.fonction);
      setGrade(agent.grade);
      setDateEngagement(agent.dateEngagement);
      setStatut(agent.statut);
      setSalaireBase(agent.salaireBase);
      setPrime(agent.prime);
      setIndemnites(agent.indemnites);
      setBanque(agent.banque);
      setNumeroCompte(agent.numeroCompte);
    } else {
      // Auto-generate Matricule for new agent
      generateMatricule();
    }
  }, [agent]);

  const generateMatricule = () => {
    const num = Math.floor(100000 + Math.random() * 900000);
    setMatricule(`A-${num}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !postNom.trim()) {
      alert("Veuillez remplir au moins le Nom et Post-nom de l'agent.");
      return;
    }
    if (!numeroCompte.trim()) {
      alert("Le numéro de compte bancaire est obligatoire pour finaliser la fiche de paie.");
      return;
    }

    const savedAgent: Agent = {
      matricule,
      nom: nom.toUpperCase(),
      postNom,
      sexe,
      dateNaissance,
      etatCivil,
      telephone,
      adresse,
      ministere,
      secretariatGeneral: secretariatGeneral || `Secrétariat Général aux ${ministere.replace('Ministère des ', '').replace('Ministère de la ', '').replace('Ministère du ', '')}`,
      serviceRH: serviceRH || "Service Ressources Humaines",
      fonction,
      grade,
      dateEngagement,
      statut,
      salaireBase: Number(salaireBase) || 0,
      prime: Number(prime) || 0,
      indemnites: Number(indemnites) || 0,
      banque,
      numeroCompte,
      total: (Number(salaireBase) || 0) + (Number(prime) || 0) + (Number(indemnites) || 0)
    };

    onSave(savedAgent);
  };

  return (
    <div id="agent-form-container" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div id="agent-form-card" className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {agent ? "Modifier la Fiche Agent" : "Enregistrer un Nouvel Agent"}
              </h2>
              <p className="text-slate-400 text-xs">Formulaire officiel d'identification de l'agent et de sa paie</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: ÉTAT CIVIL */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span>
              1. Gérer l'Agent (État Civil)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Matricule</label>
                <div className="relative">
                  <input
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    required
                    readOnly={!!agent}
                    placeholder="e.g. A-123456"
                    className="w-full bg-slate-50 text-slate-800 font-mono text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                  {!agent && (
                    <button
                      type="button"
                      onClick={generateMatricule}
                      title="Générer un matricule aléatoire"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nom / Nom de famille</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="e.g. KABANGE"
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Post-nom & Prénom</label>
                <input
                  type="text"
                  value={postNom}
                  onChange={(e) => setPostNom(e.target.value)}
                  placeholder="e.g. MWENZE Jean-Paul"
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Sexe</label>
                <select
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value as SexeType)}
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date de Naissance</label>
                <input
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">État Civil</label>
                <select
                  value={etatCivil}
                  onChange={(e) => setEtatCivil(e.target.value as EtatCivilType)}
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Marié">Marié(e)</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Divorcé">Divorcé(e)</option>
                  <option value="Veuf">Veuf(ve)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="e.g. +243 812 345 678"
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Adresse</label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="e.g. Av. de la Gombe 14, Kinshasa/Gombe"
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: INFORMATION PROFESSIONNELLE */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span>
              2. Informations Professionnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Ministère</label>
                <input
                  list="ministries-datalist"
                  type="text"
                  value={ministere}
                  onChange={(e) => setMinistere(e.target.value)}
                  placeholder="Saisir ou choisir un ministère..."
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="ministries-datalist">
                  {MINISTE_LIST.map((min, idx) => (
                    <option key={idx} value={min} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Secrétariat Général</label>
                <input
                  type="text"
                  value={secretariatGeneral}
                  onChange={(e) => setSecretariatGeneral(e.target.value)}
                  placeholder="Généré automatiquement si vide"
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Service des Ressources Humaines</label>
                <input
                  type="text"
                  value={serviceRH}
                  onChange={(e) => setServiceRH(e.target.value)}
                  placeholder="Division administrative"
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Fonction occupée</label>
                <input
                  type="text"
                  value={fonction}
                  onChange={(e) => setFonction(e.target.value)}
                  placeholder="e.g. Chef d'Ordonnancement, Inspecteur"
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {GRADES_LIST.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date d'Engagement</label>
                <input
                  type="date"
                  value={dateEngagement}
                  onChange={(e) => setDateEngagement(e.target.value)}
                  required
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Statut d'Activité</label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as StatutAgentType)}
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Actif">Actif</option>
                  <option value="Suspendu">Suspendu</option>
                  <option value="Retraité">Retraité</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: INFORMATION DE PAIE & CALCUL */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span>
              3. Rémunération & Coordonnées Bancaires
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Salaire de Base (FC)</label>
                <input
                  type="number"
                  min="0"
                  value={salaireBase}
                  onChange={(e) => setSalaireBase(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full bg-white text-slate-800 font-semibold text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Prime Complémentaire (FC)</label>
                <input
                  type="number"
                  min="0"
                  value={prime}
                  onChange={(e) => setPrime(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full bg-white text-slate-800 font-semibold text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Indemnités Diverses (FC)</label>
                <input
                  type="number"
                  min="0"
                  value={indemnites}
                  onChange={(e) => setIndemnites(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full bg-white text-slate-800 font-semibold text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-900 text-white p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Salaire Mensuel Total</span>
                <span className="text-xl font-bold tracking-tight">
                  {total.toLocaleString('fr-FR')} FC
                </span>
                <span className="text-[9px] text-blue-300 italic">Total = Base + Prime + Indem.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Banque Domiciliataire</label>
                <select
                  value={banque}
                  onChange={(e) => setBanque(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BANQUES_LIST.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Numéro de Compte Bancaire (RIB)</label>
                <input
                  type="text"
                  value={numeroCompte}
                  onChange={(e) => setNumeroCompte(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                  placeholder="e.g. 01001234567-89"
                  required
                  className="w-full bg-white text-slate-800 font-mono text-sm py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 text-sm font-semibold text-white bg-blue-950 hover:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
            >
              <span>{agent ? "Enregistrer les modifications" : "Créer la fiche agent"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
