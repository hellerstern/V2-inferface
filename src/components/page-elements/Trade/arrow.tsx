import React from 'react';

import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { NavigateNext, NavigateBefore } from '@mui/icons-material';

function Arrow({
  children,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        right: '1%',
        opacity: disabled ? '0' : '1',
        userSelect: 'none',
        background: '#2B2F3A',
        borderRadius: '5px',
        border: 'none',
        color: '#FFFFFF',
        minWidth: '30px',
        minHeight: '30px',
        alignItems: 'center',
        marginLeft: '10px',
        marginRight: '10px'
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { isFirstItemVisible, scrollPrev, visibleElements, initComplete } = React.useContext(VisibilityContext);

  const [isDisabled, setDisabled] = React.useState(!initComplete || (initComplete && isFirstItemVisible));
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length > 0) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);

  console.log('initComplete: ', initComplete);

  return (
    <Arrow disabled={isDisabled} onClick={() => scrollPrev()}>
      <NavigateBefore />
    </Arrow>
  );
}

export function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleElements } = React.useContext(VisibilityContext);

  // console.log({ isLastItemVisible });
  const [isDisabled, setDisabled] = React.useState(visibleElements.length === 0 && isLastItemVisible);
  React.useEffect(() => {
    if (visibleElements.length > 0) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);

  return (
    <Arrow disabled={isDisabled} onClick={() => scrollNext()}>
      <NavigateNext />
    </Arrow>
  );
}
