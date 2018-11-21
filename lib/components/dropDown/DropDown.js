'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _StateContext = require('../../StateContext');

var _StateContext2 = _interopRequireDefault(_StateContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
    dropdown: {
        position: 'absolute',
        padding: 0,
        margin: 0,
        background: 'white',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '12px',
        boxShadow: '0 0 2px 0 rgba(0,0,0,.24), 0 8px 16px 0 rgba(0,0,0,.16)',
        width: 150,
        listStyle: 'none',
        textAlign: 'left',
        top: 24,
        zIndex: 1001,
        '& li': {
            padding: '12px 16px',
            borderBottom: '1px solid #eee',
            '&:last-child': {
                border: 'none'
            }
        }
    },
    backDrop: {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        transition: 'opacity 500ms ease-in',
        zIndex: 1000
    }
};

function DropDown(props) {
    var api = props.api,
        openMenu = props.openMenu,
        menuId = props.menuId,
        classes = props.classes;

    var style = props.align === 'left' ? { left: '8px' } : { right: '8px' };
    style.top = typeof props.top === 'number' ? props.top : undefined;
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        openMenu == menuId && _react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement('div', { className: classes.backDrop, onClick: function onClick() {
                    api.setOpenMenu();
                } }),
            _react2.default.createElement(
                'ul',
                { className: classes.dropdown, style: style },
                props.children
            )
        )
    );
}

var HOC = function HOC(props) {
    return _react2.default.createElement(
        _StateContext2.default.Consumer,
        null,
        function (_ref) {
            var openMenu = _ref.openMenu,
                api = _ref.api;

            return _react2.default.createElement(DropDown, _extends({}, props, { api: api, openMenu: openMenu }));
        }
    );
};

exports.default = (0, _reactJss2.default)(styles)(HOC);
module.exports = exports['default'];