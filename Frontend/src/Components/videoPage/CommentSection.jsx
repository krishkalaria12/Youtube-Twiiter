import React from "react";
import CommentCard from "./CommentCard"

function CommentSection() {
    return (
        <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
            <div className="block">
                <h6 className="mb-4 text-white font-semibold">573 Comments</h6>
                <input
                type="text"
                className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
                placeholder="Add a Comment"
                />
            </div>
            <hr className="my-4 border-white" />
            <CommentCard />
            <CommentCard />
        </div>
    );
}

export default CommentSection;
