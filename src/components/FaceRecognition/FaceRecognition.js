import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="800px"
          height="auto"
        />
        {boxes.map((element, index) => {
          return (
            <div
              key={index}
              className="bounding-box"
              style={{
                top: element.topRow,
                right: element.rightCol,
                bottom: element.bottomRow,
                left: element.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
