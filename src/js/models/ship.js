export const Ship = (length) => {
  let hits = 0;

  function getHit() {
    this.hits++;
  }

  function checkIfSunk() {
    console.log(this.length, this.hits)
    if (this.hits === this.length) return true;
    else return false;
  }

  return { length, getHit, checkIfSunk, hits};
};
