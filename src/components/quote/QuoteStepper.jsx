import Icon from '../ui/Icon.jsx';

/**
 * Horizontal step indicator at the top of the quote wizard.
 * Marks past steps as done, the current step as active, and future steps as pending.
 */
export default function QuoteStepper({ steps, currentIndex }) {
  return (
    <ol className="quote-steps" aria-label="Quote progress">
      {steps.map((step, i) => {
        const state =
          i < currentIndex ? 'done' :
          i === currentIndex ? 'current' :
          'pending';
        return (
          <li
            key={step.id}
            className={`quote-steps__item quote-steps__item--${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="quote-steps__num" aria-hidden>
              {state === 'done' ? <Icon name="check" size={12} stroke={3} /> : i + 1}
            </span>
            <span>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
