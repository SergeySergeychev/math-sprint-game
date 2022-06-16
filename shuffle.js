// Function to shuffle an array
function shuffle(array) {
  let currenIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle
  while (currenIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currenIndex);
    currenIndex--;

    // And swap it with the curent element.
    temporaryValue = array[currenIndex];
    array[currenIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
