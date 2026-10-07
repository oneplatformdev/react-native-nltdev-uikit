#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const manifest = require('../registry/manifest.json');
const packageInfo = require('../package.json');

const packageRoot = path.resolve(__dirname, '..');
const available = Object.keys(manifest);

const help = () => {
    process.stdout.write(
        `Usage: ${packageInfo.name} add <component> [--dir <path>]\n` +
        `Components: ${available.join(', ')}\n` +
        'Default destination: src/components/ui/<Component>\n' +
        'Run from the consuming project root; no init step is needed.\n',
    );
};

const readPackage = cwd => {
    const file = path.join(cwd, 'package.json');
    if (!fs.existsSync(file)) {
        throw new Error(`No package.json in ${cwd}. Run this command from your project root.`);
    }
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
        throw new Error(`Cannot parse ${file}. Fix package.json before adding a component.`);
    }
};

const declaredDependency = (pkg, name) =>
    ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
        .some(section => Object.hasOwn(pkg[section] ?? {}, name));

const importPattern = /\bfrom\s+(['"])([^'"]+)\1/g;
const namedImportPattern = /\bimport\s+(?:type\s+)?\{([^}]+)\}\s+from\s+(['"])([^'"]+)\2/g;
const mergeableImportPattern = /^import\s+(type\s+)?(?:([A-Za-z_$][\w$]*)\s*,\s*)?\{([^}]*)\}\s+from\s+(['"])([^'"]+)\4;[ \t]*\n?/gm;
const moduleImportPattern = /^import\s+(?:type\s+)?(?:[A-Za-z_$][\w$]*\s*,\s*)?(?:\{[^}]*\}|\*\s+as\s+[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*)\s+from\s+(['"])([^'"]+)\1;[ \t]*$/gm;
const sideEffectImportPattern = /^import\s+(['"])([^'"]+)\1;[ \t]*$/gm;

const consolidateImports = source => {
    const matches = [...source.matchAll(mergeableImportPattern)];
    const groups = new Map();
    for (const match of matches) {
        const group = groups.get(match[5]) ?? [];
        group.push(match);
        groups.set(match[5], group);
    }
    const replacements = new Map();
    for (const group of groups.values()) {
        if (group.length < 2) continue;
        const defaults = group.filter(match => match[2]);
        const allTypeOnly = group.every(match => match[1]);
        if (defaults.length > 1 || defaults.some(match => match[1]) && !allTypeOnly) continue;
        const specifiers = group.flatMap(match => match[3].split(',').map(part => part.trim()).filter(Boolean)
            .map(part => match[1] && !allTypeOnly && !part.startsWith('type ') ? `type ${part}` : part));
        const first = group[0];
        const defaultImport = defaults[0] ? `${defaults[0][2]}, ` : '';
        const ending = first[0].endsWith('\n') ? '\n' : '';
        replacements.set(first.index,
            `import ${allTypeOnly ? 'type ' : ''}${defaultImport}{\n    ${specifiers.join(',\n    ')},\n} from ${first[4]}${first[5]}${first[4]};${ending}`);
        for (const match of group.slice(1)) replacements.set(match.index, '');
    }
    let cursor = 0;
    let result = '';
    for (const match of matches) {
        result += source.slice(cursor, match.index) + (replacements.get(match.index) ?? match[0]);
        cursor = match.index + match[0].length;
    }
    return result + source.slice(cursor);
};

const validateUniqueImports = (name, file, source) => {
    const seen = new Set();
    for (const match of [...source.matchAll(moduleImportPattern), ...source.matchAll(sideEffectImportPattern)]) {
        if (seen.has(match[2])) {
            throw new Error(`Duplicate generated import from ${match[2]} in ${name}/${file}.`);
        }
        seen.add(match[2]);
    }
};

const resolveComponents = name => {
    const ordered = [];
    const visiting = new Set();
    const visited = new Set();
    const visit = current => {
        const entry = manifest[current];
        if (!entry || !Array.isArray(entry.componentDependencies)) {
            throw new Error(`Invalid component dependency in registry: ${current}.`);
        }
        if (visiting.has(current)) {
            throw new Error(`Component dependency cycle: ${[...visiting, current].join(' -> ')}.`);
        }
        if (visited.has(current)) return;
        visiting.add(current);
        for (const dependency of entry.componentDependencies) visit(dependency);
        visiting.delete(current);
        visited.add(current);
        ordered.push(current);
    };
    visit(name);
    return ordered;
};

const publicContract = (name, readFile) => {
    const entry = manifest[name];
    if (!entry.publicExports) return;
    const index = readFile('index.ts');
    if (index === null) throw new Error(`Missing public entrypoint for ${name}: index.ts.`);
    for (const [symbol, file] of Object.entries(entry.publicExports)) {
        if (!entry.files.includes(file)) throw new Error(`Invalid public export file in ${name}: ${file}.`);
        const source = readFile(file);
        const moduleName = file.replace(/\.[^.]+$/, '');
        if (source === null || !new RegExp(`\\bexport\\s+(?:const|function|class|type|interface)\\s+${symbol}\\b`).test(source) ||
            !index.includes(`export * from './${moduleName}'`)) {
            throw new Error(`missing public export ${symbol} in ${name}`);
        }
    }
};

const renderComponent = name => {
    const entry = manifest[name];
    if (!entry || !/^[A-Z][A-Za-z]+$/.test(entry.folder) || !Array.isArray(entry.files) || !entry.files.length ||
        !Array.isArray(entry.componentDependencies) || !Array.isArray(entry.dependencies) || !entry.rewrites) {
        throw new Error(`Invalid registry entry for ${name}.`);
    }
    const files = new Map();
    const rewriteHits = new Set();
    const requiredComponentImports = [];

    for (const file of entry.files) {
        if (path.basename(file) !== file || !/^[A-Za-z][A-Za-z0-9.]+$/.test(file) || files.has(file)) {
            throw new Error(`Invalid source file in ${name} registry: ${file}`);
        }
        const sourcePath = path.join(packageRoot, 'src', 'components', entry.folder, file);
        if (!fs.statSync(sourcePath, { throwIfNoEntry: false })?.isFile()) {
            throw new Error(`Missing canonical source: ${sourcePath}`);
        }
        let source = fs.readFileSync(sourcePath, 'utf8');
        for (const imported of source.matchAll(namedImportPattern)) {
            const target = path.posix.normalize(path.posix.join(entry.folder, path.posix.dirname(file), imported[3]));
            const dependency = entry.componentDependencies.find(current => manifest[current]?.folder === target);
            if (dependency) requiredComponentImports.push({ file, declaration: imported[0], dependency });
        }
        source = source.replace(importPattern, (match, quote, specifier) => {
            const replacement = entry.rewrites[specifier];
            if (!replacement) return match;
            rewriteHits.add(specifier);
            return match.replace(`${quote}${specifier}${quote}`, `${quote}${replacement}${quote}`);
        });
        source = consolidateImports(source);
        if (file === `${entry.folder}.tsx`) {
            source = '// Copied from react-native-ntldev-uikit. Project-owned; package upgrades do not update this file.\n' + source;
        }
        files.set(file, source);
        validateUniqueImports(name, file, source);
    }

    for (const specifier of Object.keys(entry.rewrites)) {
        if (!rewriteHits.has(specifier)) {
            throw new Error(`Stale ${name} import rewrite: ${specifier}. Update the registry before packing.`);
        }
    }
    for (const dependency of entry.componentDependencies) {
        if (!requiredComponentImports.some(imported => imported.dependency === dependency)) {
            throw new Error(`Missing canonical component import from ${name} to ${dependency}.`);
        }
    }
    for (const imported of requiredComponentImports) {
        if (!files.get(imported.file).includes(imported.declaration)) {
            throw new Error(`Generated ${name}/${imported.file} no longer imports local ${imported.dependency}.`);
        }
    }

    for (const foundation of entry.foundations) {
        if (![...files.values()].some(source => new RegExp(`\\b${foundation}\\b`).test(source))) {
            throw new Error(`Stale ${name} foundation metadata: ${foundation}`);
        }
    }
    publicContract(name, file => files.get(file) ?? null);
    return { entry, files };
};

const validateImports = (name, rendered) => {
    const { entry, files } = rendered.get(name);
    const closure = new Set(resolveComponents(name));
    for (const [file, source] of files) {
        for (const match of source.matchAll(importPattern)) {
            const specifier = match[2];
            if (!specifier.startsWith('.')) {
                if (!entry.dependencies.includes(specifier)) {
                    throw new Error(`Undeclared generated dependency in ${name}/${file}: ${specifier}`);
                }
                continue;
            }
            const target = path.posix.normalize(path.posix.join(entry.folder, path.posix.dirname(file), specifier));
            const resolved = [...rendered].find(([, component]) =>
                [`${target}.ts`, `${target}.tsx`, `${target}.js`, `${target}/index.ts`]
                    .some(candidate => component.files.has(path.posix.relative(component.entry.folder, candidate))));
            if (!resolved || !closure.has(resolved[0])) {
                throw new Error(`Unresolved generated import in ${name}/${file}: ${specifier}`);
            }
            if (resolved[0] !== name) {
                for (const imported of source.matchAll(namedImportPattern)) {
                    if (imported[3] !== specifier) continue;
                    for (const symbol of imported[1].split(',').map(part => part.trim().split(/\s+as\s+/)[0])) {
                        if (!manifest[resolved[0]].publicExports?.[symbol]) {
                            throw new Error(`Missing dependency export ${symbol} for ${name}/${file}: ${specifier}`);
                        }
                    }
                }
            }
        }
    }
};

const validateRegistry = () => {
    for (const name of available) resolveComponents(name);
    const rendered = new Map(available.map(name => [name, renderComponent(name)]));
    for (const name of available) validateImports(name, rendered);
    return available.length;
};

const parseArgs = args => {
    if (args.length === 1 && args[0] === '--help' || args.length === 2 && args[0] === 'add' && args[1] === '--help') {
        return { help: true };
    }
    if (args[0] !== 'add' || !args[1] || args[1].startsWith('-')) {
        throw new Error('Expected add <component>. Use --help for usage.');
    }
    const name = args[1].toLowerCase();
    if (!manifest[name]) {
        throw new Error(`Unknown component "${args[1]}". Available: ${available.join(', ')}.`);
    }
    let dir = 'src/components/ui';
    let seenDir = false;
    for (let index = 2; index < args.length; index++) {
        if (args[index] !== '--dir' || seenDir) {
            throw new Error(`Unexpected argument "${args[index]}". Use --help for usage.`);
        }
        const value = args[++index];
        if (!value || value.startsWith('--')) {
            throw new Error('--dir requires a relative destination path.');
        }
        dir = value;
        seenDir = true;
    }
    return { name, dir };
};

const existingPath = file => {
    try {
        return fs.lstatSync(file);
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
};

const destination = (cwd, dir, folder) => {
    if (path.isAbsolute(dir)) throw new Error('--dir must be relative to the project root.');
    const root = path.resolve(cwd, dir);
    const relative = path.relative(cwd, root);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new Error('--dir must stay inside the consuming project.');
    }
    let current = cwd;
    for (const part of relative.split(path.sep).filter(Boolean)) {
        current = path.join(current, part);
        const stat = existingPath(current);
        if (stat?.isSymbolicLink()) throw new Error(`Destination contains a symlink: ${current}`);
        if (stat && !stat.isDirectory()) throw new Error(`Destination parent is not a directory: ${current}`);
    }
    return { root, folderPath: path.join(root, folder) };
};

const checkExistingDependency = (name, folderPath) => {
    const entry = manifest[name];
    try {
        if (!existingPath(folderPath)?.isDirectory()) throw new Error('not a directory');
        for (const file of entry.files) {
            if (!existingPath(path.join(folderPath, file))?.isFile()) throw new Error(`missing ${file}`);
        }
        publicContract(name, file => fs.readFileSync(path.join(folderPath, file), 'utf8'));
    } catch (error) {
        throw new Error(`Incompatible owned dependency ${name} at ${folderPath}: ${error.message}. No files were installed.`);
    }
};

const install = (cwd, name, dir) => {
    const ordered = resolveComponents(name);
    const rendered = new Map(ordered.map(current => [current, renderComponent(current)]));
    for (const current of ordered) validateImports(current, rendered);
    const consumer = readPackage(cwd);
    const missingDependencies = [...new Set(ordered.flatMap(current => rendered.get(current).entry.dependencies))]
        .filter(dependency => !declaredDependency(consumer, dependency));
    if (missingDependencies.length) {
        throw new Error(`Declare required dependencies in your project package.json before adding ${name}: ${missingDependencies.join(', ')}. No packages were installed.`);
    }
    const targets = ordered.map(current => ({
        name: current,
        ...rendered.get(current),
        ...destination(cwd, dir, rendered.get(current).entry.folder),
    }));
    const root = targets[0].root;
    for (const target of targets) {
        const existing = existingPath(target.folderPath);
        if (!existing) continue;
        if (target.name === name) {
            throw new Error(`Destination already exists: ${target.folderPath}. Refusing to overwrite project-owned source.`);
        }
        checkExistingDependency(target.name, target.folderPath);
    }
    const pending = targets.filter(target => !existingPath(target.folderPath));

    const stage = fs.mkdtempSync(path.join(cwd, '.nltdev-uikit-'));
    const parents = [];
    const created = [];
    let current = root;
    while (current !== cwd && !existingPath(current)) {
        parents.push(current);
        current = path.dirname(current);
    }
    try {
        for (const target of pending) {
            const stagedFolder = path.join(stage, target.entry.folder);
            fs.mkdirSync(stagedFolder);
            for (const [file, source] of target.files) {
                fs.writeFileSync(path.join(stagedFolder, file), source, { flag: 'wx' });
            }
        }
        for (const parent of parents.reverse()) fs.mkdirSync(parent);
        for (const target of pending) {
            if (existingPath(target.folderPath)) throw new Error(`Destination appeared during installation: ${target.folderPath}`);
            fs.renameSync(path.join(stage, target.entry.folder), target.folderPath);
            created.push(target.folderPath);
        }
    } catch (error) {
        for (const folder of created.reverse()) fs.rmSync(folder, { recursive: true, force: true });
        for (const parent of parents.reverse()) {
            try { fs.rmdirSync(parent); } catch { /* Keep non-empty directories. */ }
        }
        throw error;
    } finally {
        fs.rmSync(stage, { recursive: true, force: true });
    }

    for (const target of targets) {
        process.stdout.write(target.name === name || pending.includes(target)
            ? `Installed ${target.name} to ${target.folderPath}\nFiles: ${[...target.files.keys()].join(', ')}\n`
            : `Reused existing ${target.name} at ${target.folderPath} (unchanged).\n`);
    }
    process.stdout.write(`Source version: ${packageInfo.version}. This source is project-owned; package upgrades do not update it.\n`);
};

if (require.main === module) {
    try {
        const parsed = parseArgs(process.argv.slice(2));
        if (parsed.help) help();
        else install(process.cwd(), parsed.name, parsed.dir);
    } catch (error) {
        process.stderr.write(`${packageInfo.name}: ${error.message}\n`);
        process.exitCode = 1;
    }
}

module.exports = { validateRegistry };
