import Vue from "vue";
interface File {
    id: number,
    fileName: string,
    txt: string,
    isActive: boolean,
    isOpen: boolean
}

const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
        //activeText: '',
        editorSeen: true,
        rmFileListSeen: false,
        rmFileIdList: new Array<number>()
    },
    methods: {
        seenInput: async () => {
            if (app.newFileInputSeen)
                app.newFileInputSeen = false;
            else {
                app.newFileInputSeen = true;
                await _sleep(100);
                if (app.$refs.newFileName) {
                    app.$refs.newFileName.focus();
                }
            }
        },
        newFile: () => {
            var fileName: any = app.$refs.newFileName;
            if (!fileName.value.length) {
                alert('新規作成するファイル名を入力してください');
                return;
            }
            app.fileList.map((file: File) => { file.isActive = false });
            app.addFile(fileName.value, "");
            fileName.value = '';
            app.newFileInputSeen = false;
            app.editorSeen = true;
        },
        overwritingSave: () => {
            if (app.fileList.filter((file: File) => file.isActive))
                app.fileList[app.getActiveIndex(app.fileList)].txt = app.$refs.editor.value;
            else
                alert('ファイルが開かれていません');
        },
        saveAs: () => {
            var fileName: any = app.$refs.saveAsFileName;
            if (!fileName.value.length) {
                alert('ファイル名を入力してください');
                return;
            }
            app.addFile(fileName.value, app.fileList.filter((file: File) => file.isActive)[0].txt);
            app.fileList.map((file: File) => file.isActive = false);
            app.openFile(app.fileList.filter((file: File) => file.fileName == fileName.value)[0]);
            app.saveAsInputSeen = false;
        },
        removeFile: () => {
            if (app.rmFileIdList.length == 0) {
                alert('ファイルが一つも選択されていません');
                return;
            }
            //削除確認
            var res = confirm(app.fileList.filter((file: File) => app.rmFileIdList.some((removeId: number) => file.id == removeId)).map((file: File) => file.fileName).join(',') + 'を削除します。本当によろしいですか？');
            if (res != true) return;
            //fileListからrmFileIdListに当てはまるファイルを取り除いたもので更新
            app.fileList = app.fileList
                .filter((file: File) => !(app.rmFileIdList.some((id: number) => id == file.id)));
            app.rmFileIdList = new Array<number>();
            app.saveAsInputSeen = false;
            if (!app.fileList.some((file: File) => file.isActive) && app.fileList[0])
                app.fileList[0].isActive = true;
            app.rmFileListSeen = false;
        },
        getActiveIndex: function (fileList: Array<File>) {
            var rtn_value: number = -1;
            fileList.map((file: File, index: number) => { if (file.isActive == true) rtn_value = index; })
            if (rtn_value == -1) {
                console.error('active file is not exits');
                return -1;
            }
            else
                return rtn_value;
        },
        changeActive: function (file: File) {
            app.fileList.map((file: File) => { file.isActive = false });
            app.fileList[app.fileList.indexOf(file)].isActive = true;
        },
        closeFile: function (file: File) {
            app.fileList[app.fileList.indexOf(file)].isActive = false;
            app.fileList[app.fileList.indexOf(file)].isOpen = false;
            if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) + 1])
                app.fileList[app.fileList.indexOf(file) + 1].isActive = true;
            else if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) - 1])
                app.fileList[app.fileList.indexOf(file) - 1].isActive = true;
        },
        openFile: function (file: File) {
            this.changeActive(file);
            app.fileList[app.fileList.indexOf(file)].isOpen = true;
        },
        addFile(fileName: string, fileTxt: string) {
            app.fileList.push({
                id: fileStorage.uid++,
                fileName: fileName,
                txt: fileTxt,
                isActive: true,
                isOpen: true
            });
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
            this.addFile('untitled', "");
        this.openFileList = this.fileList.filter((file: File) => file.isOpen == true);
        //console.log('-loaded to page-');
        //console.log('list');
        //console.log(this.fileList);
        //console.log('open list');
        //console.log(this.openFileList);
    }
});
