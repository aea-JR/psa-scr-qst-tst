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
|                     | PSA_QST_TPL_STR_MUL |Multi-line text input  |❌ Not Needed           |
|                     | PSA_QST_TPL_CLB   | Multi-line text input | ✅ Implemented                  |
|                     | PSA_QST_TPL_BLB  | Multi-line text input  | ❌ Not Needed                  |
|                     | PSA_QST_TPL_INT  | Integer (numeric number input)| ✅ Implemented                |
|                     | PSA_QST_TPL_FLO  | Float (decimal number input)| ✅ Implemented                |
|                     | PSA_QST_TPL_DAT_TIM  | Date and time input| ✅ Implemented                |
|                     | PSA_QST_TPL_DAT  |Date-only input| ✅ Implemented                |
|                     | PSA_QST_TPL_MON   | Money input field      | Planned                 |
| **Dropdown Widget** | PSA_QST_TPL_CHC  | Regular dropdown   |✅ Implemented             |
|                     | PSA_QST_TPL_CTY   | Countries dropdown   |❌ Rejected (requires API) |
|                     | PSA_QST_TPL_LNG   | Languages dropdown    |❌ Rejected (requires API) |
|                     | PSA_QST_TPL_LOB   | Business dropdown         |❌ Rejected (requires API) |
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

## Supported Questionnaire Input Types (Response Mode)

The `psa-scr-qst-tst` package supports multiple questionnaire input types, determining how answers are retrieved, submitted, and managed during usage. These modes are defined as follows:

### **Multiple Submissions (`PSA_QST_INP_TYP_REP`)**
- **Behavior**: A new set of answers is created every time the questionnaire is filled. Existing answers are not retrieved or edited.

### **Single Submission with Edits (`PSA_QST_INP_TYP_ONC_UPD`)**
- **Behavior**: A single instance of the questionnaire is associated with the context. The user can view and modify their previous answers.

### **Once Only (`PSA_QST_INP_TYP_ONC`)** *(Not supported)*
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
- Add the following snippet to your vite.config:

```js
 resolve: {
      alias: {
        'psa-scr-qst-tst': path.resolve(
          __dirname,
          '../psa-scr-qst-tst/src' 
        ),
       
      },
      dedupe: ['react', 'react-dom', 'scrivito'],
    }, 
```
- Add the following snippet to your tsconfig: 
```js
 "paths": {
      "psa-scr-qst-tst": ["../psa-scr-qst-tst/src"],
      "psa-scr-qst-tst/editing": ["../psa-scr-qst-tst/src/editing"]
    },
```
**Note:**
The Scrivito Portal App is built using Vite and will automatically compile the package, so there's no need to run `npm run build` or `npm run start` for local development.


## Questionnaire Creation and Updating

### Creating a Questionnaire

Before you can use or answer a questionnaire, it needs to be created in PisaSales. This can be done through the **PisaSales Questionnaire Management** tab in the properties of the questionnaire widget. When the creation process starts, the questionnaire, including all its questions and options, is created in PisaSales and becomes ready for use on your site.

### Updating a Questionnaire

The package automatically detects changes related to the questionnaire, such as modifications to questions, options, or other attributes. If changes are detected, you must manually push these updates to PisaSales via the **PisaSales Questionnaire Management** tab in the widget properties.

### Failure Handling
If creating or updating any question or answer option fails, the questionnaire will behave as if changes were detected, displaying a Pending Update message and button. This happens when the data in the Scrivito questionnaire no longer matches the data in PisaSales, allowing you to retry the update process to synchronize both systems.


## Questionnaire Usage Across Different Pages

The `psa-scr-qst-tst` package allows you to reuse questionnaires across different pages using the copy/duplicate functionality. This feature enables flexibility in how questionnaires are deployed and managed within your Scrivito project.

### Key Behaviors:
1. **Copying or Duplicating an Already Created Questionnaire:**
   - When you copy or duplicate a questionnaire that has already been created in PisaSales, its identifiers are retained.
   - This allows the same questionnaire to be reused across multiple pages without creating duplicates in PisaSales.

2. **Copying or Duplicating a New Questionnaire:**
   - If a questionnaire is copied or duplicated before it has been created in PisaSales, new identifiers will be generated upon creation.
   - This ensures that the duplicate behaves as an entirely new questionnaire in PisaSales.

3. **Copying or Pasting Individual Questions or Options:**
   - When individual questions or answer options are copied and pasted, new identifiers are always generated, regardless of whether the parent questionnaire is already created in PisaSales.

### Note on Identifiers:
Each questionnaire, question, and answer option is uniquely identified by both `externalId` and `GID`. These identifiers ensure proper synchronization and behavior between Scrivito and PisaSales.



## Review Feature

The Review feature allows users to review their answers before submitting a questionnaire with multiple steps. It provides a dialog where users can see all their responses at a glance.

### Review Dialog

<img src="images/review_dialog.png" width="350" alt="Screenshot">

### Closing the Dialog

Users can close the review dialog in two ways:

1. **Click Outside:** Clicking anywhere outside the dialog will close it.
2. **Close Button:** The dialog also includes a close button in the footer for users who prefer to close it manually.

It's important to note that the footer with the close button is not mandatory. Users can easily close the dialog using any of the methods mentioned above.

The Review feature is specifically designed for questionnaires with multiple steps, providing users with an opportunity to verify their responses before final submission.


# Questionnaire Widgets

## Questionnaire Widget

<!-- <img src="images/form_container.png" width="350" alt="Screenshot"> -->

The `Questionnaire` widget is the main widget for creating and managing questionnaires. 

### Properties

<!-- <img src="images/questionnaire_properties.png" width="350" alt="Screenshot"> -->

The `Questionnaire` widget has the following properties divided into several tabs:

- "General" tab
  - Title: Enter the title for the questionnaire.
  - Response Mode: Select the [response mode](#supported-questionnaire-input-types-response-mode) for the questionnaire.
  - Additional CSS Classes: Specify additional CSS class names to be added to the main container of the questionnaire. Separate multiple class names with spaces.
  - Enable fixed height: Manually set the form height if enabled.
  - Form height: Enter the height of the questionnaire content measured in em units.
  - Scrollbar width: Select the width of the scrollbar. "None" will hide the scrolbar.
  - Overscroll behavior: Select how overscrolling should behave, i.e. it scrolls also the container."
- "ID's" tab
  - External ID: The external reference ID for the questionnaire.
  - Questionnaire ID (GID): The questionnaire ID in PisaSales.(Shown after questionnaire got created.)
- "Answer Context" tab
  - Activity ID Source: Select whether to manually enter the Activity ID or retrieve it from a DataItem attribute.
  - Activity ID: Manully enter the Activity ID. (Visible if selected source is "manual")
  - Name of the data attribute in question: Enter the name of the data attribute to read the activity id from.(Visible if selected source is "DataItem")
  - Activity ID data attribute value: The value behind the data item attribute name.(Visible if selected source is "DataItem")
  - Contact ID Source: Select whether to manually enter the Contact ID or retrieve it from a DataItem attribute.
  - Contact ID: Manully enter the Contact ID. (Visible if selected source is "manual")
  - Name of the data attribute in question: Enter the name of the data attribute to read the contact id from.(Visible if selected source is "DataItem")
  - Contact ID data attribute value: The value behind the data item attribute name.(Visible if selected source is "DataItem")
  - Project ID Source: Select whether to manually enter the Project ID or retrieve it from a DataItem attribute.
  - Project ID: Manully enter the Project ID. (Visible if selected source is "manual")
  - Name of the data attribute in question: Enter the name of the data attribute to read the project id from.(Visible if selected source is "DataItem")
  - Project ID data attribute value: The value behind the data item attribute name.(Visible if selected source is "DataItem")
- "Submission messages" tab
  - Submitting message type: Select the type of message displayed while the questionnaire answers are being submitted.
  - Submitting message: Message shown while the questionnaire answers are being submitted. (Visible if submitting message type is set to `Default text`).
  - Submitting content: Widgets shown while the questionnaire answers are being submitted. (Visible if submitting message type is set to `Custom content`).
  - Preview submitting message/widgets: Preview the message or content displayed while the questionnaire answers are being submitted. Works only in edit mode.
  - Submission success message type: Select the type of message displayed after successful answer submission.
  - Submitted message: Message shown after the answers are successfully submitted. (Visible if submission success message type is set to `Default text`).
  - Submission success content: Widgets shown after the answers are successfully submitted. (Visible if submission success message type is set to `Custom content`).
  - Preview success message/widgets: Preview the message or content displayed after the answers are successfully submitted. Works only in edit mode.
  - Submission failure message type: Select the type of failure message displayed upon submission failure.
  - Failed message: Message shown if the answer submission failed. (Visible if submission failure message type is set to `Default text`).
  - Submission failure content: Widgets shown if the answer submission failed. (Visible if submission failure message type is set to `Custom content`).
  - Show retry button: Show a retry button at the end of the message/widgets.
  - Retry button text: The text for the retry button.
  - Retry button alignment: Alignment for the retry button.
  - Preview failed message/widgets: Preview the message or content displayed if the answer submission failed. Works only in edit mode.
- "Steps" tab
  - Steps: Configure the questionnaire steps.
- "Review" tab
  - Enable Review: Adds a button to the last step of "Multiple Steps" for reviewing the answers.
  - Review button text: The text for the review button.
  - Show steps: Shows the steps in the review dialog.
  - Include empty answers: Includes empty answers in the review dialog, otherwise only non empty answers are shown.
  - Show header: Adds a header to the review dialog.
  - Header title: The title of the review header.
  - Show footer: Adds a footer with a button for closing the review dialog.
  - Close button text: The text on the button for closing the review dialog.

- "Navigation area" tab (Content depends on form type i.e. single-step or multiple-steps)
  - Forward button text: Text for the forward button.
  - Backward button text: Text for the backward button.
  - Submit button text: Text for the submit button.
  - Alignment: Alignment for the single-step questionnaire submit button.
- "PisaSales Questionnaire Management" tab (Content depends on the current questionnaire status)
  - Create button: Fully creates the questionnaire on PisaSales side. (Visible if questionnaire has not been created yet)
  - Push changes button: Push all changes made for the questinnaire to PisaSales. (Visible if questionnaire has unsynced changes)

### Validation

The `Questionnaire` Widget has specific validation requirements:

- The widget cannot be placed on public sites.
- The widget cannot be placed into another Questionnaire widget.
- The widget must include at least one question.
- The Questionnaire title cannot be empty.

## Questionnaire Step Widget

<!-- <img src="images/form_step_preview.png" width="350" alt="Screenshot"> -->

The `Questionnaire Step` widget represents an individual step within the questionnaire. Each step can have its own set of questions and content.

### Properties

- Content: Configure the content for this step.

### Validation

- The step widget must be placed within the questionnaire.
