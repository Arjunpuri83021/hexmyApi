const Data = require('../model/dataModel');
const Stars = require('../model/Stars.model')


function slugify(input) {
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

exports.data = async (req, res) => {
  const { videoNo, views, link, imageUrl, titel, minutes, Category, name, desc,altKeywords } = req.body;

  try {
    // Check if `name` is provided and valid
    if (!name || !Array.isArray(name)) {
      return res.status(400).json({ error: "The 'name' field must be an array of strings." });
    }

    // Slugify each name individually
    const slugifiedNames = name.map((item) => slugify(item));

    // Create a new record with the processed `name` array
    const record = new Data({
      imageUrl,
      altKeywords,
      name: slugifiedNames, // Use the slugified array
      videoNo,
      views,
      link,
      titel,
      minutes,
      Category,
      desc
    });

    // Save the record to the database
    await record.save();

    console.log(record);
    res.status(201).json(record);
  } catch (error) {
    console.error("Error in data post API:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getpostdata = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $or: [
        { videoNo: { $regex: search, $options: "i" } },
        { titel: { $regex: search, $options: "i" } },
      ],
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting by createdAt (most recent first), and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records (newest first)
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getpostdata API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getpopularVideos = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $and: [
        { views: { $gt: 40 } }, // Filter for views greater than 40
        {
          $or: [
            { videoNo: { $regex: search, $options: "i" } },
            { titel: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting by createdAt (most recent first), and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records (newest first)
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getpostdata API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getnewVideos = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $and: [
        { views: { $lte: 40 } }, // Filter for views less than or equal to 40
        {
          $or: [
            { videoNo: { $regex: search, $options: "i" } },
            { titel: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting by createdAt (most recent first), and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records (newest first)
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getLessPopularVideos API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTopRate = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $and: [
        { views: { $gt: 100 } }, // Filter for views greater than 40
        {
          $or: [
            { videoNo: { $regex: search, $options: "i" } },
            { titel: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting by createdAt (most recent first), and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records (newest first)
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getpostdata API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.relatedpostData = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // Split the search term into words for better matching
    const searchWords = search.split(" ");
    const query = {
      $or: searchWords.map((word) => ({
        titel: { $regex: word, $options: "i" },
      })),
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting, and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getpostdata API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $or: [
        { videoNo: { $regex: search, $options: "i" } },
        { titel: { $regex: search, $options: "i" } },
      ],
      minutes: { $gte: 49 }, // Filter to show only videos of 49 minutes or more
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting, and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getpostdata API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.deletepost = async (req, res) => {
  const id = req.params.id;
  try {
    const record = await Data.findByIdAndDelete(id);
    res.json(record);
  } catch (error) {
    console.log("error in delete post api", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatepost = async (req, res) => {
  const { postId } = req.params;
  const { videoNo, name, views, link, imageUrl, titel, minutes, Category, desc,altKeywords } = req.body;

  try {
    // Check if `name` is provided and slugify it if it's an array
    let updatedName = name;

    if (name && Array.isArray(name)) {
      updatedName = name.map((item) => slugify(item));
    } else if (name && typeof name === 'string') {
      updatedName = slugify(name);
    }

    // Perform the update operation
    const updatedRecord = await Data.findByIdAndUpdate(
      postId,
      {
        imageUrl,
        altKeywords,
        name: updatedName, // Ensure the updated name is slugified
        videoNo,
        views,
        link,
        titel,
        minutes,
        Category,
        desc
      },
      { new: true } // Return the updated document
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedRecord);
  } catch (error) {
    console.error("Error in update post API:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};





  exports.addStar = async(req,res)=>{
    const {starUrl,starName,starLike,starImgUrl} = req.body
  const StarCheack= await Stars.findOne({starName:starName})
   console.log(StarCheack) 
   if(StarCheack==null){
    const record= await new Stars({
      starurl:starUrl,
      starName:starName,
      likes:starLike,
      starImgUrl:starImgUrl
     })
     await record.save()
    //  console.log(record)
     res.json(record)

    }
    else{
      res.json({
        message:"Star Is allready Added"
      })
    }
  }


  exports.getstars = async(req,res)=>{
   const record= await Stars.find()
   res.json(record)
  }


  // Update a star by ID
exports.updateStar = async (req, res) => {
  const starId = req.params.starId;
  const { starUrl, starName, starLike, starImgUrl } = req.body;

  try {
    const updatedStar = await Stars.findByIdAndUpdate(
      starId,
      { starurl: starUrl, starName, likes: starLike, starImgUrl },
      { new: true } // This option returns the modified document rather than the original.
    );

    if (!updatedStar) {
      return res.status(404).json({ error: 'Star not found' });
    }

    res.json(updatedStar);
  } catch (error) {
    console.log("Error in update star API", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a star by ID
exports.deleteStar = async (req, res) => {
  const starId = req.params.starId;

  try {
    const deletedStar = await Stars.findByIdAndDelete(starId);

    if (!deletedStar) {
      return res.status(404).json({ error: 'Star not found' });
    }

    res.json(deletedStar);
  } catch (error) {
    console.log("Error in delete star API", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateviews = async (req, res) => {
  const { id } = req.params;
  const { views } = req.body;

  try {
    const updatedPost = await Data.findByIdAndUpdate(id, { views }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    console.log("Error in update views API", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getindians = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $and: [
        { Category: "indian" }, // Filter for "indian" category
        {
          $or: [
            { videoNo: { $regex: search, $options: "i" } }, // Search by video number
            { titel: { $regex: search, $options: "i" } },   // Search by title
          ],
        },
      ],
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting by createdAt (most recent first), and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by newest records first
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getindians API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getHijabi = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 16 } = req.query;

    // MongoDB query to filter data
    const query = {
      $and: [
        { Category: "hijabi" }, // Filter for hijabi category
        {
          $or: [
            { videoNo: { $regex: search, $options: "i" } }, // Search in videoNo
            { titel: { $regex: search, $options: "i" } },   // Search in titel
          ],
        },
      ],
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records with search, sorting by createdAt (most recent first), and pagination
    const records = await Data.find(query)
      .sort({ createdAt: -1 }) // Sort by latest records (newest first)
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count for pagination metadata
    const totalRecords = await Data.countDocuments(query);

    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.log("Error in getHijabi API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getVideo = async(req,res)=>{
 const id =req.params.id
 const record=  await Data.findById(id)
 res.json(record)
}



exports.searchByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { page = 1, limit = 16 } = req.query; // Get page and limit from query parameters

    // MongoDB query to match the name using $regex for case-insensitive and partial match
    const query = {
      name: { $regex: name, $options: 'i' }, // Case-insensitive match of the name
    };

    // Pagination logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch records matching the query with pagination
    const records = await Data.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Sorting by createdAt, most recent first

    // Get the total count of documents matching the query (for pagination metadata)
    const totalRecords = await Data.countDocuments(query);

    // Return the paginated data along with metadata
    res.json({
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      records,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

