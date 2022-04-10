import Field from './Field';
import './game.scss'

const app = document.querySelector<HTMLDivElement>('#field')!


const w = 10;
const h = 10;
const mines = 18;

// @ts-ignore
window.field = new Field(w, h, mines, app);

