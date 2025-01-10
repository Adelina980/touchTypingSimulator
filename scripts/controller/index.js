import {
    populateTextList,
    showTextList,
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
    ownTextInputBtn, selectedTextToView,
} from '../view.js';
import {
    updatePresetTexts,
    loadCurrentText,
    checkInput,
    setSelectedType,
    setSelectedLevel,
    setSelectedText,
    setIsTextLoaded,
    setIsAddingText,
    setStartTime,
    selectedType,
    selectedText,
    selectedLevel,
    isTextLoaded,
    isAddingText,
    customTexts, setCustomTexts,
} from '../model.js';


async function startTraining() {
    if (selectedType === 'custom' && (customTexts === [] || customTexts.length === 0)) {
        alert("Вы ещё не добавили ни одного текста!");

    } else {
        if (isAddingText) {
            const confirmExit = confirm("Вы уверены, что хотите начать тренировку? Незавершенный текст будет утерян.");
            if (!confirmExit) {
                return;
            }
            ownTextInput.value = "";
            ownTextInputContainer.classList.add('hidden');
            setIsAddingText(false);
        }
        if (!isTextLoaded) {
            alert("Тексты еще загружаются. Пожалуйста, подождите.");
            return; // Прерываем запуск тренировки
        }
        if (inputField.classList.contains('error')) {
            inputField.classList.remove('error');
        }
        startScreen.classList.add('hidden');
        trainingScreen.classList.remove('hidden');
        inputField.disabled = false;
        inputField.value = '';
        result.textContent = '';
        setStartTime(Date.now());

        loadCurrentText(textToType);
        if (selectedType === 'all') {
            await updatePresetTexts();
        } else if (selectedType === 'preset') {
            await updatePresetTexts(selectedLevel);
        } else {
            setIsTextLoaded(true);
        }
    }
}

async function handleTextTypeChange() {
    if (isAddingText) {
        const confirmExit = confirm("Вы уверены, что хотите начать тренировку? Незавершенный текст будет утерян.");
        if (!confirmExit) {
            textTypeSelect.value = 'custom';
            return;
        }
        ownTextInput.value = "";
        ownTextInputContainer.classList.add('hidden');
        isAddingText = false;
    }
    if (!ownTextInputContainer.classList.contains("hidden")) {
        ownTextInputContainer.classList.add("hidden");
    }
    textListContainer.classList.add('hidden');
    setSelectedType(textTypeSelect.value);
    localStorage.removeItem('selectedText');
    selectedTextToViewContainer.classList.add('hidden');

    setSelectedType(textTypeSelect.value);
    if (selectedType === 'custom') {
        if (customTexts !== [] && customTexts.length !== 0) {
            showTextListButton.textContent = "Показать список текстов";
            showTextListButton.classList.remove('hidden');
        }
        addTextButton.classList.remove('hidden');
        levelContainer.classList.add('hidden');
    } else if (selectedType === 'preset') {
        levelContainer.classList.remove('hidden');
        showTextListButton.classList.add('hidden');
        addTextButton.classList.add('hidden');
        setIsTextLoaded(false);
        await updatePresetTexts(selectedLevel);
    } else {
        levelContainer.classList.add('hidden');
        showTextListButton.classList.add('hidden');
        addTextButton.classList.add('hidden');
        setIsTextLoaded(false);
        await updatePresetTexts();
    }
}

function handleLevelChange() {
    setSelectedLevel(textLevelSelect.value);
    updatePresetTexts(textLevelSelect.value);
    localStorage.setItem('selectedLevel', selectedLevel);
}

function handleAddText() {
    if (ownTextInputContainer.classList.contains('hidden')) {
        ownTextInputContainer.classList.remove('hidden');
    } else {
        ownTextInputContainer.classList.add('hidden');
    }
}

function handleBackToStart() {
    trainingScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    setSelectedText(null);
    localStorage.removeItem('selectedText');
    selectedTextToViewContainer.classList.add('hidden');
    ownTextInputContainer.classList.add('hidden');
    textListContainer.classList.add('hidden');
}

// События
startButton.addEventListener('click', startTraining);
restartButton.addEventListener('click', startTraining);
showTextListButton.addEventListener('click', () => showTextList(customTexts, selectedText));
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
        for (let customText of customTexts) {
            if (customText === ownTextInput.value) {
                isInList = true;
            }
        }
        if (!isInList) {
            customTexts.push(ownTextInput.value);
        }
        if (!textListContainer.classList.contains("hidden")) {
            populateTextList(customTexts, selectedText);

            textListContainer.classList.remove('hidden');
            showTextListButton.textContent = "Скрыть список текстов";
        }
        if (showTextListButton.classList.contains('hidden')) {
            showTextListButton.textContent = "Показать список текстов";
            showTextListButton.classList.remove('hidden');
        }
        ownTextInput.value = "";
        setIsAddingText(false);
    }
});
textTypeSelect.addEventListener('change', handleTextTypeChange);
textLevelSelect.addEventListener('change', handleLevelChange);
addTextButton.addEventListener('click', handleAddText);
backToStartButton.addEventListener('click', handleBackToStart);


window.addEventListener('beforeunload', () => {
    localStorage.setItem('selectedType', selectedType);
    localStorage.setItem('selectedText', selectedText);
    localStorage.setItem('isShowTextListButtonVisible', !showTextListButton.classList.contains('hidden')); // Сохраняем видимость кнопки
    localStorage.setItem('isAddTextButtonVisible', !addTextButton.classList.contains('hidden')); // Сохраняем видимость кнопки
    localStorage.setItem('isSelectedTextToViewContainerVisible', !selectedTextToViewContainer.classList.contains('hidden'));
    localStorage.setItem('textSelected', localStorage.getItem('textSelected'));
    localStorage.setItem('selectedLevel', selectedLevel);
    localStorage.setItem('isSelectedLevelContainerVisible', selectedType === 'preset');
    if (isAddingText) {
        localStorage.setItem('ownTextInput', ownTextInput.value);
    } else {
        localStorage.setItem('ownTextInput', "");
    }
    localStorage.setItem('customTexts', JSON.stringify(customTexts || []));
});

window.addEventListener('load', async () => {
    const savedType = localStorage.getItem('selectedType');
    const savedText = localStorage.getItem('selectedText');
    const isShowTextListButtonVisible = localStorage.getItem('isShowTextListButtonVisible') === 'true'; // Восстанавливаем видимость кнопки
    const isAddTextButtonVisible = localStorage.getItem('isAddTextButtonVisible') === 'true'; // Восстанавливаем видимость кнопки
    const isSelectedTextToViewContainerVisible = localStorage.getItem('isSelectedTextToViewContainerVisible') === 'true';
    const textSelected = localStorage.getItem('textSelected');
    const savedLevel = localStorage.getItem('selectedLevel');
    const isSelectedLevelContainerVisible = localStorage.getItem('isSelectedLevelContainerVisible') === 'true';
    const savedTextInput = localStorage.getItem('ownTextInput');
    const savedCustomTexts = localStorage.getItem('customTexts');

    if (savedType) {
        setSelectedType(savedType);
        textTypeSelect.value = savedType;
    }
    if (savedLevel) {
        setSelectedLevel(savedLevel);
        textLevelSelect.value = savedLevel;
    }
    if (savedText === textSelected) {
        setSelectedText(savedText);
        selectedTextToViewContainer.classList.remove('hidden');
        selectedTextToView.textContent = savedText;
    }
    if (isShowTextListButtonVisible) {
        showTextListButton.classList.remove('hidden');
    } else {
        showTextListButton.classList.add('hidden');
    }
    if (isAddTextButtonVisible) {
        addTextButton.classList.remove('hidden');
    } else {
        addTextButton.classList.add('hidden');
    }
    if (isSelectedTextToViewContainerVisible) {
        selectedTextToViewContainer.classList.remove('hidden');
    } else {
        selectedTextToViewContainer.classList.add('hidden');
    }
    if (isSelectedLevelContainerVisible) {
        levelContainer.classList.remove('hidden');
    } else {
        levelContainer.classList.add('hidden');
    }
    if (selectedType === 'all') {
        textListContainer.classList.add('hidden');
        await updatePresetTexts(); // Загружаем пресеты
    } else if (selectedType === 'preset') {
        textListContainer.classList.add('hidden');
        await updatePresetTexts(selectedLevel); // Загружаем пресеты
    } else {
        setIsTextLoaded(true);
    }
    if (savedTextInput && savedTextInput.trim() !== "") {
        ownTextInput.value = savedTextInput;
        ownTextInputContainer.classList.remove('hidden');
        setIsAddingText(true);
    } else {
        ownTextInput.value = '';
        ownTextInputContainer.classList.add('hidden');
    }
    if (savedCustomTexts) {
        setCustomTexts(JSON.parse(savedCustomTexts));
    }
    if (selectedType === 'custom' && customTexts && customTexts.length > 0) {
        populateTextList(customTexts, selectedText);
    }
});


