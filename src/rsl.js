/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>
(function ($) {
    'use strict';
    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>")
                .addClass("custom-combobox")
                .insertAfter(this.element);
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
            this._setOption("disabled", this.element.prop("disabled"));
            //update input size.
            var txt = this.element.find(':selected').text();
            var wrappedTxt = $("<span style='display:none'>" + txt + "</span>").insertAfter(this.element);
            //$(this)[0].input.width($(wrappedTxt).width() < 135 ? 155 : $(wrappedTxt).width() + 20);
            $(wrappedTxt).remove();
        },
        _createAutocomplete: function () {
            var selected = this.element.children(":selected");
            var value = selected ? selected.text() : "";
            this.input = $("<input>")
                .data("originalselect", this.element)
                .appendTo(this.wrapper)
                .val(value)
                .attr("title", "")
                .focus(function () { $(this).select(); })
                .mouseup(function (e) { e.preventDefault(); }) // dans certains navigateur, la s�lection sur le focus disparait au mouse up
                .addClass("custom-combobox-input")
                .autocomplete({
                delay: 0,
                minLength: 0,
                source: $.proxy(this, "_source")
            });
            $(this.element).data("filtered_input", this.input);
        },
        _createShowAllButton: function () {
            var input = this.input;
            var pShowAllButton = $("<a>");
            this.button = $("<a>")
                .attr("tabIndex", -1)
                .appendTo(this.wrapper)
                .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle")
                .click(function () {
                input.focus();
                // Pass empty string as value to search for, displaying all results
                input.autocomplete("search", "");
            });
            //try to fullfill synchronous rendering expectations of the javascript runtime
            setTimeout(function () {
                pShowAllButton.css({ height: input.outerHeight() - 2 });
            }, 0);
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if (key === "disabled") {
                if (value) {
                    this.element.prop("disabled", true);
                    this.input.prop("disabled", true);
                    this.button.button("disable");
                }
                else {
                    this.element.prop("disabled", false);
                    this.input.prop("disabled", false);
                    this.button.button("enable");
                }
                return;
            }
        },
        _source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function () {
                var text = $(this).text();
                if (this.value != null && (!request.term || matcher.test(text)))
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }));
        },
        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        }
    });
})(jQuery);
//# sourceMappingURL=rsl.js.map