import { addImage, deleteImage, addComment, deleteComment, getFirstImage, getImage, getComment, getIndex, setIndex, getcindex } from './api.mjs'; 

//Fill the gallery when you currently add the first image, or you refresh with gallery not empty
function fillGallery() {
    if ((index != 0)&&(isEmpty)) {
        alert("hello");
        let current = getFirstImage();
        let image_contents = document.createElement("div");
        image_contents.id = ("ic");
        image_contents.innerHTML = `
        <div class="image_display">
            <div class="display_title" id="idt">Image display</div>
            <img src="${current.url}" id="current_img">
            <div class="img_description" id="current_title">Title: ${current.title}</div>
            <div class="img_description" id="current_author">Author: ${current.author}</div>
            <div class="shifting_buttons">
                <button type="click" class="btn" id="left_img">&lt;==</button>
                <button type="click" class="btn" id="right_img">==&gt;</button>
                <button type="click" class="btn" id="delete_img">DELETE</button>
            </div>
        </div>
        <form class="make_comment" id="mc">
            <div class="display_title">Comment ont it</div>
            <div  class="add_subtitle">User</div>
            <input
                type="text"
                class="add_input"
                placeholder="Enter your name"
                name="user_name"
                id="user_name"
                required
            />
            <div class="add_subtitle">Comment</div>
            <input
                type="text"
                class="add_input"
                placeholder="Enter your comment"
                name="user_comment"
                id="user_comment"
                required
            />
            <button type="submit" class="btn" id="mk_comment">Submit</button>
        </form>
        <div class="comments">
            <div class="past_comments">
                <div class="display_title">Comments</div>
                <div id="comment_section">
                </div>
            </div>
            <div class="shifting_buttons">
                <button type="click" class="btn" id="left_comment">&lt;==</button>
                <button type="click" class="btn" id="right_comment">==&gt;</button>
            </div>
        </div>
        `;
        document.getElementById("not_empty").prepend(image_contents);

        //shifting images
        document.getElementById("left_img").addEventListener("click", function(){
            let cur_img = getImage(current_img_index);
            let left = parseInt(cur_img.left, 10);
            if(left != -1) {
                current_img_index = left;
                changeimg(current_img_index);
            }
        })

        document.getElementById("right_img").addEventListener("click", function(){
            let cur_img = getImage(current_img_index);
            let right = parseInt(cur_img.right, 10);
            if(right != -1) {
                current_img_index = right;
                changeimg(current_img_index);
            }
        })

        //delete images
        document.getElementById("delete_img").addEventListener("click", function(){
            waiting();
            current_img_index = deleteImage(current_img_index);
            index = getIndex();
            if(index === 0) {
                clearGallery();
            } else {
                changeimg(current_img_index);
            }
        })

        //post comment
        document.getElementById("mk_comment").addEventListener("click", function(e){
            e.preventDefault();
            const name = document.getElementById("user_name").value;
            const content = document.getElementById("user_comment").value;
            document.getElementById("mc").reset();
            alert(current_img_index);
            let c = addComment(current_img_index, name, content);
            clist.unshift(c);
            showComments();
        })

        //for shifting comments
        document.getElementById("right_comment").addEventListener("click", function(){
            if(current_comment_index + 10 < clist.length) {
                current_comment_index = current_comment_index + 10;
                showComments();
            }
        })

        document.getElementById("left_comment").addEventListener("click", function(){
            if(current_comment_index - 10 >= 0) {
                current_comment_index = current_comment_index - 10;
                showComments();
            }
        })

        isEmpty = false;
        changeimg(current.imageId);
    }
}

//Transition between changing image
function waiting() {
    document.getElementById("current_img").src = 'webgallery/media/time-left.png';
    document.getElementById("current_title").innerHTML = `Title: Time Left`;
    document.getElementById("current_author").innerHTML = `Author: Flaction`;
}


//Clear the gallery when you delete all images
function clearGallery() {
    if((index === 0)&&(!isEmpty)) {
        document.getElementById("ic").remove();
        isEmpty = true;
        index = 0;
        setIndex(index);
    }
}

//When shifting images, use this function
function changeimg(imageId) {
    removeAllComments();
    let image = getImage(imageId);
    document.getElementById("current_img").src = image.url;
    document.getElementById("current_title").innerHTML = `Title: ${image.title}`;
    document.getElementById("current_author").innerHTML = `Author: ${image.author}`;
    // Then shift to the comments of the new image
    clist.splice(0, clist.length);
    current_comment_index = 0;
    let cnum = imageId + "c";
    let cindex = getcindex(cnum);
    for (let i = 0; i < cindex; i++) {
        let n = i;
        let cId = cnum + n.toString();
        let comment = getComment(cId);
        if (comment != null) {
            clist.unshift(comment);
        }
    }
    showComments();
}

//get the index of comments in the clist
function getListIndex(commentId) {
    let i = 0;
    while (clist[i].commentId != commentId) {
        i++;
    }
    return i;
}

//show this group of 10 comments
function showComments() {
    removeAllComments();
    let end = current_comment_index + 10;
    if (end >= clist.length) {
        end = clist.length;
    }
    end = end - 1;
    for (let i = end; i >= current_comment_index; i--) {
        commentMaker(clist[i]);
    }
}

//post the division of comment into html
function commentMaker(comment) {
    let current = comment;
    let comment_contents = document.createElement("div");
    comment_contents.className = "latest_comment";
    comment_contents.id = current.commentId;
    comment_contents.innerHTML = `
    <div class="uat">
        <div class="uat_u">${current.author}</div>
        <div class="uat_a">${current.date}</div>
    </div>
    <div class="lcc">${current.content}</div>
    <button type="click" class="delete_btn">Delete</button>
    `;
    document.getElementById("comment_section").prepend(comment_contents);

    for (let child of comment_contents.children) {
        switch(child.className) {
          case "delete_btn" :
            child.addEventListener("click", function(){
                let id = getListIndex(comment_contents.id);
                deleteComment(comment_contents.id);
                clist.splice(id, 1);
                document.getElementById(comment_contents.id).remove();
                showComments();
            })
            break;
          case "default":
            break;
        }
    };
}

//Remove all comment for the change of or add/delete of comments
function removeAllComments() {
    let toDelete = document.querySelectorAll("div.latest_comment");
    toDelete.forEach(function(e){
        e.remove();
    });
}


let addepd = false;
//localStorage.clear();
let index = localStorage.getItem("index");
if (index === null) {
    index = 0;
    setIndex(index);
}


let isEmpty = true;
if (index === 0) {
    isEmpty = true;
}

let bt=document.getElementById("ae");
let current_img_index = 0;
let current_comment_index = 0;
let clist = [];


//add images
bt.addEventListener("click", function(){
    if (!addepd) {
        let ae = document.createElement("form");
        ae.className = "add_image_detail";
        ae.id = "aexpand";
        ae.innerHTML = `
        <div  class="add_subtitle">Title</div>
        <input
            type="text"
            class="add_input"
            placeholder="Enter image title"
            name="image_title"
            id="input_it"
            required
        />
        <div class="add_subtitle">Author</div>
        <input
            type="text"
            class="add_input"
            placeholder="Enter image author's name"
            name="image_author"
            id="input_ia"
            required
        />
        <div class="add_subtitle">URL</div>
        <input
            type="text"
            class="add_input"
            placeholder="Enter image url"
            name="image_url"
            id="input_iu"
            required
        />
        <button type="submit" class="btn" id="sub">Upload</button>
        `;
        document.getElementById("add_expand").prepend(ae);
        bt.innerHTML = "-&nbsp;&nbsp;&nbsp;Add an image(Click to shrink)";

        document.getElementById("sub").addEventListener("click", function(e){
            e.preventDefault();
            const title = document.getElementById("input_it").value;
            const author = document.getElementById("input_ia").value;
            const url = document.getElementById("input_iu").value;
            document.getElementById("aexpand").reset();
            let newword = addImage(title, author, url);
            let newId = parseInt(newword, 10);
            index = newId + 1;
            fillGallery();
            changeimg(newId);
            current_img_index = newId;
        })
    } else {
        let ae = document.getElementById("aexpand");
        ae.remove();
        bt.innerHTML = "+&nbsp;&nbsp;&nbsp;Add an image(Click to expand)";
    }
    addepd = !addepd;
})

fillGallery();
//localStorage.removeItem("index");
