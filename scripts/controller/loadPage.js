import {
    customTexts,
    isAddingText,
    selectedLevel,
    selectedText,
    selectedType,
    setCustomTexts,
    setIsAddingText,
    setIsTextLoaded,
    setSelectedLevel,
    setSelectedText,
    setSelectedType,
    updatePresetTexts
} from "../model.js";
import {
    populateTextList,
    textTypeSelect,
    showTextListButton,
    textListContainer,
    selectedTextToViewContainer,
    selectedTextToView,
    levelContainer,
    textLevelSelect,
    addTextButton,
    ownTextInputContainer,
    ownTextInput,
} from '../view.js';

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
