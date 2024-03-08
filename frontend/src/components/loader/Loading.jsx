import React from "react";
import styled, { keyframes } from "styled-components";

const Body = styled.div`
width:100vw;
height:100vh;
  z-index: 1000;
  font-size: 62.5%;
  overflow: hidden;
  background-color: #fff; /* Updated background color */
`;

const len = 242.776657104492;
const time = 1.6;

const anim = keyframes`
  12.5% {
    stroke-dasharray: ${len * 0.14}px, ${len}px;
    stroke-dashoffset: ${-len * 0.11}px;
  }
  43.75% {
    stroke-dasharray: ${len * 0.35}px, ${len}px;
    stroke-dashoffset: ${-len * 0.35}px;
  }
  100% {
    stroke-dasharray: ${len * 0.01}px, ${len}px;
    stroke-dashoffset: ${-len * 0.99}px;
  }
`;

const Svg = styled.svg`
  width:30vw;
  height:30vh;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Outline = styled.path`
  stroke: #e80059;
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
  stroke-dasharray: ${len * 0.01}px, ${len}px;
  stroke-dashoffset: 0;
  animation: ${anim} ${time}s linear infinite;
`;

const OutlineBg = styled.path`
  opacity: 0.05;
  fill: none;
  stroke: ##e80059;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
`;

const Loading = () => {
  return (
    <Body>
      <Svg viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet">
        <Outline
          stroke="##e80059"
          id="outline"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
        />
        <OutlineBg
          id="outline-bg"
          fill="none"
          stroke="#e80059"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
        />
      </Svg>
    </Body>
  );
};

export default Loading;
