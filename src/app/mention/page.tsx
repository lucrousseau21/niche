import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales | Niche.",
  description:
    "Mentions légales de Niche. : éditeur, hébergement, propriété intellectuelle et données personnelles.",
};

const sectionClass =
  "mt-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm";
const paragraphClass = "mt-3 font-lato leading-relaxed text-[#2D3748]";

export default function MentionsLegales() {
  return (
    <>
      <Header />

      <main className="mx-auto mt-24 min-h-screen max-w-4xl bg-[#FFFAF0] px-6 py-16">
        <h1 className="font-montserrat text-4xl font-bold text-[#2D3748]">
          Mentions légales – Niche.
        </h1>
        <p className="mt-1 text-sm text-[#2D3748] opacity-70">
          Dernière mise à jour : 17/09/2026
        </p>

        <section className={`${sectionClass} mt-10`}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            1. Éditeur du site
          </h2>
          <p className={paragraphClass}>
            Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance
            dans l&apos;économie numérique (LCEN), les utilisateurs du site
            Niche., accessible à l&apos;adresse{" "}
            <a
              className="text-[#134E4A] underline"
              href="https://niche.fr"
            >
              https://niche.fr
            </a>
            , et de ses services associés (application web, newsletters,
            synthèses audio) sont informés de l&apos;identité des différents
            intervenants.
          </p>
          <p className={paragraphClass}>Le site et le service Niche. sont édités par :</p>
          <dl className="mt-4 grid gap-3 font-lato text-[#2D3748] sm:grid-cols-[minmax(0,1fr)_2fr]">
            <dt className="font-semibold">Nom commercial</dt>
            <dd>Niche&amp;Co. (service Niche.)</dd>
            <dt className="font-semibold">Forme juridique</dt>
            <dd>Entrepreneur individuel (EI), régime de la micro-entreprise</dd>
            <dt className="font-semibold">Adresse professionnelle</dt>
            <dd>57 rue Pierre Mauroy, 59800 Lille</dd>
            <dt className="font-semibold">SIREN</dt>
            <dd>010203040</dd>
            <dt className="font-semibold">TVA</dt>
            <dd>TVA non applicable, art. 293 B du CGI</dd>
            <dt className="font-semibold">E-mail</dt>
            <dd>
              <a className="text-[#134E4A] underline" href="mailto:contact.niche@gmail.com">
                contact.niche@gmail.com
              </a>
            </dd>
            <dt className="font-semibold">Téléphone</dt>
            <dd>
              <a className="text-[#134E4A] underline" href="tel:+33601020304">
                +33 6 01 02 03 04
              </a>
            </dd>
          </dl>
          <p className={paragraphClass}>
            Dans les présentes mentions, « Niche&amp;Co. » désigne
            l&apos;éditeur ci-dessus.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            2. Directeur de la publication
          </h2>
          <p className={paragraphClass}>
            Le directeur de la publication est secret, entrepreneur individuel
            exploitant Niche&amp;Co. Il est joignable à l&apos;adresse{" "}
            <a className="text-[#134E4A] underline" href="mailto:contact.niche@gmail.com">
              contact.niche@gmail.com
            </a>
            .
          </p>
          <p className={paragraphClass}>
            Il est responsable des contenus éditoriaux diffusés par Niche.
            (site, newsletters et synthèses audio), y compris ceux produits avec
            l&apos;assistance d&apos;outils d&apos;intelligence artificielle.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            3. Hébergement
          </h2>
          <p className={paragraphClass}>Le site et l&apos;application sont hébergés par :</p>
          <p className={paragraphClass}>
            Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723,
            États-Unis — Téléphone : +1 951-383-6898 —{" "}
            <a
              className="text-[#134E4A] underline"
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
            >
              vercel.com
            </a>
          </p>
          <p className={paragraphClass}>
            Les données de l&apos;application (comptes, préférences, contenus)
            sont stockées par :
          </p>
          <p className={paragraphClass}>
            Supabase Inc. — San Francisco, Californie, États-Unis —{" "}
            <a
              className="text-[#134E4A] underline"
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
            >
              supabase.com
            </a>{" "}
            — adresse postale et région d&apos;hébergement des données à
            confirmer.
          </p>
          <p className={paragraphClass}>
            Ces informations seront mises à jour en cas de changement
            d&apos;hébergeur.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            4. Propriété intellectuelle
          </h2>
          <p className={paragraphClass}>
            La marque Niche, son logo, la charte graphique, l&apos;interface,
            les textes, synthèses, analyses, mises en page, graphiques et
            contenus audio produits par Niche. sont protégés par le Code de la
            propriété intellectuelle. Ils sont la propriété de Niche&amp;Co. ou
            utilisés avec autorisation.
          </p>
          <p className={paragraphClass}>
            Toute reproduction, représentation, adaptation ou diffusion, totale
            ou partielle, sans accord écrit préalable de Niche&amp;Co. est
            interdite, sauf exceptions prévues par la loi.
          </p>
          <p className={paragraphClass}>
            L&apos;abonnement est nominatif et réservé à un usage personnel.
            Sont notamment interdits : la revente ou la rediffusion publique des
            newsletters, le transfert massif par e-mail, et la republication
            des épisodes audio sur une autre plateforme (podcast, réseau social,
            site).
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            5. Contenus générés avec l&apos;intelligence artificielle
          </h2>
          <p className={paragraphClass}>
            Niche. utilise des outils d&apos;intelligence artificielle pour
            sélectionner, résumer et mettre en forme l&apos;actualité des niches
            choisies par chaque utilisateur. Cette information est donnée
            conformément au règlement (UE) 2024/1689 sur l&apos;intelligence
            artificielle (AI Act), article 50.
          </p>
          <p className={paragraphClass}>
            <span className="font-semibold">Newsletters et synthèses écrites.</span>{" "}
            Les synthèses sont rédigées à partir de sources sélectionnées, avec
            l&apos;assistance de modèles de langage, puis relues par
            l&apos;équipe éditoriale de Niche. avant diffusion. La
            responsabilité éditoriale en revient au directeur de la publication.
          </p>
          <p className={paragraphClass}>
            <span className="font-semibold">
              Récapitulatifs audio (fonctionnalité à venir).
            </span>{" "}
            Niche. proposera des récapitulatifs audio quotidiens, hebdomadaires
            ou selon d&apos;autres fréquences, construits à partir des niches
            choisies par l&apos;utilisateur. Ces épisodes sont :
          </p>
          <ul className="mt-3 ml-6 list-disc space-y-2 font-lato leading-relaxed text-[#2D3748]">
            <li>générés automatiquement à partir des synthèses écrites de Niche. ;</li>
            <li>lus par une voix de synthèse, qui n&apos;imite la voix d&apos;aucune personne réelle ;</li>
            <li>signalés comme contenus générés par IA au début de chaque épisode et dans le lecteur ;</li>
            <li>accompagnés, dans l&apos;application, de la liste des sources utilisées.</li>
          </ul>
          <p className={paragraphClass}>
            Malgré ces précautions, un contenu généré par IA peut comporter des
            erreurs, omissions ou approximations. L&apos;utilisateur est invité
            à consulter les sources d&apos;origine avant toute décision.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            6. Sources, liens et droits des tiers
          </h2>
          <p className={paragraphClass}>
            Les synthèses de Niche. renvoient vers les contenus d&apos;origine,
            qui restent la propriété de leurs auteurs et éditeurs. Niche. ne
            reproduit pas intégralement ces contenus et en cite systématiquement
            la source.
          </p>
          <p className={paragraphClass}>
            Les liens hypertextes présents sur le site, dans les newsletters ou
            dans les épisodes audio mènent vers des sites tiers. Niche&amp;Co.
            n&apos;exerce aucun contrôle sur ces sites et n&apos;est pas
            responsable de leur contenu.
          </p>
          <p className={paragraphClass}>
            Tout auteur, éditeur ou ayant droit qui s&apos;oppose à
            l&apos;utilisation de ses contenus peut écrire à{" "}
            <a className="text-[#134E4A] underline" href="mailto:contact.niche@gmail.com">
              contact.niche@gmail.com
            </a>
            . La demande sera traitée dans les meilleurs délais et, si elle est
            fondée, le contenu concerné sera retiré.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            7. Limitation de responsabilité
          </h2>
          <p className={paragraphClass}>
            Les contenus de Niche, écrits comme audio, sont des synthèses à visée
            informative. Ils ne constituent ni un conseil en investissement, ni
            un conseil juridique, ni une incitation à l&apos;achat, notamment
            pour les thématiques finance, crypto-actifs ou droit.
          </p>
          <p className={paragraphClass}>
            Niche&amp;Co. s&apos;efforce de fournir des informations fiables et
            à jour mais ne garantit pas leur exactitude ni leur exhaustivité.
            Sa responsabilité ne saurait être engagée du fait d&apos;erreurs,
            d&apos;omissions, d&apos;interruptions du service ou de l&apos;usage
            que l&apos;utilisateur fait des informations diffusées.
          </p>
          <p className={paragraphClass}>
            Les conditions d&apos;accès et d&apos;abonnement sont détaillées dans
            les{" "}
            <Link className="text-[#134E4A] underline" href="/CGU">
              Conditions générales d&apos;utilisation
            </Link>
            .
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            8. Données personnelles et cookies
          </h2>
          <p className={paragraphClass}>
            Niche&amp;Co. traite les données personnelles des utilisateurs
            (adresse e-mail, préférences de niches, niveau d&apos;expertise,
            données d&apos;usage des newsletters et des épisodes audio)
            conformément au RGPD et à la loi Informatique et Libertés. Le détail
            des traitements figure dans la{" "}
            <Link className="text-[#134E4A] underline" href="/conf">
              Politique de confidentialité
            </Link>
            .
          </p>
          <p className={paragraphClass}>
            Chaque utilisateur dispose d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, d&apos;opposition et de
            portabilité de ses données, à exercer à l&apos;adresse{" "}
            <a className="text-[#134E4A] underline" href="mailto:contact.niche@gmail.com">
              contact.niche@gmail.com
            </a>
            . Il peut aussi introduire une réclamation auprès de la CNIL (
            <a
              className="text-[#134E4A] underline"
              href="https://www.cnil.fr"
              target="_blank"
              rel="noreferrer"
            >
              www.cnil.fr
            </a>
            ).
          </p>
          <p className={paragraphClass}>
            Le site utilise des cookies nécessaires à son fonctionnement et,
            sous réserve du consentement de l&apos;utilisateur, des cookies de
            mesure d&apos;audience déposés via Google Tag Manager. Les choix
            peuvent être modifiés à tout moment depuis le bandeau cookies.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-montserrat text-xl font-semibold text-[#134E4A]">
            9. Médiation, droit applicable et contact
          </h2>
          <p className={paragraphClass}>
            Conformément à l&apos;article L.612-1 du Code de la consommation,
            l&apos;utilisateur consommateur peut recourir gratuitement au
            médiateur de la consommation suivant :{" "}
            <a
              className="text-[#134E4A] underline"
              href="https://www.economie.gouv.fr/mediateur/je-saisis-le-mediateur"
              target="_blank"
              rel="noreferrer"
            >
              l&apos;état
            </a>
            . Il doit au préalable avoir adressé une réclamation écrite à{" "}
            <a className="text-[#134E4A] underline" href="mailto:contact.niche@gmail.com">
              contact.niche@gmail.com
            </a>
            .
          </p>
          <p className={paragraphClass}>
            Les présentes mentions légales sont soumises au droit français. En
            cas de litige, et après tentative de résolution amiable, les
            tribunaux français seront compétents.
          </p>
          <p className={paragraphClass}>
            Pour toute question :{" "}
            <a className="text-[#134E4A] underline" href="mailto:contact.niche@gmail.com">
              contact.niche@gmail.com
            </a>
            .
          </p>
        </section>

      </main>
      <Footer />
    </>
  );
}