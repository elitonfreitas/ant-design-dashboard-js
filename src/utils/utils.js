import dictionary from "./errorConstants";

const findWord = word => dictionary[word] || word;

const translateError = message => {
  if (!message) {
    return "";
  }
  if (!message.includes("${")) {
    return findWord(message);
  }

  const words = message.split(" ");
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (word) {
      const match = word.match(/\$\{(.*)\}/i);
      if (match && match[1]) {
        words[i] = word.replace(match[0], findWord(match[1]));
      } else {
        words[i] = word;
      }
    }
  }

  return words.join(" ");
};

export default { translateError };
