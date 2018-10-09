import React from 'react';
import Modal from './Modal';

require('./Modal.css');

function ModalBlocker(props) {
    var style = { border: '1px solid deepskyblue', padding: '10px', margin: '10px', position: 'fixed', zIndex: 1000, top: 100, background: 'tomato' };
    var element = React.createElement(
        Modal,
        null,
        React.createElement(
            'div',
            { className: 'modal' },
            React.createElement('div', { className: 'modal_backdrop', onClick: props.onClose }),
            React.createElement(
                'div',
                { className: 'modal_contentWrapper' },
                React.createElement(
                    'div',
                    { className: 'modal_card' },
                    props.children
                )
            )
        )
    );
    return element;
}

export default ModalBlocker;