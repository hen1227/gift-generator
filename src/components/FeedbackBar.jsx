import React from "react";


const FeedbackBar = ({ thumbsUpCategories, thumbsDownCategories }) => {

    console.log(thumbsUpCategories);
    console.log(thumbsDownCategories);

    return (
        <div className={'feedback-bar'}>
            {thumbsUpCategories.length > 0 && (
                <div className={'reactionContainer'}>
                    <span>👍: </span>
                    {thumbsUpCategories.map((category, index) => {
                        return (
                            <div key={index} className={'reaction'}>
                                <p>{category}</p>
                            </div>
                        )
                    })}
                </div>
            )}
            {thumbsDownCategories.length > 0 && (
                <div className={'reactionContainer'}>
                    <span>👎: </span>
                    {thumbsDownCategories.map((category, index) => {
                        return (
                            <div key={index} className={'reaction'}>
                                <p>{category}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}


export default FeedbackBar;
