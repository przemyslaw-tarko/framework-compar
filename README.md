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
app/test-bookstore/           # submoduł z aplikacją testową
docker-compose.tests.yml      # kontenery testowe (selenium/cypress/playwright)
.github/workflows/            # CI/CD
results/                      # raporty testowe (gitignored)

selenium/                     # testy Selenium
 selenium/tests/*.js
 selenium/package.json

cypress/                      # testy Cypress
 cypress/e2e/*.cy.js
 cypress/cypress.config.js

playwright/                   # testy Playwright
 playwright/tests/*.spec.js
 playwright/playwright.config.js
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
Workflow w `.github/workflows/ci-cd.yml`:
- **build-app** – sprawdza, czy aplikacja testowa startuje.
- **test-selenium** – uruchamia testy Selenium.
- **test-cypress** – uruchamia testy Cypress.
- **test-playwright** – uruchamia testy Playwright.
- **ci-summary** – agreguje wynik tylko dla jobów, które powinny się uruchomić.
- **auto-merge-to-main** – włącza auto‑merge PR do `main`, gdy wszystkie wymagane joby są zielone.

### Wymagane sekrety
Repozytorium używa prywatnego submodułu, więc w GitHub Secrets musi istnieć:
- `SUBMODULES_TOKEN` – PAT z dostępem read do repozytorium `test-bookstore`.

### Ustawienia repo na GitHub
W ustawieniach repo włącz:
- **Allow auto‑merge**
- **Squash merge** (zalecane)
- **Allow GitHub Actions to create and approve pull requests**
- **Workflow permissions: Read and write**

## Zasady pracy z branchami
- Zmiany w branchu uruchamiają `CI/CD - App + Tests`.
- Po sukcesie workflowu PR do `main` jest automatycznie mergowany.

## Warunkowe uruchamianie jobów
- Zmiany tylko w `selenium/**` uruchamiają `test-selenium`.
- Zmiany tylko w `cypress/**` uruchamiają `test-cypress`.
- Zmiany tylko w `playwright/**` uruchamiają `test-playwright`.
- Zmiany tylko w `app/**` uruchamiają wyłącznie `build-app`.
- Zmiany w `docker-compose.tests.yml` lub w `.github/workflows/ci-cd.yml` uruchamiają wszystkie testy.

W ruleset/branch protection jako wymagany status check ustaw `ci-summary` (to jedyny check, który zawsze jest poprawnie oceniany przy warunkowych jobach).

## Raporty
Raporty testów są generowane do katalogu `results/` (zignorowanego przez Git). W CI raporty są publikowane jako artifacty.