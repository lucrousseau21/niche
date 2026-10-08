-- Remplace en une fois les niches de l'utilisateur connecté (évite les doublons si DELETE RLS échoue)
-- Exécuter dans Supabase → SQL Editor (prod + local)

CREATE OR REPLACE FUNCTION public.replace_user_mvp_subjects(
  p_subject_ids bigint[],
  p_grade text DEFAULT 'Débutant'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  sid bigint;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  DELETE FROM public.profil
  WHERE user_id = uid AND id_sujet IS NOT NULL;

  IF p_subject_ids IS NULL OR array_length(p_subject_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  FOREACH sid IN ARRAY p_subject_ids
  LOOP
    IF EXISTS (SELECT 1 FROM public.sujet WHERE id_sujet = sid) THEN
      INSERT INTO public.profil (user_id, id_sujet, grade)
      VALUES (uid, sid, COALESCE(NULLIF(trim(p_grade), ''), 'Débutant'));
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.replace_user_mvp_subjects(bigint[], text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.replace_user_mvp_subjects(bigint[], text) TO authenticated;
