/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

// add an image to the gallery
export function addImage(title, author, url) {
    let index = localStorage.getItem("index");

    let image = {
        imageId: index.toString(),
        title: title,
        author: author,
        url: url,
        date: new Date(),
        left: index - 1,
        right: -1
    };

    index = parseInt(index, 10);

    localStorage.setItem(index, JSON.stringify(image));
    if (image.left != -1) {
        let left = JSON.parse(localStorage.getItem(index - 1));
        left.right = index;
        localStorage.setItem(index - 1, JSON.stringify(left));
    }
    localStorage.setItem("index", index + 1);
    let cnum = image.imageId + "c";
    localStorage.setItem(cnum, 0);
    return index;
}

// delete an image from the gallery given its imageId and its corresponding comments
export function deleteImage(imageId) {
    let deleteImage = JSON.parse(localStorage.getItem(imageId));
    let start = parseInt(deleteImage.imageId, 10);
    let left = parseInt(deleteImage.left, 10);
    let right = parseInt(deleteImage.right, 10);
    localStorage.removeItem(imageId);

    let cnum = start + "c";
    let cindex = parseInt(localStorage.getItem(cnum), 10);
    for (let i = 0; i < cindex; i++) {
        let n = i;
        let comment = cnum + n.toString();
        localStorage.removeItem(comment);
    }

    localStorage.removeItem(cnum);

    if (left != -1) {
        let leftImage = JSON.parse(localStorage.getItem(left));
        leftImage.right = right;
        localStorage.setItem(left, JSON.stringify(leftImage));
    }

    if (right != -1) {
        let rightImage = JSON.parse(localStorage.getItem(right));
        rightImage.left = left;
        localStorage.setItem(right, JSON.stringify(rightImage));
    }

    let index = localStorage.getItem("index");

    if(start === index - 1) {
        index = left + 1;
        localStorage.setItem("index", index);
        return left;
    } else {
        return right;
    }
}

// add a comment to an image
export function addComment(imageId, author, content) {
    let cnum = imageId + "c";
    let cindex = localStorage.getItem(cnum);
    let commentId = cnum + cindex.toString();
    let comment = {
        commentId: commentId,
        imageId: imageId.toString(),
        author: author,
        content: content,
        date: new Date(),
        left: parseInt(cindex, 10) - 1,
        right: -1
    };
    alert(commentId);

    localStorage.setItem(commentId, JSON.stringify(comment));
    if (comment.left != -1) {
        let leftnum = cnum + comment.left;
        let left = JSON.parse(localStorage.getItem(leftnum));
        left.right = cindex;
        localStorage.setItem(leftnum, JSON.stringify(left));
    }
    localStorage.setItem(cnum, parseInt(cindex, 10) + 1);
    return comment


}

// delete a comment to an image
export function deleteComment(commentId) {
    let deletecomment = JSON.parse(localStorage.getItem(commentId));
    let imageId = parseInt(deletecomment.imageId, 10);
    let left = parseInt(deletecomment.left, 10);
    let right = parseInt(deletecomment.right, 10);
    localStorage.removeItem(commentId);

    if (left != -1) {
        let leftId = imageId + "c" + left;
        let leftcomment = JSON.parse(localStorage.getItem(leftId));
        leftcomment.right = right;
        localStorage.setItem(leftId, JSON.stringify(leftcomment));
    }

    if (right != -1) {
        let rightId = imageId + "c" + right;
        let rightcomment = JSON.parse(localStorage.getItem(rightId));
        rightcomment.left = left;
        localStorage.setItem(rightId, JSON.stringify(rightcomment));
    }
}

//get an image
export function getImage(imageId) {
    let image = JSON.parse(localStorage.getItem(imageId));
    return image;
}

//get the first image
export function getFirstImage() {
    let index = parseInt(localStorage.getItem("index"), 10);
    let i = 0;
    let img = null;
    while (img === null) {
        img = JSON.parse(localStorage.getItem(i));
        i = parseInt(i, 10) + 1;
    }
    return img;
}

// get the comment of an image
export function getComment(commentId) {
    let comment = JSON.parse(localStorage.getItem(commentId));
    return comment;
}

//get the index of images
export function getIndex() {
    return parseInt(localStorage.getItem("index"), 10);
}

//set the index of images
export function setIndex(index) {
    localStorage.setItem("index", index);
}

//get the cindex for comments
export function getcindex(cnum) {
    return parseInt(localStorage.getItem(cnum), 10);
}
