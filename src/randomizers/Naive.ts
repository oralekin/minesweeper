import Randomizer from "./Randomizer";

export default 
    class Naive
    extends Randomizer
    {

    public generateBoard(height: number, width: number, mines: number): boolean[][] {
        const board = Array.from(Array(height)).map(() => Array(width).fill(false)) as boolean[][];
        for (let placedMines = 0; placedMines < mines; ) {
            const y = this.getIntBetween(0, height);
            const x = this.getIntBetween(0, width);

            if (!board[y][x]) {

                placedMines++;
                board[y][x] = true;
            }
        }

        return board;
    }


}