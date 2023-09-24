export const tag = <Tag extends string, Children extends string>(tag: Tag, children: Children) => {
  type Output = `<${Tag}>${Children}</${Tag}>`;
  return '<' + tag + '>' + children + '</' + tag + '>' as Output;
};

export const table = (cells: string[][]) => {
  const maxSizes: number[] = [];

  for (const row of cells) {
    for (const [i, cell] of Object.entries(row)) {
      maxSizes[+i] = Math.max(maxSizes[+i] || 0, cell.length);
    }
  }

  return cells.map(row => row.map((cell, i) => cell.padEnd(maxSizes[i] || 0)).join(' ')).join('\n');
};
