# Garten Jeden API
Garten Jeden API, ein Projekt von Robert Ackermann. Entwickelt mit NodeJS und Express. Made with ♥ and ☕ in Erfurt.

## Voraussetzungen
Folgende Anwendungen müssen auf dem System installiert sein: mysql, NodeJS und npm.

## Installation
Repository klonen:

    git clone https://source.ai.fh-erfurt.de/ro1376ac/garten-jeden-api.git

Ins Verzeichnis wechseln:

    cd garten-jeden-api

Paketabhängigkeiten installieren: 

    npm install

Bevor das Projekt gestartet werden kann müssen die Konfigurationen für die Datenbank an das ausführende System angepasst werden. Konfigurationen der Datenbank sind zu finden unter:

    /core/database.js

## Projekt starten
Starten lässt sich das Projekt mit dem Befehl:

    node app.js

Die API lässt sich mit Hilfe des Tools forever auch im Hintergrund starten. Dafür muss der nachfolgende Befehl ausgeführt werden:

    npm run start-background

Um diesen Prozess dann wieder zu beenden muss der folgende Befehl ausgeführt werden:

    npm run stop-background