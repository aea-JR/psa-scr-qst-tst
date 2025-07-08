import { nanoid } from "nanoid/non-secure";

const generateId = (length: number = 20): string =>
  nanoid(length).replace(/[-_]/g, "0");

export default generateId;
