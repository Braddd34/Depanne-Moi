import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          🇪🇺 Politique de Confidentialité (RGPD)
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
        </p>

        <div className="space-y-8 text-gray-700">
          {/* 1. Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              1. Responsable du traitement des données
            </h2>
            <p className="mb-2">
              <strong>Nom de l'entreprise :</strong> [À COMPLÉTER - Votre raison sociale]
            </p>
            <p className="mb-2">
              <strong>Adresse :</strong> [À COMPLÉTER - Votre adresse]
            </p>
            <p className="mb-2">
              <strong>Email :</strong> [À COMPLÉTER - contact@votre-entreprise.fr]
            </p>
            <p className="mb-2">
              <strong>Téléphone :</strong> [À COMPLÉTER - Votre numéro]
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                ⚠️ <strong>ACTION REQUISE :</strong> Vous devez compléter ces informations avec vos vraies coordonnées d'entreprise.
              </p>
            </div>
          </section>

          {/* 2. Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              2. Données personnelles collectées
            </h2>
            <p className="mb-4">
              Conformément au principe de <strong>minimisation des données</strong> (article 5 du RGPD),
              nous ne collectons que les données strictement nécessaires au fonctionnement du service :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Nom et prénom</strong> : pour l'identification</li>
              <li><strong>Adresse email</strong> : pour la connexion et les notifications</li>
              <li><strong>Numéro de téléphone</strong> : pour faciliter la mise en relation</li>
              <li><strong>Entreprise</strong> (optionnel) : pour le contexte professionnel</li>
              <li><strong>Type de véhicule</strong> (optionnel) : pour la pertinence des trajets</li>
              <li><strong>Données de trajets</strong> : villes de départ/arrivée, dates, prix</li>
            </ul>
          </section>

          {/* 3. Base légale */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              3. Base légale du traitement (Article 6 RGPD)
            </h2>
            <p className="mb-4">Le traitement de vos données repose sur :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>L'exécution d'un contrat</strong> (article 6.1.b) : nécessaire pour vous fournir le service de mise en relation
              </li>
              <li>
                <strong>Votre consentement</strong> (article 6.1.a) : pour l'envoi d'emails transactionnels (que vous pouvez retirer à tout moment)
              </li>
            </ul>
          </section>

          {/* 4. Finalités */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              4. Finalités du traitement
            </h2>
            <p className="mb-4">Vos données sont utilisées uniquement pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Créer et gérer votre compte</li>
              <li>Publier et réserver des trajets</li>
              <li>Faciliter la mise en relation entre professionnels</li>
              <li>Envoyer des notifications transactionnelles (confirmations de réservation)</li>
              <li>Assurer la sécurité de la plateforme</li>
            </ul>
            <p className="mt-4 text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
              ✅ <strong>Nous n'utilisons JAMAIS vos données à des fins publicitaires ou commerciales.</strong>
            </p>
          </section>

          {/* 5. Destinataires */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              5. Destinataires des données
            </h2>
            <p className="mb-4">Vos données sont partagées uniquement avec :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Les autres utilisateurs</strong> : nom, téléphone, email (uniquement après une réservation)</li>
              <li><strong>Nos sous-traitants</strong> (article 28 RGPD) :
                <ul className="list-circle pl-6 mt-2">
                  <li>Vercel (hébergement, USA - clauses contractuelles types UE)</li>
                  <li>Neon (base de données, USA - clauses contractuelles types UE)</li>
                  <li>Resend (emails, USA - clauses contractuelles types UE)</li>
                </ul>
              </li>
            </ul>
            <p className="mt-4 text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              ℹ️ Tous nos sous-traitants sont conformes au RGPD et ont signé des <strong>clauses contractuelles types</strong> pour les transferts hors UE.
            </p>
          </section>

          {/* 6. Transferts hors UE */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              6. Transferts de données hors de l'UE
            </h2>
            <p className="mb-4">
              Certaines de nos données sont hébergées aux États-Unis (Vercel, Neon, Resend).
              Ces transferts sont sécurisés par :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Clauses contractuelles types de la Commission européenne</strong> (article 46 RGPD)</li>
              <li><strong>Chiffrement des données en transit et au repos</strong></li>
              <li><strong>Garanties de sécurité renforcées</strong></li>
            </ul>
          </section>

          {/* 7. Durée de conservation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              7. Durée de conservation des données
            </h2>
            <p className="mb-4">Conformément au principe de <strong>limitation de conservation</strong> :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Compte actif</strong> : données conservées tant que le compte existe</li>
              <li><strong>Après suppression du compte</strong> : données supprimées sous 30 jours</li>
              <li><strong>Données de trajets terminés</strong> : conservées 3 ans pour des raisons légales</li>
              <li><strong>Logs de sécurité</strong> : conservés 1 an maximum</li>
            </ul>
          </section>

          {/* 8. Vos droits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              8. Vos droits (Articles 15 à 22 RGPD)
            </h2>
            <p className="mb-4">Vous disposez des droits suivants :</p>
            <div className="bg-gray-50 p-4 rounded space-y-3">
              <div>
                <h3 className="font-semibold">🔍 Droit d'accès (Art. 15)</h3>
                <p className="text-sm">Consulter vos données via votre profil</p>
              </div>
              <div>
                <h3 className="font-semibold">✏️ Droit de rectification (Art. 16)</h3>
                <p className="text-sm">Modifier vos informations dans votre profil</p>
              </div>
              <div>
                <h3 className="font-semibold">🗑️ Droit à l'effacement (Art. 17)</h3>
                <p className="text-sm">Supprimer votre compte et toutes vos données</p>
              </div>
              <div>
                <h3 className="font-semibold">⛔ Droit d'opposition (Art. 21)</h3>
                <p className="text-sm">Refuser certains traitements (emails)</p>
              </div>
              <div>
                <h3 className="font-semibold">📦 Droit à la portabilité (Art. 20)</h3>
                <p className="text-sm">Récupérer vos données dans un format lisible</p>
              </div>
            </div>
            <p className="mt-4">
              Pour exercer vos droits :{' '}
              <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
                Gérer mon profil
              </Link>
            </p>
          </section>

          {/* 9. Sécurité */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              9. Sécurité des données (Article 32 RGPD)
            </h2>
            <p className="mb-4">Nous mettons en œuvre les mesures de sécurité suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>✅ <strong>Chiffrement HTTPS</strong> pour toutes les communications</li>
              <li>✅ <strong>Hachage des mots de passe</strong> (bcrypt)</li>
              <li>✅ <strong>Accès restreint</strong> aux données (principe du moindre privilège)</li>
              <li>✅ <strong>Sauvegardes régulières</strong> de la base de données</li>
              <li>✅ <strong>Surveillance des accès</strong> et logs de sécurité</li>
            </ul>
          </section>

          {/* 10. Réclamation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              10. Droit de réclamation (Article 77 RGPD)
            </h2>
            <p className="mb-4">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de :
            </p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="font-semibold">🇫🇷 CNIL (Commission Nationale de l'Informatique et des Libertés)</p>
              <p className="text-sm mt-2">3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
              <p className="text-sm">Téléphone : 01 53 73 22 22</p>
              <p className="text-sm">
                Site web :{' '}
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          {/* 11. Contact DPO */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              11. Délégué à la Protection des Données (DPO)
            </h2>
            <p className="mb-4">
              Pour toute question relative à vos données personnelles, contactez :
            </p>
            <p className="bg-gray-50 p-4 rounded">
              <strong>Email :</strong> [À COMPLÉTER - dpo@votre-entreprise.fr]
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                ℹ️ La nomination d'un DPO est obligatoire si vous traitez des données à grande échelle.
                Pour une petite structure, vous pouvez indiquer votre email de contact.
              </p>
            </div>
          </section>

          {/* 12. Modifications */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              12. Modifications de la politique
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité.
              Toute modification substantielle vous sera notifiée par email.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/legal/terms" className="text-blue-600 hover:text-blue-800">
            → Voir les Conditions Générales d'Utilisation
          </Link>
        </div>
      </div>
    </div>
  )
}
