angular.module('ng-terminal-example.command.filesystem', ['ng-terminal-example.command.tools'])

    .provider('fileSystemConfiguration', function () {
        var provider = function () {
            var me = {};
            me.directorySeparator = "\\";
            me.$get = [function () {
                return me;
            }];
            return me;
        };

        return provider();
    })

    .service('storage', [function () {
        return window.localStorage;
    }])

    .service('pathTools', ['fileSystemConfiguration', function (config) {
        var pathTools = function () {
            var me = {};
            me.isAbsolute = function (path) {
                if (!path || path.length < config.directorySeparator.length)
                    return false;
                return path.substring(0, config.directorySeparator.length) == config.directorySeparator;
            };

            me.addDirectorySeparator = function (path) {
                if (path.substr(path.length - config.directorySeparator.length, config.directorySeparator.length) !== config.directorySeparator) {
                    path += config.directorySeparator;
                }
                return path;
            };

            me.addRootDirectorySeparator = function (path) {
                if (!me.isAbsolute(path))
                    return config.directorySeparator + path;
                return path;
            };

            me.combine = function () {
                var result = '';
                for (var i = 0; i < arguments.length; i++) {

                    var arg = arguments[i];

                    if (i != 0 && me.isAbsolute(arg))
                        throw new Error("Khi kết hợp một đường dẫn, chỉ là yếu tố đầu tiên có thể một đường dẫn tuyệt đối.")
                    else if (i == 0)
                        arg = me.addRootDirectorySeparator(arg);
                    if (i != arguments.length - 1)
                        arg = me.addDirectorySeparator(arg);

                    result += arg;
                }

                return result;
            };

            me.directoryUp = function (path) {
                if (path == config.directorySeparator)
                    return path;
                var parts = path.split(config.directorySeparator);
                var count = 1;
                if (parts[parts.length - 1] == "")
                    count = 2;

                for (var i = 0; i < count; i++) {
                    parts.pop();
                }

                if (parts[0] == "")
                    parts = parts.slice(1);
                if (!parts.length)
                    return config.directorySeparator;

                return me.combine.apply(me, parts);
            };

            me.isFileOfPath = function (basePath, path) {
                if (path.substr(0, basePath.length) == basePath) {
                    var sp = path.substr(basePath.length);
                    if (me.isAbsolute(sp) && sp.indexOf(config.directorySeparator) === sp.lastIndexOf(config.directorySeparator)) {
                        sp = sp.substr(config.directorySeparator.length);
                        return sp != "_dir";
                    } else {
                        return sp.indexOf(config.directorySeparator) == -1 && sp != "_dir";
                    }
                }

                return false
            };

            me.isDirectoryOfPath = function (basePath, path) {
                if (path.substr(0, basePath.length) == basePath) {
                    var sp = path.substr(basePath.length);
                    if (sp.length > 5) {
                        var sp2 = sp.substr(0, sp.length - 5);
                        if (sp2 + "\\_dir" === sp) {
                            var pos = sp2.indexOf("\\");
                            return !!sp && (pos == -1 || pos == 0);
                        }
                    }
                }
                return false
            };

            me.getPathItemName = function (path) {
                var parts = path.split(config.directorySeparator);
                var last = parts[parts.length - 1];
                if (last == "_dir") {
                    if (parts.length >= 3)
                        return parts[parts.length - 2];
                    else
                        return config.directorySeparator;
                } else if (last == "")
                    return config.directorySeparator;
                else
                    return last;
            };

            var fileNameValidator = /^[\w_.\-]+$/;
            me.isFileNameValid = function (name) {
                return !!name && name[0] != "_" && !!name.match(fileNameValidator);
            };

            var dirNameValidator = /^[\w_\-]+$/;
            me.isDirNameValid = function (name) {
                return !!name && name[0] != "_" && !!name.match(dirNameValidator);
            };

            return me;
        };
        return pathTools();
    }])

    .service('fileSystem', ['fileSystemConfiguration', 'pathTools', 'storage', function (config, pathTools, storage) {
        var fs = function () {
            var me = {};
            var _currentPath = config.directorySeparator;

            if (!storage.getItem(config.directorySeparator + "_dir"))
                storage.setItem(config.directorySeparator + "_dir", "_dir");

            me.path = function (path) {

                if (path == "..") {
                    _currentPath = pathTools.directoryUp(_currentPath);
                } else if (path && !pathTools.isDirNameValid(path))
                    throw new Error("Tên thư mục không hợp lệ.");
                else if (path) {

                    var dirkey = pathTools.combine(_currentPath, path, "_dir");
                    if (!storage.getItem(dirkey))
                        throw new Error("Thư mục '" + path + "' không tồn tại.");

                    _currentPath = pathTools.combine(_currentPath, path);
                }

                return _currentPath;
            };

            me.list = function () {
                var result = {
                    directories: [],
                    files: []
                };

                if (_currentPath != config.directorySeparator)
                    result.directories.push("..");

                for (var key in storage) {
                    if (pathTools.isFileOfPath(_currentPath, key)) {
                        result.files.push(pathTools.getPathItemName(key));
                    } else if (pathTools.isDirectoryOfPath(_currentPath, key)) {
                        result.directories.push(pathTools.getPathItemName(key));
                    }
                }
                result.directories.sort();
                result.files.sort();
                return result;
            };

            me.existsDir = function (path, failIfNotExist) {

                if (!pathTools.isDirNameValid(path))
                    throw new Error("Tên thư mục không đúng");

                var dirkey = pathTools.combine(_currentPath, path, "_dir");
                var exists = storage.getItem(dirkey);
                if (!exists && failIfNotExist)
                    throw new Error("Thư mục không tồn tại.");
                return exists;
            };

            me.createDir = function (path) {

                if (!pathTools.isDirNameValid(path))
                    throw new Error("Tên thư mục không đúng");

                if (!pathTools.isDirNameValid(pathTools.getPathItemName(path)))
                    throw new Error("Tên thư mục không hợp lệ");
                if (me.existsDir(path))
                    throw new Error("Thư mục đã tồn tại.");
                else {
                    var dirkey = pathTools.combine(_currentPath, path, "_dir");
                    storage.setItem(dirkey, "_dir");
                }
            };

            me.removeDir = function (path) {
                console.log("Xóa thư mục: " + path + " trên: " + _currentPath);
                if (!pathTools.isDirNameValid(path))
                    throw new Error("Tên thư mục không hợp lệ");

                if (me.existsDir(path, true)) {
                    var dirkey = pathTools.combine(_currentPath, path, "_dir");
                    path = pathTools.combine(_currentPath, path);
                    console.log("Full đường dẫn: " + path);
                    var keys = [];
                    for (var key in storage) {

                        if (key.length >= path.length) {
                            var s = key.substr(0, path.length);
                            if (s === path) {
                                keys.push(key);
                                console.log("Xóa: " + key);
                                continue;
                            }
                        }
                        console.log("Bỏ qua: " + key);
                    }
                    storage.removeItem(dirkey)
                    for (var i = 0; i < keys.length; i++) {
                        storage.removeItem(keys[i]);
                    }
                }
            };

            me.writeFile = function (name, content) {
                if (!pathTools.isFileNameValid(name))
                    throw new Error("Tên file không hợp lệ.");
                if (!content)
                    throw new Error("Nội dung không được thông qua");

                var filekey = pathTools.combine(_currentPath, name);
                storage.setItem(filekey, content);
            };

            me.appendToFile = function (name, content) {
                if (!pathTools.isFileNameValid(name))
                    throw new Error("Tên file không hợp lệ");
                if (!content)
                    throw new Error("Nội dung không được thông qua");

                var filekey = pathTools.combine(_currentPath, name);
                var prevcontent = storage.getItem(filekey);
                storage.setItem(filekey, (prevcontent ? prevcontent + "\n" : "") + content);
            };

            me.deleteFile = function (name) {
                if (!pathTools.isFileNameValid(name))
                    throw new Error("Tên file không hợp lệ.");
                var filekey = pathTools.combine(_currentPath, name);
                if (!storage.getItem(filekey)) {
                    throw new Error("File không tồn tại.");
                }
                storage.removeItem(filekey);
            };

            me.readFile = function (name) {
                if (!pathTools.isFileNameValid(name))
                    throw new Error("Tên file không hợp lệ.");

                var filekey = pathTools.combine(_currentPath, name);
                var content = storage.getItem(filekey);
                if (!content) {
                    throw new Error("File không tồn tại.");
                }
                return content;
            };

            return me;
        };
        return fs();
    }])

    .config(['commandBrokerProvider', function (commandBrokerProvider) {

        var pwdCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'pwd';
            me.description = ['Hiển thị thư mục hiện hành'];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session) {
                session.output.push({
                    output: true,
                    text: [fs.path()],
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(pwdCommand());

        var cdCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'cd';
            me.description = ['Thay đổi thư mục hiện hành.', "Dùnh lệnh: cd <đường dẫn>", "Ví dụ: cd LoLiTeam", "Ví dụ: cd .."];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Vui lòng điền tên thư mục");
                session.commands.push({
                    command: 'change-prompt',
                    prompt: {
                        path: fs.path(path)
                    }
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(cdCommand());

        var mkdirCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'mkdir';
            me.description = ['Tạo thư mục.', "Dùng lệnh: mkdir <TênThưMục>", "Ví dụ: mkdir LoLiTeam"];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Vui lòng điền tên thư mục");
                fs.createDir(path);
                session.output.push({
                    output: true,
                    text: ["Đã tạo thư mục."],
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(mkdirCommand());

        var rmdirCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'rmdir';
            me.description = ['Xóa thư mục.', "Dùng lệnh: rmdir <TênThưMục>", "Ví dụ: rmdir LoLiTeam"];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Vui lòng điền tên thư mục");
                fs.removeDir(path);
                session.output.push({
                    output: true,
                    text: ["Đã xóa thư mục."],
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(rmdirCommand());

        var lsCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'ls';
            me.description = ['Liệt kê nội dung thư mục'];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session) {
                var l = fs.list();
                var output = [];

                for (var i = 0; i < l.directories.length; i++) {
                    output.push("[DIR]\t\t" + l.directories[i]);
                }
                for (var i = 0; i < l.files.length; i++) {
                    output.push("     \t\t" + l.files[i]);
                }
                output.push("");
                output.push("Tất cả: " + (l.directories.length + l.files.length));

                session.output.push({
                    output: true,
                    text: output,
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(lsCommand());

        var catCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'cat';
            me.description = ['Đọc files', "Ví dụ: cat <TênFile>", "Ví dụ: cat loli.txt"];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Nhập tên tập tin cần đọc");
                var content = fs.readFile(path);
                var outtext = content ? content.split('\n') : [];
                session.output.push({
                    output: true,
                    text: outtext,
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(catCommand());

        var rmCommand = function () {
            var me = {};
            var fs = null;
            me.command = 'rm';
            me.description = ['Xóa file.', "Dùng lệnh: rm <TênFile>", "Ví dụ: rm loli.txt"];
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Nhập tên file cần xóa");
                fs.deleteFile(path)
                session.output.push({
                    output: true,
                    text: ["Đã xóa file."],
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(rmCommand());

        var createFileRedirection = function () {
            var me = {};
            var fs = null;
            me.command = '>';
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Nhập tên tập tin được yêu cầu");

                if (session.input) {
                    var content = '';
                    for (var i = 0; i < session.input.length; i++) {
                        for (var j = 0; j < session.input[i].text.length; j++) {
                            content += session.input[i].text[j];
                            if (j != session.input[i].text.length - 1)
                                content += '\n';
                        }
                    }
                    fs.writeFile(path, content);
                }
            }
            return me;
        };

        commandBrokerProvider.appendRedirectorHandler(createFileRedirection());

        var appendFileRedirection = function () {
            var me = {};
            var fs = null;
            me.command = '>>';
            me.init = ['fileSystem', function (fileSystem) {
                fs = fileSystem;
            }];
            me.handle = function (session, path) {
                if (!path)
                    throw new Error("Nhập tên tập tin được yêu cầu");

                if (session.input) {
                    var content = '';
                    for (var i = 0; i < session.input.length; i++) {
                        for (var j = 0; j < session.input[i].text.length; j++) {
                            content += session.input[i].text[j];
                            if (j != session.input[i].text.length - 1)
                                content += '\n';
                        }
                    }
                    fs.appendToFile(path, content);
                }
            }
            return me;
        };

        commandBrokerProvider.appendRedirectorHandler(appendFileRedirection());
    }])

    .run(['fileSystemConfiguration', 'storage', function (fs, storage) {
        if (!storage.getItem(fs.directorySeparator + "_dir"))
            storage.setItem(fs.directorySeparator + "_dir", "_dir");
    }])

;
