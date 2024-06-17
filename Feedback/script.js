console.log("JS loaded");
// -- Global -- //
const MAX_CHARS = 150;
const BASE_API = "https://bytegrad.com/course-assets/js/1/api";

const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbacksListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn__text");
const spinnerEl = document.querySelector(".spinner");

const hashtagsListEl = document.querySelector(".hashtags");

const renderFeedbackItem = (feedbackItem) => {
  const feedbackItemHtml = `
     <li class="feedback">
       <button class="upvote">
           <i class="fa-solid fa-caret-up upvote__icon"></i>
           <span class="upvote__count">${feedbackItem.upvoteCount}</span>
       </button>
       <section class="feedback__badge">
           <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
       </section>
       <div class="feedback__content">
           <p class="feedback__company">${feedbackItem.company}</p>
           <p class="feedback__text">${feedbackItem.text}</p>
       </div>
       <p class="feedback__date">${
         feedbackItem.daysAgo === 0 ? "New" : `${feedbackItem.daysAgo}d`
       }</p>
   </li>
     `;
  feedbacksListEl.insertAdjacentHTML("beforeend", feedbackItemHtml);
};
// -- Counter Components -- //
(() => {
  const inputHandler = () => {
    const numberCharacterType = textareaEl.value.length;
    counterEl.textContent = MAX_CHARS - numberCharacterType;
  };
  textareaEl.addEventListener("input", inputHandler);
})();

// -- Form Components -- //
(() => {
  const showVisualIndicator = (textCheck) => {
    const className = textCheck == "valid" ? "form--valid" : "form--invalid";
    formEl.classList.add(className);
    setTimeout(() => {
      formEl.classList.remove(className);
    }, 3000);
  };

  const submitHandler = (event) => {
    // prevemnt default browser action (submiting form data to 'action'-address and loading new page)
    event.preventDefault();

    // get text from text area
    const text = textareaEl.value;

    // validate text (check #tag is present and text is long enough)
    if (text.includes("#") && text.length >= 5) {
      showVisualIndicator("valid");
    } else {
      showVisualIndicator("invalid");
      textareaEl.focus();
      return;
    }

    // extarct other info from text
    const hasTag = text.split(" ").find((word) => word.includes("#"));
    const company = hasTag.substring(1);
    const badgeLetter = company.substring(0, 1).toUpperCase();
    const upvoteCount = 0;
    const daysAgo = 0;
    // render feedback item
    const feedbackItem = {
      upvoteCount: upvoteCount,
      company: company,
      badgeLetter: badgeLetter,
      hasTag: hasTag,
      daysAgo: daysAgo,
      text: text,
    };
    renderFeedbackItem(feedbackItem);

    // seend feedback item to sever
    fetch(`${BASE_API}/feedbacks`, {
      method: "POST",
      body: JSON.stringify(feedbackItem),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("something went wrong!");
          return;
        }
        console.log("successfyly submited");
      })
      .catch((error) => {
        console.log(error);
      });
    // crear text area
    textareaEl.value = "";
    // blur submit
    submitBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
  };

  formEl.addEventListener("submit", submitHandler);
})();

// -- Feedback list componenst -- //
(() => {
  const clickHandler = (event) => {
    // get clicked html element
    const clickEl = event.target;

    // determine if user intended to upvoye or expand
    const upvoteIntention = clickEl.className.includes("upvote");

    // run the appropriate logic
    if (upvoteIntention) {
      // get the closest
      const upvoteBtnEl = clickEl.closest(".upvote");

      // disbale upvote button (prevent double clicked)
      upvoteBtnEl.disabled = true;

      // select the upvoate count elent wihin the upvote button
      const upvoateCountEl = upvoteBtnEl.querySelector(".upvote__count");

      // get currently displayed upvoate count
      let upvoteCount = +upvoateCountEl.textContent;

      // set upvotecount

      upvoateCountEl.textContent = ++upvoteCount;
    } else {
      // expand the cliclked feedback item
      clickEl.closest(".feedback").classList.toggle("feedback--expand");
    }
  };
  feedbacksListEl.addEventListener("click", clickHandler);

  fetch(`${BASE_API}/feedbacks`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // remove spinner
      spinnerEl.remove();
      //     console.log(data.feedbacks);
      data.feedbacks.forEach((feedbackItem) => {
        // render feedback item
        renderFeedbackItem(feedbackItem);
      });
    })
    .catch((error) => {
      console.log("Error fetching feedback data:", error);
      feedbacksListEl.textContent = `Error fetching feedback data: ${error}`;
    });
})();

// -- hastag list component -- //
(() => {
  const clickHandler = (event) => {
    const clickedEl = event.target;

    // stop funtions if clicked outside from button
    if (clickedEl.className === "hashtags") {
      return;
    }

    // extract conpany name
    const companyNameFromHastags = clickedEl.textContent
      .substring(1)
      .toLowerCase()
      .trim();

    // iterate over each feedback item in the list
    feedbacksListEl.childNodes.forEach((childNodes) => {
      // stop this iteration is its a text node
      if (childNodes.nodeType === 3) {
        return;
      }

      const companyNameFromFeedbackItem = childNodes
        .querySelector(".feedback__company")
        .textContent.toLowerCase()
        .trim();
      // remove feedback item from list if company name are not equal
      if (companyNameFromHastags !== companyNameFromFeedbackItem) {
        childNodes.remove();
      }
    });
  };

  hashtagsListEl.addEventListener("click", clickHandler);
})();
