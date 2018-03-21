(function () {
    'use strict';
    CKEDITOR.plugins.add('googleDocPastePlugin', {
        requires: 'clipboard',
        init: function (editor) {
            editor.on('paste', function (evt) {
                if ("data" in evt && "dataValue" in evt.data && evt.data.dataValue.includes("docs-internal-guid") && "dataTransfer" in evt.data && "_" in evt.data.dataTransfer && "data" in evt.data.dataTransfer._ && "text/html" in evt.data.dataTransfer._.data) {
                    evt.data.dataValue = formatting(evt.data.dataTransfer._.data['text/html']);
                }
            });
        }
    });
})();

function recursiveFormatting(context) {
    var children = context.get(0).children;
    var index = 0;
    context.children().each(function () {
        var clonedEle;
        //for italicity
        if (children[index].style.fontStyle !== "") {
            if (children[index].style.fontStyle === "italic") {
                children[index].style.fontStyle = null;
                clonedEle = $("<em></em>").append($(children[index]).clone());
                $(children[index]).replaceWith(clonedEle.get(0));
            } else {
                children[index].style.fontStyle = null;
            }
        }
     //for underline
        if (children[index].style.textDecoration !== "") {
            if (children[index].style.textDecoration === "underline") {
                children[index].style.textDecoration = null;
                clonedEle = $("<u></u>").append($(children[index]).clone());
                $(children[index]).replaceWith(clonedEle.get(0));
            } else {
                children[index].style.textDecoration = null;
            }
        }
       //for bold
        if (children[index].style.fontWeight !== "") {
            if (children[index].style.fontWeight > "400") {
                children[index].style.fontWeight = null;
                clonedEle = $("<strong></strong>").append($(children[index]).clone());
                $(children[index]).replaceWith(clonedEle.get(0));
            } else {
                children[index].style.fontWeight = null;
            }
        }
        if ($(children[index]).children().length > 0) {
            recursiveFormatting($(children[index]));
        }
        index++;
    });
}

function formatting(str) {
    var jqueryObject = $(str);
    var parent = $("<div></div>");
    jqueryObject.children().each(function () {
        parent.append($(this));
    });
    recursiveFormatting (parent);
    return parent.get(0).innerHTML;
}