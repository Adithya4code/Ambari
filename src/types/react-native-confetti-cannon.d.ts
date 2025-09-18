declare module 'react-native-confetti-cannon' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  interface ConfettiCannonProps extends ViewProps {
    count?: number;
    origin?: { x: number; y: number };
    autoStart?: boolean;
    fadeOut?: boolean;
    explosionSpeed?: number;
    fallSpeed?: number;
    onAnimationEnd?: () => void;
  }

  export default class ConfettiCannon extends React.Component<ConfettiCannonProps> {}
}
