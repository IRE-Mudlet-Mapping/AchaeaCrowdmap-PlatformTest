# Achaea Danger rules

This plugin owns only checks that are specific to Achaea. Common map lifecycle
checks come from CrowdmapPlatform.

Each rule lives in its own file under `rules/`. Edit
`rules/allowed_room_marks.yaml` to maintain the room-mark allowlist.

From the repository root:

```sh
npm ci --prefix crowdmap/plugins/achaea-danger-rules
npm test --prefix crowdmap/plugins/achaea-danger-rules
npm run typecheck --prefix crowdmap/plugins/achaea-danger-rules
npm run danger:local --prefix crowdmap/plugins/achaea-danger-rules
```
