(function () {

    var create = function (tag, attrs) {
        var element = document.createElement(tag);
        if (attrs && attrs.length > 0) {
            for (var i = 0; i < attrs.length; i++) {
                if (attrs[i].name && attrs[i].value) {
                    element.setAttribute(attrs[i].name, attrs[i].value);
                }
            }
        }

        return element;
    };

    var scroller = create("div",
        [
            { name: "class", value: "hidden-sm top-scroller" },
            { name: "hidden", value: "hidden" }
        ]);

    var uparrow = create("span", [{ name: "class", value: "fa fa-chevron-up" }]);

    var title = create("span");
    title.innerText = " наверх";
    scroller.appendChild(uparrow);
    scroller.appendChild(title);
    document.body.appendChild(scroller);
    var onScrollHandler = function() {
        var bodyScrollTop = window.topScroller.getScrollPosition();

        var lastPosition = window.bodyScrollLastPosition;
        if (bodyScrollTop >= screen.height) {
            if (scroller.getAttribute("hidden") === "hidden") {
                scroller.removeAttribute("hidden");
            }
            if (lastPosition != undefined && bodyScrollTop > lastPosition) {
                window.bodyScrollLastPosition = undefined;
                window.topScroller.changeScroller();
            }
        } else {
            if (lastPosition == undefined) {
                scroller.setAttribute("hidden", "hidden");
            }
        }
    };

    var onClickToTopHandler = function(e) {
        window.bodyScrollLastPosition = window.topScroller.getScrollPosition();
        window.topScroller.scrollPage(0);
        window.topScroller.changeScroller();
    };
    var onClickToDownHandler = function(e) {
        window.topScroller.scrollPage(window.bodyScrollLastPosition);
        window.bodyScrollLastPosition = undefined;
        window.topScroller.changeScroller();
    };

    var scrollFn = function (toY) {
        return function() {
            window.scrollTo(window.pageXOffset, Math.round(toY));
        };
    };

    window.topScroller = {
        scrollPage: function (topY) {
            var kf = 1;
            if (window.pageYOffset > topY) {
                for (var i = window.pageYOffset; i >= topY; i--) {
                    if (i % 5 === 0) {
                        setTimeout(scrollFn(i), kf);
                        kf += 1;
                    }
                }
            } else {
                for (var k = window.pageYOffset; k <= topY; k++) {
                    if (k % 5 === 0) {
                        setTimeout(scrollFn(k), kf);
                        kf += 1;
                    }
                }
            }
        },
        getScrollPosition: function() {
            return window.pageYOffset;
        },
        changeScroller: function() {
            var addClassName = "fa-chevron-down";
            var removeClassName = "fa-chevron-up";
            var titleValue = "&nbsp;вниз";

            if (window.bodyScrollLastPosition != undefined) {
                window.topScroller.addClickScrollDownEvent();

            } else {
                addClassName = "fa-chevron-up";
                removeClassName = "fa-chevron-down";
                titleValue = "&nbsp;наверх";
                window.topScroller.addClickScrollTopEvent();
            }
            uparrow.classList.add(addClassName);
            uparrow.classList.remove(removeClassName);
            title.innerHTML = titleValue;

        },
        addClickScrollTopEvent: function() {
            scroller.removeEventListener("click", onClickToDownHandler);
            scroller.addEventListener("click", onClickToTopHandler);
        },
        addClickScrollDownEvent: function() {
            scroller.removeEventListener("click", onClickToTopHandler);
            scroller.addEventListener("click", onClickToDownHandler);
        }
    };

    window.topScroller.addClickScrollTopEvent();
    window.addEventListener("scroll", onScrollHandler);
})();

function hideTopScroller() {
    var topScroller = $(".top-scroller");
    if (topScroller.attr("hidden") !== undefined) {
        topScroller.attr("hidden", "hidden");
    }
    if (window.bodyScrollLastPosition != undefined) {
        window.bodyScrollLastPosition = undefined;
    }
}