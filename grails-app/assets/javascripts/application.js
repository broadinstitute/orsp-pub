*
 * Generic utility functions
 */

 // @TODO: These functions should all be deprecated.
// local functions
var orsp = (function (module) {
    module.radioChild = function (parent) {
        var value = $(parent).attr("data-child-value");
        if (!value || value.length < 1) {
            return;
        }
        var childId = $(parent).attr("data-child-id");
        var child = $("#" + childId);
        var fcn = function () {
            var val = $("input:checked", $(parent)).val();
            if (val == value) {
                $(child).show();
            } else {
                $(child).hide();
            }
        };
        $("input", $(parent)).change(fcn);
        fcn();
    };

     module.radioMessage = function (divId) {
        var div = $("#" + divId);
        $("div.radio-msg", $(div)).hide();
        var fcn = function () {
            var id  = $(this).val();
            $("div[data-id!=" + id +"]", $(div)).hide();
            $("div[data-id="  + id +"]", $(div)).show();
        };
        $("input[type='radio']:checked", $(div)).each(fcn);
        $("input[type='radio']", $(div)).change(fcn);
    };

     module.selectChild = function (node) {
        var childId = $(node).attr("data-child-id");
        if (childId.length < 1) {
            return;
        }
        var value = $(node).attr("data-child-value");
        var parent = $("select", $(node));
        var child = $("#" + childId);
        var fcn = function () {
            var vals = $(parent).val();
            var show = false;
            if (vals != null) {
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i] == value) {
                        show = true;
                        break;
                    }
                }
            }
            if (show) {
                $(child).show();
            } else {
                $(child).hide();
            }
        };
        $(parent).change(fcn);
        fcn();
    };

     module.methodButton = function () {
        var mth = $(this).attr("data-method");
        var arg = $(this).attr("data-arg");
        var key = $(this).attr("data-key");
        if (mth && arg) {
            var target = $(this).parents(".dialog-target").get(0);
            var type = $(this).attr("data-type") || "irb";
            var arg2 = $(this).attr("data-arg2");
            $.ajax("/orsp/" + type + "/" + mth, {
                type: "post",
                data: {arg: arg, id: key, arg2: arg2},
                success: function (data) {
                    var dom = $.parseHTML(data);
                    orsp.bindHandlers(dom);
                    $(target).replaceWith(dom);
                }
            });
        }
    };

     module.loadDiv = function (div, extra) {
        var url = div.attr("data-href");
        if (url) {
            var form = $("form", div).get(0);
            var data;
            if (form) {
                data = new FormData(form);
            } else {
                data = new FormData();
            }
            $.ajax(url, {
                type: "post",
                processData: false,
                contentType: false,
                data: data
            }).done(function (data) {
                div.empty();
                div.append(data);
                orsp.bindHandlers(div, extra);
                div.removeAttr("data-href");
            });
        }
    };

     module.bindHandlers = function (context, extra) {
        $(".orsp-tabs", context).tabs({
            activate: function (evt, ui) {
                orsp.loadDiv(ui.newPanel, extra);
            },
            create: function (evt, ui) {
                orsp.loadDiv(ui.panel, extra);
            }
        });
        $(".orsp-tabs").show();
        $(".select-child", context).each(function () {
            orsp.selectChild(this);
        });
        $(".radio-child", context).each(function () {
            orsp.radioChild(this);
        });
        $(".date-field input", context)
            .datepicker({changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd"});
        $(".methodButton", context).click(orsp.methodButton);
        $(".scroll-replace", context).click(orsp.scrollReplace);

         for (var key in extra) {
            $("." + key, context).on(extra[key]);
        }
    }

     return module;
}(orsp || {}));

 $(document).ready(function () {
    orsp.bindHandlers($(document));
});