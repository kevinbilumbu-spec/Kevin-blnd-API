import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { MINISTE_LIST } from '../data/mockData';
import { CreditCard, Landmark, RotateCw, Play, AlertCircle } from 'lucide-react';

interface PayrollManagerProps {
  agents: Agent[];
  onTriggerBankLink: () => void;
}

export default function PayrollManager({ agents, onTriggerBankLink }: PayrollManagerProps) {
  const [payrollMonth, setPayrollMonth] = useState('Juin 2026');
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Formatting records, 2: Initiating Bank Handshake, 3: Completed
  const [cycles, setCycles] = useState<{ [month: string]: 'Brouillon' | 'Transmis' | 'Payé' }>({
    'Mai 2026': 'Payé',
    'Juin 2026': 'Brouillon'
  });

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.statut === 'Actif');
  const totalBase = agents.reduce((acc, a) => acc + a.salaireBase, 0);
  const totalPrimes = agents.reduce((acc, a) => acc + a.prime, 0);
  const totalIndemnites = agents.reduce((acc, a) => acc + a.indemnites, 0);
  const grossTotal = totalBase + totalPrimes + totalIndemnites;
  const estimatedDeductions = Math.round(totalBase * 0.05 + (totalBase + totalPrimes) * 0.03);
  const netTotal = grossTotal - estimatedDeductions;

  // Simulate payroll cycle computation 
  const runSimulation = () => {
    if (cycles[payrollMonth] === 'Payé') {
      alert("La paie de ce mois a déjà été entièrement traitée et transférée à la Banque.");
      return;
    }
    
    setIsRunningSim(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setTimeout(() => {
          setCycles(prev => ({ ...prev, [payrollMonth]: 'Payé' }));
          setIsRunningSim(false);
          setSimulationStep(0);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const getStatusBadgeClass = (status: 'Brouillon' | 'Transmis' | 'Payé') => {
    switch (status) {
      case 'Payé': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Transmis': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div id="payroll-manager-container" className="space-y-6">
      
      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Masse Salariale Brut</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">
            {grossTotal.toLocaleString('fr-FR')} FC
          </p>
          <div className="text-xs text-slate-500 font-medium mt-2 flex justify-between">
            <span>Base: {totalBase.toLocaleString('fr-FR')}</span>
            <span>Primes: {totalPrimes.toLocaleString('fr-FR')}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Retenues IPRE & CNSS Est.</p>
          <p className="text-xl font-extrabold text-red-600 mt-1 font-mono">
            -{estimatedDeductions.toLocaleString('fr-FR')} FC
          </p>
          <p className="text-xs text-slate-400 font-semibold mt-2">Deductions statutaires de 8%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Masse Salariale Nette (Payée)</p>
          <p className="text-xl font-extrabold text-blue-900 mt-1 font-mono">
            {netTotal.toLocaleString('fr-FR')} FC
          </p>
          <p className="text-xs text-slate-400 font-semibold mt-2">Prêts pour virement d'administration</p>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-xl shadow-xs relative overflow-hidden">
          <span className="p-2 bg-blue-600 rounded-lg absolute right-4 top-4 text-white">
            <Landmark className="w-5 h-5" />
          </span>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Agents Éligibles</p>
          <p className="text-2xl font-black mt-1">{activeAgents.length} / {totalAgents}</p>
          <p className="text-xs text-slate-300 font-medium mt-2">{totalAgents - activeAgents.length} temporairement inactifs / suspendus</p>
        </div>

      </div>

      {/* Main Payment console */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Console d'Ordonnancement et Virement Mensuel</h2>
            <p className="text-xs text-slate-500">Calculer la paie des fonctionnaires, générer les fichiers banques et vider les ordonnances</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Mois ciblé:</span>
            <select
              value={payrollMonth}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs font-bold py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Mai 2026">Mai 2026</option>
              <option value="Juin 2026">Juin 2026</option>
              <option value="Juillet 2026">Juillet 2026</option>
            </select>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Simulation console left side */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">État du cycle de paie</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(cycles[payrollMonth])}`}>
                  {cycles[payrollMonth]}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  {cycles[payrollMonth] === 'Brouillon' ? (
                    "Le cycle de paie de ce mois est actuellement ouvert. Vous pouvez ajouter, modifier les gains des agents avant de verrouiller la table et d'ordonner le transfert automatique vers la Banque Centrale."
                  ) : (
                    "La virement de paie a été complété pour ce mois. La Banque Centrale a reçu l'ordre d'approvisionnement des comptes Rawbank, TMB, Equity BCDC pour chaque agent actif."
                  )}
                </p>
              </div>

              {/* Dynamic Step indicator when running */}
              {isRunningSim && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-blue-700">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Traitement et cryptage en cours...</span>
                  </div>
                  
                  {/* Progress milestones */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${simulationStep >= 1 ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                      <span className={simulationStep === 1 ? 'font-bold text-slate-800' : ''}>Assemblage des {agents.length} fiches et application des retenues</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${simulationStep >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                      <span className={simulationStep === 2 ? 'font-bold text-slate-800' : ''}>Simulation de signature cryptée de l'ordonnateur et routage BCC</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${simulationStep >= 3 ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                      <span className={simulationStep === 3 ? 'font-bold text-slate-800 font-extrabold text-blue-800' : ''}>Transmission effectuée avec succès au guichet compensatoire</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons trigger */}
              {!isRunningSim && (
                <div>
                  {cycles[payrollMonth] === 'Brouillon' ? (
                    <button
                      onClick={runSimulation}
                      className="w-full py-3 bg-blue-950 hover:bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>LANCER L'ORDONNANCEMENT DE LA PAIE ({payrollMonth})</span>
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        onClick={() => {
                          if (confirm(`Réinitialiser la paie de ${payrollMonth} au statut Brouillon ?`)) {
                            setCycles(prev => ({ ...prev, [payrollMonth]: 'Brouillon' }));
                          }
                        }}
                        className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        Réouvrir le Brouillon (Réinitialiser)
                      </button>
                      <button
                        onClick={onTriggerBankLink}
                        className="flex-1 py-2.5 text-center text-xs font-bold text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>Consulter la Banque</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Note logic info */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-900">Règle de suspension de virement</p>
                <p className="text-amber-800 leading-relaxed">
                  Conformément au règlement de l'Administration Publique, les agents au statut <span className="font-bold">"Suspendu"</span> voient leurs primes retenues de manière préventive lors des cycles de virement, jusqu'à la résolution de leur litige disciplinaire ou administratif.
                </p>
              </div>
            </div>

          </div>

          {/* Ministry budget breakdown - right side */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Masse Salariale par Ministère</h3>
            
            <div className="space-y-3.5">
              {MINISTE_LIST.map((min, idx) => {
                const ministryAgents = agents.filter(a => a.ministere === min);
                const ministryTotalPay = ministryAgents.reduce((acc, a) => acc + a.total, 0);
                const pct = grossTotal > 0 ? Math.round((ministryTotalPay / grossTotal) * 100) : 0;
                
                return (
                  <div key={idx} className="space-y-1 bg-slate-50/30 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-[210px]">{min}</span>
                      <span className="font-mono font-extrabold text-slate-950">{pct}%</span>
                    </div>
                    
                    {/* Visual Progress gauge */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-950 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>{ministryAgents.length} fiches d'agents</span>
                      <span>{ministryTotalPay.toLocaleString('fr-FR')} FC</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
