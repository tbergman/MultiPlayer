import React from "react";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";

import styled from "styled-components";
import Picture from "./Picture";

// #f9f9f9;

type CardProps = {
  selected: boolean;
  frame: boolean;
};
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 3px;
  background-color: ${(props: CardProps) =>
    props.selected ? "#ddd" : "#f9f9f9"};

  border-color: ${(props: CardProps) =>
    props.frame ? "lightgreen" : "transparent"};

  height: 150px;
  width: 220px;
  cursor: pointer;
  text-align: center;
  border-width: 4px;
  border-style: solid;
  border-radius: 15px;
  box-shadow: 2px 2px 2px #ddd;
  :hover {
    box-shadow: 4px 4px 4px #777;
  }
`;

type Props = {
  card: GameSetCard;
  selected: boolean;
  showFrame: boolean;
  onClick: () => void;
};

const Card: React.FC<Props> = ({ card, selected, showFrame, onClick }) => {
  if (!card) {
    return (
      <CardContainer
        selected={selected}
        frame={false}
        onClick={onClick}
      ></CardContainer>
    );
  }
  const { color } = mapCardProps(card);
  const pics = new Array(card.count).fill(1);
  return (
    <CardContainer selected={selected} frame={showFrame} onClick={onClick}>
      {pics.map((p, index) => {
        return (
          <Picture
            key={index}
            shape={card.shape}
            color={card.color}
            fill={card.fill}
          ></Picture>
        );
      })}
    </CardContainer>
  );
};

const mapCardProps = (card: GameSetCard) => {
  const props = { color: "white" };
  switch (card.color) {
    case 1:
      props.color = "red";
      break;
    case 2:
      props.color = "green";
      break;
    case 3:
      props.color = "blue";
      break;
  }

  return props;
};

export default Card;
