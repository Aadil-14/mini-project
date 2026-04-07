import React, { useEffect } from 'react';
import { X } from 'lucide-react';

import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
            <div
                className="bg-white w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto p-0 shadow-2xl rounded-2xl animate-slideUp border border-white/50"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button className="bg-transparent border-none text-gray-500 cursor-pointer p-1 rounded-lg flex transition-colors hover:bg-black/5 hover:text-gray-800" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;