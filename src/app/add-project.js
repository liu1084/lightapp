/**
 * Created by jim.liu on 2016-07-09.
 */
$(function () {
    toastr.options = {
        closeMethod: '',
        closeDuration: '200',
        closeEasing: '',
        preventDuplicates: true,
        positionClass: 'toast-top-full-width',
        hideDuration: 500000
    };

    var neu = new Neu();
    neu.init();
});

var contextPath = '/workflow';
var Neu = function(){
    //this.selectedProducts = [{id: 1, name:'', money: 0}];
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
        $('.i-checkbox').on('click', function () {
            $(this).toggleClass('i-checkbox-checked');
            var productName = $(this).siblings('.description').text();
            var productMoney = $(this).siblings('.number').children('input').val() ? $(this).siblings('.number').children('input').val() : 0;
            if ($(this).hasClass('i-checkbox-checked')){
                _this.selectedProducts.push({name: productName, money: productMoney.toNumber()});
            }else {
                _this.selectedProducts = $.grep(_this.selectedProducts, function(product){
                    return productName !== product.name;
                });
            }

            _this.countSelected();
        });
        $('.icon-nextui-add').on('click', function () {
            //window.location.href = "add-project-detail.html";
            _this.getProducts();
            $('#myModal')
                .modal({
                    backdrop: 'static',
                    show: true,
                    keyboard: false
                })
                .on('show.bs.modal', function(e){
                    _this.selectedProductsOnModal();
                    _this.countSelected();
                })
                .on('hidden.bs.modal', function(){
                    _this.renderSelectedProducts();
                    _this.selectedProducts = ($.merge(_this.selectedProducts, _this.getNewSelectedProducts())).unique();
                });
        });

        $('.icon-nextui-delete').on('click', function () {
            var form = $('.products form');
            if ($(this).attr('show-select') === "true"){
                form.find('.item').find('.avatar').prev('span').remove();
                $(this).attr('show-select', false);
                return false;
            }
            var html = '<span class="i-checkbox i-checkbox-unchecked">' +
                '<span class="icon-nextui-check"></span>' +
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
                _this.selectedProducts = $.grep(_this.selectedProducts, function(product){
                    return productName != product.name;
                });

                $(line).parent('.item').remove();
            });
        });
        //
        //$(document).on('change', '.products .item .number input[type="number"]', function(){
        //    _this.updateProductMoney();
        //});
    },
    showToast: function(type, logo, message){
        //toast
        var toast = $('#toast');
        var source = toast.html();
        var template = Handlebars.compile(source);
        var context = {type: type, logo: logo, message: message};
        var html = template(context);

        var body = $('body');
        body.children('.toast').remove();
        body.append(html);
        toast.show();
        setTimeout(function(){
            $('.toast').hide();
        }, 2000);
    },
    save: function () {
        var _this = this;
        $(".apply-for").click(function () {
            _this.updateProductMoney();
            var id = $("#id").val();
            var name = $("#name").val();
            var custName = $("#custName").val();
            var status = $("#status").val();
            var signDate = $("#signDate").val();
            var projectMoney = $("#projectMoney").val();
            var product = {products: _this.selectedProducts};
            var remark = $("#remark").html();



            if (name == null || name == "") {
                //toastr.warning('', '项目名不能为空');
                //_this.showToast('toast-success', 'icon-nextui-check-circle', '项目名不能为空');
                //_this.showToast('toast-warning', 'icon-nextui-report-problem', '客户名不能为空');
                _this.showToast('toast-info', 'icon-nextui-error-outline', '客户名不能为空');
                return false;
            }
            if (custName == null || custName == "") {
                _this.showToast('toast-warning', 'icon-nextui-report-problem', '客户名不能为空');
                //toastr.warning('', '客户名不能为空');
                return false;
            }
            $.ajax({
                type: 'POST',
                async: false,
                dataType: 'json',
                data: {"id": id, "name": name, "custName": custName, "status": status, "signDate": signDate, "projectMoney": projectMoney, "product": JSON.stringify(product), "remark": remark},
                url: contextPath + "/workflow/saveSaleProject.action",
                success: function (data) {
                    $("#id").val(data.id);
                    //window.location.href = "myproject.html";
                    _this.showToast('toast-success', 'icon-nextui-check', '保存成功');
                },
                error: function (data) {
                    _this.showToast('toast-warning', 'icon-nextui-report-problem', '保存失败');
                }
            });
        });
    },
    getProducts: function () {
        var _this = this;
        $(".products .list-body ul > .item").each(function(){
            var productName = $(this).find('.description').text();
            var productMoney = $(this).find('.number').children('input').val() ? $(this).find('.number').children('input').val() : 0;
            _this.selectedProducts.push({name: productName, money: productMoney.toNumber()});
        });

        _this.selectedProducts.unique();
    },
    renderSelectedProducts: function(){
        var _this = this;
        var html = '';
        _this.selectedProducts = _this.selectedProducts.unique();
        $.each(_this.selectedProducts, function(i, p){
            var letter = p.name.substr(0, 1);
            html +='<li class="item">';
            html +='    <span class="avatar avatar-' + letter.toLowerCase() + '">' + letter + '</span>';
            html +='    <span class="description">' + p.name + '</span>';
            html +='    <span class="number">';
            html +='        <input value="' + p.money + '" maxlength="10" placeholder="输入金额" type="number"/>';
            html +='    </span>';
            html +='</li>';
        });

        $('.products .list-body ul').html(html);
        $('.icon-nextui-icon-delete').attr('show-select', false);
    },
    getNewSelectedProducts: function(){
        var selectedProducts = [];
        var products = $('.select-products .item .i-checkbox-checked');
        $.each(products, function(i, p){
            var productName = $(this).siblings('.description').text();
            var productMoney = $(this).siblings('.number').children('input').val() ? $(this).siblings('.number').children('input').val() : 0;
            selectedProducts.push({name: productName, money: productMoney.toNumber()});
        });
        return selectedProducts;
    },

    updateProductMoney: function(){
        var _this = this;
        var products = $('.products .item .description');
        var tmp = [];
        $.each(products, function(i, p){
            var name = $(this).text();
            var number = $(this).next('span.number').children('input').val();
            tmp.push({name: name, money: number});
        });

        _this.selectedProducts = tmp;
    },
    selectedProductsOnModal: function(){
        var _this = this;
        _this.selectedProducts = _this.selectedProducts.unique();
        var products = $('.select-products .item .i-checkbox');
        $.each(products, function(i, p){
            var productName = $(this).siblings('.description').text();
            var that = this;
            var result = _this.selectedProducts.find(function(p){
                return p.name === productName;
            });

            if (result){
                $(that).removeClass('i-checkbox-unchecked').addClass('i-checkbox-checked');
            }else{
                $(that).removeClass('i-checkbox-checked').addClass('i-checkbox-unchecked');
            }
        });
    },
    countSelected: function(){
        var count = this.selectedProducts.length;
        $('.select-count').text(count);
    }
};