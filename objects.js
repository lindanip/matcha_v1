const fs = require('fs');
const db = require('./config/db');

function postImages(username, images){
    this.username = username,
    this.images = images,
    this.post = function() {
        var x = 0;
        console.log(images);
        while (images[x])
        {
            console.log(images);
            let split = this.images[x].mimetype.split('/');
            let extension = split[1];
            let img = this.images[x].path+"."+extension;
            console.log("path name: " + img);
            fs.rename(this.images[x].path, img, function(err) {
                if (err)
                {
                    console.log(err);
                }
            });
            db.query("INSERT INTO images (username, image) VALUES (?, ?)", [this.username, img], function(err) {
                if (err)
                {
                    console.log(err);
                }
            });
            x++;
        }
    }
}

module.exports = postImages;