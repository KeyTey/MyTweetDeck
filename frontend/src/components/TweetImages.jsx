import React from 'react';
import { useDispatch } from 'react-redux';
import { setModalDataAction } from '../modules/modal';

const TweetImages = (props) => {
    const dispatch = useDispatch();
    const { tweet } = props;

    // クリック -> 画像モーダル表示
    const clickImage = (e, imageUrl) => {
        e.stopPropagation();
        dispatch(setModalDataAction({ imageUrl }));
    };

    // マウスオーバー -> 画像のロード
    const mouseOverImage = (imageUrl) => {
        dispatch(setModalDataAction({ imageUrl }));
    };

    // 画像用スタイル
    const getImageStyle = (imageUrl) => ({
        backgroundImage: `url(${imageUrl}?format=jpg&name=240x240)`
    });

    return (
        <div className="row mb-0 no-gutters">
            {tweet.imageUrls.map((imageUrl) => (
                <div className="col-6" key={imageUrl}>
                    <div
                        style={getImageStyle(imageUrl)}
                        className="img-preview border mb-1"
                        data-toggle="modal"
                        data-target="#imageModal"
                        onClick={(e) => clickImage(e, imageUrl)}
                        onMouseOver={() => mouseOverImage(imageUrl)}
                    />
                </div>
            ))}
        </div>
    );
};

export default TweetImages;
