/**
 * jQuery plugin for getting position of cursor in textarea
 * @license under Apache license
 * @author Bevis Zhao (i@bevis.me, http://bevis.me)
 */

(function ($, window, document, undefined) {
    $(function () {
        var calculator = {
            // key styles
            primaryStyles: ['fontFamily', 'fontSize', 'fontWeight', 'fontVariant', 'fontStyle',
				'paddingLeft', 'paddingTop', 'paddingBottom', 'paddingRight',
				'marginLeft', 'marginTop', 'marginBottom', 'marginRight',
				'borderLeftColor', 'borderTopColor', 'borderBottomColor', 'borderRightColor',
				'borderLeftStyle', 'borderTopStyle', 'borderBottomStyle', 'borderRightStyle',
				'borderLeftWidth', 'borderTopWidth', 'borderBottomWidth', 'borderRightWidth',
				'line-height', 'outline'],

            specificStyle: {
                'word-wrap': 'break-word',
                'overflow-x': 'hidden',
                'overflow-y': 'auto'
            },

            simulator: $('<div id="textarea_simulator" contenteditable="true"/>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                visibility: 'hidden'
            }).appendTo(document.body),

            toHtml: function (text) {
                return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
					.replace(/(\s)/g, '<span style="white-space:pre-wrap;">$1</span>');
            },
            // calculate position
            getCaretPosition: function () {
                var cal = calculator, self = this, element = self[0], elementOffset = self.offset();

                // IE has easy way to get caret offset position
                if ($.support.msie) {
                    // must get focus first
                    element.focus();
                    var range = document.selection.createRange();
                    return {
                        left: range.boundingLeft - elementOffset.left,
                        top: parseInt(range.boundingTop) - elementOffset.top + element.scrollTop
							+ document.documentElement.scrollTop + parseInt(self.getComputedStyle("fontSize"))
                    };
                }
                cal.simulator.empty();
                // clone primary styles to imitate textarea
                $.each(cal.primaryStyles, function (index, styleName) {
                    self.cloneStyle(cal.simulator, styleName);
                });

                // caculate width and height
                cal.simulator.css($.extend({
                    'width': self.width(),
                    'height': self.height()
                }, cal.specificStyle));

                var value = self.val(), cursorPosition = self.getCursorPosition();
                var beforeText = value.substring(0, cursorPosition),
					afterText = value.substring(cursorPosition);

                var before = $('<span class="before"/>').html(cal.toHtml(beforeText)),
					focus = $('<span class="focus"/>'),
					after = $('<span class="after"/>').html(cal.toHtml(afterText));

                cal.simulator.append(before).append(focus).append(after);
                var focusOffset = focus.offset(), simulatorOffset = cal.simulator.offset();
                // alert(focusOffset.left  + ',' +  simulatorOffset.left + ',' + element.scrollLeft);
                return {
                    top: focusOffset.top - simulatorOffset.top - element.scrollTop
						// calculate and add the font height except Firefox
						+ ($.support.mozilla ? 0 : parseInt(self.getComputedStyle("fontSize"))),
                    left: focus[0].offsetLeft - cal.simulator[0].offsetLeft - element.scrollLeft
                };
            }
        };

        $.fn.extend({
            getComputedStyle: function (styleName) {
                if (this.length == 0) return;
                var thiz = this[0];
                var result = this.css(styleName);
                result = result || ($.support.msie ?
					thiz.currentStyle[styleName] :
					document.defaultView.getComputedStyle(thiz, null)[styleName]);
                return result;
            },
            // easy clone method
            cloneStyle: function (target, styleName) {
                var styleVal = this.getComputedStyle(styleName);
                if (!!styleVal) {
                    $(target).css(styleName, styleVal);
                }
            },
            cloneAllStyle: function (target, style) {
                var thiz = this[0];
                for (var styleName in thiz.style) {
                    var val = thiz.style[styleName];
                    typeof val == 'string' || typeof val == 'number'
						? this.cloneStyle(target, styleName)
						: NaN;
                }
            },
            getCursorPosition: function () {
                var thiz = this[0], result = 0;
                if ('selectionStart' in thiz) {
                    result = thiz.selectionStart;
                } else if ('selection' in document) {
                    var range = document.selection.createRange();
                    if (parseInt($.support.version) > 6) {
                        thiz.focus();
                        var length = document.selection.createRange().text.length;
                        range.moveStart('character', -thiz.value.length);
                        result = range.text.length - length;
                    } else {
                        var bodyRange = document.body.createTextRange();
                        bodyRange.moveToElementText(thiz);
                        for (; bodyRange.compareEndPoints("StartToStart", range) < 0; result++)
                            bodyRange.moveStart('character', 1);
                        for (var i = 0; i <= result; i++) {
                            if (thiz.value.charAt(i) == '\n')
                                result++;
                        }
                        var enterCount = thiz.value.split('\n').length - 1;
                        result -= enterCount;
                        return result;
                    }
                }
                return result;
            },
            getCaretPosition: calculator.getCaretPosition
        });
    });
})(jQuery, window, document);



// Generated by CoffeeScript 1.10.0



(function () {
    var MentionsBase, MentionsContenteditable, MentionsInput, Selection, entityMap, escapeHtml, namespace,
      bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
      extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
      hasProp = {}.hasOwnProperty,
      slice = [].slice;

    namespace = "mentionsInput";

    Selection = {
        get: function (input) {
            return {
                start: input[0].selectionStart,
                end: input[0].selectionEnd
            };
        },
        set: function (input, start, end) {
            if (end == null) {
                end = start;
            }
            if (input[0].selectionStart) {
                input[0].selectStart = start;
                return input[0].selectionEnd = end;
            }
        }
    };

    entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };

    escapeHtml = function (text) {
        return text.replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    };


    $.widget("ui.areacomplete", $.ui.autocomplete, {
        options: $.extend({}, $.ui.autocomplete.prototype.options, {
            matcher: "(\\b[^,]*)",
            minChars: 3, //customization: change minimum characters to trigger autocomplete
            showAtCaret: true,
            suffix: ''
        }),
        //open: function (event, ui) { customization: autocomplete open function overriding
        //    $('.ui-autocomplete').append('<span class=\"mentions-autocomplete-link\"><a href="javascript:void(0)">click here</a></span>'); //See all results
        //},
        _create: function () {
            this.overriden = {
                open: this.options.open,
                select: this.options.select,
                focus: this.options.focus
            };
            this.options.select = $.proxy(this.selectCallback, this);
            this.options.focus = $.proxy(this.focusCallback, this);
            // this.options.open = $.proxy(this.open, this); customization:appending link to autocomplete dropdown 
            $.ui.autocomplete.prototype._create.call(this);
            return this.matcher = new RegExp(this.options.matcher + '$');
        },
        selectCallback: function (event, ui) {
            var after, before, newval, value;
            value = this._value();
            before = value.substring(0, this.start);
            after = value.substring(this.end);
            newval = ui.item.value + this.options.suffix;
            value = before + newval + after;
            this._value(value);
            Selection.set(this.element, before.length + newval.length);
            if (this.overriden.select) {
                ui.item.pos = this.start;
                this.overriden.select(event, ui);
            }
            return false;
        },
        focusCallback: function () {
            if (this.overriden.focus) {
                return this.overriden.focus(event, ui);
            }
            return false;
        },
        search: function (value, event) {
            var match, pos;
            //&& value.length >= this.options.minChars
            if (!value) {
                sel = window.getSelection();
                node = sel.focusNode;
                value = this._value();
                pos = Selection.get(this.element).start;
                value = value.substring(0, pos);
                match = this.matcher.exec(value);
                if (!match) {

                    return '';
                }


                this.start = match.index;
                this.end = match.index + match[0].length;
                this.searchTerm = match[1];
                if (match[1].length <= this.options.minChars) {//customization: to check minChars

                    this.searchTerm = '';// customization: to clear autocomplete dropdown
                }

                this._setDropdownPosition(this.element.context); // customization: to set dropdownposition at cursor
            }
            return $.ui.autocomplete.prototype.search.call(this, this.searchTerm, event);
        },
        _renderItem: function (ul, item) {
            var anchor, li, value;
            li = $('<li>');
            anchor = $('<a>').appendTo(li);
            if (item.image) {
                anchor.append("<img src=\"" + item.image + "\" />");
            }
        
            value = item.value.replace(this.searchTerm.substring(), "<strong>$&</strong>");
            anchor.append(value);

           

            return li.appendTo(ul);;
            
        },
        _setDropdownPosition: function (node) {// customization: function to set dropdownposition at cursor
            var pos = $(node).getCaretPosition();//customization: plugin used to get top and left of cursor to show drop down
            //  node = $('.mentions-input .mentions')[0];
            if (this.options.showAtCaret) {
                return this.options.position.at = "left+" + pos.left + " top+" + pos.top;
            }
        }
    });

    MentionsBase = (function () {
        MentionsBase.prototype.marker = '\u200B';

        function MentionsBase(input1, options) {
            this.input = input1;
            this.options = $.extend({}, this.settings, options);
            if (!this.options.source) {
                this.options.source = this.input.data('source') || [];
            }
        }

        MentionsBase.prototype._getMatcher = function () {
            var allowedChars;
            allowedChars = '[^' + this.options.trigger + ']';
            return '\\B[' + this.options.trigger + '](' + allowedChars + '{0,20})';
        };

        MentionsBase.prototype._markupMention = function (mention) {
            return "[" + mention.value + "](" + mention.entityid + ")(" + mention.entitytypeid + ")";
        };

        return MentionsBase;

    })();

    MentionsInput = (function (superClass) {
        var mimicProperties;

        extend(MentionsInput, superClass);

        mimicProperties = ['backgroundColor', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'borderTopWidth', 'borderLeftWidth', 'borderBottomWidth', 'borderRightWidth', 'fontSize', 'fontStyle', 'fontFamily', 'fontWeight', 'lineHeight', 'height', 'boxSizing'];

        function MentionsInput(input1, options) {
            var container;
            this.input = input1;
            this._updateHScroll = bind(this._updateHScroll, this);
            this._updateVScroll = bind(this._updateVScroll, this);
            this._updateValue = bind(this._updateValue, this);
            this._onSelect = bind(this._onSelect, this);
            this._addMention = bind(this._addMention, this);
            this._updateMentions = bind(this._updateMentions, this);
            this._update = bind(this._update, this);
            this.settings = {
                trigger: '@',
                minChars: 4,
                widget: 'areacomplete',
                suffix: '',
                autocomplete: {
                    autoFocus: true,
                    delay: 0
                }
            };
            MentionsInput.__super__.constructor.call(this, this.input, options);
            this.mentions = [];
            this.input.addClass('input');
            container = $('<div>', {
                'class': 'mentions-input'
            });
            container.css('display', this.input.css('display'));
            this.container = this.input.wrapAll(container).parent();
            this.hidden = this._createHidden();
            this.highlighter = this._createHighlighter();
            this.highlighterContent = $('div', this.highlighter);
            this.input.focus((function (_this) {
                return function () {
                    return _this.highlighter.addClass('focus');
                };
            })(this)).blur((function (_this) {
                return function () {
                    return _this.highlighter.removeClass('focus');
                };
            })(this));
            options = $.extend({
                matcher: this._getMatcher(),
                select: this._onSelect,
                suffix: this.options.suffix,
                source: this.options.source,
                appendTo: this.input.parent()
            }, this.options.autocomplete);
            this.autocomplete = this.input[this.options.widget](options);
            this._setValue(this.input.val());
            this._initEvents();
        }

        MentionsInput.prototype._initEvents = function () {
            var tagName;
            this.input.on("input." + namespace + " change." + namespace, this._update);
            tagName = this.input.prop("tagName");
            if (tagName === "INPUT") {
                this.input.on("focus." + namespace, (function (_this) {
                    return function () {
                        return _this.interval = setInterval(_this._updateHScroll, 10);
                    };
                })(this));
                return this.input.on("blur." + namespace, (function (_this) {
                    return function () {
                        setTimeout(_this._updateHScroll, 10);
                        return clearInterval(_this.interval);
                    };
                })(this));
            } else if (tagName === "TEXTAREA") {
                this.input.on("scroll." + namespace, ((function (_this) {
                    return function () {
                        return setTimeout(_this._updateVScroll, 10);
                    };
                })(this)));
                return this.input.on("resize." + namespace, ((function (_this) {
                    return function () {
                        return setTimeout(_this._updateVScroll, 10);
                    };
                })(this)));
            }
        };

        MentionsInput.prototype._setValue = function (value) {
            var match, mentionRE, offset;
            offset = 0;
            //mentionRE = /@\[([^\]]+)\]\(([^ \)]+)\)/g;
            mentionRE = /\[([^\]]+)\]\(([^ \)]+)\)\(([^ \)]+)\)/g;
            this.value = value.replace(mentionRE, '$1');
            this.input.val(this.value);
            match = mentionRE.exec(value);
            while (match) {
                console.log(match);
                this._addMention({
                    value: match[1],
                    entityid: match[2],
                    entitytypeid: match[3],
                    pos: match.index - offset

                });
                offset += match[3].length + 7;
                match = mentionRE.exec(value);
            }
            return this._updateValue();
        };

        MentionsInput.prototype._createHidden = function () {
            var hidden;
            hidden = $('<input>', {
                type: 'hidden',
                name: this.input.attr('name')
            });
            hidden.appendTo(this.container);
            this.input.removeAttr('name');
            return hidden;
        };

        MentionsInput.prototype._createHighlighter = function () {
            var content, highlighter, j, len, property;
            highlighter = $('<div>', {
                'class': 'highlighter'
            });
            if (this.input.prop("tagName") === "INPUT") {
                highlighter.css('whiteSpace', 'pre');
            } else {
                highlighter.css('whiteSpace', 'pre-wrap');
                highlighter.css('wordWrap', 'break-word');
            }
            content = $('<div>', {
                'class': 'highlighter-content'
            });
            highlighter.append(content).prependTo(this.container);
            for (j = 0, len = mimicProperties.length; j < len; j++) {
                property = mimicProperties[j];
                highlighter.css(property, this.input.css(property));
            }
            this.input.css('backgroundColor', 'transparent');
            return highlighter;
        };

        MentionsInput.prototype._update = function () {
            this._updateMentions();
            return this._updateValue();
        };

        MentionsInput.prototype._updateMentions = function () {
            var change, cursor, diff, i, j, k, len, mention, piece, ref, update_pos, value;
            value = this.input.val();
            diff = diffChars(this.value, value);
            update_pos = (function (_this) {
                return function (cursor, delta) {
                    var j, len, mention, ref, results;
                    ref = _this.mentions;
                    results = [];
                    for (j = 0, len = ref.length; j < len; j++) {
                        mention = ref[j];
                        if (mention.pos >= cursor) {
                            results.push(mention.pos += delta);
                        } else {
                            results.push(void 0);

                        }
                    }
                    return results;
                };
            })(this);
            cursor = 0;
            for (j = 0, len = diff.length; j < len; j++) {
                change = diff[j];
                if (change.added) {
                    update_pos(cursor, change.count);
                } else if (change.removed) {
                    update_pos(cursor, -change.count);
                }
                if (!change.removed) {
                    cursor += change.count;
                }
            }
            ref = this.mentions.slice(0);
            for (i = k = ref.length - 1; k >= 0; i = k += -1) {
                mention = ref[i];
                piece = value.substring(mention.pos, mention.pos + mention.value.length);
                if (mention.value !== piece) {
                    this.mentions.splice(i, 1); //removing mentions
                 
                }
            }
            return this.value = value;
        };

        MentionsInput.prototype._addMention = function (mention) {
            this.mentions.push(mention);
            return this.mentions.sort(function (a, b) {
                return a.pos - b.pos;
            });
        };

        MentionsInput.prototype._onSelect = function (event, ui) {
            this._updateMentions();
            this._addMention({ // add more attributes according to your json 
                value: ui.item.value,
                pos: ui.item.pos,
                entityid: ui.item.entityid,
                entitytypeid: ui.item.entitytypeid
            });

            //var evt = new CustomEvent("mentionAdded", { bubbles: true, cancelable: false, detail: ui.item });
            //$(".mentions")[0].dispatchEvent(evt);
            SetCaretAtEnd($('.mentions')[0]);// customization: setting cursor at end on adding mentions in IE edge bug fix 
            return this._updateValue();
        };

        MentionsInput.prototype._updateValue = function () {
            var cursor, hdContent, hlContent, j, len, mention, piece, ref, value;
            value = this.input.val();
            hlContent = [];
            hdContent = [];
            cursor = 0;
            ref = this.mentions;
            console.log(this.mentions);
            for (j = 0, len = ref.length; j < len; j++) {
                mention = ref[j];
                piece = value.substring(cursor, mention.pos);
                hlContent.push(escapeHtml(piece));
                hdContent.push(piece);
                hlContent.push("<strong>" + mention.value + "</strong>");
                hdContent.push(this._markupMention(mention));
                cursor = mention.pos + mention.value.length;
            }
            piece = value.substring(cursor);
            this.highlighterContent.html(hlContent.join('') + escapeHtml(piece));
            return this.hidden.val(hdContent.join('') + piece);
        };

        MentionsInput.prototype._updateVScroll = function () {
            var scrollTop;
            scrollTop = this.input.scrollTop();
            this.highlighterContent.css({
                top: "-" + scrollTop + "px"
            });
            return this.highlighter.height(this.input.height());
        };

        MentionsInput.prototype._updateHScroll = function () {
            var scrollLeft;
            scrollLeft = this.input.scrollLeft();
            return this.highlighterContent.css({
                left: "-" + scrollLeft + "px"
            });
        };

        MentionsInput.prototype._replaceWithSpaces = function (value, what) {
            return value.replace(what, Array(what.length).join(' '));
        };

        MentionsInput.prototype._cutChar = function (value, index) {
            return value.substring(0, index) + value.substring(index + 1);
        };

        MentionsInput.prototype.setValue = function () {
            var j, len, piece, pieces, value;
            pieces = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            value = '';
            for (j = 0, len = pieces.length; j < len; j++) {
                piece = pieces[j];
                if (typeof piece === 'string') {
                    value += piece;
                } else {
                    value += this._markupMention(piece);
                }
            }
            return this._setValue(value);
        };

        MentionsInput.prototype.getValue = function () {
            return this.hidden.val();
        };

        MentionsInput.prototype.getRawValue = function () {
            return this.input.val().replace(this.marker, '');
        };

        MentionsInput.prototype.getMentions = function () {
            return this.mentions;
        };

        MentionsInput.prototype.clear = function () {
            this.input.val('');
            return this._update();
        };

        MentionsInput.prototype.destroy = function () {
            this.input.areacomplete("destroy");
            this.input.off("." + namespace).attr('name', this.hidden.attr('name'));
            return this.container.replaceWith(this.input);
        };

        return MentionsInput;

    })(MentionsBase);


    /*
        Copyright (c) 2009-2011, Kevin Decker <kpdecker@gmail.com>
    */
    function diffChars(oldString, newString) {
        // Handle the identity case (this is due to unrolling editLength == 0
        if (newString === oldString) {
            return [{ value: newString }];
        }
        if (!newString) {
            return [{ value: oldString, removed: true }];
        }
        if (!oldString) {
            return [{ value: newString, added: true }];
        }

        var newLen = newString.length, oldLen = oldString.length;
        var maxEditLength = newLen + oldLen;
        var bestPath = [{ newPos: -1, components: [] }];

        // Seed editLength = 0, i.e. the content starts with the same values
        var oldPos = extractCommon(bestPath[0], newString, oldString, 0);
        if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
            // Identity per the equality and tokenizer
            return [{ value: newString }];
        }

        // Main worker method. checks all permutations of a given edit length for acceptance.
        function execEditLength() {
            for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
                var basePath;
                var addPath = bestPath[diagonalPath - 1],
                    removePath = bestPath[diagonalPath + 1];
                oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
                if (addPath) {
                    // No one else is going to attempt to use this value, clear it
                    bestPath[diagonalPath - 1] = undefined;
                }

                var canAdd = addPath && addPath.newPos + 1 < newLen;
                var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
                if (!canAdd && !canRemove) {
                    // If this path is a terminal then prune
                    bestPath[diagonalPath] = undefined;
                    continue;
                }

                // Select the diagonal that we want to branch from. We select the prior
                // path whose position in the new string is the farthest from the origin
                // and does not pass the bounds of the diff graph
                if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
                    basePath = clonePath(removePath);
                    pushComponent(basePath.components, undefined, true);
                } else {
                    basePath = addPath;   // No need to clone, we've pulled it from the list
                    basePath.newPos++;
                    pushComponent(basePath.components, true, undefined);
                }

                var oldPos = extractCommon(basePath, newString, oldString, diagonalPath);

                // If we have hit the end of both strings, then we are done
                if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
                    return buildValues(basePath.components, newString, oldString);
                } else {
                    // Otherwise track this path as a potential candidate and continue.
                    bestPath[diagonalPath] = basePath;
                }
            }

            editLength++;
        }

        // Performs the length of edit iteration. Is a bit fugly as this has to support the
        // sync and async mode which is never fun. Loops over execEditLength until a value
        // is produced.
        var editLength = 1;
        while (editLength <= maxEditLength) {
            var ret = execEditLength();
            if (ret) {
                return ret;
            }
        }
    }

    function buildValues(components, newString, oldString) {
        var componentPos = 0,
            componentLen = components.length,
            newPos = 0,
            oldPos = 0;

        for (; componentPos < componentLen; componentPos++) {
            var component = components[componentPos];
            if (!component.removed) {
                component.value = newString.slice(newPos, newPos + component.count);
                newPos += component.count;

                // Common case
                if (!component.added) {
                    oldPos += component.count;
                }
            } else {
                component.value = oldString.slice(oldPos, oldPos + component.count);
                oldPos += component.count;
            }
        }

        return components;
    }

    function pushComponent(components, added, removed) {
        var last = components[components.length - 1];
        if (last && last.added === added && last.removed === removed) {
            // We need to clone here as the component clone operation is just
            // as shallow array clone
            components[components.length - 1] = { count: last.count + 1, added: added, removed: removed };
        } else {
            components.push({ count: 1, added: added, removed: removed });
        }
    }

    function extractCommon(basePath, newString, oldString, diagonalPath) {
        var newLen = newString.length,
            oldLen = oldString.length,
            newPos = basePath.newPos,
            oldPos = newPos - diagonalPath,

            commonCount = 0;
        while (newPos + 1 < newLen && oldPos + 1 < oldLen && newString[newPos + 1] == oldString[oldPos + 1]) {
            newPos++;
            oldPos++;
            commonCount++;
        }

        if (commonCount) {
            basePath.components.push({ count: commonCount });
        }

        basePath.newPos = newPos;
        return oldPos;
    }

    function clonePath(path) {
        return { newPos: path.newPos, components: path.components.slice(0) };
    };

    $.fn[namespace] = function () {
        var args, options, returnValue;
        options = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        returnValue = this;
        this.each(function () {
            var instance, ref;
            if (typeof options === 'string' && options.charAt(0) !== '_') {
                instance = $(this).data('mentionsInput');
                if (options in instance) {
                    return returnValue = instance[options].apply(instance, args);
                }
            } else {
                if ((ref = this.tagName) === 'INPUT' || ref === 'TEXTAREA') {
                    return $(this).data('mentionsInput', new MentionsInput($(this), options));
                } else if (this.contentEditable === "true") {
                    return $(this).data('mentionsInput', new MentionsContenteditable($(this), options));
                }
            }
        });
        return returnValue;
    };

}).call(this);
//var el = $("textarea.mentions")[0];
function SetCaretAtEnd(el) {
    var elem = el;
    console.log(elem);
    var elemLen = elem.value.length;
    // For IE Only
    if (document.selection) {
        // Set focus
        elem.focus();
        // Use IE Ranges
        var oSel = document.selection.createRange();
        // Reset position to 0 & then set at end
        oSel.moveStart('character', -elemLen);
        oSel.moveStart('character', elemLen);
        oSel.moveEnd('character', 0);
        oSel.select();
    }
    else if (elem.selectionStart || elem.selectionStart == '0') {
        // Firefox/Chrome
        elem.selectionStart = elemLen;
        elem.selectionEnd = elemLen;
        elem.focus();
    } // if
}
$('selector-class-or-id-name').on('input propertychange paste focus', function() { // binding event with auto grow height of textarea 
        textarea_height(this, 7);// set the maximum row numbers to be needed in the textarea.
    });
    function textarea_height(TextArea, MaxHeight) {// height autogrow function
        textarea = TextArea;
        textareaRows = textarea.value.split("\n");
        if(textareaRows[0] != "undefined" && textareaRows.length < MaxHeight) counter = textareaRows.length;
        else if(textareaRows.length >= MaxHeight) counter = MaxHeight;
        else counter = 1;
        textarea.rows = counter; 
        $(TextArea).siblings('.highlighter').css("height",$(TextArea).height());
    }
