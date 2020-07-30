import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { postTweet } from '../../modules/timelines';
import { status } from '../../modules/user';

const TweetModal = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const user = useSelector(state => state.user);
    const [content, setContent] = useState('');

    // テキスト管理
    const changeContent = (e) => setContent(e.target.value);

    // ツイートボタンのクリックイベント
    const clickTweetButton = () => {
        // ゲストユーザーの場合 -> 認証モーダル表示
        if (user.status === status.GUEST) {
            $('.modal').modal('hide');
            $('#authModal').modal('show');
            setContent('');
            return;
        }
        // ツイート実行
        dispatch(postTweet(content, alert));
        setContent('');
    };

    return (
        <div className="modal" id="tweetModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">ツイート</h5>
                        <button className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <textarea className="form-control" rows="5" placeholder="いまどうしてる？" value={content} onChange={changeContent}></textarea>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-dismiss="modal">閉じる</button>
                        <button className="btn btn-primary" data-dismiss="modal" onClick={clickTweetButton}>ツイート</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetModal;
