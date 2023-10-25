import React from "react";


const InputBar = ({ input, index }) => {

    return (
        <div key={`conversation ${index}`} style={{width: '100%'}}>
            {index === 0 && (
                <p className={'input-bar'}>
                    <span>I want a gift for a </span>
                    {input.promptInfo.age ? <span>{input.promptInfo.age} year old</span> : <></>}
                    {input.promptInfo.gender ? <span> {input.promptInfo.gender}</span> : <></>}
                    {input.promptInfo.relationship ? <span> {input.promptInfo.relationship}</span> : <></>}
                    {input.promptInfo.occasion ? <span> for {input.promptInfo.occasion}</span> : <></>}
                    <span> with a budget of ${input.promptInfo.lowerBudgetRange} - ${input.promptInfo.upperBudgetRange}</span>
                    {input.promptInfo.interests.length > 0 &&
                        <p>This person is interested in {input.promptInfo.interests && input.promptInfo.interests.map((interest) => {
                            return (
                                <span key={interest}>{interest}, </span>
                            )
                        })}
                        </p>
                    }
                    {input.promptInfo.disinterests.length > 0 &&
                        <p>And not interested in {input.promptInfo.disinterests && input.promptInfo.disinterests.map((interest) => {
                            return (
                                <span key={interest}>{interest}, </span>
                            )
                        })}
                        </p>
                    }
                    <p>{input.promptInfo.openEndedAddition ? <span> Also, {input.promptInfo.openEndedAddition}</span> : <></>}</p>
                </p>
            )}
            {index > 0 && (
                <p className={'input-bar'}>
                    {input.promptInfo.thumbsUpCategories && input.promptInfo.thumbsUpCategories.length > 0 && (
                        <span>
                            <span>I want more gifts related to: </span>
                            {input.promptInfo.thumbsUpCategories && input.promptInfo.thumbsUpCategories.map((category, index) => {
                                if (index === input.promptInfo.thumbsUpCategories.length - 1 && input.promptInfo.thumbsUpCategories.length > 1) {
                                    return (
                                        <span>and <span style={{color: '#dd0'}} key={category}>{category} </span></span>
                                    )
                                }else if(input.promptInfo.thumbsUpCategories.length > 1){
                                    return (
                                        <span style={{color: '#dd0'}} key={category}>{category}, </span>
                                    )
                                }else {
                                    return (
                                        <span style={{color: '#dd0'}} key={category}>{category} </span>
                                    )
                                }
                            })}
                        </span>
                    )}
                    {input.promptInfo.thumbsDownCategories && input.promptInfo.thumbsDownCategories.length > 0 && (
                        <span>
                            <span>and less gifts related to: </span>
                            {input.promptInfo.thumbsDownCategories && input.promptInfo.thumbsDownCategories.map((category) => {
                                if (index === input.promptInfo.thumbsDownCategories.length - 1 && input.promptInfo.thumbsDownCategories.length > 1) {
                                    return (
                                        <span>and <span style={{color: '#dd0'}} key={category}>{category} </span></span>
                                    )
                                }else if(input.promptInfo.thumbsDownCategories.length > 1){
                                    return (
                                        <span style={{color: '#dd0'}} key={category}>{category}, </span>
                                    )
                                }else {
                                    return (
                                        <span style={{color: '#dd0'}} key={category}>{category} </span>
                                    )
                                }
                            })}
                        </span>
                    )}
                    {((!input.promptInfo.thumbsUpCategories || input.promptInfo.thumbsUpCategories.length === 0) && (!input.promptInfo.thumbsDownCategories || input.promptInfo.thumbsDownCategories.length === 0)) && (
                        <p>Generate more gifts.</p>
                    )}
                </p>
            )}

        </div>
    );
}

export default InputBar;
