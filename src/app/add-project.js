/**
 * Created by jim.liu on 2016-07-09.
 */
$(function () {
    toastr.options = {
        closeMethod: 'fadeOut',
        closeDuration: '200',
        closeEasing: 'swing',
        preventDuplicates: true,
        positionClass: 'toast-top-full-width',
        hideDuration: 500
    };

    var neu = new Neu();
    neu.init();
});

var contextPath = '/workflow';
var Neu = function(){
    this.selectedProducts = [];
    this.products = [];
};
Neu.prototype = {
    init: function () {
        this.save();
        this.bind();
    },
    bind: function () {
        var _this = this;
        $('.i-checkbox').off('click').on('click', function () {
            $(this).toggleClass('i-checkbox-checked');
            var productName = $(this).siblings('.description').text();
            if ($(this).hasClass('i-checkbox-checked')){
                _this.selectedProducts.push(productName);
            }else {
                _this.selectedProducts = $.grep(_this.selectedProducts, function(value){
                    return productName !== value;
                })
            }
            console.log(_this.selectedProducts);
        });
        $('.icon-nextui-icon-add').on('click', function () {
            //window.location.href = "add-project-detail.html";
            _this.getProducts();
            console.log(_this.selectedProducts);
            $('#myModal')
                .modal({
                    backdrop: 'static',
                    show: true,
                    keyboard: false
                })
                .on('show.bs.modal', function(e){
                    _this.selectedProductsOnModal();
                })
                .on('hidden.bs.modal', function(){
                    _this.selectedProducts = $.unique($.merge(_this.selectedProducts, _this.getNewSelectedProducts()));
                    _this.renderSelectedProducts();
                });
        });

        $('.icon-nextui-icon-delete').on('click', function () {
            var form = $('.products form');
            if ($(this).attr('show-select') === "true"){
                form.find('.item').find('.avatar').prev('span').remove();
                $(this).attr('show-select', false);
                return false;
            }
            var html = '<span class="i-checkbox i-checkbox-unchecked">' +
                '<span class="icon-nextui-icon-check"></span>' +
                '</span>';
            $(this).attr('show-select', true);

            form.find('.item').find('span.i-checkbox').remove();
            form.find('.item').find('.avatar').before(html);
            $('.i-checkbox').off('click').on('click', function () {
                $(this).toggleClass('i-checkbox-checked');
            });
        });

        $('.delete').on('click', function () {
            var lines = $('.products form').find('.item').find('span.i-checkbox-checked');
            $.each(lines, function(i, line){
                var productName = $(line).parent('.item').children('.description').text();
                _this.selectedProducts = $.grep(_this.selectedProducts, function(value){
                    return value != productName;
                });

                $(line).parent('.item').remove();
            });
            console.log(_this.selectedProducts);
        });

    },
    save: function () {
        var _this = this;
        $(".apply-for").click(function () {
            var id = $("#id").val();
            var name = $("#name").val();
            var custName = $("#custName").val();
            var status = $("#status").val();
            var signDate = $("#signDate").val();
            var projectMoney = $("#projectMoney").val();
            var product = _this.selectedProducts.join('#');
            var remark = $("#remark").html();
            if (name == null || name == "") {
                toastr.warning('', '项目名不能为空');
                return false;
            }
            if (custName == null || custName == "") {
                toastr.warning('', '客户名不能为空');
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
    getProducts: function () {
        var _this = this;
        $(".products .list-body ul > .item").each(function(){
            _this.selectedProducts.push($(this).find('.description').html());
        });

        $.unique(_this.selectedProducts);
    },
    getNewSelectedProducts: function(){
        var selectedProducts = [];
        var products = $('.select-products .item .i-checkbox-checked');
        $.each(products, function(i, p){
            var thiz = this;
            var productName = $(thiz).siblings('.description').text();
            selectedProducts.push(productName);
        });
        return selectedProducts;
    },
    renderSelectedProducts: function(){
        var _this = this;
        console.log(_this.selectedProducts);
        var html = '';
        $.each(_this.selectedProducts, function(i, p){
            var letter = p.substr(0, 1);
            html +='<li class="item">';
            html +='    <span class="avatar avatar-' + letter.toLowerCase() + '">' + letter + '</span>';
            html +='    <span class="description">' + p + '</span>';
            html +='    <span class="number">';
            html +='        <input value="" maxlength="10" placeholder="输入金额" type="text"/>';
            html +='    </span>';
            html +='</li>';
        });

        $('.products .list-body ul').html(html);
        $('.icon-nextui-icon-delete').attr('show-select', false);
    },
    selectedProductsOnModal: function(){
        var _this = this;
        var products = $('.select-products .item .i-checkbox');
        $.each(products, function(i, p){
            var productName = $(this).siblings('.description').text();
            if ($.inArray(productName, _this.selectedProducts) > -1){
                $(this).removeClass('i-checkbox-unchecked').addClass('i-checkbox-checked');
            }else{
                $(this).removeClass('i-checkbox-checked').addClass('i-checkbox-unchecked');
            }
        });
    }
};