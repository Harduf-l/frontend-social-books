export const checkIfInputIsHebrew = (e) => {
  if (e.charCodeAt(0) >= 1488 && e.charCodeAt(0) <= 1514) {
    return true;
  }
  return false;
};
