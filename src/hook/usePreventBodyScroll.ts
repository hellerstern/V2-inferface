import React from 'react';

const preventDefault = (ev: Event) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
};

const enableBodyScroll = () => {
  document?.removeEventListener('wheel', preventDefault, false);
};
const disableBodyScroll = () => {
  document?.addEventListener('wheel', preventDefault, {
    passive: false
  });
};

function usePreventBodyScroll() {
  const [isHidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    isHidden ? disableBodyScroll() : enableBodyScroll();

    return enableBodyScroll;
  }, [isHidden]);

  const disableScroll = React.useCallback(() => setHidden(true), []);
  const enableScroll = React.useCallback(() => setHidden(false), []);
  return { disableScroll, enableScroll };
}

export default usePreventBodyScroll;
