export type UserSubject = {
  id_sujet: number;
  nom: string;
  description: string;
};

export type RecapWithSubject = {
  id_recap: number;
  created_at: string;
  titre: string;
  resume: string | string[] | Record<string, string>;
  contenu: string;
  id_sujet: number;
  sujet: { nom: string } | null;
};
