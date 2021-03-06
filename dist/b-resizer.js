(function () {
    var BResizerPrototype = Object.create(HTMLElement.prototype, {
            left: {
                enumerable: true,
                get: function () {
                    return this.direction === 'left';
                }
            },
            right: {
                enumerable: true,
                get: function () {
                    return this.direction === 'right';
                }
            },
            direction: {
                enumerable: true,
                get: function () {
                    return this.hasAttribute('direction') ? this.getAttribute('direction') : null;
                }
            },
            vertical: {
                enumerable: true,
                get: function () {
                    return this.left || this.right;
                }
            },
            top: {
                enumerable: true,
                get: function () {
                    return this.direction === 'top';
                }
            },
            bottom: {
                enumerable: true,
                get: function () {
                    return this.direction === 'bottom';
                }
            },
            horizontal: {
                enumerable: true,
                get: function () {
                    return this.top || this.bottom;
                }
            },
            omni: {
                enumerable: true,
                get: function () {
                    return !this.top && !this.bottom && !this.left && !this.right;
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    if (this.vertical) {
                        this.setAttribute('vertical', '');
                    }
                    if (this.horizontal) {
                        this.setAttribute('horizontal', '');
                    }
                    if (this.omni) {
                        this.setAttribute('omni', '');
                    }
                    this.parentNode.classList.add('b-resizer-container');
                    if (this.left) {
                        this.setPosition(this.parentNode, 'left', 0);
                    }
                    this.startListener = this.start.bind(this);
                    this.addEventListener('mousedown', this.startListener, false);
                }
            },
            detachedCallback: {
                enumerable: true,
                value: function () {
                    this.removeEventListener('mousedown', this.startListener, false);
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
                    var diff = this.getPositionDiff(e);
                    if (this.omni || this.vertical) {
                        this.updateSize(this.parentNode, 'width', diff.x);
                        if (this.left) {
                            this.updatePosition(this.parentNode, 'left', -diff.x);
                        }
                    }
                    if (this.omni || this.horizontal) {
                        this.updateSize(this.parentNode, 'height', this.top ? -diff.y : diff.y);
                    }
                    this.refreshPreviousPosition(e);
                }
            },
            getPositionDiff: {
                enumerable: true,
                value: function (e) {
                    var x = e.pageX, y = e.pageY, xdiff = this.left ? this.previousPosition.x - x : x - this.previousPosition.x, ydiff = y - this.previousPosition.y;
                    return {
                        x: xdiff,
                        y: ydiff
                    };
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
                    this.dispatchEvent(new CustomEvent('resize', {
                        detail: {
                            dimension: dimension,
                            size: size
                        }
                    }));
                }
            },
            updateSize: {
                enumerable: true,
                value: function (node, dimension, diff) {
                    var currentSize = this.getSize(node, dimension);
                    this.setSize(node, dimension, currentSize + diff);
                }
            },
            getPosition: {
                enumerable: true,
                value: function (node, side) {
                    return parseInt(node.style[side].replace('px', ''));
                }
            },
            setPosition: {
                enumerable: true,
                value: function (node, side, value) {
                    node.style[side] = value + 'px';
                }
            },
            updatePosition: {
                enumerable: true,
                value: function (node, side, diff) {
                    var currentPos = this.getPosition(node, side);
                    this.setPosition(node, side, currentPos + diff);
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
}());