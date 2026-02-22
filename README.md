# Porównanie Selenium, Cypress i Playwright (Docker + CI/CD)

## Cel projektu
Porównanie trzech frameworków E2E (Selenium, Cypress, Playwright) pod kątem:
- łatwości konfiguracji i pisania testów w JavaScript,
- stabilności uruchomień,
- integracji z CI/CD,
- generowania raportów testowych.

Testy są wykonywane na aplikacji **test‑bookstore** uruchamianej w osobnym kontenerze. Każdy framework działa w osobnym kontenerze, aby izolować środowiska.

## Struktura repozytorium
```
app/test-bookstore/          # submoduł z aplikacją testową
Docker-compose.tests.yml      # kontenery testowe (selenium/cypress/playwright)
.github/workflows/           # CI/CD i E2E
results/                     # raporty testowe (gitignored)
tests/selenium/              # testy Selenium
 tests/selenium/tests/*.js
 tests/selenium/package.json

tests/cypress/               # testy Cypress
 tests/cypress/e2e/*.cy.js
 tests/cypress/cypress.config.js

tests/playwright/            # testy Playwright
 tests/playwright/tests/*.spec.js
 tests/playwright/playwright.config.js
```

## Wymagania lokalne
- Docker + Docker Compose
- Git

## Submoduł aplikacji
Aplikacja testowa jest submodułem (`app/test-bookstore`). Po klonowaniu repozytorium:
```
git submodule update --init --recursive
```

## Uruchomienie aplikacji testowej (lokalnie)
```
docker compose -f app/test-bookstore/docker-test-bookstore/docker-compose.yml up -d
```
Aplikacja powinna być dostępna pod:
```
http://localhost:8080/wp-login.php
```

## Uruchomienie testów lokalnie
Wszystkie testy uruchamiają się w kontenerach i zapisują raporty XML do `results/<framework>`.

### Selenium
```
docker compose -f docker-compose.tests.yml up -d selenium-chrome

docker compose -f docker-compose.tests.yml run --rm selenium-tests
```
Raporty: `results/selenium/*.xml`

### Cypress
```
docker compose -f docker-compose.tests.yml run --rm cypress-tests
```
Raport: `results/cypress/results.xml`

### Playwright
```
docker compose -f docker-compose.tests.yml run --rm playwright-tests
```
Raport: `results/playwright/results.xml`

### Sprzątanie
```
docker compose -f docker-compose.tests.yml down --remove-orphans

docker compose -f app/test-bookstore/docker-test-bookstore/docker-compose.yml down --remove-orphans
```

## CI/CD – jak działa
Workflowy w `.github/workflows/`:
- **CI Base** – podstawowa walidacja dla zmian w `app/**` i `ci.yml`.
- **E2E Selenium / Cypress / Playwright** – testy E2E dla zmian w odpowiednich katalogach i w `app/**`.
- **Auto PR to main** – po sukcesie CI/E2E automatycznie tworzy PR i włącza auto‑merge.
- **CD Base** – uruchamia się po merge do `main` przy zmianach w `app/**`.

### Wymagane sekrety
Repozytorium używa prywatnego submodułu, więc w GitHub Secrets musi istnieć:
- `SUBMODULES_TOKEN` – PAT z dostępem read do repozytorium `test-bookstore`.

### Ustawienia repo na GitHub
W ustawieniach repo włącz:
- **Allow auto‑merge** (żeby auto‑PR mógł się scalać),
- **Squash merge** (zalecane dla czytelnej historii).

## Zasady pracy z branchami
- Każda zmiana w dowolnym branchu uruchamia odpowiednie E2E.
- Po sukcesie workflowów tworzony jest PR do `main`.
- Merge do `main` uruchamia CD.

## Raporty
Raporty testów są generowane do katalogu `results/` (zignorowanego przez Git). W CI raporty są publikowane jako artifacty.