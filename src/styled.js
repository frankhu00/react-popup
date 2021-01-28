import styled, { css } from 'styled-components';
import { fade, DelayUnmountStage } from '@frankhu00/react-animations';

export const PopupContentContainer = styled.div`
    position: fixed;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(111, 119, 130, 0.15), 0 5px 20px 0 rgba(21, 27, 38, 0.08);
    box-sizing: border-box;
    background: #fff;
    z-index: ${({ zIndex = 3 }) => zIndex};
    ${({ show }) => (show === false ? `display: none;` : null)}
    ${({ stage, animationDuration }) =>
        stage === DelayUnmountStage.ENTERING
            ? css`
                  animation: ${fade.in()} ${animationDuration / 1000}s forwards;
              `
            : css`
                  animation: ${fade.out()} ${animationDuration / 1000}s forwards;
              `}
`;
