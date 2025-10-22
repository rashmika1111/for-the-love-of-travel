// DB cleanup script for existing records (Mongo shell/Compass)
// Remove base64 featuredImage and strip empty/"undefined" from section data

// Run this in MongoDB shell or Compass
db.posts.updateMany(
  {},
  [
    {
      $set: {
        featuredImage: {
          $cond: [
            { $regexMatch: { input: "$featuredImage", regex: /^data:/i } },
            null,
            "$featuredImage"
          ]
        },
        contentSections: {
          $map: {
            input: { $ifNull: ["$contentSections", []] },
            as: "s",
            in: {
              type: "$$s.type",
              data: {
                $function: {
                  body: function (d) {
                    if (!d || typeof d !== 'object') return d;
                    const out = {};
                    for (const k in d) {
                      const v = d[k];
                      if (v === '' || v === null || v === undefined || v === 'undefined') continue;
                      out[k] = v;
                    }
                    return out;
                  },
                  args: ["$$s.data"],
                  lang: "js"
                }
              }
            }
          }
        }
      }
    }
  ]
);

