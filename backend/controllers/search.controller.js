import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
    const { query } = req.params;
    const user = req.user; // ✅ Get user from req

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        const existingEntry = user.searchHistory.find(item => item.id === response.results[0].id && item.searchType === "person");
        if (!existingEntry) {
            await User.findByIdAndUpdate(user._id, {
                $push: {
                    searchHistory: {
                        id: response.results[0].id,
                        image: response.results[0].profile_path,
                        title: response.results[0].name,
                        searchType: "person",
                        createdAt: new Date(),
                    },
                },
            });
        }

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in SearchPerson Controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function searchMovie(req, res) {
    const { query } = req.params;
    const user = req.user;

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        const existingEntry = user.searchHistory.find(item => item.id === response.results[0].id && item.searchType === "movie");
        if (!existingEntry) {
            await User.findByIdAndUpdate(user._id, {
                $push: {
                    searchHistory: {
                        id: response.results[0].id,
                        image: response.results[0].poster_path,
                        title: response.results[0].title,
                        searchType: "movie",
                        createdAt: new Date(),
                    },
                },
            });
        }

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in SearchMovie Controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function searchTv(req, res) {
    const { query } = req.params;
    const user = req.user;

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        const existingEntry = user.searchHistory.find(item => item.id === response.results[0].id && item.searchType === "tv");
        if (!existingEntry) {
            await User.findByIdAndUpdate(user._id, {
                $push: {
                    searchHistory: {
                        id: response.results[0].id,
                        image: response.results[0].poster_path,
                        title: response.results[0].name,
                        searchType: "tv",
                        createdAt: new Date(),
                    },
                },
            });
        }

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in SearchTv Controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({ success: true, content: req.user.searchHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function removeItemFromSearchHistory(req, res) {
    let { id } = req.params; // id will be a string

    // Optional: Only parse if your searchHistory stores `id` as a number
    const parsedId = parseInt(id);

    try {
        const result = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    searchHistory: { id: parsedId }, // Or { id } if it's a string in DB
                },
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Item removed from search history" });
    } catch (error) {
        console.error("Error in removeItemFromSearchHistory controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
