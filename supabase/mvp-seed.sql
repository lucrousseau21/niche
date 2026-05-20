-- MVP Niche : sujets (IDs 1–3) + veilles fournies par l'équipe
-- Exécuter dans Supabase → SQL Editor

-- 1) Sujets (upsert par id)
INSERT INTO public.sujet (id_sujet, nom, description)
VALUES
  (1, 'Développement Fullstack & Web3', 'Frameworks, architectures, smart contracts et écosystème Web3.'),
  (2, 'Intelligence Artificielle & Data', 'LLM, data engineering, MLOps et outils d''analyse.'),
  (3, 'Design d''Interface & UX', 'UI, accessibilité, design systems et recherche utilisateur.')
ON CONFLICT (id_sujet) DO UPDATE SET
  nom = EXCLUDED.nom,
  description = EXCLUDED.description;

-- 2) Recaps MVP (remplace les veilles existantes pour ces sujets)
DELETE FROM public.recap WHERE id_sujet IN (1, 2, 3);

INSERT INTO public.recap (id_sujet, titre, resume, contenu) VALUES
(
  1,
  'Next.js 15 et l''écosystème React en 2026',
  '{"titre_1": "Partial Prerendering (PPR) stabilisé", "titre_2": "Turbopack devient le bundler par défaut", "titre_3": "Changement majeur sur les defaults du cache"}'::jsonb,
  '## Contexte
L''écosystème React s''est stabilisé autour de Next.js 15 et de React 19 comme standards de production. Les concepts de Server Components et de Server Actions sont désormais adoptés massivement pour les applications métier.

## Points clés
- **Partial Prerendering (PPR) :** C''est la grande évolution. Il permet de combiner sur une même page une coque statique (générée au build) et des composants dynamiques streamés en temps réel.
- **Turbopack par défaut :** Webpack tire sa révérence. Le bundler écrit en Rust est désormais activé par défaut pour le développement, divisant par 4 le temps de démarrage local.
- **Refonte du cache :** Par défaut, les requêtes `fetch` et les Route Handlers ne sont plus mis en cache automatiquement. Les développeurs doivent désormais opter explicitement (*opt-in*) pour la mise en cache.

## À retenir
Next.js 15 met fin à l''ère des usines à gaz de configuration. Le framework privilégie la vitesse brute en développement avec Turbopack et un contrôle granulaire du rendu hybride grâce au PPR.'
),
(
  2,
  'L''ère du GPT-5.5 et des agents financiers',
  '{"titre_1": "Déploiement global de GPT-5.5 Instant", "titre_2": "Claude se structure pour les workflows d''entreprise", "titre_3": "Baisse massive du taux de détection des hallucinations"}'::jsonb,
  '## Contexte
Le marché des LLM ne se résume plus à une simple course à la taille des modèles, mais s''oriente vers la spécialisation métier et la réduction drastique des erreurs pour des cas d''usage critiques.

## Points clés
- **GPT-5.5 Instant :** Devenu le nouveau modèle par défaut d''OpenAI, il affiche une baisse de plus de 50% des hallucinations sur les sujets complexes (finance, droit, médecine) par rapport aux versions précédentes.
- **Agents d''entreprise par Anthropic :** Claude s''intègre nativement au cœur des outils bureautiques (Excel, Word) avec des templates d''agents autonomes capables de gérer des audits, des revues de résultats ou du KYC sans coupure de contexte.
- **Course aux puces et infrastructures :** La compétition reste un enjeu de matériel, illustré par les investissements massifs des laboratoires d''IA auprès des géants du Cloud pour réserver de la capacité de calcul brute (TPU).

## À retenir
L''IA en 2026 devient une couche opérationnelle invisible. On passe des chatbots généralistes à des agents fiables, connectés à nos données et capables de chaîner des actions complexes de bout en bout.'
),
(
  3,
  'Figma 2026 : Du design d''interface au ''Vibe Coding''',
  '{"titre_1": "Figma AI s''impose dans le nettoyage des fichiers", "titre_2": "Figma Sites et le prototypage de production", "titre_3": "Code Connect unifie enfin le Design et le Dev"}'::jsonb,
  '## Contexte
Figma a achevé sa mutation. L''outil n''est plus seulement une application de dessin vectoriel pour interfaces, mais une plateforme complète englobant la création de sites, les présentations et la génération de code.

## Points clés
- **Fonctionnalités Figma AI :** L''intelligence artificielle gère désormais la corvée du renommage automatique des calques, la recherche visuelle de composants similaires dans l''organisation et la réécriture contextuelle de micro-copies (UX writing).
- **Figma Sites & Make :** L''introduction de ces modules permet de passer d''un simple ''vibe design'' à un site web fonctionnel et publiable sans coder, tout en respectant le Design System de l''équipe.
- **Code Connect et Flexbox/Grid :** L''export de code s''améliore nettement grâce à l''IA qui analyse la structure globale pour générer du code CSS (Grid et Flexbox) propre et sémantique, directement relié aux composants React ou Storybook de production.

## À retenir
La frontière entre designer et développeur continue de s''estomper. Figma se positionne comme l''outil central de l''équipe produit, capable de traduire visuellement une idée en composants de code quasi prêts pour la production.'
);
