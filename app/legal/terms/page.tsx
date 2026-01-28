import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Conditions Générales d'Utilisation (CGU)
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
        </p>

        <div className="space-y-8 text-gray-700">
          {/* 1. Objet */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              1. Objet de la plateforme
            </h2>
            <p>
              Depanne Moi est une plateforme de mise en relation entre professionnels du transport
              (chauffeurs, remorqueurs) permettant d'optimiser les trajets retour et d'éviter les
              trajets à vide.
            </p>
            <p className="mt-4">
              La plateforme permet aux utilisateurs de :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Publier des trajets disponibles</li>
              <li>Rechercher et réserver des trajets</li>
              <li>Entrer en contact avec d'autres professionnels</li>
            </ul>
          </section>

          {/* 2. Acceptation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              2. Acceptation des CGU
            </h2>
            <p>
              L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes
              Conditions Générales d'Utilisation. En créant un compte, vous confirmez avoir lu et
              accepté ces conditions.
            </p>
          </section>

          {/* 3. Inscription */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              3. Inscription et compte utilisateur
            </h2>
            <p className="mb-4">
              Pour utiliser la plateforme, vous devez :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Être un <strong>professionnel du transport</strong></li>
              <li>Être <strong>majeur</strong> (18 ans minimum)</li>
              <li>Fournir des <strong>informations exactes et à jour</strong></li>
              <li>Accepter la <Link href="/legal/privacy" className="text-blue-600 hover:underline">Politique de confidentialité</Link></li>
            </ul>
            <p className="mt-4 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              ⚠️ Vous êtes responsable de la confidentialité de votre mot de passe et de toutes
              les activités effectuées depuis votre compte.
            </p>
          </section>

          {/* 4. Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              4. Services fournis
            </h2>
            <h3 className="text-xl font-semibold mb-2">4.1. Mise en relation uniquement</h3>
            <p className="mb-4">
              Depanne Moi est une <strong>plateforme de mise en relation</strong>. Nous ne sommes pas :
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Un transporteur</li>
              <li>Un intermédiaire de transport</li>
              <li>Un organisateur de transports</li>
            </ul>
            <p className="mt-4">
              Les transactions, accords et paiements se font <strong>directement entre les professionnels</strong>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">4.2. Responsabilité limitée</h3>
            <p>
              Nous ne sommes pas responsables :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>De la qualité des services fournis entre professionnels</li>
              <li>Des dommages causés pendant le transport</li>
              <li>Des litiges entre utilisateurs</li>
              <li>De la véracité des informations publiées par les utilisateurs</li>
            </ul>
          </section>

          {/* 5. Obligations */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              5. Obligations des utilisateurs
            </h2>
            <p className="mb-4">Vous vous engagez à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>✅ Fournir des informations <strong>exactes et à jour</strong></li>
              <li>✅ Utiliser la plateforme de manière <strong>loyale et professionnelle</strong></li>
              <li>✅ Respecter les <strong>lois en vigueur</strong> (code de la route, transport, etc.)</li>
              <li>✅ Ne pas publier de <strong>contenus illégaux ou offensants</strong></li>
              <li>✅ Honorer vos <strong>engagements</strong> (réservations, trajets publiés)</li>
              <li>⛔ Ne pas utiliser la plateforme à des fins frauduleuses</li>
            </ul>
          </section>

          {/* 6. Paiements */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              6. Paiements et tarifs
            </h2>
            <h3 className="text-xl font-semibold mb-2">6.1. Service gratuit (MVP)</h3>
            <p className="mb-4">
              L'utilisation de la plateforme est actuellement <strong>gratuite</strong>.
              Aucune commission n'est prélevée sur les transactions entre professionnels.
            </p>

            <h3 className="text-xl font-semibold mb-2">6.2. Paiements entre professionnels</h3>
            <p>
              Les paiements se font <strong>hors plateforme</strong>, directement entre le chauffeur
              et le client (espèces, virement, chèque, etc.). Depanne Moi ne gère aucun paiement.
            </p>
          </section>

          {/* 7. Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              7. Propriété intellectuelle
            </h2>
            <p>
              Tous les éléments de la plateforme (design, code, logo, textes) sont la propriété
              exclusive de Depanne Moi et sont protégés par le droit d'auteur.
            </p>
            <p className="mt-4">
              Vous conservez la propriété des contenus que vous publiez (trajets, informations).
            </p>
          </section>

          {/* 8. Données personnelles */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              8. Protection des données personnelles (RGPD)
            </h2>
            <p>
              Vos données sont traitées conformément au RGPD et à notre{' '}
              <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
            <p className="mt-4">
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
            </p>
          </section>

          {/* 9. Résiliation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              9. Suspension et résiliation
            </h2>
            <h3 className="text-xl font-semibold mb-2">9.1. Suspension par l'utilisateur</h3>
            <p className="mb-4">
              Vous pouvez supprimer votre compte à tout moment depuis votre{' '}
              <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
                profil
              </Link>.
            </p>

            <h3 className="text-xl font-semibold mb-2">9.2. Suspension par Depanne Moi</h3>
            <p>
              Nous nous réservons le droit de suspendre ou supprimer un compte en cas de :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Non-respect des présentes CGU</li>
              <li>Fraude ou utilisation abusive</li>
              <li>Comportement inapproprié</li>
              <li>Plaintes répétées d'autres utilisateurs</li>
            </ul>
          </section>

          {/* 10. Loi applicable */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              10. Loi applicable et juridiction
            </h2>
            <p className="mb-4">
              Les présentes CGU sont régies par le <strong>droit français</strong> et le <strong>droit européen</strong> (RGPD).
            </p>
            <p>
              En cas de litige, les tribunaux français seront compétents après tentative de
              résolution amiable.
            </p>
          </section>

          {/* 11. Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              11. Contact
            </h2>
            <p className="mb-2">
              Pour toute question concernant ces CGU :
            </p>
            <p className="bg-gray-50 p-4 rounded">
              <strong>Email :</strong> [À COMPLÉTER - contact@votre-entreprise.fr]
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                ⚠️ <strong>ACTION REQUISE :</strong> Complétez avec votre vrai email de contact.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-800">
            → Voir la Politique de confidentialité (RGPD)
          </Link>
        </div>
      </div>
    </div>
  )
}
