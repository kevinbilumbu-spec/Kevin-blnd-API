import React from 'react';
import { Agent } from '../types';
import { X, Printer, CreditCard, Award, ShieldCheck, Mail } from 'lucide-react';

interface PayslipModalProps {
  agent: Agent;
  onClose: () => void;
}

export default function PayslipModal({ agent, onClose }: PayslipModalProps) {
  // Realism calculation: Deductions
  const iprTax = Math.round(agent.salaireBase * 0.05); // 5% pension/income tax
  const cnssContribution = Math.round((agent.salaireBase + agent.prime) * 0.03); // 3% social insurance
  const totalDeductions = iprTax + cnssContribution;
  const netSalary = agent.total - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="payslip-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
      
      <div id="payslip-modal" className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 print:my-0 print:border-none print:shadow-none">
        
        {/* Actions bar (hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold">Fiche de Paie Individuelle</h2>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Matricule: {agent.matricule}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-blue-700 hover:bg-blue-600 rounded-lg text-xs font-semibold text-white flex items-center space-x-1 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Content starts here */}
        <div id="payment-slip-print-area" className="p-8 space-y-6 bg-white text-slate-800 print:p-0">
          
          {/* Official Congolese / State Header style */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
            <div className="space-y-1">
              <p className="font-extrabold text-xs tracking-wider text-slate-900 uppercase">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
              <p className="font-bold text-[10px] text-blue-800 uppercase">{agent.ministere}</p>
              <p className="text-[9px] text-slate-500 font-medium">{agent.secretariatGeneral}</p>
              <p className="text-[9px] text-slate-400 font-mono">Service: {agent.serviceRH}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="border border-slate-800 px-3 py-1 bg-slate-50 rounded-md font-mono text-xs font-extrabold inline-block text-slate-900">
                PÉRIODE: JUIN 2026
              </div>
              <p className="text-[8px] text-slate-400 uppercase font-semibold">Direction du Contrôle de la Paie</p>
              <p className="text-[8px] text-slate-400 font-mono">ID: FP-RT-{agent.matricule.replace('A-', '')}</p>
            </div>
          </div>

          {/* Title banner */}
          <div className="text-center py-2 bg-slate-100 border border-slate-200 rounded-lg">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">BULLETIN DE PAIE NUMÉRIQUE (FICHE INDIVIDUELLE)</h1>
          </div>

          {/* Agent Identification */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Informations Agent</p>
              <div className="mt-1 space-y-1">
                <p className="font-black text-slate-900 text-sm">{agent.nom} {agent.postNom}</p>
                <p><span className="text-slate-500 font-medium">Sexe:</span> <span className="font-bold">{agent.sexe === 'M' ? 'Masculin' : 'Féminin'}</span></p>
                <p><span className="text-slate-500 font-medium">Né le:</span> <span className="font-bold">{new Date(agent.dateNaissance).toLocaleDateString('fr-FR')}</span></p>
                <p><span className="text-slate-500 font-medium">État civil:</span> <span className="font-bold">{agent.etatCivil}</span></p>
                <p><span className="text-slate-500 font-medium">Téléphone:</span> <span className="font-bold font-mono">{agent.telephone}</span></p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service & Carrière</p>
              <div className="mt-1 space-y-1">
                <p className="font-bold text-slate-900 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-blue-700" />
                  {agent.grade}
                </p>
                <p><span className="text-slate-500 font-medium">Matricule:</span> <span className="font-bold font-mono text-blue-700">{agent.matricule}</span></p>
                <p><span className="text-slate-500 font-medium">Fonction:</span> <span className="font-bold">{agent.fonction}</span></p>
                <p><span className="text-slate-500 font-medium">Statut d'activité:</span> <span className="font-bold text-slate-900">{agent.statut}</span></p>
                <p><span className="text-slate-500 font-medium">Engagé le:</span> <span className="font-bold">{new Date(agent.dateEngagement).toLocaleDateString('fr-FR')}</span></p>
              </div>
            </div>
          </div>

          {/* Calculations Earnings and Deductions Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                  <th className="py-2.5 px-3">Rubrique de Paie</th>
                  <th className="py-2.5 px-3 text-right">Gains (FC)</th>
                  <th className="py-2.5 px-3 text-right">Retenues (FC)</th>
                  <th className="py-2.5 px-3 text-center">Taux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                {/* Earnings */}
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Salaire de base (Statutaire)</td>
                  <td className="py-2 px-3 text-right font-mono">{agent.salaireBase.toLocaleString('fr-FR')}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-400">-</td>
                  <td className="py-2 px-3 text-center text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Primes spécifiques / Rendement</td>
                  <td className="py-2 px-3 text-right font-mono">{agent.prime.toLocaleString('fr-FR')}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-400">-</td>
                  <td className="py-2 px-3 text-center text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Indemnités de logement & transport</td>
                  <td className="py-2 px-3 text-right font-mono">{agent.indemnites.toLocaleString('fr-FR')}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-400">-</td>
                  <td className="py-2 px-3 text-center text-slate-400">-</td>
                </tr>

                {/* Deductions */}
                <tr className="text-slate-600 font-medium">
                  <td className="py-2 px-3 text-slate-500">Impôt Professionnel sur le Revenu (IPR)</td>
                  <td className="py-2 px-3 text-right text-slate-400">-</td>
                  <td className="py-2 px-3 text-right font-mono text-red-700">{iprTax.toLocaleString('fr-FR')}</td>
                  <td className="py-2 px-3 text-center text-slate-500">5.0%</td>
                </tr>
                <tr className="text-slate-600 font-medium">
                  <td className="py-2 px-3 text-slate-500">Retenue Retraites & Assurance Sociale (CNSS)</td>
                  <td className="py-2 px-3 text-right text-slate-400">-</td>
                  <td className="py-2 px-3 text-right font-mono text-red-700">{cnssContribution.toLocaleString('fr-FR')}</td>
                  <td className="py-2 px-3 text-center text-slate-500">3.0%</td>
                </tr>

                {/* Subtotals */}
                <tr className="bg-slate-50 font-bold border-t border-slate-300">
                  <td className="py-2 px-3">Sous-Totaux</td>
                  <td className="py-2 px-3 text-right font-mono text-green-800">{agent.total.toLocaleString('fr-FR')} FC</td>
                  <td className="py-2 px-3 text-right font-mono text-red-800">{totalDeductions.toLocaleString('fr-FR')} FC</td>
                  <td className="py-2 px-3 text-center text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* NET PAYABLE BANNER */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center print:border-2 print:border-slate-800 print:bg-slate-50 print:text-slate-900">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 print:text-slate-500">NET APURÉ À PERCEVOIR</p>
              <p className="text-[8px] text-slate-500 font-semibold italic mt-0.5">Virement bancaire direct</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tight font-mono">
                {netSalary.toLocaleString('fr-FR')} FC
              </span>
            </div>
          </div>

          {/* Banking destination router */}
          <div className="flex bg-slate-50 border border-slate-200 p-3 rounded-lg items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-slate-400 text-[9px] uppercase font-bold">Banque Domiciliataire</p>
                <p className="font-extrabold text-slate-800 text-xs">{agent.banque}</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <p className="text-slate-400 text-[9px] uppercase font-bold text-right">Numéro de Compte</p>
              <p className="font-bold text-slate-800">{agent.numeroCompte}</p>
            </div>
          </div>

          {/* Stamps & Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-4 text-center text-[10px] border-t border-slate-200">
            <div>
              <p className="text-slate-400 uppercase font-extrabold tracking-wider">Le Gestionnaire des Ressources Humaines</p>
              <div className="h-16 flex items-center justify-center">
                {/* Simulated Signature and Stamps */}
                <div className="border border-red-500/30 text-red-500/50 rounded-full px-4 py-1 text-[9px] font-extrabold rotate-3 border-dashed uppercase tracking-widest">
                  MIN. BUDGET • RH SEC
                </div>
              </div>
              <p className="font-bold text-slate-700">Service Liquidation Paie</p>
            </div>

            <div>
              <p className="text-slate-400 uppercase font-extrabold tracking-wider">Visa de l'Ordonnateur Délégué BCC</p>
              <div className="h-16 flex items-center justify-center">
                <div className="opacity-40 font-mono text-[9px] border border-blue-500 rounded p-1 text-blue-600 uppercase font-bold select-none">
                  VISA ELECTRONIC APPROVED
                </div>
              </div>
              <p className="font-bold text-slate-600">Banque Centrale du Congo</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
