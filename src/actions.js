import axios from 'axios';
import { TweenMax } from 'gsap';

const showProjectImage = (key, x, y) => {
  TweenMax.fromTo('.projectImage img', 0.5, { width: 0 }, { width: 180 });

  return {
    // visible: true,
    type: 'SHOW_PROJECT',
    positionX: x - 75,
    positionY: y - 75,
    projectKey: key
  };
};

const hideProjectImage = () => {
  return {
    type: 'HIDE_PROJECT'
  };
};

export { showProjectImage, hideProjectImage };
