angular.module('ng-terminal-example.command.implementations', ['ng-terminal-example.command.tools'])

    .config(['commandBrokerProvider', function (commandBrokerProvider) {

        commandBrokerProvider.appendCommandHandler({
            command: 'version',
            description: ['Hiển thị phiên bản của chương trình'],
            handle: function (session) {
                session.output.push({
                    output: true,
                    text: ['Version 1.3 Beta build by LoLi Team'],
                    breakLine: true
                });
            }
        });


        commandBrokerProvider.appendCommandHandler({
            command: 'info',
            description: ['Hiển thị thông tin về LoLi Team'],
            handle: function (session) {
                session.output.push({
                    output: true,
                    text: ['#Name: LoLi Sec Team', '#Contry: Vietnamese', '#Team Leader: Thương EoPi', '#Team Dev: Hell Cat', '#Home: loliteam.net', '#Blog: https://blog.hellcatvn.com/', '#Leader Site: http://hoàithương.vn', '#Dev Site: http://www.hellcatvn.com'],
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'contacts',
            description: ['Hiển thị thông tin liên lạc'],
            handle: function (session) {
                session.output.push({
                    output: true,
                    text: ['>> EoPi Facebook: https://facebook.com/Thuong.EoPi',
                        '>> HellCat Facebook: https://www.facebook.com/hellcat.info',
                        '>> EoPi Email: tinykidpro@gmail.com',
                        '>> HellCat Email: hellcatvn@gmail.com',
                        '>> Website: http://hoàithương.vn',
                        '>> Website: http://www.hellcatvn.com',
                        '© LoLi Sec Team 2017'
                    ],
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'view',
            description: ['Toàn bộ thông tin về chương trình'],
            handle: function (session) {
                session.output.push({
                    output: true,
                    text: ['-LoLi Sec Team Terminal-Emulator là chương trình giả lập terminal của các hệ điều hành Linux', '-Mục đích là mang lại cho người dùng những trải nghiệm duyệt web mới lạ với phong cách dòng lệnh mà các hacker hay sử dụng ^.^', '-Do vẫn đang trong quá trình phát triển nên chưa hoàn thiện hy vọng các bạn đóng góp ý kiến về Email: <tinykidpro@gmail.com>', '-We Are LoLi Sec Team # SHIINA EOPI # HELL CAT # Thank You for Visiting My Team Website'],
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'members',
            description: ['Hiển thị danh sách các thành viên của LoLi Team'],
            handle: function (session) {
                session.output.push({
                    output: true,
                    text: ['________________________________',
                        '|_________LoLi_Sec_Team________|',
                        '#################################',
                        '# Shiina EoPi    # Hell Cat     #',
                        '# TMD.NS         # T.Virus      #',
                        '# Meowton Kalava # Joker.2k2    #',
                        '# NMQ            # Thiên.Đz     #',
                        '# Nolife.VN      # NMT.ROS3     #',
                        '# Lương.Gayer    # HC.Phát      #',
                        '# ĐT.Sơn         # B.Mạnh       #',
                        '# TV.Tuyên       # P.Cường      #',
                        '# Souji.T1       # Trung Vỵt    #',
                        '# ThảoPizza      # TQ.Minh      #',
                        '# Young.TMD      # Phong Nguyễn #',
                        '# Accelerator    # D4lziel.404  #',
						'# Dat.TTD        # TTH.Thuật    #',
						'# NoahX          # ROSA         #',
                        '#################################',
                        'Đây là danh sách tạm thời chưa update hết.'
                    ],
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'blog',
            description: ['Truy cập vào trang blog của LoLi Team.'],
            handle: function (session) {
                window.open('http://meomeoilu.blogspot.com/');
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'utube',
            description: ['Truy cập vào kênh youtube của LoLi Team.'],
            handle: function (session) {
                window.open('https://www.youtube.com/channel/UC0HE9IQZ6X85f1dequ07bxA');
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'clear',
            description: ['Xóa các dòng hiển thị và các lệnh vừa dùng khỏi màn hình terminal.'],
            handle: function (session) {
                session.commands.push({
                    command: 'clear'
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'echo',
            description: ['Nhập Echoes.'],
            handle: function (session) {
                var a = Array.prototype.slice.call(arguments, 1);
                session.output.push({
                    output: true,
                    text: [a.join(' ')],
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'eval',
            description: ['Đánh giá đầu vào như JavaScript. ', 'Ví dụ: eval alert(1)'],
            handle: function (session, param) {
                var a = Array.prototype.slice.call(arguments, 1);
                var param = eval(a.join(' '));
                param = param ? param.toString() : '';
                session.output.push({
                    output: true,
                    text: [param],
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'break',
            description: ['Kiểm tra cách lệnh được chia nhỏ trong các phân đoạn.', "Ví dụ: break 'LoLi Team' LoLi Team"],
            handle: function (session) {
                var a = Array.prototype.slice.call(arguments, 1);
                session.output.push({
                    output: true,
                    text: a,
                    breakLine: true
                });
            }
        });

        commandBrokerProvider.appendCommandHandler({
            command: 'websocket',
            description: ['Bắt đầu chạy websocket. ',
                'Dùng lệnh: websocket <url> [protocol]',
                'Ví dụ: websocket wss://echo.websocket.org'
            ],
            handle: function (session, url, protocol) {
                if (!url) {
                    throw new Error("Cần thêm thông số 'url', nhập 'help websocket' để nhận trợ giúp.")
                }

                session.output.push({
                    output: true,
                    text: ["Mở kết nối đến " + url + (protocol ? " với protocol " + protocol : "") + " ...",
                        "Nhập 'exit' để thoát."
                    ],
                    breakLine: true
                });
                session.commands.push({
                    command: 'change-prompt',
                    prompt: {
                        path: 'websocket[' + url + ']'
                    }
                });
                session.contextName = "websocket";
                session.context = function () {
                    var me = {};
                    var ws = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
                    ws.onopen = function () {
                        session.output.push({
                            output: true,
                            text: ["Kết nối được thiết lập."],
                            breakLine: true
                        });
                        session.$scope.$apply();
                    };

                    ws.onerror = function () {
                        session.output.push({
                            output: true,
                            text: ["Kết nối bị lỗi."],
                            breakLine: true
                        });
                        session.$scope.$apply();
                        me.execute(session, "exit");
                    };

                    ws.onmessage = function (msg) {
                        session.output.push({
                            output: true,
                            text: [msg.data],
                            breakLine: true
                        });
                        session.$scope.$apply();
                    };

                    me.execute = function (s, c) {
                        if (c == 'exit') {
                            ws.close();
                            s.contextName = "";
                            delete s.context;
                            s.commands.push({
                                command: 'reset-prompt',
                                prompt: {
                                    path: true
                                }
                            });
                            s.output.push({
                                output: true,
                                text: ["Websocket đã ngừng."],
                                breakLine: true
                            });
                            return;
                        }
                        ws.send(c);
                    };
                    return me;
                }();
            }
        });

        var suCommandHandler = function () {
            var me = {};
            var ga = null;
            me.command = 'su';
            me.description = ['Thay đổi nhận dạng người dùng.', "Dùng lệnh: su <TênNgườiDùng>", "Ví dụ: su EoPi"];
            me.init = ['$ga', function ($ga) {
                ga = $ga;
            }];
            me.handle = function (session, login) {
                if (!login) {
                    session.output.push({
                        output: true,
                        text: ["Tham số <TênNgườiDùng> là bắt buộc.", "Nhập 'help su' để được gợi ý."],
                        breakLine: true
                    });
                    return;
                }

                ga('set', {
                    userId: login.toString()
                });
                session.login = login;
                session.commands.push({
                    command: 'change-prompt',
                    prompt: {
                        user: login
                    }
                });
                session.output.push({
                    output: true,
                    text: ["Nhận dạng đã được thay đổi."],
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(suCommandHandler());

        var feedbackCommandHandler = function () {
            var me = {};
            var _ga = null;
            me.command = 'feedback';
            me.description = ['Gửi tin nhắn phản hồi cho Admin.', "Dùng lệnh: feedback <Nội dung tin nhắn>", "Ví dụ: feedback Cái này trất quá Admin ơi! Tôi có thể đóng gốp để xây dựng nó ở đâu?"];
            me.init = ['$ga', function ($ga) {
                _ga = $ga;
            }];
            me.handle = function (session, param) {
                param = Array.prototype.slice.call(arguments, 1);
                param = param.join(' ');
                var outText = [];
                if (!param) {
                    outText.push("Bạn cần nhập nội dung tin nhắn, nhập 'help feedback' để nhận gợi ý.");
                } else {
                    outText.push("Tin nhắn của bạn đã được gửi.");
                    outText.push("Cảm ơn bạn đã phản hồi!.");
                    _ga('send', 'event', 'Console', 'Feedback', param);
                }
                session.output.push({
                    output: true,
                    text: outText,
                    breakLine: true
                });
            }
            return me;
        };
        commandBrokerProvider.appendCommandHandler(feedbackCommandHandler());

        // this must be the last
        var helpCommandHandler = function () {
            var me = {};

            me.command = 'help';
            me.description = ['Cung cấp hướng dẩn làm thế nào để sử dung terminal của LoLi Team'];
            me.handle = function (session, cmd) {
                var list = commandBrokerProvider.describe();
                var outText = [];
                if (cmd) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].command == cmd) {
                            var l = list[i];
                            outText.push("Thông tin về lệnh: " + cmd);
                            for (var j = 0; j < l.description.length; j++) {
                                outText.push(l.description[j]);
                            }
                            break;
                        }
                    }
                    if (!outText.length)
                        outText.push("Không có trợ giúp nào cho lệnh: " + cmd);
                } else {
                    outText.push("Các lệnh hiện tại bạn có thể dùng (vẫn đang trong quá trình phát triển nên còn giới hạn):");
                    for (var i = 0; i < list.length; i++) {
                        var str = "  " + list[i].command + "\t\t";
                        for (var j = 0; j < 3 && i + 1 < list.length; j++) {
                            var cmd = list[++i].command;
                            str += cmd + (cmd.length > 6 ? "\t" : "\t\t");
                        }
                        outText.push(str);
                    }
                    outText.push("");
                    outText.push("Nhập 'help <lệnh>' để xem trợ giúp về lệnh đó");
                }
                session.output.push({
                    output: true,
                    text: outText,
                    breakLine: true
                });
            };
            return me;
        };
        commandBrokerProvider.appendCommandHandler(helpCommandHandler());
    }])

;
