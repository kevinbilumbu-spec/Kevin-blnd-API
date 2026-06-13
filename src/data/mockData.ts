import { Agent, Complaint } from '../types';

export const MINISTE_LIST = [
  'Ministère de l\'Intégration Régionale'
];

export const GRADES_LIST = [
  'Secrétaire Général (SG)',
  'Directeur (DIR)',
  'Chef de Division (CD)',
  'Chef de Bureau (CB)',
  'Attaché d\'Administration de 1ère classe (ATB1)',
  'Attaché d\'Administration de 2ème classe (ATB2)',
  'Agent d\'Administration de 1ère classe (AD1)',
  'Agent d\'Administration de 2ème classe (AD2)'
];

export const BANQUES_LIST = [
  'Banque Centrale du Congo (BCC)',
  'Rawbank',
  'Equity BCDC',
  'Trust Merchant Bank (TMB)',
  'Access Bank',
  'Standard Bank'
];

export const INITIAL_AGENTS: Agent[] = [
  {
    matricule: "A-004291",
    nom: "KABANGE",
    postNom: "MWENZE Jean-Paul",
    sexe: "M",
    dateNaissance: "1978-04-12",
    etatCivil: "Marié",
    telephone: "+243 812 345 678",
    adresse: "Av. de la Gombe 14, Kinshasa/Gombe",
    ministere: "Ministère de l'Intégration Régionale",
    secretariatGeneral: "Secrétariat Général",
    serviceRH: "Direction des Ressources Humaines - Intégration Régionale",
    fonction: "Chef de Division de Coordination d'Intégration",
    grade: "Chef de Division (CD)",
    dateEngagement: "2005-09-15",
    statut: "Actif",
    salaireBase: 450000,
    prime: 120000,
    indemnites: 85000,
    banque: "Rawbank",
    numeroCompte: "01002340596-88",
    total: 655000
  },
  {
    matricule: "A-009823",
    nom: "MUTOMBO",
    postNom: "BILONDA Thérèse",
    sexe: "F",
    dateNaissance: "1983-11-22",
    etatCivil: "Marié",
    telephone: "+243 998 765 432",
    adresse: "Rond-point Ngaba 45, Kinshasa/Limete",
    ministere: "Ministère de l'Intégration Régionale",
    secretariatGeneral: "Secrétariat Général",
    serviceRH: "Cellule de Gestion de la Paie",
    fonction: "Chef de Bureau du Suivi des Affaires Régionales",
    grade: "Chef de Bureau (CB)",
    dateEngagement: "2010-02-10",
    statut: "Actif",
    salaireBase: 380000,
    prime: 95000,
    indemnites: 60000,
    banque: "Equity BCDC",
    numeroCompte: "02094589021-43",
    total: 535000
  },
  {
    matricule: "A-010543",
    nom: "ILUNGA",
    postNom: "TSHIMANGA Dieudonné",
    sexe: "M",
    dateNaissance: "1960-03-05",
    etatCivil: "Marié",
    telephone: "+243 854 112 233",
    adresse: "Av. Kabinda 102, Kinshasa/Lingwala",
    ministere: "Ministère de l'Intégration Régionale",
    secretariatGeneral: "Secrétariat Général",
    serviceRH: "Division de l'Administration Générale",
    fonction: "Directeur Adjoint de l'Intégration Communautaire",
    grade: "Directeur (DIR)",
    dateEngagement: "1988-06-01",
    statut: "Retraité",
    salaireBase: 550000,
    prime: 150000,
    indemnites: 120000,
    banque: "Banque Centrale du Congo (BCC)",
    numeroCompte: "00001004052-11",
    total: 820000
  },
  {
    matricule: "A-012994",
    nom: "NGOY",
    postNom: "MULAND Grace",
    sexe: "F",
    dateNaissance: "1991-07-08",
    etatCivil: "Célibataire",
    telephone: "+243 903 445 566",
    adresse: "Av. Bypass 56, Kinshasa/Lemba",
    ministere: "Ministère de l'Intégration Régionale",
    secretariatGeneral: "Secrétariat Général",
    serviceRH: "Direction administrative",
    fonction: "Attaché d'Administration Paie",
    grade: "Attaché d'Administration de 1ère classe (ATB1)",
    dateEngagement: "2016-11-20",
    statut: "Actif",
    salaireBase: 320000,
    prime: 70000,
    indemnites: 50000,
    banque: "Trust Merchant Bank (TMB)",
    numeroCompte: "04034871902-12",
    total: 440000
  },
  {
    matricule: "A-007821",
    nom: "KASONG",
    postNom: "BEYA Christian",
    sexe: "M",
    dateNaissance: "1985-05-18",
    etatCivil: "Marié",
    telephone: "+243 821 556 778",
    adresse: "Quartier Joli Parc 8, Kinshasa/Ngaliema",
    ministere: "Ministère de l'Intégration Régionale",
    secretariatGeneral: "Secrétariat Général",
    serviceRH: "Coordination Régionale de Kinshasa",
    fonction: "Inspecteur de Liaison Régionale",
    grade: "Chef de Division (CD)",
    dateEngagement: "2012-04-05",
    statut: "Suspendu",
    salaireBase: 440000,
    prime: 0,
    indemnites: 40000,
    banque: "Rawbank",
    numeroCompte: "01004928172-55",
    total: 480000
  },
  {
    matricule: "A-013112",
    nom: "MBUYI",
    postNom: "KALALA Eugénie",
    sexe: "F",
    dateNaissance: "1994-01-30",
    etatCivil: "Célibataire",
    telephone: "+243 898 333 444",
    adresse: "Kalamu Matonge Av. Stade 32",
    ministere: "Ministère de l'Intégration Régionale",
    secretariatGeneral: "Secrétariat Général",
    serviceRH: "Recrutement et carrière",
    fonction: "Secrétaire Administrative de direction",
    grade: "Agent d'Administration de 1ère classe (AD1)",
    dateEngagement: "2020-03-01",
    statut: "Actif",
    salaireBase: 250000,
    prime: 40000,
    indemnites: 30000,
    banque: "Access Bank",
    numeroCompte: "05048293810-09",
    total: 320000
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "REC-2026-001",
    agentMatricule: "A-012994",
    agentNomComplet: "NGOY MULAND Grace",
    probleme: "Salaire non reçu pour le mois de Mai 2026",
    dateSignalement: "2026-06-02",
    statut: "En cours",
    commentaire: "Dossier transmis au guichet TMB. En attente de confirmation de la banque."
  },
  {
    id: "REC-2026-002",
    agentMatricule: "A-007821",
    agentNomComplet: "KASONG BEYA Christian",
    probleme: "Correction indemnités de logement omises",
    dateSignalement: "2026-06-05",
    statut: "En attente",
    commentaire: "Le statut Suspendu de l'agent restreint le versement des primes complémentaires. Requête en cours de traitement au Service des Contentieux RH."
  },
  {
    id: "REC-2026-003",
    agentMatricule: "A-009823",
    agentNomComplet: "MUTOMBO BILONDA Thérèse",
    probleme: "Ancien compte bancaire ciblé au lieu du nouveau",
    dateSignalement: "2026-05-28",
    statut: "Résolu",
    commentaire: "Modification de RIB enregistrée avec succès. Virement compensatoire exécuté le 01/06/2026."
  }
];
