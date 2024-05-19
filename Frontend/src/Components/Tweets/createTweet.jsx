import React, { useState } from 'react';

function CreateTweet({ handleTweetSubmit }) { 
    const [tweetContent, setTweetContent] = useState('');

    const handleInputChange = (e) => {
        setTweetContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (tweetContent.trim()) {
            handleTweetSubmit(tweetContent);
            setTweetContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
            <textarea
                value={tweetContent}
                onChange={handleInputChange}
                placeholder="What's happening?"
                className="flex-grow w-full sm:w-2/3 p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
                Tweet
            </button>
        </form>
    );
}

export default CreateTweet;
