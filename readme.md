# psa-scr-qst-tst (Proof of Concept)

## 🚧 Proof of Concept (PoC): This package is currently in PoC mode. Use at your own risk, as changes and improvements are ongoing. It is not yet ready for production environments. A proper release with an updated package name will follow.

## Overview
The psa-scr-qst-tst package provides a collection of questionnaire builder widgets for creating and using PisaSales questionnaires within the Scrivito CMS. These questionnaires can only be used on restricted sites.

## Features
- **Questionnaire Creation**: Build questionnaires directly from the Scrivito CMS editor.
- **Questionnaire Usage**: Use created questionnaires within restricted sites only.
- **Answer submission & retrieval**: Submit and retrieve answers using context parameters such as questionnaireId, projectId, activityId, and contactId.
- **Supported Question Types**:
  - Fully implemented question templates:
    - Single-line text input (`PSA_QST_TPL_QUE_STR`)
    - Multi-line text input (`PSA_QST_TPL_STR_MUL`)
    - Regular dropdown (`PSA_QST_TPL_CHC`)
  - Planned support for additional question templates (see the table below).


## Supported Templates
| Widget Category | Equivalent Templates | Type/Functionality  | Notes  |
|-----------------------|----------------------------|------------------------------------|--------------------------|
| **Input Widget**    | PSA_QST_TPL_QUE_STR | Single-line text input|✅ Implemented           |
|                     | PSA_QST_TPL_STR_MUL |Multi-line text input  |✅ Implemented           |
|                     | PSA_QST_TPL_CLB   | Multi-line text input | Planned                 |
|                     | PSA_QST_TPL_BLB  | Multi-line text input  | Planned                 |
|                     | PSA_QST_TPL_FLO  | Float (decimal number input)| Planned              |
|                     | PSA_QST_TPL_MON   | Money input field      | Planned                 |
| **Dropdown Widget** | PSA_QST_TPL_CHC  | Regular dropdown   |✅ Implemented             |
|                     | PSA_QST_TPL_CTY   | Countries dropdown   |❌ Rejected (requires API) |
|                     | PSA_QST_TPL_LNG   | Languages dropdown    |❌ Rejected (requires API) |
|                     | PSA_QST_TPL_LOB   | Business dropdown         |❌ Rejected (requires API) |
| **Date/Time Widget**| PSA_QST_TPL_DAT_TIM | Date and time input    | Planned               |
|                     | PSA_QST_TPL_DAT     | Date-only input       | Planned               |
| **Select Widget**   | PSA_QST_TPL_RAD     | Single-select radios    | Planned               |
|                     | PSA_QST_TPL_LOG      | Single-select checkbox  | Planned               |
|                     | PSA_QST_TPL_LOG_NUL  | Tri-state single-select checkbox  | Planned      |
|                     | PSA_QST_TPL_CHK     | Multi-select checkboxes    | Planned              |
| **File Widget**     | PSA_QST_TPL_FIL     | Single file upload        |⏳ Pending Decision      |
|                     | PSA_QST_TPL_FIL_MUL  | Multi-file upload      |⏳ Pending Decision        |
| **Signature Widget**| PSA_QST_TPL_SIG     | Signature              |⏳ Pending Decision       |
| **Miscellaneous**   | PSA_QST_TPL_URL     | URL for redirection       |❌ Not Needed           |
|                     | PSA_QST_TPL_SLD     | Numeric slider (0-10)      |⏳ Pending Decision    |
|                     | PSA_QST_TPL_ORG_PIC | Image display            |❌ Not Needed            |
|                     | PSA_QST_TPL_HEA     | Heading                 |❌ Not Needed             |

## Supported Questionnaire Input Types

The `psa-scr-qst-tst` package supports multiple questionnaire input types, determining how answers are retrieved, submitted, and managed during usage. These modes are defined as follows:

### **Repeatable (`PSA_QST_INP_TYP_REP`)**
- **Behavior**: A new set of answers is created every time the questionnaire is filled. Existing answers are not retrieved or edited.

### **Once with Updates (`PSA_QST_INP_TYP_ONC_UPD`)**
- **Behavior**: A single instance of the questionnaire is associated with the context. The user can view and modify their previous answers.

### **Once Only (`PSA_QST_INP_TYP_ONC`)** *(Not yet supported)*
- **Behavior**: A single instance of the questionnaire is associated with the context. Once the questionnaire is submitted, it cannot be edited or resubmitted.

## Installation

Install the package into your scrivito portal app:

```shell
npm install psa-scr-qst-tst
```

### Importing and Initializing

Import the `initPisaQuestionnaireWidgets` function from the package and call it in your index.ts file found in the Widgets folder (e.g., in `src/Widgets/index.ts`). Make sure to provide the URL to your PisaSales REST API as the pisaUrl parameter:

```js
import { initPisaQuestionnaireWidgets } from "psa-scr-qst-tst";

// Replace "YOUR_PISA_API_URL" with the actual PisaSales REST API URL
initPisaQuestionnaireWidgets({ pisaUrl: "YOUR_PISA_API_URL" });

```

Import the `loadEditingConfigs` function from the package and call it in your editingConfigs.ts file also found in the Widgets folder.

```js
import { loadEditingConfigs } from "psa-scr-qst-tst/editing";

loadEditingConfigs();
```

Add the widget styles to your app.
This can be done by either loading the CSS via `css-loader` (e.g. in `src/index.js` or `src/Widgets/index.js`):

```js
import "psa-scr-qst-tst/index.css";
```

Or by importing the styles into your stylesheets (e.g. in `src/assets/stylesheets/index.scss`):

```scss
@import "psa-scr-qst-tst/index.css";
```

Add the editing styles in `scrivitoExtensions.scss`:

```scss
@import "psa-scr-qst-tst/editing.css";
```

## Local Development

To develop and test the package locally, follow these steps:

- Copy or clone the repository
- Navigate into the package directory.
- Install the package dependencies:

```shell
npm install
```
- Link the package locally: 
```shell
npm link
```
- Navigate into the Portal App
- Use the linked the package:
```shell
npm link psa-scr-qst-tst
```
- If you have a prevoius version installed, remove or outcomment the imported styles from `index.scss` and `scrivitoExtensions.scss`.
- follow [importing and initializing](#importing-and-initializing) instructions.
**Note:**

The Scrivito Portal App is built using Vite and will automatically compile the package, so there's no need to run `npm run build` or `npm run start` for local development.