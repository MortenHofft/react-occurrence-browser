function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import ReactDOM from 'react-dom';
import React from 'react';

var modalRoot = document.body;

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal(props) {
    _classCallCheck(this, Modal);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.el = document.createElement('div');
    return _this;
  }

  Modal.prototype.componentDidMount = function componentDidMount() {
    modalRoot.appendChild(this.el);
  };

  Modal.prototype.componentWillUnmount = function componentWillUnmount() {
    modalRoot.removeChild(this.el);
  };

  Modal.prototype.render = function render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  };

  return Modal;
}(React.Component);

export default Modal;