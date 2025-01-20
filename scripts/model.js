let selectedType = "all";
let selectedText = null;
let selectedLevel = "easy";
let isTextLoaded = false; // По умолчанию текст не загружен
let isAddingText = false; // Флаг для отслеживания добавления текста

let allTexts = []; // Все доступные тексты
let customTexts = []; // Пользовательские тексты
let presetTexts = []; // Пресетные тексты

let currentText = "";
let startTime;


function getRandomText(texts) {
    return texts[Math.floor(Math.random() * texts.length)];
}

function getSelectedType() {
    return selectedType;
}

function getSelectedLevel() {
    return selectedLevel;
}

function getSelectedText() {
    return selectedText;
}

function getIsTextLoaded() {
    return isTextLoaded;
}

function getIsAddingText() {
    return isAddingText;
}

function getCustomTexts() {
    return customTexts;
}

function getStartTime() {
    return startTime;
}

function getCurrentText() {
    return currentText;
}

function getPresetTexts() {
    return presetTexts;
}

function getAllTexts() {
    return allTexts;
}

function setSelectedType(newType) {
    selectedType = newType;
}

function setSelectedLevel(newLevel) {
    selectedLevel = newLevel;
}

function setSelectedText(newText) {
    selectedText = newText;
}

function setIsTextLoaded(newTextLoaded) {
    isTextLoaded = newTextLoaded;
}

function setIsAddingText(newIsAddingText) {
    isAddingText = newIsAddingText;
}

function setCustomTexts(newCustomTexts) {
    customTexts = newCustomTexts;
}

function setStartTime(newStartTime) {
    startTime = newStartTime;
}

function setCurrentText(newCurrentText) {
    currentText = newCurrentText;
}

function setPresetTexts(newPresetTexts) {
    presetTexts = newPresetTexts;
}

function setAllTexts(newAllTexts) {
    allTexts = newAllTexts;
}

function addCustomText(text) {
    customTexts.push(text);
}


export {
    selectedType,
    selectedText,
    selectedLevel,
    isTextLoaded,
    isAddingText,
    allTexts,
    customTexts,
    presetTexts,
    currentText,
    startTime,
    getRandomText,
    setSelectedType,
    setSelectedLevel,
    setSelectedText,
    setIsTextLoaded,
    setIsAddingText,
    setCustomTexts,
    setStartTime,
    setCurrentText,
    setPresetTexts,
    setAllTexts,
    addCustomText,
    getSelectedType,
    getSelectedLevel,
    getSelectedText,
    getIsTextLoaded,
    getIsAddingText,
    getCustomTexts,
    getStartTime,
    getCurrentText,
    getPresetTexts,
    getAllTexts,
};
