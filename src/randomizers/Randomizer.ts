import seedrandom, { PRNG } from "seedrandom";

export type PRNGConstructor = (seed?: string) => seedrandom.PRNG;

export default abstract class Randomizer {

    public _seed: string;
    protected generator: PRNG;

    constructor(seed: string, generator: PRNGConstructor) {
        this._seed = seed;
        this.generator = generator(this._seed);
    }

    get seed() {
      return this._seed;
    }


    // numbers HAVE TO BE integers
    protected getIntBetween(min: number, max: number): number {
      return Math.round((this.generator() * (max - min) + min - 0.5))
    }

    public abstract generateBoard(height: number, width: number, mines: number): boolean[][]


}