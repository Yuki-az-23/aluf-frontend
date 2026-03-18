// Aluf UI Shell — javascript_before
// NOTE: body.aluf-loaded is added by React in main.tsx AFTER successful mount.
// This file is intentionally minimal — only used for {{var_to_json}} config injection.
// Do NOT add aluf-loaded class here — that would hide Konimbo UI before React loads,
// breaking graceful degradation if the CDN is unreachable.
