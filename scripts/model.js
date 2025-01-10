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

const fetchPresetTexts = async (level) => {
    try {
        const sentences = level === 'easy' ? 1 : level === 'medium' ? 3 : 6;
        const response = await fetch(`https://fish-text.ru/get?type=sentence&number=${sentences}&format=json`);
        const data = await response.json();
        if (data.status === 'success') {
            return data.text;
        } else {
            throw new Error(data.text);
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return "Ошибка загрузки текста";
    }
};

async function updatePresetTexts(level) {
    isTextLoaded = false; // Перед загрузкой сбрасываем флаг

    if (level) {
        presetTexts = [await fetchPresetTexts(level)];
    } else {
        presetTexts = [await fetchPresetTexts('easy'), await fetchPresetTexts('medium'), await fetchPresetTexts('hard')];
    }
    allTexts = [...customTexts, ...presetTexts];
    console.log(allTexts);
    isTextLoaded = true;
}

function getRandomText(texts) {
    return texts[Math.floor(Math.random() * texts.length)];
}

function loadCurrentText(textToType) {
    if (selectedType === 'custom') {
        currentText = selectedText || getRandomText(customTexts);
    } else if (selectedType === 'preset') {
        currentText = getRandomText(presetTexts);
    } else {
        currentText = getRandomText(allTexts);
    }
    textToType.textContent = currentText;

}

function checkInput(inputField, result) {
    const typedText = inputField.value;
    const correctText = currentText.slice(0, typedText.length);

    if (typedText !== correctText) {
        inputField.classList.add('error');
    } else {
        inputField.classList.remove('error');
    }

    if (typedText === currentText) {
        const timeTaken = (Date.now() - startTime) / 1000;
        const wordsPerMinute = (currentText.length / 5) / (timeTaken / 60);
        result.textContent = `Готово! Время: ${timeTaken.toFixed(2)} сек. Скорость: ${Math.round(wordsPerMinute)} слов/мин.`;
        inputField.disabled = true;
    }
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

function setIsAddingText(newAddingText) {
    isAddingText = newAddingText;
}

function setCustomTexts(newCustomTexts) {
    customTexts = newCustomTexts;
}

function setStartTime(newStartTime) {
    startTime = newStartTime;
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
    fetchPresetTexts,
    updatePresetTexts,
    getRandomText,
    loadCurrentText,
    checkInput,
    setSelectedType,
    setSelectedLevel,
    setSelectedText,
    setIsTextLoaded,
    setIsAddingText,
    setCustomTexts,
    setStartTime
};
