import React from 'react';
import Modal from './Modal';
import injectSheet from 'react-jss';

const modalFadeIn = {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    transition: 'opacity 500ms ease-in'
};

const styles = {
    modal: {
        ...modalFadeIn,
        zIndex: 1000
    },
    modalBackdrop: {
        ...modalFadeIn,
        background: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadein 100ms'
    },
    modalContentWrapper: {
        animation: 'fadein 0.3s',
        width: 630,
        maxWidth: '100%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    modalCard: {
        boxShadow: '0 0 15px 10px rgba(0, 0, 0, 0.1)',
        background: 'white',
        maxHeight: 'calc(100% - 100px)',
        animation: 'slideDown 0.3s',
        transform: 'translateY(0%)',
        overflow: 'auto',
        maxHeight: '100vh'
    },
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
    const { classes } = props;
    const element = (
        <Modal>
            <div className={classes.modal}>
                <div className={classes.modalBackdrop} onClick={props.onClose}></div>
                <div className={classes.modalContentWrapper} >
                    <div className={classes.modalCard}>
                        {props.children}
                    </div>
                </div>
            </div>
        </Modal>
    );
    return element;
}


export default injectSheet(styles)(ModalBlocker);;