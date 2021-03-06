namespace Randomize {
  // generate random int between 0 and max-1
  export function generateInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  export function generateId(
    len: number,
    type: "all" | "numeric" | "alpha" | "upcase" | "downcase" = "all"
  ) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    let list = "";
    switch (type) {
      case "all":
        list = numbers + alphabet + alphabet.toUpperCase();
        break;
      case "numeric":
        list = numbers;
        break;
      case "alpha":
        list = alphabet + alphabet.toUpperCase();
        break;
      case "upcase":
        list = alphabet.toUpperCase();
        break;
      case "downcase":
        list = alphabet;
        break;
      default:
        throw new Error(`bad type: ${type}`);
    }
    const elements = list.split("");
    if (len <= 0) {
      len = 1;
    }
    const result = [];
    for (let i = 0; i < len; i++) {
      const idx = this.generateInt(elements.length);
      result.push(elements[idx]);
    }
    return result.join("");
  }

  export function choose(list: any[]): any {
    const idx = Randomize.generateInt(list.length);
    return list[idx];
  }

  export function shuffle(list: any[]): any[] {
    const result = list.map((e) => e);
    for (let i = 0; i < list.length; i++) {
      const idx1 = Randomize.generateInt(list.length);
      const idx2 = Randomize.generateInt(list.length);
      if (idx1 !== idx2) {
        const tmp = result[idx1];
        result[idx1] = result[idx2];
        result[idx2] = tmp;
      }
    }
    return result;
  }
}

export default Randomize;
