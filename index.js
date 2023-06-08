const date = new Date();
date.setDate(date.getDate() + 14);

function getCardElements(card) {
  const cardElementTop = card.querySelector('.card-element__top');
  const cardElementBottom = card.querySelector('.card-element__bottom');

  const cardElementFlip = card.querySelector('.card-element-flip');
  const cardElementFlipTop = card.querySelector('.card-element-flip__top');
  const cardElementFlipBottom = card.querySelector('.card-element-flip__bottom');

  return {
    cardElementTop,
    cardElementBottom,
    cardElementFlip,
    cardElementFlipTop,
    cardElementFlipBottom
  };
}

function updateCardValues(
  cardElement,
  cardElementFlip,
  value
) {
  cardElement.textContent = value;
  cardElementFlip.textContent = value;
}

function updateDateElement(cardElement, cardElementValue) {
  const cardElements =
    getCardElements(cardElement);

  if (parseInt(cardElements.cardElementTop.textContent, 10) === cardElementValue) {
    return;
  }

  cardElements.cardElementFlip.classList.add('anim');

  updateCardValues(
    cardElements.cardElementTop,
    cardElements.cardElementFlipBottom,
    cardElementValue
  );

  function endAnimation() {
    cardElements.cardElementFlip.classList.remove('anim');
    updateCardValues(
      cardElements.cardElementBottom,
      cardElements.cardElementFlipTop,
      cardElementValue
    );

    this.removeEventListener(
      'animationend',
      endAnimation
    );
  }

  cardElements.cardElementFlip.addEventListener(
    'animationend',
    endAnimation
  );
}

function updateDateElementValue(elementId, elementValue) {
  const firstNumber = Math.floor(elementValue / 10) || 0;
  const secondNumber = elementValue % 10 || 0;
  const cards = document.getElementById(elementId);
  const cardElements = cards.querySelectorAll('.card-element');

  updateDateElement(cardElements[0], firstNumber);
  updateDateElement(cardElements[1], secondNumber);
}

function getRemainingTime(target) {
  const currentTime = Date.now();
  const complete = currentTime >= target;

  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0
    };
  }

  const secondsRemaining = Math.floor(
    (target - currentTime) / 1000
  );
  const days = Math.floor(secondsRemaining / 24 / 60 / 60);
  const hours = Math.floor(secondsRemaining / 60 / 60) - days * 24;
  const minutes = Math.floor(secondsRemaining / 60) - days * 24 * 60 - hours * 60;
  const seconds = secondsRemaining % 60;

  return {
    complete,
    seconds,
    minutes,
    hours,
    days
  };
}

function updateAllElements() {
  const timeRemainingForUpdate = getRemainingTime(
    new Date(date).getTime()
  );

  updateDateElementValue('seconds', timeRemainingForUpdate.seconds);
  updateDateElementValue('minutes', timeRemainingForUpdate.minutes);
  updateDateElementValue('hours', timeRemainingForUpdate.hours);
  updateDateElementValue('days', timeRemainingForUpdate.days);


  return timeRemainingForUpdate.complete;
}

const countdownInterval = setInterval(() => {
  const isComplete = updateAllElements();

  if (isComplete) {
    clearInterval(countdownInterval);
  }
}, 1000);

updateAllElements();
