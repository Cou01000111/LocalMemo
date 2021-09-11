var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Vue from "vue";
var _sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
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
        //activeText: '',
        editorSeen: true,
        rmFileListSeen: false,
        rmFileIdList: new Array()
    },
    methods: {
        seenInput: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!app.newFileInputSeen) return [3 /*break*/, 1];
                        app.newFileInputSeen = false;
                        return [3 /*break*/, 3];
                    case 1:
                        app.newFileInputSeen = true;
                        return [4 /*yield*/, _sleep(100)];
                    case 2:
                        _a.sent();
                        if (app.$refs.newFileName) {
                            app.$refs.newFileName.focus();
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        newFile: function () {
            var fileName = app.$refs.newFileName;
            if (!fileName.value.length) {
                alert('新規作成するファイル名を入力してください');
                return;
            }
            app.fileList.map(function (file) { file.isActive = false; });
            app.addFile(fileName.value, "");
            fileName.value = '';
            app.newFileInputSeen = false;
            app.editorSeen = true;
        },
        overwritingSave: function () {
            if (app.fileList.filter(function (file) { return file.isActive; }))
                app.fileList[app.getActiveIndex(app.fileList)].txt = app.$refs.editor.value;
            else
                alert('ファイルが開かれていません');
        },
        saveAs: function () {
            var fileName = app.$refs.saveAsFileName;
            if (!fileName.value.length) {
                alert('ファイル名を入力してください');
                return;
            }
            app.addFile(fileName.value, app.fileList.filter(function (file) { return file.isActive; })[0].txt);
            app.fileList.map(function (file) { return file.isActive = false; });
            app.openFile(app.fileList.filter(function (file) { return file.fileName == fileName.value; })[0]);
            app.saveAsInputSeen = false;
        },
        removeFile: function () {
            if (app.rmFileIdList.length == 0) {
                alert('ファイルが一つも選択されていません');
                return;
            }
            //削除確認
            var res = confirm(app.fileList.filter(function (file) { return app.rmFileIdList.some(function (removeId) { return file.id == removeId; }); }).map(function (file) { return file.fileName; }).join(',') + 'を削除します。本当によろしいですか？');
            if (res != true)
                return;
            //fileListからrmFileIdListに当てはまるファイルを取り除いたもので更新
            app.fileList = app.fileList
                .filter(function (file) { return !(app.rmFileIdList.some(function (id) { return id == file.id; })); });
            app.rmFileIdList = new Array();
            app.saveAsInputSeen = false;
            if (!app.fileList.some(function (file) { return file.isActive; }) && app.fileList[0])
                app.fileList[0].isActive = true;
            app.rmFileListSeen = false;
        },
        getActiveIndex: function (fileList) {
            var rtn_value = -1;
            fileList.map(function (file, index) { if (file.isActive == true)
                rtn_value = index; });
            if (rtn_value == -1) {
                console.error('active file is not exits');
                return -1;
            }
            else
                return rtn_value;
        },
        changeActive: function (file) {
            app.fileList.map(function (file) { file.isActive = false; });
            app.fileList[app.fileList.indexOf(file)].isActive = true;
        },
        closeFile: function (file) {
            app.fileList[app.fileList.indexOf(file)].isActive = false;
            app.fileList[app.fileList.indexOf(file)].isOpen = false;
            if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) + 1])
                app.fileList[app.fileList.indexOf(file) + 1].isActive = true;
            else if (app.fileList.length > 1 && app.fileList[app.fileList.indexOf(file) - 1])
                app.fileList[app.fileList.indexOf(file) - 1].isActive = true;
        },
        openFile: function (file) {
            app.changeActive(file);
            app.fileList[app.fileList.indexOf(file)].isOpen = true;
        },
        addFile: function (fileName, fileTxt) {
            this.fileList.push({
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
            handler: function (fileList) {
                console.log('save file to storage');
                fileStorage.save(fileList);
                app.openFileList = fileList.filter(function (file) { return file.isOpen; });
            },
            deep: true
        }
    },
    created: function () {
        this.fileList = fileStorage.fetch();
        console.log('fetch', this.fileList);
        //ファイルが一つもない場合
        if (this.fileList.length == 0) {
            this.addFile('untitled', "");
            console.log('first boot');
        }
        this.openFileList = this.fileList.filter(function (file) { return file.isOpen == true; });
        //開かれているファイルがない場合
        // console.log(this.fileList.filter((file: File) => file.isOpen == true).length == 0 || this.fileList.filter((file: File) => file.isActive == true).length == 0);
        // console.log(this.fileList.filter((file: File) => file.isOpen == true).length == 0);
        // console.log(this.fileList.filter((file: File) => file.isActive == true).length == 0);
        if (this.fileList.filter(function (file) { return file.isOpen == true; }).length == 0 || this.fileList.filter(function (file) { return file.isActive == true; }).length == 0) {
            this.fileList[0].isOpen = true;
            this.fileList[0].isActive = true;
            console.log('not opened');
        }
        console.log('-loaded to page-');
        console.log('list');
        console.log(this.fileList);
        console.log('open list');
        console.log(this.openFileList);
    }
});
