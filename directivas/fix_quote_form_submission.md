# Directive: Fix Quote Form Auto-Submission

## Objective

Prevent the multi-step quote form from submitting prematurely when a user interacts with the image upload fields on the final step.

## Requirements

- **No Auto-Submit**: Uploading a file should NEVER trigger the `onSubmit` handler of the form.
- **Explicit Submission**: Only clicking the "Submit Quote Request" button on Step 3 should trigger the database insertion and email notifications.
- **Event Isolation**: Stop event propagation from file inputs and labels to prevent them from bubbling up to the form's submit trigger.

## Logic Flow

1. **Event Handling**: Update the file input `onClick` and `onChange` to call `e.stopPropagation()`.
2. **Label Isolation**: Add `onClick={(e) => e.stopPropagation()}` to the `<label>` wrapping the file input to prevent click bubbling to the form.
3. **Form Validation**: Update `handleSubmit` to check if `status === 'submitting'` and if a safety delay (`canSubmit`) has passed to prevent double-submissions or premature triggers during step transitions.
4. **Safety Delay**: Implement a 500ms lockout (`canSubmit`) when transitioning from Step 2 to Step 3 to ensure a double-click on the "Next" button doesn't trigger the "Submit" button.
5. **Keyboard Safety**: Maintain `e.preventDefault()` for 'Enter' key to avoid accidental submissions.

## Steps

1. Modify `src/routes/quote.tsx`.
2. Update the `label` in Step 3 to stop event propagation.
3. Update the `input type="file"` in Step 3 to ensure both `onClick` and `onChange` stop propagation.
4. Add a guard in `handleSubmit` to check for `status === 'submitting'`.
