import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { addTimeline } from '../../modules/timelines';
import { status } from '../../modules/user';
import classNames from 'classnames';

const AddTimelineModal = () => {
    const dictionary = useSelector(state => state.dictionary);

    return (
        <div className="modal" id="addTimelineModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">タイムラインを追加する</h5>
                        <button className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            {Object.entries(dictionary).map(([key, timelineList]) => (
                                <TimelineGroup key={key} timelineList={timelineList} />
                            ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-dismiss="modal">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTimelineModal;

const TimelineGroup = (props) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const user = useSelector(state => state.user);
    const [openList, setOpenList] = useState(false);
    const { timelineList } = props;

    // リストの開閉
    const toggleOpenList = () => {
        if (timelineList.items.length === 0) return;
        setOpenList(!openList);
    };

    // 追加ボタンのクリックイベント
    const clickAddButton = (e, timelineItem) => {
        // ゲストユーザーがホームボタンをクリックした場合 -> 認証モーダル表示
        if (user.status === status.GUEST && timelineItem.type === 'home') {
            $('.modal').modal('hide');
            $('#authModal').modal('show');
            return;
        }
        // タイムラインの追加
        dispatch(addTimeline(timelineItem, alert));
        // ボタンのアクション
        const button = $(e.target).closest('.btn');
        $(button).addClass('active');
        $(button).one('animationend', () => $(button).removeClass('active'));
    };

    const listStyle = {
        maxHeight: openList ? '40vh' : 0,
        visibility: openList ? '' : 'hidden'
    };
    const timelineItemClass = 'list-group-item d-flex justify-content-between align-items-center border-none';

    return (
        <li className="list-group-item" onMouseEnter={toggleOpenList} onMouseLeave={toggleOpenList}>
            <h5>{timelineList.name}</h5>
            <ul className="timeline-list list-group border" style={listStyle}>
                {timelineList.items.map((timelineItem, idx) => (
                    <li className={classNames(timelineItemClass, { 'border-top': idx !== 0 })} key={idx}>
                        <span>
                            <span className="btn btn-sm btn-outline-primary mr-3" onClick={(e) => clickAddButton(e, timelineItem)}>
                                <i className="fas fa-plus"></i>
                            </span>
                            <span className="text-truncate mr-2">
                                {timelineItem.name}
                            </span>
                        </span>
                        <i className={timelineItem.iconClass}></i>
                    </li>
                ))}
            </ul>
        </li>
    );
};
