export type TabTransitionDirection = 'left' | 'right';

let lastSwipeDirection: TabTransitionDirection | null = null;
let exitAnimator: ((direction: TabTransitionDirection, onDone: () => void) => void) | null = null;

export function setLastSwipeDirection(direction: TabTransitionDirection) {
  lastSwipeDirection = direction;
}

export function consumeLastSwipeDirection() {
  const direction = lastSwipeDirection;
  lastSwipeDirection = null;
  return direction;
}

export function setExitAnimator(
  animator: ((direction: TabTransitionDirection, onDone: () => void) => void) | null,
) {
  exitAnimator = animator;
}

export function requestTabTransition(direction: TabTransitionDirection, onDone: () => void) {
  setLastSwipeDirection(direction);
  if (exitAnimator) {
    exitAnimator(direction, onDone);
    return;
  }
  onDone();
}
