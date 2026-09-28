# Achaea Danger rules

This plugin owns only checks that are specific to Achaea. Common map lifecycle
checks come from CrowdmapPlatform.

Each rule lives in its own file under `rules/`. Edit
`rules/allowed_room_marks.yaml` to maintain the room-mark allowlist.

The rule base classes and map loader come directly from CrowdmapPlatform. For
local development, make the platform checkout available at
`.crowdmap-platform` in the repository root (a symlink to a neighbouring
checkout is sufficient). CI creates that checkout automatically.

From the repository root:

```sh
npm ci --prefix crowdmap/plugins/achaea-danger-rules
npm test --prefix crowdmap/plugins/achaea-danger-rules
npm run typecheck --prefix crowdmap/plugins/achaea-danger-rules
npm run danger:local --prefix crowdmap/plugins/achaea-danger-rules
```
