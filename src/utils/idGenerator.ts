import { nanoid } from "nanoid";

const generateId = (length: number = 20): string =>
  nanoid(length).replace(/[-_]/g, "0");

export default generateId;
