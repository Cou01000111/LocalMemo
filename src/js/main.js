import $ from "jquery";
var files = localStorage.getItem("localMemo");
if (files != null) {
    var fileList = files.split(',');
    fileList.forEach(function (file) {
        setFile(file);
    });
}
else {
    setFile('untitled');
}
//tabにファイル名を追加
//追加したモノにis-activeを追加
//それ以外のタブからis-activeを削除
//右のFILESに追加する
function setFile(fileName) {
}
function addFileToTab(fileName) {
    $('editorTabs').children('ul').append(getTabsItem(fileName));
}
function getTabsItem(fileName) {
    return ('<li id="add"><a>' + fileName + ' </a></li>');
}
