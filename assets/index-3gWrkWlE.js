var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _Lotto_instances, validate_fn, _winningNumbers, _bonusNumber, _WinningResult_instances, getMatchCount_fn, _lottos, _LottoMachine_instances, generateLottos_fn, _PurchaseFormView_instances, template_fn, bindEvents_fn, _PurchaseForm_instances, handlePurchase_fn, _LottoList_instances, template_fn2, _WinningInputsFormView_instances, template_fn3, initElements_fn, bindEvents_fn2, attachInputListeners_fn, attachButtonClickListener_fn, _WinningInputsForm_instances, handleResultRequest_fn, _WinningResultModalView_instances, template_fn4, bindEvents_fn3, attachBackdropListener_fn, attachCloseButtonListener_fn, attachRestartButtonListener_fn, close_fn, _WinningResultModal_instances, handleRestart_fn, _lottoMachine, _Main_instances, template_fn5, renderDashboardLayout_fn, renderPurchaseForm_fn, renderLottoList_fn, renderWinningInputsForm_fn, bindEvents_fn4, bindPurchaseLottosEvent_fn, bindCalculateResultEvent_fn, bindRestartEvent_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const SEPARATOR = ",";
const KEY = Object.freeze({
  PURCHASE_PRICE: "구입 금액",
  WINNING_NUMBERS: "당첨 번호",
  BONUS_NUMBER: "보너스 번호",
  LOTTO_NUMBERS: "로또 번호"
});
const PURCHASE_PRICE = Object.freeze({
  MIN: 1e3,
  MAX: 1e6,
  UNIT: 1e3
});
const LOTTO = Object.freeze({
  MIN_NUMBER: 1,
  MAX_NUMBER: 45,
  LENGTH: 6
});
const PROFIT = Object.freeze([5e3, 5e4, 15e5, 3e7, 2e9]);
const generateRandomNumber = (max, count) => {
  const lottoNumbers = new Array(max).fill().map((_, index) => index + 1);
  return () => {
    lottoNumbers.sort(() => Math.random() - 0.5);
    return lottoNumbers.slice(0, count);
  };
};
function deepFreeze(obj) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}
const ERROR_MESSAGE = deepFreeze({
  PURCHASE: {
    INVALID_UNIT: "구입 금액은 1,000원 단위로 입력해야 합니다."
  },
  BONUS_NUMBER: {
    DUPLICATE: "보너스 번호는 당첨 번호와 중복될 수 없습니다."
  },
  RESTART: {
    INVALID_INPUT: "y 또는 n을 입력해주세요."
  },
  LOTTO: {
    DUPLICATE: "로또 번호는 중복될 수 없습니다."
  },
  COMMON: {
    INVALID_TYPE: (key) => `${key}은(는) 숫자여야 합니다.`,
    INVALID_RANGE: ({ key, min, max }) => `${key}은(는) ${min.toLocaleString()} 이상 ${max.toLocaleString()} 이하여야 합니다.`,
    INVALID_COUNT: (key) => `${key}은(는) 6개여야 합니다.`
  }
});
const validateType = (key, value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(ERROR_MESSAGE.COMMON.INVALID_TYPE(key));
  }
};
const validateRange = ({ key, value, min, max }) => {
  if (value < min || value > max) {
    throw new Error(
      ERROR_MESSAGE.COMMON.INVALID_RANGE({
        key,
        min,
        max
      })
    );
  }
};
const validateCount = (key, value) => {
  if (value.length !== LOTTO.LENGTH) {
    throw new Error(ERROR_MESSAGE.COMMON.INVALID_COUNT(key));
  }
};
const validateTypeAll = (key, numbers) => {
  numbers.forEach((number) => {
    validateType(key, number);
  });
};
const validateRangeAll = (key, numbers) => {
  numbers.forEach((number) => {
    validateRange({
      key,
      value: number,
      min: LOTTO.MIN_NUMBER,
      max: LOTTO.MAX_NUMBER
    });
  });
};
const validateDuplicate = (numbers) => {
  if (new Set(numbers).size !== numbers.length) {
    throw new Error(ERROR_MESSAGE.LOTTO.DUPLICATE);
  }
};
const LottoNumbersValidator = {
  validate: (key, numbers) => {
    validateTypeAll(key, numbers);
    validateCount(key, numbers);
    validateRangeAll(key, numbers);
  }
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _Lotto_instances);
    __privateAdd(this, _numbers);
    __privateMethod(this, _Lotto_instances, validate_fn).call(this, numbers);
    __privateSet(this, _numbers, numbers);
  }
  get numbers() {
    return __privateGet(this, _numbers);
  }
}
_numbers = new WeakMap();
_Lotto_instances = new WeakSet();
validate_fn = function(numbers) {
  LottoNumbersValidator.validate(KEY.LOTTO_NUMBERS, numbers);
  validateDuplicate(numbers);
};
class WinningResult {
  constructor(winningNumbers, bonusNumber) {
    __privateAdd(this, _WinningResult_instances);
    __privateAdd(this, _winningNumbers);
    __privateAdd(this, _bonusNumber);
    __privateSet(this, _winningNumbers, winningNumbers);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  calculate(lottos) {
    const counts = Array(5).fill(0);
    lottos.forEach((lotto) => {
      const matchCount = __privateMethod(this, _WinningResult_instances, getMatchCount_fn).call(this, lotto);
      if (matchCount === 6) counts[4] += 1;
      if (matchCount === 5 && lotto.numbers.includes(__privateGet(this, _bonusNumber)))
        counts[3] += 1;
      if (matchCount === 5 && !lotto.numbers.includes(__privateGet(this, _bonusNumber)))
        counts[2] += 1;
      if (matchCount === 4) counts[1] += 1;
      if (matchCount === 3) counts[0] += 1;
    });
    return counts;
  }
  calculateProfitRate(lottoPurchasePrice, counts) {
    const totalReward = counts.reduce((acc, curr, i) => {
      return acc + curr * PROFIT[i];
    }, 0);
    return totalReward / lottoPurchasePrice * 100;
  }
}
_winningNumbers = new WeakMap();
_bonusNumber = new WeakMap();
_WinningResult_instances = new WeakSet();
getMatchCount_fn = function(lotto) {
  const sumSet = /* @__PURE__ */ new Set([...lotto.numbers, ...__privateGet(this, _winningNumbers)]);
  const matchCount = lotto.numbers.length + __privateGet(this, _winningNumbers).length - sumSet.size;
  return matchCount;
};
class LottoMachine {
  constructor(lottoPurchasePrice) {
    __privateAdd(this, _LottoMachine_instances);
    __privateAdd(this, _lottos, []);
    const lottoCount = lottoPurchasePrice / PURCHASE_PRICE.UNIT;
    __privateSet(this, _lottos, __privateMethod(this, _LottoMachine_instances, generateLottos_fn).call(this, lottoCount));
  }
  get lottos() {
    return __privateGet(this, _lottos);
  }
  calculateResult(winningNumbers, bonusNumber) {
    const winningResult = new WinningResult(winningNumbers, bonusNumber);
    const winningCounts = winningResult.calculate(__privateGet(this, _lottos));
    const profitRate = winningResult.calculateProfitRate(
      __privateGet(this, _lottos).length * PURCHASE_PRICE.UNIT,
      winningCounts
    );
    return [winningCounts, profitRate];
  }
}
_lottos = new WeakMap();
_LottoMachine_instances = new WeakSet();
generateLottos_fn = function(lottoCount) {
  const generateLotto = () => generateRandomNumber(LOTTO.MAX_NUMBER, LOTTO.LENGTH)().sort(
    (a, b) => a - b
  );
  return Array.from({ length: lottoCount }, () => new Lotto(generateLotto()));
};
class ViewComponent {
  constructor($container) {
    if (!$container) {
      throw new Error("container가 주입되지 않았습니다.");
    }
    this.$container = $container;
  }
  render() {
  }
  bindEvents() {
  }
  template() {
    return "";
  }
}
const PURCHASE_EVENT_NAME = "purchaseLottos";
const SELECTORS$3 = Object.freeze({
  INPUT: ".purchase-price-input input",
  BUTTON: ".purchase-price-input button"
});
class PurchaseFormView extends ViewComponent {
  constructor($container) {
    super($container);
    __privateAdd(this, _PurchaseFormView_instances);
    this.render();
    __privateMethod(this, _PurchaseFormView_instances, bindEvents_fn).call(this);
  }
  render() {
    this.$container.innerHTML = __privateMethod(this, _PurchaseFormView_instances, template_fn).call(this);
    this.$input = this.$container.querySelector(SELECTORS$3.INPUT);
    this.$button = this.$container.querySelector(SELECTORS$3.BUTTON);
  }
  setOnPurchaseClick(callback) {
    this.onPurchaseClick = callback;
  }
  disableInput() {
    this.$input.disabled = true;
    this.$button.disabled = true;
  }
}
_PurchaseFormView_instances = new WeakSet();
template_fn = function() {
  return `
      <label>구입할 금액을 입력해주세요.</label>
      <div class="purchase-price-input">
        <input type="number" placeholder="금액 (1,000원 단위로 최대 1,000,000원)" min="${PURCHASE_PRICE.MIN}" step="${PURCHASE_PRICE.UNIT}" max="${PURCHASE_PRICE.MAX}" />
        <button class="purchase-button" disabled>구입</button>
      </div>
    `;
};
bindEvents_fn = function() {
  this.$input.addEventListener("input", () => {
    this.$button.disabled = this.$input.value.trim() === "";
  });
  this.$container.addEventListener("submit", (e) => {
    e.preventDefault();
    if (this.onPurchaseClick) {
      const purchasePrice = parseInt(this.$input.value, 10);
      this.onPurchaseClick(purchasePrice);
    }
  });
};
const validateUnit = (purchasePrice) => {
  if (purchasePrice % PURCHASE_PRICE.UNIT !== 0) {
    throw new Error(ERROR_MESSAGE.PURCHASE.INVALID_UNIT);
  }
};
const PurchasePriceValidator = {
  validate: (purchasePrice) => {
    validateType(KEY.PURCHASE_PRICE, purchasePrice);
    validateRange({
      key: KEY.PURCHASE_PRICE,
      value: purchasePrice,
      min: PURCHASE_PRICE.MIN,
      max: PURCHASE_PRICE.MAX
    });
    validateUnit(purchasePrice);
  }
};
class PurchaseForm {
  constructor($container) {
    __privateAdd(this, _PurchaseForm_instances);
    this.$view = new PurchaseFormView($container);
    this.$view.setOnPurchaseClick(
      (purchasePrice) => __privateMethod(this, _PurchaseForm_instances, handlePurchase_fn).call(this, purchasePrice)
    );
  }
}
_PurchaseForm_instances = new WeakSet();
handlePurchase_fn = function(purchasePrice) {
  try {
    PurchasePriceValidator.validate(purchasePrice);
    const event = new CustomEvent(PURCHASE_EVENT_NAME, {
      detail: purchasePrice,
      bubbles: true
    });
    this.$view.$container.dispatchEvent(event);
    this.$view.disableInput();
  } catch (e) {
    alert(e.message);
  }
};
class LottoList {
  constructor($container) {
    __privateAdd(this, _LottoList_instances);
    this.$container = $container;
  }
  render(lottos) {
    this.$container.innerHTML = __privateMethod(this, _LottoList_instances, template_fn2).call(this, lottos);
  }
}
_LottoList_instances = new WeakSet();
// eslint-disable-next-line max-lines-per-function
template_fn2 = function(lottos) {
  const titleHTML = `<span>총 ${lottos.length}개를 구매했습니다.</span>`;
  const lottoItemsHTML = lottos.map(
    (lotto) => `<div class="lotto-ticket">🎟️ ${lotto.numbers.join(`${SEPARATOR} `)}</div>`
  ).join("");
  return `
      ${titleHTML}
      <div class="lotto-tickets">
        ${lottoItemsHTML}
      </div>
    `;
};
const getInstructionMarkup = () => `<label>지난 주 당첨번호 ${LOTTO.LENGTH}개와 보너스 번호 1개를 입력해주세요.</label>`;
const getInputsLabelsMarkup = () => `
  <div class="inputs-label">
    <label>당첨 번호</label>
    <label>보너스 번호</label>
  </div>
`;
const generateWinningNumbers = (count, maxlength) => Array.from(
  { length: count },
  () => `<input type="text" class="number-input winning" maxlength="${maxlength}" />`
).join("");
const generateInputs = (count, maxlength) => `
  <div class="winning-inputs">
    <div class="winning-numbers">
      ${generateWinningNumbers(count, maxlength)}
    </div>
    <input type="text" class="number-input bonus" maxlength="${maxlength}" />
  </div>
`;
const getButtonMarkup = () => `<button class="result-button" disabled>결과 확인하기</button>`;
const WINNING_NUMBERS_COUNT = 6;
const WINNING_NUMBER_MAX_LENGTH = 2;
const RESULT_EVENT_NAME = "calculateResult";
const SELECTORS$2 = Object.freeze({
  WINNING_NUMBER_INPUTS: ".number-input.winning",
  BONUS_NUMBER_INPUT: ".number-input.bonus",
  RESULT_BUTTON: ".result-button"
});
class WinningInputsFormView extends ViewComponent {
  constructor($container) {
    super($container);
    __privateAdd(this, _WinningInputsFormView_instances);
    this.render();
    __privateMethod(this, _WinningInputsFormView_instances, bindEvents_fn2).call(this);
  }
  render() {
    this.$container.innerHTML = __privateMethod(this, _WinningInputsFormView_instances, template_fn3).call(this);
    __privateMethod(this, _WinningInputsFormView_instances, initElements_fn).call(this);
  }
  setOnResultRequest(callback) {
    this.onResultRequest = callback;
  }
}
_WinningInputsFormView_instances = new WeakSet();
template_fn3 = function() {
  return `
      ${getInstructionMarkup()}
      ${getInputsLabelsMarkup()}
      ${generateInputs(WINNING_NUMBERS_COUNT, WINNING_NUMBER_MAX_LENGTH)}
      ${getButtonMarkup()}
    `;
};
initElements_fn = function() {
  this.$winningNumbers = this.$container.querySelectorAll(
    SELECTORS$2.WINNING_NUMBER_INPUTS
  );
  this.$bonusNumber = this.$container.querySelector(
    SELECTORS$2.BONUS_NUMBER_INPUT
  );
  this.$button = this.$container.querySelector(SELECTORS$2.RESULT_BUTTON);
};
bindEvents_fn2 = function() {
  __privateMethod(this, _WinningInputsFormView_instances, attachInputListeners_fn).call(this);
  __privateMethod(this, _WinningInputsFormView_instances, attachButtonClickListener_fn).call(this);
};
attachInputListeners_fn = function() {
  const updateButtonState = () => {
    this.$button.disabled = this.$bonusNumber.value.trim() === "" || Array.from(this.$winningNumbers).some(
      ($input) => $input.value.trim() === ""
    );
  };
  this.$winningNumbers.forEach(
    ($input) => $input.addEventListener("input", updateButtonState)
  );
  this.$bonusNumber.addEventListener("input", updateButtonState);
};
attachButtonClickListener_fn = function() {
  this.$container.addEventListener("submit", (e) => {
    e.preventDefault();
    if (this.onResultRequest) {
      const winningNumbers = Array.from(this.$winningNumbers).map(
        (input) => parseInt(input.value, 10)
      );
      const bonusNumber = parseInt(this.$bonusNumber.value, 10);
      this.onResultRequest({ winningNumbers, bonusNumber });
    }
  });
};
const validateDuplicateBonus = (bonusNumber, winningNumbers) => {
  if (winningNumbers.includes(bonusNumber)) {
    throw new Error(ERROR_MESSAGE.BONUS_NUMBER.DUPLICATE);
  }
};
const BonusNumberValidator = {
  validate: (bonusNumber, winningNumbers) => {
    validateType(KEY.BONUS_NUMBER, bonusNumber);
    validateRange({
      key: KEY.BONUS_NUMBER,
      value: bonusNumber,
      min: LOTTO.MIN_NUMBER,
      max: LOTTO.MAX_NUMBER
    });
    validateDuplicateBonus(bonusNumber, winningNumbers);
  }
};
class WinningInputsForm {
  constructor($container) {
    __privateAdd(this, _WinningInputsForm_instances);
    this.$view = new WinningInputsFormView($container);
    this.$view.setOnResultRequest((data) => __privateMethod(this, _WinningInputsForm_instances, handleResultRequest_fn).call(this, data));
  }
}
_WinningInputsForm_instances = new WeakSet();
handleResultRequest_fn = function({ winningNumbers, bonusNumber }) {
  try {
    LottoNumbersValidator.validate(KEY.WINNING_NUMBERS, winningNumbers);
    validateDuplicate(winningNumbers);
    BonusNumberValidator.validate(bonusNumber, winningNumbers);
    const event = new CustomEvent(RESULT_EVENT_NAME, {
      detail: { winningNumbers, bonusNumber },
      bubbles: true
    });
    this.$view.$container.dispatchEvent(event);
  } catch (e) {
    alert(e.message);
  }
};
const SELECTORS$1 = Object.freeze({
  MODAL_ROOT: "#modal-root",
  MAIN: "#main",
  RESTART_BUTTON: ".restart-button",
  MODAL_BACKDROP: ".modal-backdrop",
  MODAL_CLOSE_BUTTON: ".modal-close-button"
});
const RESTART_EVENT_NAME = "restart";
function getRowsData(winningCounts) {
  return [
    ["3개", "5,000", `${winningCounts[0] ?? 0}개`],
    ["4개", "50,000", `${winningCounts[1] ?? 0}개`],
    ["5개", "1,500,000", `${winningCounts[2] ?? 0}개`],
    ["5개 + 보너스볼", "30,000,000", `${winningCounts[3] ?? 0}개`],
    ["6개", "2,000,000,000", `${winningCounts[4] ?? 0}개`]
  ];
}
function getTableRow(row) {
  const [matchText, prize, count] = row;
  return `
    <tr>
      <td>${matchText}</td>
      <td>${prize}</td>
      <td>${count}</td>
    </tr>
  `;
}
function getTableWrapperMarkup(rowsMarkup) {
  return `
    <table>
      <thead>
        <tr>
          <th>일치 개수</th>
          <th>당첨금</th>
          <th>당첨 개수</th>
        </tr>
      </thead>
      <tbody>
        ${rowsMarkup}
      </tbody>
    </table>
  `;
}
function getTableMarkup(winningCounts) {
  const rows = getRowsData(winningCounts);
  const rowsMarkup = rows.map((row) => getTableRow(row)).join("");
  return getTableWrapperMarkup(rowsMarkup);
}
function getModalMarkup(winningCounts, profitRate) {
  return `
    <div class="modal-backdrop">
      <div class="modal-content">
        <button class="modal-close-button">✕</button>
        <h2>🏆 당첨 통계 🏆</h2>
        ${getTableMarkup(winningCounts)}
        <strong>당신의 총 수익률은 ${profitRate.toFixed(1).toLocaleString()}%입니다.</strong>
        <button class="restart-button">다시 시작하기</button>
      </div>
    </div>
  `;
}
class WinningResultModalView extends ViewComponent {
  constructor() {
    super(...arguments);
    __privateAdd(this, _WinningResultModalView_instances);
  }
  render(winningCounts, profitRate) {
    this.$container.innerHTML = __privateMethod(this, _WinningResultModalView_instances, template_fn4).call(this, winningCounts, profitRate);
    __privateMethod(this, _WinningResultModalView_instances, bindEvents_fn3).call(this);
  }
  setOnResultRequest(callback) {
    this.onResultRequest = callback;
  }
}
_WinningResultModalView_instances = new WeakSet();
template_fn4 = function(winningCounts, profitRate) {
  return getModalMarkup(winningCounts, profitRate);
};
bindEvents_fn3 = function() {
  __privateMethod(this, _WinningResultModalView_instances, attachBackdropListener_fn).call(this);
  __privateMethod(this, _WinningResultModalView_instances, attachCloseButtonListener_fn).call(this);
  __privateMethod(this, _WinningResultModalView_instances, attachRestartButtonListener_fn).call(this);
};
attachBackdropListener_fn = function() {
  const $backdrop = this.$container.querySelector(SELECTORS$1.MODAL_BACKDROP);
  if ($backdrop) {
    $backdrop.addEventListener("click", (event) => {
      if (event.target === $backdrop) {
        __privateMethod(this, _WinningResultModalView_instances, close_fn).call(this);
      }
    });
  }
};
attachCloseButtonListener_fn = function() {
  const $closeButton = this.$container.querySelector(
    SELECTORS$1.MODAL_CLOSE_BUTTON
  );
  if ($closeButton) {
    $closeButton.addEventListener("click", () => {
      __privateMethod(this, _WinningResultModalView_instances, close_fn).call(this);
    });
  }
};
attachRestartButtonListener_fn = function() {
  const $restartButton = this.$container.querySelector(
    SELECTORS$1.RESTART_BUTTON
  );
  if ($restartButton) {
    $restartButton.addEventListener("click", () => {
      if (this.onResultRequest) {
        __privateMethod(this, _WinningResultModalView_instances, close_fn).call(this);
        this.onResultRequest();
      }
    });
  }
};
close_fn = function() {
  this.$container.innerHTML = "";
};
class WinningResultModal {
  constructor() {
    __privateAdd(this, _WinningResultModal_instances);
    this.$modalRoot = document.querySelector(SELECTORS$1.MODAL_ROOT);
    this.$view = new WinningResultModalView(this.$modalRoot);
    this.$view.setOnResultRequest(() => __privateMethod(this, _WinningResultModal_instances, handleRestart_fn).call(this));
  }
  render(winningCounts, profitRate) {
    this.$view.render(winningCounts, profitRate);
  }
}
_WinningResultModal_instances = new WeakSet();
handleRestart_fn = function() {
  const $main = document.querySelector(SELECTORS$1.MAIN);
  try {
    const restartEvent = new CustomEvent(RESTART_EVENT_NAME, {
      bubbles: true
    });
    $main.dispatchEvent(restartEvent);
  } catch (e) {
    alert(e.message);
  }
};
const EVENT_TYPES = Object.freeze({
  PURCHASE_LOTTOS: "purchaseLottos",
  CALCULATE_RESULT: "calculateResult",
  RESTART: "restart"
});
const SELECTORS = Object.freeze({
  PURCHASE_PRICE_AREA: ".purchase-price-area",
  LOTTOS_AREA: ".lottos-area",
  WINNING_INPUTS_AREA: ".winning-inputs-area"
});
class Main extends ViewComponent {
  constructor(selector) {
    const $container = document.querySelector(selector);
    super($container);
    __privateAdd(this, _Main_instances);
    __privateAdd(this, _lottoMachine);
    __privateMethod(this, _Main_instances, bindEvents_fn4).call(this);
  }
  render() {
    __privateMethod(this, _Main_instances, renderDashboardLayout_fn).call(this);
    __privateMethod(this, _Main_instances, renderPurchaseForm_fn).call(this);
    __privateMethod(this, _Main_instances, renderLottoList_fn).call(this);
    this.$winningResultModal = new WinningResultModal();
  }
}
_lottoMachine = new WeakMap();
_Main_instances = new WeakSet();
template_fn5 = function() {
  return `
      <div class="dashboard">
        <h1>🎱 내 번호 당첨 확인 🎱</h1>
        <form class="purchase-price-area"></form>
        <div class="lottos-area"></div>
        <form class="winning-inputs-area"></form>
      </div>
    `;
};
renderDashboardLayout_fn = function() {
  this.$container.innerHTML = __privateMethod(this, _Main_instances, template_fn5).call(this);
};
renderPurchaseForm_fn = function() {
  const $purchasePriceArea = this.$container.querySelector(
    SELECTORS.PURCHASE_PRICE_AREA
  );
  this.$purchaseForm = new PurchaseForm($purchasePriceArea);
};
renderLottoList_fn = function() {
  const $lottosArea = this.$container.querySelector(SELECTORS.LOTTOS_AREA);
  this.$lottoList = new LottoList($lottosArea);
};
renderWinningInputsForm_fn = function() {
  const $winningInputsArea = this.$container.querySelector(
    SELECTORS.WINNING_INPUTS_AREA
  );
  this.$winningInputsForm = new WinningInputsForm($winningInputsArea);
};
bindEvents_fn4 = function() {
  __privateMethod(this, _Main_instances, bindPurchaseLottosEvent_fn).call(this);
  __privateMethod(this, _Main_instances, bindCalculateResultEvent_fn).call(this);
  __privateMethod(this, _Main_instances, bindRestartEvent_fn).call(this);
};
bindPurchaseLottosEvent_fn = function() {
  this.$container.addEventListener(EVENT_TYPES.PURCHASE_LOTTOS, (e) => {
    const purchasePrice = e.detail;
    __privateSet(this, _lottoMachine, new LottoMachine(purchasePrice));
    this.$lottoList.render(__privateGet(this, _lottoMachine).lottos);
    __privateMethod(this, _Main_instances, renderWinningInputsForm_fn).call(this);
  });
};
bindCalculateResultEvent_fn = function() {
  this.$container.addEventListener(EVENT_TYPES.CALCULATE_RESULT, (e) => {
    const { winningNumbers, bonusNumber } = e.detail;
    const [winningCounts, profitRate] = __privateGet(this, _lottoMachine).calculateResult(
      winningNumbers,
      bonusNumber
    );
    this.$winningResultModal.render(winningCounts, profitRate);
  });
};
bindRestartEvent_fn = function() {
  this.$container.addEventListener(EVENT_TYPES.RESTART, () => {
    this.render();
    __privateMethod(this, _Main_instances, bindEvents_fn4).call(this);
  });
};
document.addEventListener("DOMContentLoaded", () => {
  new Main(SELECTORS$1.MAIN).render();
});
