import React, { useState } from 'react';
import { Agent } from '../types';
import { BANQUES_LIST } from '../data/mockData';
import { FileSpreadsheet, Cpu, RefreshCw, Send, CheckCircle } from 'lucide-react';

interface BankCommunicatorProps {
  agents: Agent[];
}

export default function BankCommunicator({ agents }: BankCommunicatorProps) {
  // State 
  const [bankMode, setBankMode] = useState<'Manuel' | 'API'>('Manuel');
  const [emailTo, setEmailTo] = useState('notifications-compensation@bcc.cd');
  const [emailSubject, setEmailSubject] = useState('ADMINISTRATION RH-INTÉGRATION RÉGIONALE: Fichier de compensation Salaires Juin 2026');
  const [emailBody, setEmailBody] = useState(
    `Bonjour,\n\nVeuillez trouver ci-joint l'ordre officiel de virement ainsi que la liste compensatoire consolidée pour le compte de la paie des fonctionnaires de l'État pour le mois de Juin 2026.\n\nTotal ordonnancé: ${agents.reduce((acc, a) => acc + a.total, 0).toLocaleString('fr-FR')} FC pour ${agents.length} agents d'administration éligibles.\n\nCordialement,\nCabinet du Secrétaire Général\nDirection du Trésor public RDC.`
  );
  
  const [emailSent, setEmailSent] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // API Config States
  const [apiConnected, setApiConnected] = useState(false);
  const [apiConsole, setApiConsole] = useState<string[]>([]);
  const [apiLoading, setApiLoading] = useState(false);

  // Totals
  const totalPayout = agents.reduce((acc, a) => acc + a.total, 0);

  // Generate simulated CSV and Trigger Download
  const handleDownloadCSV = () => {
    setExportComplete(true);
    
    // Create CSV content
    const headers = "Matricule,Nom,PostNom,Banque,Compte,Base,Primes,Indemnites,Total\n";
    const rows = agents.map(a => 
      `"${a.matricule}","${a.nom}","${a.postNom}","${a.banque}","${a.numeroCompte}",${a.salaireBase},${a.prime},${a.indemnites},${a.total}`
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `PAIE_RDC_COMPENSATION_JUIN_2026.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setExportComplete(false), 4000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
    }, 4000);
  };

  // Automated bank API sync sequence simulator
  const handleTriggerAPISync = () => {
    setApiLoading(true);
    setApiConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] Début du handshake sécurisé SSL avec BCC-Net API...`]);
    
    setTimeout(() => {
      setApiConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] Authentification JWT : Certificat de l'ordonnateur validé.`]);
      setTimeout(() => {
        setApiConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] Envoi du payload JSON : ${agents.length} comptes de salaires...`]);
        setTimeout(() => {
          setApiConsole(prev => [
            ...prev, 
            `[${new Date().toLocaleTimeString()}] Réponse BCC: 200 OK. Virement en bloc de ${totalPayout.toLocaleString('fr-FR')} FC accepté. CODE RETOUR BCC-77921.`
          ]);
          setApiLoading(false);
          setApiConnected(true);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div id="bank-communicator-container" className="space-y-6">
      
      {/* Selector of Modernity level */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Canal de Communication Bancaire</h2>
          <p className="text-xs text-slate-500">Du format administratif manuel à la connexion directe Banque Centrale</p>
        </div>

        <div className="bg-slate-100 p-1 rounded-lg flex space-x-1.5 font-bold text-xs">
          <button
            onClick={() => setBankMode('Manuel')}
            className={`py-1.5 px-4 rounded-md cursor-pointer transition-all flex items-center space-x-1.5 ${
              bankMode === 'Manuel' 
                ? 'bg-blue-950 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>1. Excel & Email (Manuel)</span>
          </button>
          
          <button
            onClick={() => setBankMode('API')}
            className={`py-1.5 px-4 rounded-md cursor-pointer transition-all flex items-center space-x-1.5 ${
              bankMode === 'API' 
                ? 'bg-blue-950 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>2. API Intégrée (Automatique)</span>
          </button>
        </div>
      </div>

      {bankMode === 'Manuel' ? (
        /* MANUEL MODE: DOWNLOAD EXCEL / EXPORT + EMAIL FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Step 1: Export records */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/60 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Étape 1</span>
              <h3 className="text-base font-bold text-slate-900 mt-2">Générer le Fichier de Virement (CSV/Excel)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Télécharger le fichier de compensation récapitulant les matricules, comptes de dépôt, banques et montants exacts calculés pour chaque fonctionnaire de l'État.
              </p>
            </div>

            {/* Simulated file layout */}
            <div className="border border-dashed border-slate-200 p-4 rounded-lg bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-600" />
                  PAIE_RDC_COMPENSATION_JUIN_2026.csv
                </span>
                <span className="text-slate-400 font-mono text-[10px]">~24 KB</span>
              </div>
              <div className="space-y-1.5 font-mono text-[9px] text-slate-400">
                <p className="truncate">"Matricule","Nom","PostNom","Banque","Compte","Total"</p>
                <p className="truncate">"A-004291","KABANGE","MWENZE Jean-Paul","Rawbank","01002340596-88",655000</p>
                <p className="truncate">"A-009823","MUTOMBO","BILONDA Thérèse","Equity BCDC","02094589021-43",535000</p>
              </div>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-sm text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{exportComplete ? "Virement Exporté ! (Téléchargement Lancé)" : "Exporter au format CSV (Excel)"}</span>
            </button>

            {exportComplete && (
              <p className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center animate-fade-in">
                Fichier de compensation généré avec succès dans le dossier Téléchargements.
              </p>
            )}

          </div>

          {/* Step 2: Email communication draft */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/60 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Étape 2</span>
              <h3 className="text-base font-bold text-slate-900 mt-2">Expédition d'Avis Sécurisé</h3>
              <p className="text-xs text-slate-500">Transmettre le document de calcul au guichet compensatoire de la Banque Centrale par courrier officiel.</p>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Destinataire</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sujet du Message</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Corps de l'Avis de compensation</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed font-medium"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/55 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center text-[11px] font-semibold text-slate-700">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Rapport_Compensation_Paie.csv (Joint)
                </span>
                <span className="text-[10px] font-bold text-slate-400">Attaché</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-950 hover:bg-slate-900 font-bold text-white text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmettre l'Avis de virement</span>
              </button>

              {emailSent && (
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-800 font-bold text-center rounded-lg flex items-center justify-center space-x-1.5 animate-bounce-slow">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Avis postal simulé envoyé avec succès avec la pièce jointe.</span>
                </div>
              )}

            </form>

          </div>

        </div>
      ) : (
        /* AUTOMATED API MODE WITH CONNECT DETAILS & CONSOLE LOG RUNNER */
        <div className="bg-white p-6 rounded-xl border border-slate-200/60 space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-extrabold uppercase">API Bank Direct</span>
              <h3 className="text-base font-bold text-slate-900 mt-2">Passerelle de Virement Instantané Automatique</h3>
              <p className="text-xs text-slate-500">Système sécurisé d'interfaçage de compensation raccordé au réseau interbancaire de la BCC.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${apiConnected ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${apiConnected ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-xs font-bold text-slate-700">
                Statut: {apiConnected ? "Connecté (BCC API V2)" : "En attente d'initialisation"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* API settings dashboard */}
            <div className="lg:col-span-4 space-y-4 text-xs font-medium text-slate-600">
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gateway Configuration</p>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Endpoint Host</label>
                  <p className="font-mono text-slate-800 font-bold mt-0.5">https://api-rtgs.bcc-net.gouv.cd/v1</p>
                </div>
                <div className="pt-2">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Security Scheme</label>
                  <p className="text-slate-800 font-bold">HMAC-SHA256 & TLS 1.3</p>
                </div>
                <div className="pt-2">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Enregistrements éligibles</label>
                  <p className="text-slate-800 font-extrabold">{agents.length} Fiches d'agents identifiées</p>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-200/50 p-4 rounded-xl space-y-2">
                <h4 className="font-extrabold text-blue-900 text-xs">Note administrative évolution</h4>
                <p className="text-[11px] text-blue-800 leading-relaxed font-semibold">
                  Cette passerelle évite les interférences d'export Excel et les erreurs de saisie manuelle. Les virements sont exécutés de compte à compte en quelques millisecondes après signature électronique du Ministre.
                </p>
              </div>
            </div>

            {/* Simulated Live command console */}
            <div className="lg:col-span-8 bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col justify-between min-h-[300px]">
              
              <div className="space-y-2.5 font-mono text-[11px] text-zinc-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-zinc-500">
                  <span>TERMINAL DE COMPENSATION BCC DIRECT</span>
                  <span>SSL v3 Secured</span>
                </div>
                
                {apiConsole.length === 0 ? (
                  <p className="text-zinc-500 italic text-center py-12">
                    Console API inactive. Cliquez sur le virement automatique pour lancer le cycle.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                    {apiConsole.map((line, idx) => (
                      <p key={idx} className={line.includes('200 OK') ? 'text-green-400 font-bold' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Console Trigger buttons */}
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setApiConsole([])}
                  className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase font-bold"
                >
                  Effacer l'historique log
                </button>

                <button
                  onClick={handleTriggerAPISync}
                  disabled={apiLoading}
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {apiLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Requête en cours...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Exécuter API Virement Direct</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
