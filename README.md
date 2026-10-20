# Tâches Labo

Application Android de gestion des tâches du laboratoire d'analyses médicales : rappels sonores, validation par code personnel, planning, rapports de traçabilité.

**Version d'essai 0.1** — les données sont enregistrées sur le téléphone (un téléphone ou une tablette partagé au labo).

## Installer l'application sur le téléphone

1. Sur le téléphone, ouvrez la page **Releases** de ce dépôt (colonne de droite sur GitHub).
2. Touchez le fichier `TachesLabo-v0.1.X.apk` de la version la plus récente pour le télécharger.
3. Ouvrez le fichier téléchargé. Android demande d'**autoriser l'installation depuis cette source** : acceptez, puis touchez **Installer**.
4. Au premier lancement, créez le compte du biologiste, puis **autorisez les notifications** (et « Alarmes et rappels » si Android le demande).

Une nouvelle version s'installe par-dessus l'ancienne, sans perdre les données.

## Fonctionnement

- **Tâches** : à faire / validées, mes tâches / tout le labo. Couleurs : rouge urgent, rouge foncé en retard, orange aujourd'hui, bleu à venir, vert fait.
- **Initiales** : cercle de couleur propre à chaque technicien, « BIO » pour un biologiste. Aucune initiale quand la tâche est pour tout le monde.
- **Validation** : code personnel à 4 chiffres, avec n° de lot / résultat et commentaire. Nom, date et heure enregistrés.
- **Tâches permanentes** (biologiste) : tous les N jours / semaines / mois, suspendables (automate en panne…).
- **Rappels** : notifications avec un son par famille (équipements, patients, administratif) et alarme pour les tâches urgentes ou en retard, même téléphone en veille. Relance à +15 min et +1 h en cas de retard.
- **N° de dossier** : scan de l'étiquette (photo), dictée vocale « jour, mois, numéro chiffre par chiffre », ou saisie. Relecture « Patient n° 188 du 9 janvier ».
- **Rapports** : par période, personne, catégorie ; envoi en CSV (ouvrable dans Excel).
- **Sauvegarde** (onglet Équipe, biologiste) : à envoyer régulièrement ; permet de tout restaurer sur un autre téléphone.

## Technique

- [Capacitor 6](https://capacitorjs.com) : l'interface est dans `www/` (HTML/JS sans framework), le projet Android dans `android/`.
- Plugins : notifications locales, dictée vocale, partage de fichiers, bouton retour.
- La compilation est automatique : chaque envoi sur la branche `main` lance le workflow `.github/workflows/build-apk.yml`, qui publie l'APK dans **Releases**.
- La clé de signature `android/keystore/taches-labo-essai.jks` sert uniquement à l'essai (mots de passe dans `android/app/build.gradle`). Pour une publication sur le Play Store, il faudra une clé privée gardée en secret.

Compilation locale (avec Android Studio installé) :

```sh
npm ci
./vendor.sh
npx cap sync android
cd android && ./gradlew assembleRelease
```
