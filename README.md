# Achaea Crowdmap platform fixture

This repository shows the game-owned surface of an Achaea crowdmap repository
using `IRE-Mudlet-Mapping/CrowdmapPlatform@v1`.

The repository owns:

- the binary map, version, and changelog in `Map/`;
- `crowdmap.json`;
- thin reusable-workflow callers in `.github/workflows/`;
- Achaea-specific Danger rules, tests, and their isolated Node dependencies in
  `crowdmap/plugins/achaea-danger-rules/`.

Map export, textual and visual diffs, common Danger rules, dependency-update
validation, the centralized explorer, publishing, and Dependabot auto-merge
behavior are platform-owned. The explorer uses the maintained
`mudlet-map-browser-script` package without adding web assets or browser
dependencies to this repository.
