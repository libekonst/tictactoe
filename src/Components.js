import React from "react";

const Square = props => <div className="Square" {...props} />;

export const Board = ({ squares, onClick }) => (
  <div className="Board">
    {squares.map((s, i) => (
      <Square onClick={() => onClick(i)}>{s && <Mark mark={s} />}</Square>
    ))}
  </div>
);

export const Mark = ({ mark }) => (
  <ion-icon name={mark === "X" ? "close" : "radio-button-off"} />
);
