## [1.0.1]

### Added
- Support for async API URL via Promise. You can now pass either a `string` or a `Promise<string | null>` as `pisaApiUrl` in `initPisaQuestionnaireWidgets`:
  ```ts
  initPisaQuestionnaireWidgets({ pisaApiUrl: pisaSalesApiUrl() });
- Validation fallback for widgets rendered outside a Questionnaire container. Displays an informative message block: _"This widget must be placed within a PisaSales Questionnaire!"_

### Changed
- Replaced `lodash` and `nanoid` with lightweight polyfills and `nanoid/non-secure` for better SSR/pre-rendering compatibility (e.g., Node environments without `window`).
- Allowed `react` peer dependency range `>=18.0.0 <20.0.0`.

### Refactored
- DataClass registration was streamlined and decoupled from eager execution.
- Internal contexts no longer throw on missing parents — behavior now gracefully falls back to display validation messaging.

## [1.0.0]
- Initial Release