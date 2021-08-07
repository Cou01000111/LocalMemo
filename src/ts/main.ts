import Vue from "vue";
interface File {
    id: number,
    fileName: string,
    txt: string,
    isActive: boolean,
    isOpen: boolean
}

var STORAGE_KEY = 'local-memo'
var fileStorage = {
    uid: 0,
    fetch: () => {
        console.log('-loaded from local storage-');
        var fileList: any = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        );
        fileList.forEach(function (file: File, index: number) {
            file.id = index;
        })
        fileStorage.uid = fileList.length;
        console.log(fileList);
        return fileList
    },
    save: function (fileList: Array<File>) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fileList))
    }
}

var app = new Vue({
    el: '#app',
    data: {
        fileList: new Array<File>(),
        openFileList: new Array<File>(),
        saveAsInputSeen: false,
        newFileInputSeen: false,
        activeText: '',
        editorSeen: true
    },
    methods: {
        newFileBefore: () => {
            app.newFileInputSeen = true;
        },
        newFileAfter: () => {
            var fileName: any = app.$refs.newFileName;
            if (!fileName.value.length) {
                alert('新規作成するファイル名を入力してください');
                return;
            }
            app.fileList.map((file: File) => { file.isActive = false });
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
        overwritingSave: () => {
            console.log(`push overwriting file ${app.$refs.editor.value}`);
            if (app.$refs.editor.value.length)
                app.fileList[app.getActiveIndex(app.fileList)].txt = app.$refs.editor.value;
        },
        saveAsBefore: () => {
            console.log('push save as');
            app.saveAsInputSeen = true;
        },
        saveAsAfter: () => {
            app.fileList.push({
                id: fileStorage.uid++,
                fileName: app.$refs.saveAsFileName.value,
                txt: app.$refs.editor.value,
                isActive: true,
                isOpen: true
            });
            app.saveAsInputSeen = false;
        },
        removeFile: (file: File) => {
            var res = confirm(file.fileName + 'を削除します。本当によろしいですか？');
            if (res != true) return;
            var index = app.fileList.indexOf(file);
            app.fileList.splice(index, 1);
            if (app.fileList.length == 0)
                app.editorSeen = false;
        },
        getActiveIndex: function (fileList: Array<File>) {
            var rtn_value: number = -1;
            fileList.forEach((file: File, index: number) => {
                if (file.isActive == true) rtn_value = index;
            });
            if (rtn_value == -1)
                console.error('active file is not exits');
            else
                return rtn_value;
        },
        changeActive: function (file: File) {
            app.fileList.map((file: File) => { file.isActive = false });
            app.fileList[app.fileList.indexOf(file)].isActive = true;
            app.activeText = app.fileList[app.fileList.indexOf(file)].txt;
        },
        rmFileTab: function (file: File) {
            app.fileList[app.fileList.indexOf(file)].isActive = false;
            app.fileList[app.fileList.indexOf(file)].isOpen = false;
            if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) + 1]) app.fileList[app.fileList.indexOf(file) + 1].isOpen = true;
            else if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) - 1]) app.fileList[app.fileList.indexOf(file) - 1].isOpen = true;
        }
    },
    watch: {
        fileList: {
            handler: (fileList: Array<File>) => {
                console.log('save file to storage');
                fileStorage.save(fileList);
                app.openFileList = fileList.filter(file => file.isOpen);
                app.activeText = app.fileList[app.getActiveIndex(app.fileList)].txt;
            },
            deep: true
        },
    },
    created() {
        this.fileList = fileStorage.fetch();
        //ファイルが一つもない場合
        if (this.fileList.length == 0)
            this.fileList.push({
                id: fileStorage.uid++,
                fileName: 'untitled',
                txt: "",
                isActive: true,
                isOpen: true,
            });
        this.openFileList = this.fileList.filter((file: File) => file.isOpen == true);

        console.log('-loaded to page-');
        console.log('list');
        console.log(this.fileList);
        console.log('open list');
        console.log(this.openFileList);
    }
});
