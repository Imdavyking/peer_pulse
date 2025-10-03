export const ellipsify = (word: string, length = 12) => {
  if (word.length > length) {
    return (
      word.substr(0, length / 2) + "..." + word.substr(word.length - length / 2)
    );
  } else {
    return word;
  }
};
