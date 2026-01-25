// MongoDB Data Migration Script
// Converts existing posts from single 'image' field to 'images' array

// Connect to your MongoDB database first
// Example: use tastepedia

// Migration Script - Run in MongoDB Shell
db.community_posts.updateMany(
    {
        image: { $exists: true }
    },
    [
        {
            $set: {
                images: {
                    $cond: {
                        if: { $or: [{ $eq: ["$image", null] }, { $eq: ["$image", ""] }] },
                        then: [],
                        else: ["$image"]
                    }
                }
            }
        },
        {
            $unset: "image"
        }
    ]
);

// Verify migration
print("Migration complete. Checking results...");
print("Posts with images array: " + db.community_posts.countDocuments({ images: { $exists: true } }));
print("Posts with old image field: " + db.community_posts.countDocuments({ image: { $exists: true } }));

// Sample query to verify data
print("\nSample post after migration:");
printjson(db.community_posts.findOne({ images: { $exists: true } }));
