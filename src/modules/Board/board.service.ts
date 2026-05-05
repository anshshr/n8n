import AppError from "../../Error/appError.js";
import { Board, Shape } from "./board.model.js";

// create a  empty board
export async function createBoard(name: string, desc: string) {
  return Board.create({ name, desc: desc, shapes: [], connections: [] });
}

export async function getBoards() {
  return Board.find().populate("shapes").populate("connections");
}

//add a shape to the board
export async function addShape(
  boardId: string,
  x: string,
  y: string,
  name: string,
  colour: string,
  height: string,
  width: string,
) {
  const board = await Board.findById(boardId);

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  const shape = await Shape.create({
    x,
    y,
    name,
    colour,
    height,
    width,
  });

  board.shapes.push(shape._id);
  await board.save();

  return shape;
}

// remove a shape from a board

// delete a board

// get all the baords

// delete all the boards

// add a conection to the board

// remove a connection to the board
