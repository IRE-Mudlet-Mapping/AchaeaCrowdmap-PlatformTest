# Achaea NPC database plugin

This game-owned publication plugin preserves Achaea's existing
`Map/denizen.json` while the former Realm update service remains unavailable.
It intentionally lives outside CrowdmapPlatform.

During publication it:

1. downloads the last published database after map export;
2. validates the staged database before deployment; and
3. reports the published NPC count after deployment.

`ACHAEA_NPC_SOURCE_URL` can override the source URL. The default is the current
production Achaea Crowdmap database. No secret or Node dependency is required.
