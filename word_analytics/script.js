console.log("Js loaded");

const textareaEl = document.querySelector(".textarea");
const wordEl = document.querySelector(".stat__number--words");
const charactersEl = document.querySelector(".stat__number--characters");
const twitterEl = document.querySelector(".stat__number--twitter");
const facebookEl = document.querySelector(".stat__number--facebook");

inputEventHandler = () => {
  /*
   * Validation
   */
  if (textareaEl.value.includes("<script>")) {
    alert("<script> is not allow");
    textareaEl.value = textareaEl.value.replace("<script>", "");
  }
  /*
   * Get The Value
   */
  const charactersNumber = textareaEl.value.length;
  const twitterNumber = 280 - charactersNumber;
  const facebookNumber = 2200 - charactersNumber;
  let wordNumber = textareaEl.value.split(" ").length;

  /*
   * if else
   */
  if (charactersNumber === 0) {
    wordNumber = 0;
  }

  if (twitterNumber < 0) {
    twitterEl.classList.add("limit-exceed");
  } else {
    twitterEl.classList.remove("limit-exceed");
  }
  if (facebookNumber < 0) {
    facebookEl.classList.add("limit-exceed");
  } else {
    facebookEl.classList.remove("limit-exceed");
  }
  /*
   * Set The Value
   */
  charactersEl.textContent = charactersNumber;
  twitterEl.textContent = twitterNumber;
  facebookEl.textContent = facebookNumber;
  wordEl.textContent = wordNumber;
};

textareaEl.addEventListener("input", inputEventHandler);
