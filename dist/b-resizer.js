(function () {
    var BResizerPrototype = Object.create(HTMLElement.prototype, {
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.parentNode.classList.add('b-resizer-container');
                    this.startListener = this.start.bind(this);
                    this.addEventListener('mousedown', this.startListener, false);
                }
            },
            start: {
                enumerable: true,
                value: function (e) {
                    e.preventDefault();
                    this.refreshPreviousPosition(e);
                    this.resizeListener = this.resize.bind(this);
                    this.stopListener = this.stop.bind(this);
                    document.addEventListener('mousemove', this.resizeListener, false);
                    document.addEventListener('mouseup', this.stopListener, false);
                }
            },
            resize: {
                enumerable: true,
                value: function (e) {
                    var x = e.pageX, xdiff = x - this.previousPosition.x;
                    this.updateSize(this.parentNode, 'width', xdiff);
                    this.refreshPreviousPosition(e);
                }
            },
            refreshPreviousPosition: {
                enumerable: true,
                value: function (e) {
                    this.previousPosition = {
                        x: e.pageX,
                        y: e.pageY
                    };
                }
            },
            getSize: {
                enumerable: true,
                value: function (node, dimension) {
                    return parseInt(node.getBoundingClientRect()[dimension]);
                }
            },
            setSize: {
                enumerable: true,
                value: function (node, dimension, size) {
                    node.style[dimension] = size + 'px';
                }
            },
            updateSize: {
                enumerable: true,
                value: function (node, dimension, diff) {
                    var currentSize = this.getSize(node, dimension);
                    this.setSize(node, dimension, currentSize + diff);
                }
            },
            stop: {
                enumerable: true,
                value: function (e) {
                    document.removeEventListener('mousemove', this.resizeListener, false);
                    document.removeEventListener('mouseup', this.stopListener, false);
                }
            }
        });
    window.BResizer = document.registerElement('b-resizer', { prototype: BResizerPrototype });
    Object.defineProperty(BResizerPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <div class="b-resizer-handle"></div> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());