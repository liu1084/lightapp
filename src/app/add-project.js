/**
 * Created by jim.liu on 2016-07-09.
 */
$(function () {
    neu.projectCreate.init();
    toastr.options = {
        closeMethod: 'fadeOut',
        closeDuration: '200',
        closeEasing: 'swing',
        preventDuplicates: true,
        positionClass: 'toast-top-full-width',
        hideDuration: 500
    };
});

var neu = window.neu || {};
var contextPath = 'http://10.4.45.46:8080/workflow';
neu.projectCreate = {
    init: function () {
        this.bindAddItem();
        this.bindStatus();
        this.bindMinus();
        this.bindSave();
        this.bind();
        this.initContent();
    },

    bind: function () {
        var _this = this;
        $('.i-checkbox').off('click').on('click', function () {
            $(this).toggleClass('i-checkbox-checked');
        });
        $('.icon-nextui-icon-add').on('click', function () {
            //window.location.href = "add-project-detail.html";
            $('#myModal').modal({
                backdrop: 'static',
                show: true,
                keyboard: false
            });
        });

        $('.icon-nextui-icon-delete').on('click', function () {
            var html = '<span class="i-checkbox i-checkbox-unchecked">' +
                '<span class="icon-nextui-icon-check"></span>' +
                '</span>';
            $('.products form').find('.item').find('span.i-checkbox').remove();
            $('.products form').find('.item').find('.avatar').before(html);
            $('.i-checkbox').off('click').on('click', function () {
                $(this).toggleClass('i-checkbox-checked');
            });
        });

        $('.delete').on('click', function () {
            var line = $('.products form').find('.item').find('span.i-checkbox-checked');
            if (line.length > 0) {
                var item = $(line).parent('.item').remove();
            }
        });

    },

    initContent: function () {
        var params = window.location.search;
        if (params.indexOf("id") >= 0) {
            var id = params.split("=")[1];
            if (id != null) {
                document.title = "项目更新";
                $.ajax({
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    data: {"id": id},
                    url: contextPath + "/workflow/getUniqueSaleProject.action",
                    success: function (data) {
                        $("#id").val(data.id);
                        $("#name").val(data.name);
                        $("#custName").val(data.custName);
                        $("#status").val(data.status);
                        $("#signDate").val(data.signDate);
                        $("#projectMoney").val(data.projectMoney);
                        $("#remark").html(data.remark);
                        if ($("#remark").attr("placeholder") == "项目信息补充说明" && $("#remark").html() == "" || $("#remark").html() == "项目信息补充说明") {
                            $("#remark").html("项目信息补充说明");
                            $("#remark").addClass("placeholder");
                        } else {
                            $("#remark").removeClass("placeholder");
                        }
                        document.title = "项目更新";
                        var html = "";
                        if (data.product != "") {
                            var product = data.product.split("#");
                            for (var i = 0; i < product.length; i++) {
                                var html = html + "<div class=\"proItem minus\">" + product[i] + "</div>";
                            }
                        }
                        $(".item0").find(".addItem").before(html);
                    },
                    error: function (data) {
                        $('.weui_toast_content').html("获取数据失败！");
                        $('#loadingToast').show();
                        setTimeout(function () {
                            $('#loadingToast').hide();
                        }, 1000);
                    }
                })
            }
        }
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    bindSave: function () {
        var _this = this;
        $(".apply-for").click(function () {
            var id = $("#id").val();
            var name = $("#name").val();
            var custName = $("#custName").val();
            var status = $("#status").val();
            var signDate = $("#signDate").val();
            var projectMoney = $("#projectMoney").val();
            var product = _this.getProduct();
            var remark = $("#remark").html();
            if (name == null || name == "") {
                toastr.warning('', '项目名不能为空');
                return false;
            }
            if (custName == null || custName == "") {
                toastr.warning('', '客户名不能为空')
                return false;
            }
            $.ajax({
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {"id": id, "name": name, "custName": custName, "status": status, "signDate": signDate, "projectMoney": projectMoney, "product": product, "remark": remark},
                url: contextPath + "/workflow/saveSaleProject.action",
                success: function (data) {
                    $("#id").val(data.id);
                    //window.location.href = "myproject.html";
                    toastr.success('保存成功!');
                },
                error: function (data) {
                    toastr.warning('保存失败!', data.statusText);
                }
            });
        });
    },
    bindMinus: function () {
        $(".item0").on('click', '.minus', function () {
            $(this).remove();
        });
    },
    bindStatus: function () {
        $('.container').on('click', '.bt_iptText', function () {
            var _bt = baidu.template;
            $("#weui_actionsheet").html(_bt("statusTemplate", {}));
            var mask = $('#mask');
            var weuiActionsheet = $('#weui_actionsheet');
            weuiActionsheet.addClass('weui_actionsheet_toggle');
            mask.show().addClass('weui_fade_toggle').one('click', function () {
                hideActionSheet(weuiActionsheet, mask);
            });
            $('#actionsheet_cancel').one('click', function () {
                hideActionSheet(weuiActionsheet, mask);
            });
            $('#actionSheet_wrap').one('click', '.bt_cell', function () {
                $("#status").val($(this).html());
                hideActionSheet(weuiActionsheet, mask);
            })
            weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');
            function hideActionSheet(weuiActionsheet, mask) {
                weuiActionsheet.removeClass('weui_actionsheet_toggle');
                mask.removeClass('weui_fade_toggle');
                weuiActionsheet.on('transitionend', function () {
                    mask.hide();
                }).on('webkitTransitionEnd', function () {
                })
            }

        });
    },
    getProduct: function () {
        var status = "";
        $(".item0 .minus").each(function () {
            status = status + "#" + $(this).html();
        })
        return status.length == 0 ? status : status.substring(1, status.length);
    },
    bindAddItem: function () {
        var _this = this;
        $('.container').on('click', '.bt_addItem', function () {
            var _bt = baidu.template;
            var status = "";
            $("#weui_actionsheet").html(_bt("productTemplate", {"status": _this.getProduct()}));
            var mask = $('#mask');
            var weuiActionsheet = $('#weui_actionsheet');
            weuiActionsheet.addClass('weui_actionsheet_toggle');
            mask.show().addClass('weui_fade_toggle').one('click', function () {
                hideActionSheet(weuiActionsheet, mask);
            });
            $('#actionsheet_cancel').one('click', function () {
                hideActionSheet(weuiActionsheet, mask);
            });
            $('#actionSheet_wrap').on('click', '.bt_cell_item', function () {
                if ($(this).hasClass("choose")) {
                    $(this).removeClass("choose");
                    var pro = $(this).html();
                    $(".item0").find(".minus").each(function () {
                        if ($(this).html() == pro) {
                            $(this).remove();
                        }
                    })
                } else {
                    $(".item0").find(".addItem").before("<div class='proItem minus'>" + $(this).html() + "</div>");
                    $(this).addClass("choose");
                }
            })
            weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');
            function hideActionSheet(weuiActionsheet, mask) {
                $('#actionSheet_wrap').off();
                weuiActionsheet.removeClass('weui_actionsheet_toggle');
                mask.removeClass('weui_fade_toggle');
                weuiActionsheet.on('transitionend', function () {
                    mask.hide();
                }).on('webkitTransitionEnd', function () {
                    mask.hide();
                })
            }
        })
    }

};
