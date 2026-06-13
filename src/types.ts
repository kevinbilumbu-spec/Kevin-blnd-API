export type SexeType = 'M' | 'F';

export type EtatCivilType = 'Célibataire' | 'Marié' | 'Divorcé' | 'Veuf';

export type StatutAgentType = 'Actif' | 'Suspendu' | 'Retraité';

export interface Agent {
  matricule: string;
  nom: string;
  postNom: string;
  sexe: SexeType;
  dateNaissance: string;
  etatCivil: EtatCivilType;
  telephone: string;
  adresse: string;
  
  // Professional info
  ministere: string;
  secretariatGeneral: string;
  serviceRH: string;
  fonction: string;
  grade: string;
  dateEngagement: string;
  statut: StatutAgentType;
  
  // Payroll info
  salaireBase: number;
  prime: number;
  indemnites: number;
  banque: string;
  numeroCompte: string;
  total: number; // calculated as salaireBase + prime + indemnites
}

export type ComplaintStatus = 'En cours' | 'Résolu' | 'En attente';

export interface Complaint {
  id: string;
  agentMatricule: string;
  agentNomComplet: string;
  probleme: string;
  dateSignalement: string;
  statut: ComplaintStatus;
  commentaire: string;
}

export interface BankConfig {
  mode: 'Manuel' | 'API';
  apiConnected: boolean;
  apiEndpoint: string;
  lastSyncDate: string;
}

export type ReportRecipient = 'Ministre de l\'Intégration Régionale' | 'Secrétaire Général' | 'Banque' | 'Comptable';
