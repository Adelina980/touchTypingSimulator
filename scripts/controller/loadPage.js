import {
    getCustomTexts, getIsAddingText, getSelectedLevel, getSelectedText, getSelectedType,
    setCustomTexts, setIsAddingText, setIsTextLoaded, setSelectedLevel, setSelectedText, setSelectedType,
} from "../model.js";
import {
    populateTextList,
    updateElementValue,
    showElement,
    updateTextContent,
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
    hideElement
} from '../view.js';
import {updatePresetTexts} from "./index.js";


window.addEventListener('beforeunload', () => {
    localStorage.setItem('selectedType', getSelectedType());
    localStorage.setItem('selectedText', getSelectedText());
    localStorage.setItem('isShowTextListButtonVisible', !showTextListButton.classList.contains('hidden')); // Сохраняем видимость кнопки
    localStorage.setItem('isAddTextButtonVisible', !addTextButton.classList.contains('hidden')); // Сохраняем видимость кнопки
    localStorage.setItem('isSelectedTextToViewContainerVisible', !selectedTextToViewContainer.classList.contains('hidden'));
    localStorage.setItem('textSelected', localStorage.getItem('textSelected'));
    localStorage.setItem('selectedLevel', getSelectedLevel());
    localStorage.setItem('isSelectedLevelContainerVisible', getSelectedType() === 'preset');
    if (getIsAddingText()) {
        localStorage.setItem('ownTextInput', ownTextInput.value);
    } else {
        localStorage.setItem('ownTextInput', "");
    }
    localStorage.setItem('customTexts', JSON.stringify(getCustomTexts() || []));
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
    const savedCustomTexts = localStorage.getItem('customTexts') || [];

    if (savedType) {
        setSelectedType(savedType);
        updateElementValue(textTypeSelect, savedType);
    }
    if (savedLevel) {
        setSelectedLevel(savedLevel);
        updateElementValue(textLevelSelect, savedLevel);
    }
    if (savedText === textSelected) {
        setSelectedText(savedText);
        showElement(selectedTextToViewContainer);
        updateTextContent(selectedTextToView, savedText);
    }
    if (isShowTextListButtonVisible) {
        showElement(showTextListButton);
    } else {
        hideElement(showTextListButton);
    }
    if (isAddTextButtonVisible) {
        showElement(addTextButton);
    } else {
        hideElement(addTextButton);
    }
    if (isSelectedTextToViewContainerVisible) {
        showElement(selectedTextToViewContainer);
    } else {
        hideElement(selectedTextToViewContainer);
    }
    if (isSelectedLevelContainerVisible) {
        showElement(levelContainer);
    } else {
        hideElement(levelContainer);
    }
    if (getSelectedType() === 'all') {
        hideElement(textListContainer);
        await updatePresetTexts(); // Загружаем пресеты
    } else if (getSelectedType() === 'preset') {
        hideElement(textListContainer);
        await updatePresetTexts(getSelectedLevel()); // Загружаем пресеты
    } else {
        setIsTextLoaded(true);
    }
    if (savedTextInput && savedTextInput.trim() !== "") {
        updateElementValue(ownTextInput, savedTextInput);
        showElement(ownTextInputContainer);
        setIsAddingText(true);
    } else {
        updateElementValue(ownTextInput, "");
        hideElement(ownTextInputContainer);
    }
    if (savedCustomTexts && savedCustomTexts !== 'null') {
        setCustomTexts(JSON.parse(savedCustomTexts));
    } else {
        setCustomTexts([]);
    }
    if (getSelectedType() === 'custom' && getCustomTexts() && getCustomTexts().length > 0) {
        populateTextList(getCustomTexts(), getSelectedText());
    }
});
