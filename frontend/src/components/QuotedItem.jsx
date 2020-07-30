import React from 'react';
import TweetHeader from './TweetHeader';
import TweetContent from './TweetContent';
import TweetImages from './TweetImages';
import TweetVideo from './TweetVideo';

const QuotedItem = (props) => {
    const { tweet } = props;

    return (
        <div className="tweet-item quoted list-group-item p-1" onClick={(e) => e.stopPropagation()}>
            <TweetHeader tweet={tweet} />
            <TweetContent tweet={tweet} />
            <TweetImages tweet={tweet} />
            <TweetVideo tweet={tweet} />
        </div>
    );
};

export default QuotedItem;
