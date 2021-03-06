/*

player:
1:red
2:black
3:yellow
4:green


position: start, start+1, ....

red:     1, 2, 3, 4, 5, 6, 7, 8, 9,10
black:  11,12,13,14,15,16,17,18,19,20
yellow: 21,22,23,24,25,26,27,28,29,30
green:  31,32,33,34,35,36,37,38,39,40

target for
red:    101,102,103,104
black:  111,112,113,114
yellow: 121,122,123,124
green:  131,132,133,134

path for
red:    1.........40,101,102,103,104
black:  11..40,1..10,111,112,113,114
yellow: 21..40,1..20,121,122,123,124
green:  31..40,1..30,131,132,133,134
*/

import GameBase from "../GameBase";
import Randomize from "../Randomize";
import DtoGameTicTacToe from "./DtoGameTicTacToe";

const MAX_PLAYER_COUNT = 2;
const MAX_ROW = 3;
const MAX_COL = 3;

const CELL_1 = 1;
const CELL_2 = 2;
const CELL_EMPTY = 0;

class GameTicTacToe extends GameBase {
  board = [];
  currentPlayerIdx = -1;
  wonPlayerId = undefined;
  state: "idle" | "started" | "finished" = "idle";

  public message(message: any) {
    if (this.gameId != message.gameId) {
      // ups - wrong game
      return;
    }
    const playerId = message.playerId;

    switch (message.cmd) {
      case "GAME_MOVE":
        this.cmdMakeMove(playerId, message.move);
        break;
      case "GAME_RESTART":
        this.cmdStart();
        break;
      default:
        console.error("bad message", message);
    }
  }

  getGame(): DtoGameTicTacToe {
    let dto: DtoGameTicTacToe = {
      name: "TicTacToe",
      gameId: this.gameId,
      board: this.board,
      wonPlayerId: this.wonPlayerId ? this.wonPlayerId : undefined,
      currentPlayerId: this.wonPlayerId ? undefined : this.getCurrentPlayerId(),
      state: this.state,
    };
    return dto;
  }

  public addPlayer(playerId: string) {
    if (this.state == "idle" && this.players.length < MAX_PLAYER_COUNT) {
      super.addPlayer(playerId);
    }

    //   if (this.players.length == MAX_PLAYER_COUNT) {
    //   this.cmdStart();
    // }
  }

  public removePlayer(playerId: string) {
    this.state = "idle";
    super.removePlayer(playerId);
  }

  public cmdInit() {
    this.clearBoard();
    this.state = "idle";
    this.sendUpdate();
  }

  public cmdStart() {
    this.clearBoard();
    this.state = "started";
    this.sendUpdate();
  }

  public cmdMakeMove(
    playerId: string,
    { col, row }: { col: number; row: number }
  ) {
    this.checkValidPlayerId(playerId);
    this.checkValidMove(col, row);
    if (this.state === "started") {
      const val = this.getCellValueForPlayer(playerId);
      this.setCellValue(col, row, val);

      const wonPlayerId = this.getWonPlayerId();
      if (wonPlayerId) {
        this.wonPlayerId = wonPlayerId;
        this.state = "finished";
      }

      if (this.isGameDrawn()) {
        this.state = "finished";
      }

      this.setNextCurrentPlayerIdx();
      this.sendUpdate();
    }
  }

  private clearBoard() {
    this.board = [];
    for (let iRow = 0; iRow < MAX_ROW; iRow++) {
      const row = [];
      for (let iCol = 0; iCol < MAX_COL; iCol++) {
        row.push(CELL_EMPTY);
      }
      this.board.push(row);
    }
    this.currentPlayerIdx = Randomize.generateInt(2);
    this.wonPlayerId = undefined;
  }

  private getCellValueForPlayer(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    return index === 0 ? CELL_1 : CELL_2;
  }

  private checkValidMove(col: number, row: number) {
    let ok = col >= 0 && col < MAX_COL && row >= 0 && row < MAX_ROW;
    if (!ok) {
      throw new Error(
        `invalid move - bad col/row: ${this.gameId}, ${col}, ${row}`
      );
    }
    if (this.getCellValue(col, row)) {
      throw new Error(
        `invalid move - cell allready set: ${this.gameId}, ${col}, ${row}`
      );
    }
  }

  private checkValidPlayerId(playerId: string) {
    const ok = this.getPlayerId(this.currentPlayerIdx) === playerId;
    if (!ok) {
      throw new Error("player is not current player");
    }
  }

  private getPlayerId(idx: number) {
    if (idx >= 0 && idx < this.players.length && idx < MAX_PLAYER_COUNT) {
      return this.players[idx].id;
    } else {
      return "";
    }
  }

  private setNextCurrentPlayerIdx() {
    if (this.state === "started") {
      if (this.currentPlayerIdx < this.players.length - 1) {
        this.currentPlayerIdx++;
      } else {
        this.currentPlayerIdx = 0;
      }
    }
  }

  private getCurrentPlayerId() {
    if (
      this.currentPlayerIdx >= 0 &&
      this.currentPlayerIdx < this.players.length
    ) {
      const player = this.players[this.currentPlayerIdx];
      return player.id;
    } else {
      return "";
    }
  }

  private getCellValue(col: number, row: number) {
    return this.board[row][col];
  }

  private setCellValue(col: number, row: number, val: number) {
    this.board[row][col] = val;
  }

  private getWonPlayerId() {
    const checkCells = [
      ["0,0", "0,1", "0,2"],
      ["1,0", "1,1", "1,2"],
      ["2,0", "2,1", "2,2"],

      ["0,0", "1,0", "2,0"],
      ["0,1", "1,1", "2,1"],
      ["0,2", "1,2", "2,2"],

      ["0,0", "1,1", "2,2"],
      ["0,2", "1,1", "2,0"],
    ];

    let wonPlayerId;
    checkCells.forEach((cells) => {
      const values = new Set<number>();
      cells.forEach((cell) => {
        const [col, row] = cell.split(",").map((str) => parseInt(str));
        values.add(this.getCellValue(col, row));
      });
      if (values.size === 1 && !values.has(CELL_EMPTY)) {
        const playerIdA = this.players[0].id;
        const playerCellValueA = this.getCellValueForPlayer(playerIdA);
        if (values.has(playerCellValueA)) {
          wonPlayerId = playerIdA;
        } else {
          wonPlayerId = this.players[1].id;
        }
      }
    });

    return wonPlayerId;
  }

  private *makeBoardIterator() {
    for (let iRow = 0; iRow < MAX_ROW; iRow++) {
      for (let iCol = 0; iCol < MAX_COL; iCol++) {
        const val = this.board[iRow][iCol];
        yield { row: iRow, col: iCol, val };
      }
    }
  }

  private isGameDrawn() {
    const cellValues = new Set<number>();
    const iter = this.makeBoardIterator();
    for (const cell of iter) {
      cellValues.add(cell.val);
    }
    return !cellValues.has(CELL_EMPTY);
  }
}

export default GameTicTacToe;
