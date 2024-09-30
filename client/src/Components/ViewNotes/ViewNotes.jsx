import React from 'react';
import './ViewNotes.css';

const ViewNote = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ViewNote;
