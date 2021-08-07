import Vue from "vue";
var STORAGE_KEY = 'local-memo';
var fileStorage = {
    uid: 0,
    fetch: function () {
        console.log('-loaded from local storage-');
        var fileList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        fileList.forEach(function (file, index) {
            file.id = index;
        });
        fileStorage.uid = fileList.length;
        console.log(fileList);
        return fileList;
    },
    save: function (fileList) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fileList));
    }
};
var app = new Vue({
    el: '#app',
    data: {
        fileList: new Array(),
        openFileList: new Array(),
        saveAsInputSeen: false,
        newFileInputSeen: false,
        activeText: '',
        editorSeen: true
    },
    methods: {
        newFileBefore: function () {
            app.newFileInputSeen = true;
        },
        newFileAfter: function () {
            var fileName = app.$refs.newFileName;
            if (!fileName.value.length) {
                alert('新規作成するファイル名を入力してください');
                return;
            }
            app.fileList.map(function (file) { file.isActive = false; });
            app.fileList.push({
                id: fileStorage.uid++,
                fileName: fileName.value,
                txt: "",
                isActive: true,
                isOpen: true
            });
            fileName.value = '';
            app.newFileInputSeen = false;
            app.editorSeen = true;
        },
        overwritingSave: function () {
            console.log("push overwriting file " + app.$refs.editor.value);
            if (app.$refs.editor.value.length)
                app.fileList[app.getActiveIndex(app.fileList)].txt = app.$refs.editor.value;
        },
        saveAsBefore: function () {
            console.log('push save as');
            app.saveAsInputSeen = true;
        },
        saveAsAfter: function () {
            app.fileList.push({
                id: fileStorage.uid++,
                fileName: app.$refs.saveAsFileName.value,
                txt: app.$refs.editor.value,
                isActive: true,
                isOpen: true
            });
            app.saveAsInputSeen = false;
        },
        removeFile: function (file) {
            var res = confirm(file.fileName + 'を削除します。本当によろしいですか？');
            if (res != true)
                return;
            var index = app.fileList.indexOf(file);
            app.fileList.splice(index, 1);
            if (app.fileList.length == 0)
                app.editorSeen = false;
        },
        getActiveIndex: function (fileList) {
            var rtn_value = -1;
            fileList.forEach(function (file, index) {
                if (file.isActive == true)
                    rtn_value = index;
            });
            if (rtn_value == -1)
                console.error('active file is not exits');
            else
                return rtn_value;
        },
        changeActive: function (file) {
            app.fileList.map(function (file) { file.isActive = false; });
            app.fileList[app.fileList.indexOf(file)].isActive = true;
            app.activeText = app.fileList[app.fileList.indexOf(file)].txt;
        },
        rmFileTab: function (file) {
            app.fileList[app.fileList.indexOf(file)].isActive = false;
            app.fileList[app.fileList.indexOf(file)].isOpen = false;
            if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) + 1])
                app.fileList[app.fileList.indexOf(file) + 1].isOpen = true;
            else if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) - 1])
                app.fileList[app.fileList.indexOf(file) - 1].isOpen = true;
        }
    },
    watch: {
        fileList: {
            handler: function (fileList) {
                console.log('save file to storage');
                fileStorage.save(fileList);
                app.openFileList = fileList.filter(function (file) { return file.isOpen; });
                app.activeText = app.fileList[app.getActiveIndex(app.fileList)].txt;
            },
            deep: true
        }
    },
    created: function () {
        this.fileList = fileStorage.fetch();
        //ファイルが一つもない場合
        if (this.fileList.length == 0)
            this.fileList.push({
                id: fileStorage.uid++,
                fileName: 'untitled',
                txt: "",
                isActive: true,
                isOpen: true
            });
        this.openFileList = this.fileList.filter(function (file) { return file.isOpen == true; });
        console.log('-loaded to page-');
        console.log('list');
        console.log(this.fileList);
        console.log('open list');
        console.log(this.openFileList);
    }
});
