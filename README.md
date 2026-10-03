# Achaea Crowdmap platform fixture

This repository shows the game-owned surface of an Achaea crowdmap repository
using `IRE-Mudlet-Mapping/CrowdmapPlatform@v1`.

The repository owns:

- the binary map, version, and changelog in `Map/`;
- `crowdmap.json`;
- thin reusable-workflow callers in `.github/workflows/`;
- Achaea-specific Danger rules and tests in
  `crowdmap/plugins/achaea-danger-rules/`, with their optional Node tooling
  declared once at the repository root.
- the game-owned Achaea NPC database publication plugin in
  `crowdmap/plugins/achaea-npc-database/`, exercising every publication hook.

Map export, textual and visual diffs, common Danger rules, dependency-update
validation, the centralized explorer, publishing, and Dependabot auto-merge
behavior are platform-owned. The explorer uses the maintained
`mudlet-map-browser-script` package without adding web assets or browser
dependencies to this repository.

## Developing Achaea Danger rules

The shared rule framework is an ordinary public npm dependency. From the
repository root, the complete local workflow is:

```sh
npm ci
npm test
npm run typecheck
npm run danger
```

No CrowdmapPlatform checkout, symlink, submodule, registry login, or special
Windows setup is required.
