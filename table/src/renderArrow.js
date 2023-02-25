import arrowDown from "./icons8-down-arrow-32.png";

export default () => {
    const arrow = new Image(16, 16);
    arrow.style.position = "absolute";
    arrow.style.right = "5";
    arrow.id = "arrow";
    arrow.src = arrowDown;
    return arrow;
  };