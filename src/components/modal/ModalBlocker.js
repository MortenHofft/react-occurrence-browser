import React from 'react';
import Modal from './Modal';

require('./Modal.css');

function ModalBlocker(props) {
    const style = {border: '1px solid deepskyblue', padding: '10px', margin: '10px', position: 'fixed', zIndex: 1000, top: 100, background: 'tomato'};
    const element = (
        <Modal>
            <div className="modal">
                <div className="modal_backdrop" onClick={props.onClose}></div>
                <div className="modal_contentWrapper">
                    <div className="modal_card">
                        {props.children}
                    </div>
                </div>
            </div>
        </Modal>
    );
    return element;
}

export default ModalBlocker;