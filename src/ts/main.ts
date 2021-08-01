import $ from "jquery";
import Vue from "vue";
var files: string | null = localStorage.getItem("localMemo");
if (files != null) {
    var fileList:Array<string> = files.split(',');
    fileList.forEach(file => {
        setFile(file);
    });
}else{
    setFile('untitled');
}

//tabにファイル名を追加
//追加したモノにis-activeを追加
//それ以外のタブからis-activeを削除
//右のFILESに追加する
function setFile(fileName:string) {

}

function addFileToTab(fileName:string) {
    $('editorTabs').children('ul').append(getTabsItem(fileName));
}

function getTabsItem(fileName:string) {
    return ('<li id="add"><a>' + fileName + ' </a></li>');
}
