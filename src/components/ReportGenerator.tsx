import React, { useState } from 'react';
import { Agent, Complaint, ReportRecipient } from '../types';
import { MINISTE_LIST } from '../data/mockData';
import { Printer } from 'lucide-react';

interface ReportGeneratorProps {
  agents: Agent[];
  complaints: Complaint[];
}

export default function ReportGenerator({ agents, complaints }: ReportGeneratorProps) {
  const [recipient, setRecipient] = useState<ReportRecipient>('Ministre de l\'Intégration Régionale');
  const [reportNote, setReportNote] = useState(
    "La présente situation fait ressortir l'aboutissement favorable de l'ordonnancement mensuel après croisement des fiches d'identification physiques et constatation des contentieux bancaires."
  );

  // Stats for the report
  const totalAgents = agents.length;
  const activeCount = agents.filter(a => a.statut === 'Actif').length;
  const suspendedCount = agents.filter(a => a.statut === 'Suspendu').length;
  const retiredCount = agents.filter(a => a.statut === 'Retraité').length;

  const totalBase = agents.reduce((acc, a) => acc + a.salaireBase, 0);
  const totalPrimes = agents.reduce((acc, a) => acc + a.prime, 0);
  const totalIndemnites = agents.reduce((acc, a) => acc + a.indemnites, 0);
  const totalPayout = totalBase + totalPrimes + totalIndemnites;

  const unresolvedLitiges = complaints.filter(c => c.statut !== 'Résolu').length;
  const resolvedLitiges = complaints.filter(c => c.statut === 'Résolu').length;

  const handlePrint = () => {
    window.print();
  };

  // Get recipient specific guidelines / paragraph
  const getRecipientBody = () => {
    switch (recipient) {
      case 'Ministre de l\'Intégration Régionale':
        return `Excellence Monsieur le Ministre,\n\nNous avons l'honneur de soumettre à votre haute autorité administrative le rapport d'ordonnancement de la paie des fonctionnaires de l'Intégration Régionale. Ce cycle s'aligne rigoureusement sur les effectifs autorisés au sein de notre ministère.`;
      case 'Secrétaire Général':
        return `Monsieur le Secrétaire Général,\n\nConformément à vos directives de rationalisation des effectifs administratifs, voici l'état exhaustif de la masse salariale. Les fiches d'activité ont fait l'objet d'un audit de validation par le Service des Ressources Humaines afin de bloquer les agents inéligibles.`;
      case 'Banque':
        return `Messieurs les Représentants de l'Institution Bancaire,\n\nPar la présente, nous confirmons le transfert des données des bénéficiaires et l'ordre général d'exécution de la compensation publique s'élevant au total apuré. Prière de libérer les soldes individuels après examen de conformité de nos fichiers cryptés.`;
      default: // Comptable
        return `Monsieur le Comptable Public,\n\nVous trouverez ci-joint la situation comptable consolidée de la paie publique. Ce rapport est destiné à servir de justificatif officiel d'écriture comptable de débit et de règlement pour le Trésor Public RDC.`;
    }
  };

  return (
    <div id="report-generator-dashboard" className="space-y-6">
      
      {/* Configuration panel (hidden during print) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs space-y-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">Éditeur de Rapports Administratifs Officiels</h2>
          <p className="text-xs text-slate-500">Générer, prévisualiser et imprimer/télécharger en PDF les documents signés et cachetés pour les autorités administratives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Sélectionner l'Autorité Destinataire</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value as ReportRecipient)}
              className="w-full bg-slate-50 text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="Ministre de l'Intégration Régionale">Le Ministre de l'Intégration Régionale (Haute Évaluation)</option>
              <option value="Secrétaire Général">Le Secrétaire Général (Audit interne)</option>
              <option value="Banque">La Banque Partenaire (Ordre de Compensation)</option>
              <option value="Comptable">Le Comptable Public (Justificatif comptable)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Observations / Notes Additionnelles du Rapport</label>
            <input
              type="text"
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none placeholder:text-slate-400"
              placeholder="Saisissez des observations de la commission de paie..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handlePrint}
            className="py-2.5 px-6 bg-blue-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Rapport d'administration (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas Area */}
      <div id="printable-administrative-letter" className="bg-white border border-slate-200/80 p-10 max-w-4xl mx-auto rounded-xl shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Letterhead (En-tête officielle) */}
        <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
          <p className="font-extrabold text-xs tracking-widest text-slate-900 uppercase">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
          <p className="font-bold text-[10px] text-blue-900 uppercase tracking-widest">MINISTÈRE DE L'INTÉGRATION RÉGIONALE</p>
          <p className="text-[9px] text-slate-500 font-bold tracking-wider">Secrétariat Général • Direction du Trésor</p>
          <div className="text-[8px] text-slate-400 font-mono">N° Réf: MIN/BUD/SGP/0026/2026 • Kinshasa, RDC</div>
        </div>

        {/* Date line */}
        <div className="flex justify-between items-start pt-6 text-xs font-semibold">
          <div>
            <div>Objet : <span className="font-black text-slate-905">Situation et Statistiques Consolidées de la Paie</span></div>
            <p className="text-[10px] text-slate-400">Période d'évaluation : Juin 2026</p>
          </div>
          <div className="text-right">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Présenté à :</p>
            <p className="font-black text-blue-950 text-sm">{recipient.toUpperCase()}</p>
            <p className="text-[10px] text-slate-500 italic mt-0.5">Pour action et suivi des services</p>
          </div>
        </div>

        {/* Letter Body Opening */}
        <div className="pt-8 space-y-4 text-xs font-medium text-slate-700 leading-relaxed text-justify">
          <p className="font-semibold whitespace-pre-line text-slate-800">
            {getRecipientBody()}
          </p>
          <p>
            {reportNote}
          </p>
        </div>

        {/* STATS BREAKDOWN IN REPORT */}
        <div className="py-6 space-y-4">
          <h3 className="text-[10px] uppercase font-black text-slate-900 tracking-wider border-b border-slate-200 pb-1">
            Section A: Résumé de la Statistique Humaine (Effectifs)
          </h3>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200/50">
              <span className="text-xs text-slate-500 font-semibold">Total Agents</span>
              <p className="text-base font-extrabold text-slate-900 font-mono">{totalAgents}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200/50">
              <span className="text-xs text-emerald-800 font-semibold">Actifs</span>
              <p className="text-base font-extrabold text-emerald-700 font-mono">{activeCount}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200/50">
              <span className="text-xs text-amber-800 font-semibold">Suspendus</span>
              <p className="text-base font-extrabold text-amber-700 font-mono">{suspendedCount}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200/50">
              <span className="text-xs text-slate-500 font-semibold">Retraités</span>
              <p className="text-base font-extrabold text-slate-600 font-mono">{retiredCount}</p>
            </div>
          </div>

          <h3 className="text-[10px] uppercase font-black text-slate-900 tracking-wider border-b border-slate-200 pb-1">
            Section B: Situation Budgétaire & Versements de Paie
          </h3>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 font-bold text-slate-600 uppercase text-[9px]">
                  <th className="py-1">Catégorie de Gains</th>
                  <th className="py-1 text-right">Montant Cumulé (FC)</th>
                  <th className="py-1 text-center">Taux Part</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700 font-mono">
                <tr>
                  <td className="py-2 text-slate-600 font-sans">Salaire de Base Cumulé</td>
                  <td className="py-2 text-right">{totalBase.toLocaleString('fr-FR')}</td>
                  <td className="py-2 text-center">{Math.round((totalBase / totalPayout) * 100)}%</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 font-sans">Primes Spécifiques Complémentaires</td>
                  <td className="py-2 text-right">{totalPrimes.toLocaleString('fr-FR')}</td>
                  <td className="py-2 text-center">{Math.round((totalPrimes / totalPayout) * 100)}%</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 font-sans">Indemnités de Transport/Logement</td>
                  <td className="py-2 text-right">{totalIndemnites.toLocaleString('fr-FR')}</td>
                  <td className="py-2 text-center">{Math.round((totalIndemnites / totalPayout) * 100)}%</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t border-slate-300 font-sans">
                  <td className="py-2 text-slate-900 font-extrabold">Total Ordonné Brut</td>
                  <td className="py-2 text-right font-mono text-blue-900">{totalPayout.toLocaleString('fr-FR')} FC</td>
                  <td className="py-2 text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-[10px] uppercase font-black text-slate-900 tracking-wider border-b border-slate-200 pb-1">
            Section C: Suivi des Contentieux de Paie (Réclamations)
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
            <div className="border border-slate-200 p-3 rounded">
              <span className="text-[9px] uppercase font-bold text-slate-400">Tickets Incident Actifs ou Suspendus</span>
              <p className="text-base font-extrabold text-blue-900 mt-1 font-mono">{unresolvedLitiges} Réclamations en cours</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Nécessite virement compensatoire ou correction de coordonnées de comptes.</p>
            </div>
            <div className="border border-slate-200 p-3 rounded">
              <span className="text-[9px] uppercase font-bold text-slate-400">Cas résolus avec succès</span>
              <p className="text-base font-extrabold text-green-700 mt-1 font-mono">{resolvedLitiges} Dossiers archivés</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Ordres de virements complémentaires exécutés.</p>
            </div>
          </div>
        </div>

        {/* Letter Closing & Official signature boxes */}
        <div className="pt-8 border-t border-slate-200/70 text-xs font-medium text-slate-600 text-justify">
          <p>
            En conclusion, l'ordonnancement de la paie pour la période sous examen se déroule normalement et reste sous contrôle permanent des structures de vérification du Secrétariat Général de l'Intégration Régionale. Nous certifions de la parfaite véracité des éléments consolidés ci-dessus.
          </p>
          
          <div className="pt-12 grid grid-cols-2 text-center text-[10px] font-bold">
            <div>
              <p className="uppercase text-slate-400 tracking-wider">Le Secrétaire Général</p>
              <div className="h-20 flex items-center justify-center">
                <div className="border border-blue-950/20 text-blue-950/40 font-mono text-[9px] px-3 py-1 uppercase rounded-md rotate-2 border-dashed font-extrabold">
                  SEC.GEN
                </div>
              </div>
              <p className="font-extrabold text-slate-700 text-xs">Avis favorable d'audit</p>
            </div>

            <div>
              <p className="uppercase text-slate-400 tracking-wider">L'Ordonnateur Général Délégué</p>
              <div className="h-20 flex items-center justify-center">
                {/* Visual stamping simulation */}
                <div className="w-16 h-16 border-2 border-red-500/30 text-red-500/50 rounded-full flex items-center justify-center font-extrabold -rotate-12 border-dotted text-[9px] select-none p-1 leading-tight text-center uppercase">
                  VISA INTÉGRATION REGIONALE
                </div>
              </div>
              <p className="font-extrabold text-slate-800 text-xs">Visa général de paie</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
