import styled from 'styled-components';

export const PopupContainer = styled.div`
    position: relative;
`;

export const PopupContentContainer = styled.div`
    position: absolute;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(111, 119, 130, 0.15), 0 5px 20px 0 rgba(21, 27, 38, 0.08);
    box-sizing: border-box;
    background: #fff;
    z-index: ${({ zIndex = 3 }) => zIndex};
    ${({ show }) => (show === false ? `display: none;` : null)}
`;
