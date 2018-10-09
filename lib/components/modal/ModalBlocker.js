'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./Modal.css');

function ModalBlocker(props) {
    var style = { border: '1px solid deepskyblue', padding: '10px', margin: '10px', position: 'fixed', zIndex: 1000, top: 100, background: 'tomato' };
    var element = _react2.default.createElement(
        _Modal2.default,
        null,
        _react2.default.createElement(
            'div',
            { className: 'modal' },
            _react2.default.createElement('div', { className: 'modal_backdrop', onClick: props.onClose }),
            _react2.default.createElement(
                'div',
                { className: 'modal_contentWrapper' },
                _react2.default.createElement(
                    'div',
                    { className: 'modal_card' },
                    props.children
                )
            )
        )
    );
    return element;
}

exports.default = ModalBlocker;
module.exports = exports['default'];