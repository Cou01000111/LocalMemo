import $ from "jquery";
import { textProcess } from "./process.js";
import { copyText } from "./copyText.js";
console.log('hey!!');
$('#input-text').on('paste keydown', (e) => {
    setTimeout(textProcess, 1000);
});
$('#youon #doesDeleteSpace #doesDeleteReturn #doesDeleteTsu').on('change', (e) => {
    setTimeout(textProcess, 1000);
});

$('#copy-button').on('click', () => { copyText() });
