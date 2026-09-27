# Achaea Crowdmap platform fixture

This repository shows the game-owned surface of an Achaea crowdmap repository
using `IRE-Mudlet-Mapping/CrowdmapPlatform@v1`.

The repository owns:

- the binary map, version, changelog, and explorer start position in `Map/`;
- `crowdmap.json`;
- thin reusable-workflow callers in `.github/workflows/`;
- Achaea-specific Danger rules, tests, and their isolated Node dependencies in
  `crowdmap/plugins/achaea-danger-rules/`; and
- the explorer assets in `website/` until those are migrated to the maintained
  map-browser upstream.

Map export, textual and visual diffs, common Danger rules, dependency-update
validation, publishing, and Dependabot auto-merge behavior are platform-owned.
