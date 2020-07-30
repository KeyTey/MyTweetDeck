import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { updateTimelines } from '../modules/timelines';

const Menu = () => {
    const dispatch = useDispatch();
    const [drag, setDrag] = useState(false);
    const timelines = useSelector(state => state.timelines);

    // タイムラインリストが空でない場合のみ更新する
    const setList = (timelines) => (timelines.length > 0) && dispatch(updateTimelines(timelines));

    const options = {
        dragClass: 'drag',
        animation: 150,
        onStart: () => setDrag(true),
        onEnd: () => setDrag(false)
    };

    return (
        <ul className="sidebar-nav sidebar-middle">
            <ReactSortable list={timelines} setList={setList} {...options}>
                {timelines.map((timeline, index) => {
                    return <MenuIcon key={timeline.id} index={index} timeline={timeline} drag={drag} />;
                })}
            </ReactSortable>
        </ul>
    );
};

export default Menu;

const MenuIcon = (props) => {
    const [display, setDisplay] = useState('');
    const { index, timeline, drag } = props;
    const labelStyle = { display };

    // ラベルの表示
    const mouseOver = () => drag || setDisplay('inline');
    // ラベルの非表示
    const mouseOut = () => drag || setDisplay('');
    // タイムラインへフォーカス
    const click = () => {
        const timelineItem = $('.timeline')[index];
        const tweetItems = $(timelineItem).find('.tweet-item');
        if ($(tweetItems).length > 0) $(tweetItems)[0].focus();
    };

    return (
        <li>
            <button className="btn btn-secondary w-100" onMouseOver={mouseOver} onMouseOut={mouseOut} onClick={click}>
                <i className={timeline.iconClass}></i>
            </button>
            <div className="timeline-name alert" style={labelStyle}>
                {timeline.name}
            </div>
        </li>
    );
};
