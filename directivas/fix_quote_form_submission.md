# Directive: Fix Quote Form Auto-Submission

## Objective
Prevent the multi-step quote form from submitting prematurely when a user interacts with the image upload fields on the final step.

## Requirements
- **No Auto-Submit**: Uploading a file should NEVER trigger the `onSubmit` handler of the form.
- **Explicit Submission**: Only clicking the "Submit Quote Request" button on Step 3 should trigger the database insertion and email notifications.
- **Event Isolation**: Stop event propagation from file inputs and labels to prevent them from bubbling up to the form's submit trigger.

## Logic Flow
1. **Event Handling**: Update the file input `onChange` to call `e.stopPropagation()`.
2. **Form Validation**: Ensure `handleSubmit` only proceeds if the event is a legitimate form submission from the designated button.
3. **Keyboard Safety**: Maintain `e.preventDefault()` for 'Enter' key to avoid accidental submissions.

## Steps
1. Modify `src/routes/quote.tsx`.
2. Update the `input type="file"` in Step 3 to explicitly stop event propagation.
3. Update `handleImageChange` if necessary to handle the event object.
