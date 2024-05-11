import React from "react";

function ChannelDescription({channelDetails}) {
  return (
    <div className="flex flex-wrap gap-4 pb-4 pt-6">
      <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
        <img
          src={channelDetails.avatar.url}
          alt={channelDetails.username}
          className="h-full w-full"
        />
      </span>
      <div className="mr-auto inline-block">
        <h1 className="font-bolg text-xl">{channelDetails.fullName}</h1>
        <p className="text-sm text-gray-400">@{channelDetails.username}</p> 
        <p className="text-sm text-gray-400">
          {channelDetails.subscribersCount} Subscribers&nbsp;·&nbsp;{channelDetails.channelsSubscribedToCount} Subscribed
        </p>
      </div>
      <div className="inline-block">
        <div className="inline-flex min-w-[145px] justify-end">
              <button
                // onClick={() => toggleSubscription(owner._id)} 
                className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out sm:w-auto">
                { channelDetails.isSubscribed ?
                  <span className="block">Subscribed</span>
                  :
                  <span className="block">Subscribe</span>
                }
              </button>
        </div>
      </div>
    </div>
  );
}

export default ChannelDescription;
