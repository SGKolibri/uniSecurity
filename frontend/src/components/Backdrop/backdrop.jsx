import { motion } from 'framer-motion';

const BACKDROP_STYLE = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
}

const Backdrop = ({ children, onCLick }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCLick}
            style={BACKDROP_STYLE}
            className="backdrop"
        >
            {children}
        </motion.div>
    );
}

export default Backdrop;