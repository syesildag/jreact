/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/jqueryui/jqueryui.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>

(function($: JQueryStatic) {
  'use strict';
  $.widget("custom.combobox", {
    _create: function() {
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

    _createAutocomplete: function() {
      var selected = this.element.children(":selected");
      var value = selected ? selected.text() : "";

      this.input = $("<input>")
        .data("originalselect", this.element)
        .appendTo(this.wrapper)
        .val(value)
        .attr("title", "")
        .focus(function() { $(this).select(); })
        .mouseup(function(e) { e.preventDefault(); }) // dans certains navigateur, la s�lection sur le focus disparait au mouse up
        .addClass("custom-combobox-input")
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: $.proxy(this, "_source")
          //,
          //open: function(event: any, ui: any) {
          //  $(".ui-menu-item a").removeClass("ui-corner-all");
          //  $(".ui-autocomplete").removeClass("ui-corner-all");
          //  // on ne cache pas car Chrome d�charge les applets cach�es, on redimensionne � 1px
          //  $("[name=dynamic_planning]").attr("with", "1");
          //  $("[name=dynamic_planning]").attr("height", "1");
          //},
          //close: function(event, ui) {
          //  $("[name=dynamic_planning]").attr("with", "100%");
          //  $("[name=dynamic_planning]").attr("height", "100%");
          //},
          //select: function(event, ui) {
          //  var jSelect = $(this).data("originalselect");
          //
          //  var sSelectedText = $(ui.item.option).text();
          //  jSelect.children("option").filter(function() {
          //    return $(this).text() == sSelectedText;
          //  }).attr('selected', true);
          //
          //  //update input size.Maj de la largeur ici aussi car suivant les pages on ne repasse pas dans la 
          //  //methode _create(?).Par contre si je le fais que ici, dans le cas ou ca repasse dans _create la
          //  //largeur sera overrid�e.
          //  var txt = jSelect.find(':selected').text();
          //  var wrappedTxt = '<span style="display:none;">' + txt + '</span>';
          //  wrappedTxt = $(wrappedTxt).insertAfter(jSelect);
          //  $(this).width($(wrappedTxt).width() < 135 ? 155 : $(wrappedTxt).width() + 20);
          //  $(wrappedTxt).remove();
          //
          //  /*if( jSelect && jSelect.size() > 0 && jSelect.get(0).onchange )
          //    jSelect.get(0).onchange();*/
          //  jSelect.change();
          //},
          //change: function(event, ui) {
          //
          //  var jSelect = $(this).data("originalselect");
          //
          //  // Selected an item, nothing to do
          //  if (ui.item) {
          //    return;
          //  }
          //
          //  // Search for a match (case-insensitive)
          //  var value = $(this).val();
          //  var valueLowerCase = value.toLowerCase();
          //  var valid = false;
          //  jSelect.children("option").each(function() {
          //    if ($(this).text().toLowerCase() === valueLowerCase) {
          //      this.selected = valid = true;
          //      return false;
          //    }
          //  });
          //
          //  // Found a match, nothing to do
          //  if (!valid) {
          //    // Remove invalid value
          //    $(this).val(jSelect.children("option:selected").text());
          //  }
          //}
        });

      $(this.element).data("filtered_input", this.input);
    },

    _createShowAllButton: function() {
      var input = this.input;
      var pShowAllButton =
        $("<a>")
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
        .click(function() {
          input.focus();
          // Pass empty string as value to search for, displaying all results
          input.autocomplete("search", "");
        });
      
      //try to fullfill synchronous rendering expectations of the javascript runtime
      setTimeout(function() {
        pShowAllButton.css({ height: input.outerHeight() - 2 });
      }, 0);
    },

    _setOption: function(key: string, value: string) {
      this._super(key, value);
      if (key === "disabled") {
        if (value) {
          this.element.prop("disabled", true);
          this.input.prop("disabled", true);
          this.button.button("disable");
        } else {
          this.element.prop("disabled", false);
          this.input.prop("disabled", false);
          this.button.button("enable");
        }
        return;
      }
    },

    _source: function(request: any, response: any) {
      var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
      response(this.element.children("option").map(function() {
        var text = $(this).text();
        if (this.value != null && (!request.term || matcher.test(text)))
          return {
            label: text,
            value: text,
            option: this
          };
      }));
    },

    _destroy: function() {
      this.wrapper.remove();
      this.element.show();
    }
  });
})(jQuery);
