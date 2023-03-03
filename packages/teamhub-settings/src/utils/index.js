class IdGenerator {
  constructor(prefix) {
    this.prefix = prefix;
  }

  createWithAppendedPrefix(id) {
    return new IdGenerator(`${this.prefix}-${id.toLowerCase()}`);
  }

  getId(id) {
    return `${this.prefix}-${id.toLowerCase()}`;
  }
}

export function createIdGenerator(prefix) {
  return new IdGenerator(prefix);
}

export const idGenerator = createIdGenerator("THS");
