import { motion } from 'framer-motion';
import Backdrop from '../Backdrop';

const dropIn = {
    hidden: {
        y: '-100vh',
        opacity: 0
    },
    visible: {
        y: '0px',
        opacity: 1,
        transition: {
            durantion: 0.1,
            type: 'spring',
            damping: 25,
            stiffness: 200
        }
    },
    exit: {
        y: '60%',
        opacity: 0
    }
};

const Modal = ({ handleClose, child }) => {
    return (
        <Backdrop onCLick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    top: '-10%',
                    width: '500px',
                    height: '300px',
                    background: '#fff',
                    borderRadius: '5px',
                    padding: '20px',
                    zIndex: 10
                }}
                className="modal"
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <h
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        fontSize: '1.5rem',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}
                >
                    {child}
                </h>
                {/* <motion.button
                    
                    onClick={handleClose}
                >
                    Fechar
                </motion.button> */}
            </motion.div>
        </Backdrop>
    );
}

export default Modal;   