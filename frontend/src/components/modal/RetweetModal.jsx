import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { setModalDataAction } from '../../modules/modal';
import { postRetweet } from '../../modules/timelines';
import { status } from '../../modules/user';

const RetweetModal = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const modal = useSelector(state => state.modal);
    const user = useSelector(state => state.user);

    useEffect(() => {
        // モーダルクローズ時 -> ストアのクリア
        $('#retweetModal').on('hidden.bs.modal', () => {
            setTimeout(() => dispatch(setModalDataAction({ retweetId: '' })), 1);
        });
    }, []);

    // リツイートボタンのクリックイベント
    const clickRetweetButton = () => {
        // ゲストユーザーの場合 -> 認証モーダル表示
        if (user.status === status.GUEST) {
            $('.modal').modal('hide');
            $('#authModal').modal('show');
            return;
        }
        // リツイート実行
        dispatch(postRetweet(modal.retweetId, alert));
    };

    return (
        <div className="modal" id="retweetModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">確認</h5>
                        <button className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>リツイートしますか？</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-dismiss="modal">閉じる</button>
                        <button id="retweetButton" className="btn btn-primary" data-dismiss="modal" onClick={clickRetweetButton}>リツイート</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetweetModal;
