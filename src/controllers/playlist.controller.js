import mongoose, {isValidObjectId} from "mongoose"
import { Playlist } from "../models/playlist.models.js"
import { Video } from "../models/video.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if (req.user?._id) {
        throw new ApiError(400, "You must be authenticated to create a playlist")
    }

    if (!name) {
        throw new ApiError(404, "Name is Required")
    }

    if (!description) {
        throw new ApiError(404, "Description is Required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id,
    });

    if (!playlist) {
        throw new ApiError(500, "failed to create playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "playlist created successfully"));

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            }
        },
        {
            $match: {
                "videos.isPublished": true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                },
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1
                }
            }
        }
        
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, playlistVideos[0], "playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (req.user?._id) {
        throw new ApiError(400, "You must be authenticated to add a video to playlist")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if ((playlist?._id.toString() && video.owner.toString()) !== req.user?._id) {
        throw new ApiError(400, "You can't add video to this playlist as you are not the owner")
    }

    const addVideoToPlaylist = await Playlist.findByIdAndUpdate(playlist?._id, {
        $addToSet: {
            videos: videoId
        }
    }, {new: true})

    if (!addVideoToPlaylist) {
        throw new ApiError(500, "Failed to add video to playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, addVideoToPlaylist, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (req.user?._id) {
        throw new ApiError(400, "You must be authenticated to remove a video from playlist")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const playlist = await Playlist.findById(playlistId)
    const video = await Video.findById(videoId)

    if ((playlist?._id.toString() && video.owner.toString()) !== req.user?._id) {
        throw new ApiError(400, "You can't remove video from this playlist as you are not the owner")
    }

    const removeVideoFromPlaylist = await Playlist.findByIdAndDelete(playlist?._id, {
        $pull: {
            videos: videoId
        }
    }, {new: true})

    if (!removeVideoFromPlaylist) {
        throw new ApiError(500, "Failed to remove video from playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, removeVideoFromPlaylist, "Video removed from playlist successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id");
    }

    const playlistDetails = await Playlist.findById(playlistId);

    if (!playlistDetails) {
        throw new ApiError(400, "No Playlist Such Found");
    }

    if (playlistDetails?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            400,
            "You can't delete this Playlist as you are not the owner"
        );
    }
    
    const result = await Playlist.findByIdAndDelete(playlistDetails?._id)
    
    if (!result) {
        throw new ApiError(500, "Couldnt Delete the Playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Successfully Deleted the Playlist")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if (req.user?._id) {
        throw new ApiError(400, "You must be authenticated to Delete a playlist")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist Id");
    }

    if (!name) {
        throw new ApiError(404, "Name is Required")
    }

    if (!description) {
        throw new ApiError(404, "Description is Required")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "No Playlist found");
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(
            400,
            "You can't edit this playlist as you are not the owner"
        );
    }

    const updatePlaylist = await Playlist.findByIdAndUpdate(playlist?._id, {
        $set: {
            name,
            description
        }
    }, {new: true})

    if (!updatePlaylist) {
        throw new ApiError(500, "Failed to update the playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatePlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
