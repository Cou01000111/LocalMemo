import Vue from "vue";
interface File {
    id: number,
    fileName: string,
    txt: string,
    isActive: boolean
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

Vue.component('tab-item', {
    props: ['file'],
    template: '<li v-bind:class="file.isActive?\'is-active\':\'\'"><a>{{ file.fileName }}</a></li>'
})

var app = new Vue({
    el: '#app',
    data: {
        fileList: new Array<File>(),
        saveAsInputSeen: false,
        newFileInputSeen: false
    },
    methods: {
        newFileBefore: () => {
            // newFileNameから新規作成ファイル名を取得
            // 追加前のfileListのisActiveを全てfalseにする
            // isActiveがtrueのFileをpush
            console.log('push new file');
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
                isActive: true
            });
            fileName.value = '';
            app.newFileInputSeen = false;
        },
        overwritingSave: () => {
            console.log(`push overwriting file ${app.$refs.editor.value}`);
            if (app.$refs.editor.value.length)
                app.fileList[getActiveIndex(app.fileList)].txt = app.$refs.editor.value;
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
                isActive: true
            });
            app.saveAsInputSeen = false;
        },
        removeFile: (item: File) => {
            console.log('called rm file');
            var index = app.fileList.indexOf(item)
            app.fileList.splice(index, 1)
        },
        getActiveIndex: function(fileList: Array<File>) {
            var rtn_value: number = -1;
            console.log(fileList);
            fileList.forEach((file: File, index: number) => {
                if (file.isActive == true) rtn_value = index;
            });
            if (rtn_value == -1)
                console.error('active file is not exits');
            else
                return rtn_value;
        }
    },
    watch: {
        fileList: {
            handler: (fileList: Array<File>) => {
                console.log('save file to storage');
                fileStorage.save(fileList);
            },
            deep: true
        }
    },
    created() {
        this.fileList = fileStorage.fetch();
        //ファイルが一つもない場合
        if (this.fileList.length == 0)
            this.fileList.push({
                id: fileStorage.uid++,
                fileName: 'untitled',
                txt: "",
                isActive: true
            });

        console.log('-loaded to page-');
        console.log(this.fileList);
    }
});

function getActiveIndex
