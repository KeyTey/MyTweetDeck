import React from 'react';
import { useSelector } from 'react-redux';

const ImageModal = () => {
    const modal = useSelector(state => state.modal);
    const imageUrl = modal.imageUrl;
    const imageItem = imageUrl ? <img className="img-full img-thumbnail" src={imageUrl} /> : null;

    return (
        <div className="modal" id="imageModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                {imageItem}
            </div>
        </div>
    );
};

export default ImageModal;
