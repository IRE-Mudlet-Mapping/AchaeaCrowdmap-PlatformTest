# Achaea Danger rules

This plugin owns only checks that are specific to Achaea. Common map lifecycle
checks come from CrowdmapPlatform.

Each rule lives in its own file under `rules/`. Edit
`rules/allowed_room_marks.yaml` to maintain the room-mark allowlist.

The rule base classes and map loader come from the public
`@ire-mudlet-mapping/crowdmap-danger` package. No CrowdmapPlatform checkout or
filesystem link is needed for local development. The package also supplies the
local Danger runner, so this plugin does not maintain its own Dangerfile or
wrapper script.

From the repository root:

```sh
npm ci --prefix crowdmap/plugins/achaea-danger-rules
npm test --prefix crowdmap/plugins/achaea-danger-rules
npm run typecheck --prefix crowdmap/plugins/achaea-danger-rules
npm run danger:local --prefix crowdmap/plugins/achaea-danger-rules
```
