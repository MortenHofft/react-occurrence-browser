var _modalCard;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import Modal from './Modal';
import injectSheet from 'react-jss';

var modalFadeIn = {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    transition: 'opacity 500ms ease-in'
};

var styles = {
    modal: _extends({}, modalFadeIn, {
        zIndex: 1000
    }),
    modalBackdrop: _extends({}, modalFadeIn, {
        background: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadein 100ms'
    }),
    modalContentWrapper: {
        animation: 'fadein 0.3s',
        width: 630,
        maxWidth: '100%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    modalCard: (_modalCard = {
        boxShadow: '0 0 15px 10px rgba(0, 0, 0, 0.1)',
        background: 'white',
        maxHeight: 'calc(100% - 100px)',
        animation: 'slideDown 0.3s',
        transform: 'translateY(0%)',
        overflow: 'auto'
    }, _modalCard['maxHeight'] = '100vh', _modalCard),
    '@keyframes fadein': {
        from: {
            opacity: '0'
        },
        to: {
            opacity: '1'
        }
    },
    '@keyframes slideDown': {
        from: {
            transform: 'translateY(-20%)'
        },
        to: {
            transform: 'translateY(0%)'
        }
    }
};

function ModalBlocker(props) {
    var classes = props.classes;

    var element = React.createElement(
        Modal,
        null,
        React.createElement(
            'div',
            { className: classes.modal },
            React.createElement('div', { className: classes.modalBackdrop, onClick: props.onClose }),
            React.createElement(
                'div',
                { className: classes.modalContentWrapper },
                React.createElement(
                    'div',
                    { className: classes.modalCard },
                    props.children
                )
            )
        )
    );
    return element;
}

export default injectSheet(styles)(ModalBlocker);;