/**
 * Created by jim.liu on 2016-07-09.
 */
$(function () {
    function bindSave() {
        var _this = this;
        $(".bt_save").click(function () {
            var id = $("#id").val();
            var name = $("#name").val();
            var custName = $("#custName").val();
            var status = $("#status").val();
            var signDate = $("#signDate").val();
            var projectMoney = $("#projectMoney").val();
            var product = _this.getProduct();
            var remark = $("#remark").html();
            $.ajax({
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {
                    "id": id,
                    "name": name,
                    "custName": custName,
                    "status": status,
                    "signDate": signDate,
                    "projectMoney": projectMoney,
                    "product": product,
                    "remark": remark
                },
                url: contextPath + "/workflow/saveSaleProject.action",
                success: function (data) {
                    $("#id").val(data.id);
                    window.location.href = "myproject.html";
                    $('.weui_toast_content').html("保存成功！");
                    $('#loadingToast').show();
                    setTimeout(function () {
                        $('#loadingToast').hide();
                    }, 1000);
                },
                error: function (data) {
                    $('.weui_toast_content').html("保存失败");
                    $('#loadingToast').show();
                    setTimeout(function () {
                        $('#loadingToast').hide();
                    }, 1000);
                }
            })
        })
    }
    $('.i-checkbox').off('click').on('click', function () {
        $(this).toggleClass('i-checkbox-checked');
    });
    $('.icon-nextui-icon-add').on('click', function(){
        window.location.href = "add-project-detail.html";
    });
});