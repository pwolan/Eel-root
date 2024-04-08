import React from "react";

import {
  useControls,
} from "react-zoom-pan-pinch";
import Button from "./Button";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <Button className=" !w-10 !px-2" onClick={() => zoomIn()}>+</Button>
      <Button className=" !w-10 !px-2" onClick={() => zoomOut()}>-</Button>
      <Button className=" !w-10 !px-2" onClick={() => resetTransform()}>x</Button>
    </div>
  );
};

export default Controls;