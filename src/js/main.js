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
Vue.component('tab-item', {
    props: ['file'],
    template: '<li v-bind:class="file.isActive?\'is-active\':\'\'"><a @click="changeActive(file)">{{ file.fileName }}</a></li>'
});
var app = new Vue({
    el: '#app',
    data: {
        fileList: new Array(),
        saveAsInputSeen: false,
        newFileInputSeen: false
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
                isActive: true
            });
            fileName.value = '';
            app.newFileInputSeen = false;
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
                isActive: true
            });
            app.saveAsInputSeen = false;
        },
        removeFile: function (item) {
            console.log('called rm file');
            var index = app.fileList.indexOf(item);
            app.fileList.splice(index, 1);
        },
        getActiveIndex: function (fileList) {
            var rtn_value = -1;
            console.log(fileList);
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
        }
    },
    watch: {
        fileList: {
            handler: function (fileList) {
                console.log('save file to storage');
                fileStorage.save(fileList);
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
                isActive: true
            });
        console.log('-loaded to page-');
        console.log(this.fileList);
    }
});
