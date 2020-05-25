import React from "react";
import {
  Board,
  Cell,
  Button,
  TicTacToeGameContainer,
} from "../components/style";
import PlayersTurn from "./PlayersTurn";
import DtoGameTicTacToe from "./DtoGameTicTacToe";
import { Player } from "../model/Player";

type Props = {
  game: DtoGameTicTacToe;
  players: Player[];
  playerId: string;
  sendMessage: (message: any) => void;
};
const TicTacToe: React.FC<Props> = ({
  game,
  players,
  playerId,
  sendMessage,
}) => {
  const handleCellClick = (row: number, col: number) => {
    const move = { row, col };
    sendMessage({
      cmd: "game_move",
      playerId: playerId,
      gameId: game.gameId,
      move: move,
    });
  };

  const handleRestart = () => {
    sendMessage({
      cmd: "game_restart",
      gameId: game.gameId,
    });
  };

  const getCellColor = (val: number): string => {
    const playerIdx = val - 1;
    switch (val) {
      case 1:
      case 2:
        if (players.length > playerIdx) {
          return players[playerIdx].color;
        } else {
          return "drakgray";
        }
      default:
        return "lightgray";
    }
  };

  const getCurrentPlayer = () => {
    return players.find((player) => player.id === game.currentPlayerId);
  };

  if (!game.board) {
    return null;
  }

  let component = null;
  if (game.state === "finished") {
    let textComponent = null;
    if (game.wonPlayerId) {
      textComponent = <h3>Player {game.wonPlayerId} won!</h3>;
    } else {
      textComponent = <h3>drawn</h3>;
    }
    component = (
      <React.Fragment>
        {textComponent}
        <Button onClick={handleRestart}>play once more</Button>
      </React.Fragment>
    );
  } else {
    const currentPlayer = getCurrentPlayer();
    const currentPlayerName = currentPlayer?.name;
    component = (
      <PlayersTurn
        playerName={currentPlayerName}
        myself={currentPlayer?.id === playerId}
      />
    );
  }

  return (
    <TicTacToeGameContainer>
      <h4>TIC TAC TOE</h4>
      {component}
      <Board>
        {game.board.map((row, iRow: number) => {
          return (
            <div key={iRow}>
              {row.map((val, iCol: number) => {
                return (
                  <Cell
                    key={iCol}
                    color={getCellColor(val)}
                    onClick={() => handleCellClick(iRow, iCol)}
                  ></Cell>
                );
              })}
            </div>
          );
        })}
      </Board>
    </TicTacToeGameContainer>
  );
};

export default TicTacToe;
