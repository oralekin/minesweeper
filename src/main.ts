import Field from './Field';
import './game.scss'

const app = document.querySelector<HTMLDivElement>('#field')!


const w = 10;
const h = 10;

// @ts-ignore
const field = new Field(w, h, app);


