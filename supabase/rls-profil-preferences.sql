-- Politiques RLS pour sauvegarder les niches depuis l'app (clé anon + session)
-- À exécuter dans Supabase → SQL Editor si la sauvegarde échoue avec une erreur "policy"

ALTER TABLE public.profil ENABLE ROW LEVEL SECURITY;

-- Lecture : ses propres lignes de préférences niche
DROP POLICY IF EXISTS "profil_select_own_niches" ON public.profil;
CREATE POLICY "profil_select_own_niches"
  ON public.profil FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND id_sujet IS NOT NULL);

-- Insertion : ses propres préférences
DROP POLICY IF EXISTS "profil_insert_own_niches" ON public.profil;
CREATE POLICY "profil_insert_own_niches"
  ON public.profil FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND id_sujet IS NOT NULL);

-- Suppression : ses propres préférences niche
DROP POLICY IF EXISTS "profil_delete_own_niches" ON public.profil;
CREATE POLICY "profil_delete_own_niches"
  ON public.profil FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND id_sujet IS NOT NULL);
