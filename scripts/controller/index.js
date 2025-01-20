import {
    populateTextList,
    showTextList,
    showErrorOnInput,
    hideErrorOnInput,
    updateResult,
    updateElementValue,
    updateElementDisabled,
    textTypeSelect,
    showTextListButton,
    textListContainer,
    startButton,
    trainingScreen,
    startScreen,
    textToType,
    inputField,
    result,
    restartButton,
    backToStartButton,
    selectedTextToViewContainer,
    levelContainer,
    textLevelSelect,
    addTextButton,
    ownTextInputContainer,
    ownTextInput,
    ownTextInputBtn,
    hideElement,
    showElement,
    updateTextContent,
} from '../view.js';
import {
    setSelectedType,
    setSelectedLevel,
    setSelectedText,
    setIsTextLoaded,
    setIsAddingText,
    setStartTime,
    getRandomText,
    setCurrentText,
    setPresetTexts,
    setAllTexts,
    addCustomText,
    getSelectedType,
    getSelectedText,
    getSelectedLevel,
    getIsTextLoaded,
    getIsAddingText,
    getCustomTexts,
    getStartTime,
    getPresetTexts,
    getAllTexts,
    getCurrentText,
} from '../model.js';


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
    setIsTextLoaded(false);
    if (level) {
        setPresetTexts([await fetchPresetTexts(level)]);
    } else {
        setPresetTexts([await fetchPresetTexts('easy'), await fetchPresetTexts('medium'), await fetchPresetTexts('hard')]);
    }
    setAllTexts([...getCustomTexts(), ...getPresetTexts()]);
    setIsTextLoaded(true);
}

function loadCurrentText(textToType) {
    if (getSelectedType() === 'custom') {
        setCurrentText(getSelectedText() || getRandomText(getCustomTexts()));
    } else if (getSelectedType() === 'preset') {
        setCurrentText(getRandomText(getPresetTexts()));
    } else {
        setCurrentText(getRandomText(getAllTexts()));
    }
    updateTextContent(textToType, getCurrentText());

}

function checkInput(inputField, result) {
    const typedText = inputField.value;
    const correctText = getCurrentText().slice(0, typedText.length);

    if (typedText !== correctText) {
        showErrorOnInput(inputField);
    } else {
        hideErrorOnInput(inputField);
    }

    if (typedText === getCurrentText()) {
        const timeTaken = (Date.now() - getStartTime()) / 1000;
        const wordsPerMinute = (getCurrentText().length / 5) / (timeTaken / 60);
        updateResult(result, timeTaken, wordsPerMinute);
        updateElementDisabled(inputField, true)
    }
}

async function startTraining() {
    if (getSelectedType() === 'custom' && getCustomTexts().length === 0) {
        alert("Вы ещё не добавили ни одного текста!");

    } else {
        if (getIsAddingText()) {
            const confirmExit = confirm("Вы уверены, что хотите начать тренировку? Незавершенный текст будет утерян.");
            if (!confirmExit) {
                return;
            }
            updateElementValue(ownTextInput, "");
            hideElement(ownTextInputContainer);
            setIsAddingText(false);
        }
        if (!getIsTextLoaded()) {
            alert("Тексты еще загружаются. Пожалуйста, подождите.");
            return; // Прерываем запуск тренировки
        }
        if (inputField.classList.contains('error')) {
            hideErrorOnInput(inputField);
        }
        hideElement(startScreen);
        showElement(trainingScreen);
        updateElementDisabled(inputField, false);
        updateElementValue(inputField, "");
        updateTextContent(result, "");
        setStartTime(Date.now());

        loadCurrentText(textToType);
        if (getSelectedType() === 'all') {
            await updatePresetTexts();
        } else if (getSelectedType() === 'preset') {
            await updatePresetTexts(getSelectedLevel());
        } else {
            setIsTextLoaded(true);
        }
    }
}

async function handleTextTypeChange() {
    if (getIsAddingText()) {
        const confirmExit = confirm("Вы уверены, что хотите начать тренировку? Незавершенный текст будет утерян.");
        if (!confirmExit) {
            updateElementValue(textTypeSelect, "custom");
            return;
        }
        updateElementValue(ownTextInput, "");
        hideElement(ownTextInputContainer);
        setIsAddingText(false);
    }
    if (!ownTextInputContainer.classList.contains("hidden")) {
        hideElement(ownTextInputContainer);
    }
    hideElement(textListContainer);
    setSelectedType(textTypeSelect.value);
    localStorage.removeItem('selectedText');
    hideElement(selectedTextToViewContainer);

    setSelectedType(textTypeSelect.value);
    if (getSelectedType() === 'custom') {
        if (getCustomTexts().length !== 0) {
            updateTextContent(showTextListButton, "Показать список текстов");
            showElement(showTextListButton);
        }
        showElement(addTextButton);
        hideElement(levelContainer);
    } else if (getSelectedType() === 'preset') {
        showElement(levelContainer);
        hideElement(showTextListButton);
        hideElement(addTextButton);
        setIsTextLoaded(false);
        await updatePresetTexts(getSelectedLevel());
    } else {
        hideElement(levelContainer);
        hideElement(showTextListButton);
        hideElement(addTextButton);
        setIsTextLoaded(false);
        await updatePresetTexts();
    }
}

function handleLevelChange() {
    setSelectedLevel(textLevelSelect.value);
    updatePresetTexts(textLevelSelect.value);
    localStorage.setItem('selectedLevel', getSelectedLevel());
}

function handleAddText() {
    if (ownTextInputContainer.classList.contains('hidden')) {
        showElement(ownTextInputContainer);
    } else {
        hideElement(ownTextInputContainer);
    }
}

function handleBackToStart() {
    hideElement(trainingScreen);
    showElement(startScreen);
    setSelectedText(null);
    localStorage.removeItem('selectedText');
    hideElement(selectedTextToViewContainer);
    hideElement(ownTextInputContainer);
    hideElement(textListContainer);
}

// События
startButton.addEventListener('click', startTraining);
restartButton.addEventListener('click', startTraining);
showTextListButton.addEventListener('click', () => showTextList(getCustomTexts(), getSelectedText()));
inputField.addEventListener('input', () => checkInput(inputField, result));
ownTextInputContainer.addEventListener('input', () => {
    setIsAddingText(true);
    if (ownTextInput.value === '') {
        setIsAddingText(false);
    }
});
ownTextInputBtn.addEventListener('click', () => {
    let isInList = false;
    if (ownTextInput.value !== "" || ownTextInput.value.length !== 0) {
        for (let customText of getCustomTexts()) {
            if (customText === ownTextInput.value) {
                isInList = true;
            }
        }
        if (!isInList) {
            addCustomText(ownTextInput.value)
        }
        if (!textListContainer.classList.contains("hidden")) {
            populateTextList(getCustomTexts(), getSelectedText());

            showElement(textListContainer);
            updateTextContent(showTextListButton, "Скрыть список текстов");
        }
        if (showTextListButton.classList.contains('hidden')) {
            updateTextContent(showTextListButton, "Показать список текстов");
            showElement(showTextListButton);
        }
        updateElementValue(ownTextInput, "");
        setIsAddingText(false);
    }
});
textTypeSelect.addEventListener('change', handleTextTypeChange);
textLevelSelect.addEventListener('change', handleLevelChange);
addTextButton.addEventListener('click', handleAddText);
backToStartButton.addEventListener('click', handleBackToStart);


export {updatePresetTexts}


