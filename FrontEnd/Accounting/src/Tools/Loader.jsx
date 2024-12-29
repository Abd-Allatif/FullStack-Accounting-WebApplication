import React from 'react';
import styled from 'styled-components';

let dimensions = {
  width: '3',
  height: '20',
  animateHeight: '35',
}
const Loader = ({ width, height, animateHeight }) => {
  dimensions.width = width;
  dimensions.height = height;
  dimensions.animateHeight = animateHeight;

  const StyledWrapper = styled.div`
  .loader {
    display: flex;
    align-items: center;
  }

  .bar {
    display: inline-block;
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    background-color: rgba(255, 255, 255, .5);
    border-radius: 10px;
    animation: scale-up4 1s linear infinite;
  }

  .bar:nth-child(2) {
    height: ${dimensions.animateHeight}px;
    margin: 0 5px;
    animation-delay: .25s;
  }

  .bar:nth-child(3) {
    animation-delay: .5s;
  }

  @keyframes scale-up4 {
    20% {
      background-color: #ffff;
      transform: scaleY(1.5);
    }

    40% {
      transform: scaleY(1);
    }
  }`;



  return (
    <StyledWrapper>
      <div className="loader">
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </div>
    </StyledWrapper>
  );
}



export default Loader;
