/**
 * @fileOverview Implementation of a binary search tree data structure
 * @author Jason S. Jones
 * @version 0.1.0
 * @license MIT
 */
(function () {
    'use strict';

    var BSTNode = function (value) {
        this.key = value;
        this.right = null;
        this.left = null;
    };

    function basicCompare(a, b) {
        return a - b;
    }

    var BST = function (compareFn) {
        this.root = null;
        this.cmp = compareFn || basicCompare;
    };

    BST.prototype.add = function (value) {
        var newNode = new BSTNode(value);

        if (this.root === null) {
            this.root = newNode;
        } else {
            addNode(this.root, newNode, this.cmp);
        }
    };

    BST.prototype.contains = function (value) {
        return containsNode(this.root, value, this.cmp);
    };

    BST.prototype.inOrderTraversal = function (cb) {
        inOrderTraverseNode(this.root, cb);
    };

    BST.prototype.preOrderTraversal = function (cb) {
        preOrderTraverseNode(this.root, cb);
    };

    BST.prototype.postOrderTraversal = function (cb) {
        postOrderTraverseNode(this.root, cb);
    };

    BST.prototype.min = function () {
        return minNode(this.root);
    };

    BST.prototype.max = function () {
        return maxNode(this.root);
    };

    BST.prototype.remove = function (key) {
        var removeNode = this.root;
        var parent = this.root;
        var isLeftChild = true;

        while (this.cmp(removeNode.key, key) !== 0) {
            parent = removeNode;

            if (this.cmp(removeNode.key, key) > 0) {
                isLeftChild = true;
                removeNode = removeNode.left;
            } else {
                isLeftChild = false;
                removeNode = removeNode.right;
            }

            if (removeNode === null) {
                return false;
            }
        }

        // case 1: leaf node
        if (removeNode.left === null && removeNode.right === null) {

            if (removeNode === this.root) {
                this.root = null;
            }

            if (isLeftChild) {
                parent.left = null;

            } else {
                parent.right = null;
            }

        // case 2: one child node
        // case 2a: left child but no right child
        } else if (removeNode.right === null) {

            if (removeNode === this.root) {
                this.root = removeNode.left;

            } else if (isLeftChild) {
                parent.left = removeNode.left;

            } else {
                parent.right = removeNode.left;
            }

        // case 2b: right child but no left child
        } else if (removeNode.left === null) {

            if (removeNode === this.root) {
                this.root = removeNode.right;

            } else if (isLeftChild) {
                parent.left = removeNode.right;

            } else {
                parent.right = removeNode.right;
            }

        // case 3: both left and right nodes
        // this is where it gets a bit harder...need to determine the replacement
        // node.
        } else {

            var replacement = getReplacementNode(removeNode);

            if (removeNode === this.root) {
                this.root = replacement;

            } else if (isLeftChild) {
                parent.left = replacement;

            } else {
                parent.right = replacement;
            }

            replacement.left = removeNode.left;
        }

        return true;
    };

    module.exports = BST;

    if (module.parent === null) {
        main();
    }

    function main() {
    }

    /********** helper functions **********/
    function addNode(node, newNode, cmp) {
        if (cmp(node.key, newNode.key) > 0) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                addNode(node.left, newNode, cmp);
            }

        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                addNode(node.right, newNode, cmp);
            }

        }
    }

    function containsNode(node, value, cmp) {
        if (node === null) {
            return false;
        }

        if (cmp(node.key, value) > 0) {
            return containsNode(node.left, value, cmp);
        } else if (cmp(value, node.key) > 0) {
            return containsNode(node.right, value, cmp);
        } else {
            return true;
        }
    }

    function inOrderTraverseNode(node, cb) {
        if (node !== null) {
            inOrderTraverseNode(node.left, cb);
            cb(node.key);
            inOrderTraverseNode(node.right, cb);
        }
    }

    function preOrderTraverseNode(node, cb) {
        if (node !== null) {
            cb(node.key);
            preOrderTraverseNode(node.left, cb);
            preOrderTraverseNode(node.right, cb);
        }
    }

    function postOrderTraverseNode(node, cb) {
        if (node !== null) {
            postOrderTraverseNode(node.left, cb);
            postOrderTraverseNode(node.right, cb);
            cb(node.key);
        }
    }

    function minNode(node) {
        if (node) {
            while (node && node.left !== null) {
                node = node.left;
            }
            return node.key;
        }
        return null;
    }

    function maxNode(node) {
        if (node) {
            while (node && node.right !== null) {
                node = node.right;
            }
            return node.key;
        }
        return null;
    }

    function getReplacementNode(nodeToRemove) {
        var replacementParent = nodeToRemove;
        var replacementNode = nodeToRemove;

        var focusNode = nodeToRemove.right;

        while (focusNode !== null) {
            replacementParent = replacementNode;
            replacementNode = focusNode;

            focusNode = focusNode.left;
        }

        if (replacementNode !== nodeToRemove.right) {
            replacementParent.left = replacementNode.right;
            replacementNode.right = nodeToRemove.right;
        }

        return replacementNode;
    }

}());
