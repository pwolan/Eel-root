import React from "react";

import {
  useControls,
} from "react-zoom-pan-pinch";
import Button from "./Button";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <Button className=" !w-24 !px-2" onClick={() => zoomIn()}>Przybliż</Button>
      <Button className=" !w-24 !px-2" onClick={() => zoomOut()}>Oddal</Button>
      <Button className=" !w-24 !px-2" onClick={() => resetTransform()}>Zresetuj</Button>
    </div>
  );
};

export default Controls;