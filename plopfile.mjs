// plopfile.mjs — générateurs de code (P18).
//   plop module      → nouveau module packages/<id> (variante base | auth)
//   plop app         → nouvelle app apps/<name>
//   plop register    → attache un module existant à une app
//   plop unregister  → détache un module d'une app
//
// Les générateurs qui touchent modules.json / registry.ts / package.json
// éditent par PARSING (JSON / regex ancrées sur des marqueurs stables), pas
// par ancres fragiles. Ne pas éditer ces fichiers à la main quand un
// générateur existe (P18).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Les trois packages d'infra ne sont PAS des "modules" utilisateur.
const INFRA = new Set(['shell', 'auth', 'module-kit']);

const NS = '@ef'; // namespace des packages internes

// --- Helpers de nommage (§5.1) ------------------------------------------
const toCamel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const toPascal = (s) => {
  const c = toCamel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
};
const isKebab = (s) => /^[a-z][a-z0-9-]*$/.test(s);

// --- Helpers de fichiers -------------------------------------------------
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');

function listApps() {
  const appsDir = path.join(__dirname, 'apps');
  if (!fs.existsSync(appsDir)) return [];
  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function listModules() {
  const pkgDir = path.join(__dirname, 'packages');
  if (!fs.existsSync(pkgDir)) return [];
  return fs
    .readdirSync(pkgDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !INFRA.has(d.name))
    .map((d) => d.name);
}

// --- Actions custom : (dé)brancher un module d'une app -------------------
function registerAction({ app, id }) {
  const pkgName = `${NS}/${id}`;
  const appDir = path.join(__dirname, 'apps', app);
  const camel = toCamel(id);

  // 1) package.json : ajouter la dépendance (liste blanche IP, P3)
  const pkgPath = path.join(appDir, 'package.json');
  const pkg = readJson(pkgPath);
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies[pkgName] = '*';
  // tri stable des deps
  pkg.dependencies = Object.fromEntries(
    Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeJson(pkgPath, pkg);

  // 2) modules.json : ajouter à la liste (P7)
  const modPath = path.join(appDir, 'modules.json');
  const mod = readJson(modPath);
  mod.modules = mod.modules || [];
  if (!mod.modules.includes(pkgName)) {
    // systemModule reste en dernier par convention ; ici insertion avant @ef/system s'il existe
    const sysIdx = mod.modules.indexOf(`${NS}/system`);
    if (sysIdx === -1) mod.modules.push(pkgName);
    else mod.modules.splice(sysIdx, 0, pkgName);
  }
  writeJson(modPath, mod);

  // 3) registry.ts : ajouter l'import + l'entrée du tableau (P8)
  const regPath = path.join(appDir, 'registry.ts');
  let reg = fs.readFileSync(regPath, 'utf8');
  const importLine = `import { ${camel}Module } from '${pkgName}';`;
  if (!reg.includes(importLine)) {
    // insérer après le dernier import
    const lines = reg.split('\n');
    let lastImport = -1;
    lines.forEach((l, i) => {
      if (l.startsWith('import ')) lastImport = i;
    });
    lines.splice(lastImport + 1, 0, importLine);
    reg = lines.join('\n');
  }
  // insérer dans le tableau `registry` avant systemModule / avant `]`
  const entry = `  ${camel}Module,`;
  if (!reg.includes(`${camel}Module,`) || !reg.match(new RegExp(`\\b${camel}Module\\b[^;]*\\]`))) {
    const sysEntry = /(\n\s*systemModule,)/;
    if (sysEntry.test(reg)) {
      reg = reg.replace(sysEntry, `\n${entry}$1`);
    } else {
      // insérer avant la fermeture du tableau `]`
      reg = reg.replace(/(\n\];)/, `\n${entry}$1`);
    }
  }
  fs.writeFileSync(regPath, reg);

  return `registered ${pkgName} → apps/${app}`;
}

function unregisterAction({ app, id }) {
  const pkgName = `${NS}/${id}`;
  const appDir = path.join(__dirname, 'apps', app);
  const camel = toCamel(id);

  const pkgPath = path.join(appDir, 'package.json');
  const pkg = readJson(pkgPath);
  if (pkg.dependencies) delete pkg.dependencies[pkgName];
  writeJson(pkgPath, pkg);

  const modPath = path.join(appDir, 'modules.json');
  const mod = readJson(modPath);
  mod.modules = (mod.modules || []).filter((m) => m !== pkgName);
  writeJson(modPath, mod);

  const regPath = path.join(appDir, 'registry.ts');
  let reg = fs.readFileSync(regPath, 'utf8');
  reg = reg
    .split('\n')
    .filter((l) => !new RegExp(`\\b${camel}Module\\b`).test(l))
    .join('\n');
  fs.writeFileSync(regPath, reg);

  return `unregistered ${pkgName} from apps/${app}`;
}

export default function (plop) {
  plop.setHelper('camel', toCamel);
  plop.setHelper('pascal', toPascal);
  plop.setHelper('ns', () => NS);

  // ---- module -----------------------------------------------------------
  plop.setGenerator('module', {
    description: 'Nouveau module produit (packages/<id>)',
    prompts: [
      {
        type: 'input',
        name: 'id',
        message: 'id du module (kebab-case) :',
        validate: (v) => (isKebab(v) ? true : 'kebab-case requis : ^[a-z][a-z0-9-]*$'),
      },
      {
        type: 'input',
        name: 'label',
        message: 'label affiché dans la nav :',
      },
      {
        type: 'list',
        name: 'variant',
        message: 'variante :',
        choices: ['base', 'auth'],
        default: 'base',
      },
    ],
    actions: (data) => {
      const base = `plop-templates/module/${data.variant}`;
      const dest = `packages/{{id}}`;
      const actions = [
        {
          type: 'addMany',
          destination: dest,
          base,
          templateFiles: `${base}/**/*.hbs`,
          globOptions: { dot: true },
          stripExtensions: ['hbs'],
        },
      ];
      return actions;
    },
  });

  // ---- app --------------------------------------------------------------
  plop.setGenerator('app', {
    description: 'Nouvelle app (apps/<name>)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: "nom de l'app (kebab-case) :",
        validate: (v) => (isKebab(v) ? true : 'kebab-case requis'),
      },
      {
        type: 'input',
        name: 'brand',
        message: 'brand affiché :',
      },
      {
        type: 'input',
        name: 'port',
        message: 'port :',
        default: '3000',
      },
    ],
    actions: () => [
      {
        type: 'addMany',
        destination: 'apps/{{name}}',
        base: 'plop-templates/app',
        templateFiles: 'plop-templates/app/**/*.hbs',
        globOptions: { dot: true },
        stripExtensions: ['hbs'],
      },
    ],
  });

  // choices résolus à l'évaluation du plopfile (fraîche à chaque `npx plop`).
  // Tableaux (pas fonctions) pour que le bypass par arguments positionnels
  // fonctionne aussi : `plop register <app> <id>`.
  const appChoices = listApps();
  const moduleChoices = listModules();

  // ---- register ---------------------------------------------------------
  plop.setGenerator('register', {
    description: 'Attache un module existant à une app',
    prompts: [
      { type: 'list', name: 'app', message: 'app :', choices: appChoices },
      { type: 'list', name: 'id', message: 'module :', choices: moduleChoices },
    ],
    actions: [
      (data) => registerAction(data),
    ],
  });

  // ---- unregister -------------------------------------------------------
  plop.setGenerator('unregister', {
    description: "Détache un module d'une app",
    prompts: [
      { type: 'list', name: 'app', message: 'app :', choices: appChoices },
      { type: 'list', name: 'id', message: 'module :', choices: moduleChoices },
    ],
    actions: [
      (data) => unregisterAction(data),
    ],
  });
}
