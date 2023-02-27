import arrowDown from "./icons8-down-arrow-32.png";
import arrowUp from "./icons8-up-arrow-32.png";
import renderArrow from "./renderArrow.js";

export default (value, id) => {
    if (value) {
        const parentEl = document.getElementById(id);
        let arrow;
        switch (value) {
          case 'firstCreation':
            arrow = renderArrow('ascending');
            parentEl.appendChild(arrow);
            break;
  
          case "changingColumn":
            const elToDel = document.getElementById("arrow");
            elToDel.remove();
            arrow = renderArrow('ascending');
            parentEl.appendChild(arrow);
            break;
          
          case 'changingToDescending': 
            arrow = document.getElementById("arrow");
            arrow.src = arrowUp;
            break;
          
          case 'changingToAscending': 
            arrow = document.getElementById("arrow");
            arrow.src = arrowDown;
            break;
          
          case 'delExisting':
            arrow = document.getElementById("arrow");
            arrow.remove();
            break;
          
          default:
            throw new Error(`Unknown process state: ${path}`);
        }
      }
}