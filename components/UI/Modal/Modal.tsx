'use client';

import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

type ModalProps = React.HTMLAttributes<HTMLDialogElement> & {
    show: boolean;
    setShow: Function;
};

function Modal(props: ModalProps) {
    const { show, setShow, className, children } = props;
    const ref = useRef<HTMLDialogElement>(null);
    const shown = useRef(false);

    useEffect(() => {
        show && !ref?.current?.open
            ? ref?.current?.showModal?.()
            : ref?.current?.close?.();
        shown.current = show;
    }, [show]);

    const preventAutoClose = (e: any) => e.stopPropagation();

    const onClose = () => setShow(false);

    return (
        <dialog
            className={`${className} ${styles.modal}`}
            ref={ref}
            onCancel={onClose}
            onClick={onClose}
        >
            <div onClick={preventAutoClose}>{children}</div>
        </dialog>
    );
}

export default Modal;
