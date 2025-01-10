import {setSelectedText} from "./model.js";

const textTypeSelect = document.getElementById('textTypeSelect');
const showTextListButton = document.getElementById('showTextListButton');
const textListContainer = document.getElementById('textListContainer');
const textList = document.getElementById('textList');
const startButton = document.getElementById('startButton');
const trainingScreen = document.getElementById('trainingScreen');
const startScreen = document.getElementById('startScreen');
const textToType = document.getElementById('textToType');
const inputField = document.getElementById('inputField');
const result = document.getElementById('result');
const restartButton = document.getElementById('restartButton');
const backToStartButton = document.getElementById('backToStartButton');
const selectedTextToViewContainer = document.getElementById('selectedTextToViewContainer');
const selectedTextToView = document.getElementById('selectedTextToView');
const levelContainer = document.getElementById('levelContainer');
const textLevelSelect = document.getElementById('textLevelSelect');
const addTextButton = document.getElementById('addTextButton');
const ownTextInputContainer = document.getElementById('ownTextInputContainer');
const ownTextInput = document.getElementById('ownTextInput');
const ownTextInputBtn = document.getElementById('ownTextInputBtn');

function populateTextList(customTexts, selectedText) {
    textList.innerHTML = '';
    customTexts.forEach((text, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        const textSpan = document.createElement('span');
        const br = document.createElement('br');
        textSpan.textContent = text;
        textSpan.classList.add('text-item');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
            customTexts.splice(index, 1); // Удаляем текст из массива
            localStorage.setItem('customTexts', JSON.stringify(customTexts));
            populateTextList(customTexts, selectedText); // Перезаполняем список
            if (customTexts === [] || customTexts.length === 0) {
                showTextListButton.classList.add('hidden');
                textListContainer.classList.add('hidden');
            }
        });

        textSpan.addEventListener('click', () => {
            setSelectedText(text);
            // selectedText = text;
            textListContainer.classList.add('hidden');
            showTextListButton.textContent = "Показать список текстов";
            selectedTextToViewContainer.classList.remove('hidden');
            selectedTextToView.textContent = text;
            localStorage.setItem("textSelected", text);
        });

        listItem.appendChild(textSpan);
        listItem.appendChild(deleteButton);

        // Добавляем строку в список
        textList.appendChild(listItem);
    });
}

function showTextList(customTexts, selectedText) {
    if (textListContainer.classList.contains('hidden')) {
        populateTextList(customTexts, selectedText);

        textListContainer.classList.remove('hidden');
        showTextListButton.textContent = "Скрыть список текстов";

    } else if (!textListContainer.classList.contains('hidden')) {
        textListContainer.classList.add('hidden');
        showTextListButton.textContent = "Показать список текстов";
    }
}

export {
    textTypeSelect,
    showTextListButton,
    textListContainer,
    textList,
    startButton,
    trainingScreen,
    startScreen,
    textToType,
    inputField,
    result,
    restartButton,
    backToStartButton,
    selectedTextToViewContainer,
    selectedTextToView,
    levelContainer,
    textLevelSelect,
    addTextButton,
    ownTextInputContainer,
    ownTextInput,
    ownTextInputBtn,
    populateTextList,
    showTextList,
};
