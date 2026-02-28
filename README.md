# Bookstore E2E Automation (Selenium + Cypress + Playwright)

Kompletny projekt automatyzacji testów aplikacji webowej **Bookstore** (WordPress + WooCommerce) w Dockerze, z porównaniem trzech frameworków: **Selenium WebDriver**, **Cypress** i **Playwright**.

## Założenia
- Jednolite scenariusze E2E we wszystkich frameworkach.
- Powtarzalne środowisko w Dockerze.
- Raporty HTML + JUnit w `reports/`.
- Integracja z TestRail przez zmienne środowiskowe (bez sekretów w repo).
- CI/CD w GitHub Actions z auto‑merge po przejściu wymaganych checków.

## Architektura repo
```
apps/bookstore/            # docker-compose dla aplikacji
apps/test-bookstore/       # submodule: źródła aplikacji testowej
packages/shared/           # wspólne helpery (config, selectors, TestRail)
tests/selenium/            # Selenium + Mocha
/tests/cypress/            # Cypress
/tests/playwright/         # Playwright Test
reports/                   # generowane raporty (gitignored)
.github/workflows/ci.yml   # pipeline CI
```

## Wymagania
- Docker + Docker Compose
- Node.js 20 LTS

## Szybki start (3 komendy)
```
cp .env.example .env
npm install
npm run env:up
```

Jeśli klonujesz repo po raz pierwszy:
```
git submodule update --init --recursive
```

Czekanie na gotowość aplikacji:
```
npm run env:wait
```

## Uruchamianie testów
Wszystkie testy uruchamiają się **w kontenerach**:
```
npm run test:selenium
npm run test:cypress
npm run test:playwright
npm run test:all
```

## Raporty
Po każdym runie znajdziesz raporty w `reports/`:
- `reports/selenium/` – Mochawesome HTML + JUnit
- `reports/cypress/` – Mochawesome HTML + JUnit
- `reports/playwright/` – HTML + JUnit
- `reports/metrics/` – metryki czasu i wyników

## TestRail
Włącz publikację ustawiając w `.env`:
```
TESTRAIL_ENABLED=true
TESTRAIL_URL=...
TESTRAIL_USER=...
TESTRAIL_API_KEY=...
TESTRAIL_RUN_ID=...
```
Identyfikacja przypadków: w tytule testu używamy formatu `[C1234]`.

## Selenium runner – dlaczego Mocha?
Wybrany został **Mocha**, ponieważ:
- jest dojrzały i stabilny,
- ma bogaty ekosystem reporterów (JUnit + HTML),
- pozwala na łatwy programatyczny pomiar metryk.

## Docker i środowisko
Start aplikacji:
```
npm run env:up
```
Domyślny `BASE_URL`: `http://localhost:8080`.

Uwaga: runtime używa gotowych obrazów Docker (jak dotychczas). Submodule zawiera kod źródłowy aplikacji dla wglądu i wersjonowania po Twojej stronie.

Szybkie komendy compose:
```
npm run compose:app:up
npm run compose:app:down
npm run compose:tests:up
npm run compose:tests:down
npm run compose:status
```

## CI/CD
Workflow `.github/workflows/ci.yml` uruchamia:
1. `lint` + format check
2. start środowiska
3. testy (niezależne joby per framework, uruchamiane tylko przy zmianach)
4. upload artefaktów `reports/` (per framework)
5. `ci-summary` jako jedyny wymagany check

### Wymagane ustawienia repo
W GitHub:
- Allow auto‑merge
- Allow GitHub Actions to create and approve pull requests
- Workflow permissions: Read and write
- Secrets: `SUBMODULES_TOKEN` z dostępem do submodułów

Branch protection dla `main`:
- Require a pull request before merging
- Require status checks → tylko `ci-summary`
- Require conversation resolution
- Restrict who can push (opcjonalnie)

## Znane problemy
- Stripe w środowisku testowym wymaga aktywnej konfiguracji w aplikacji. Jeśli płatność Stripe nie jest dostępna, test checkout nadal przejdzie przez proces zamówienia, ale bez weryfikacji pól Stripe.

## Checklist smoke
1. `npm run env:up`
2. `npm run env:wait`
3. `npm run test:playwright`
4. `ls reports/playwright/html`
