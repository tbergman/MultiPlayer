import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const AppLeftSideContainer = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
`;

export const AppGameContainer = styled.div`
  margin: 10px;
`;

export const SmallText = styled.div`
  font-size: 0.7rem;
`;

export const TicTacToeGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Board = styled.div`
  background-color: gray;
  display: flex;
  flex-direction: row;
`;

export const Cell = styled.div`
  margin: 10px;
  background-color: yellow;
  height: 50px;
  width: 50px;
  cursor: pointer;
  text-align: center;
`;

export const Button = styled.button`
  font-size: 1.2rem;
  margin: 0.5rem;
`;

// --------------------------------

export const GameNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GameListHeader = styled.h3`
  border-bottom: 1px solid gray;
`;

export const GameName = styled.button`
  background-color: lightgreen;
  width: 140px;
  font-size: 1.2rem;
  margin: 0.1rem;
`;