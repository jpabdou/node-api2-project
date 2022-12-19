// implement your posts router here
const express = require("express")
const router = express.Router()
const Post = require("./posts-model")

router.get("/", async (req,res)=>{
    try {
        const data = await Post.find()
        res.status(200).json(data)
    }
    catch {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get("/:id", async (req, res)=> {
    try {
        const data = await Post.findById(req.params.id)
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    }
    catch {
        res.status(500).json({ message: "The post information could not be retrieved" })
    }
})

router.post("/", (req,res)=>{
        const {title, contents} = req.body
        if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            Post.insert({title, contents})
            .then(res=>{
                    return Post.findById(res.id)
            })
            .then(post=>{
                res.status(201).json(post)
            })
            .catch(
                err=>{
                    res.status(500).json({ message: "The post could not be removed",
                error: err })

                }
            )
        }
})

router.put("/:id", async (req, res)=>{
    const {id} = req.params
    const {title, contents} = req.body
    const editPost = await Post.findById(id)
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else if (!editPost) {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else{
        const success = await Post.update(req.params.id, {title, contents})
        try {
                const updatedPost = await Post.findById(success)
                res.status(200).json(updatedPost)

            }
            
        catch {
            res.status(500).json({ message: "The post information could not be modified" })

        }
            
    }

})

router.delete("/:id", async (req, res)=>{
        const {id} = req.params
        const deletedPost = await Post.findById(id)
        if (!deletedPost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            Post.remove(id)
                .then(post=>{
                    res.status(200).json(deletedPost)
                })
                .catch(
                    err=>{
                        res.status(500).json({ message: "The post could not be removed",
                    error: err })

                    }
                )
        }

    }
    
)

router.get("/:id/comments", async (req, res)=>{
    const {id} = req.params
    const target = await Post.findById(id)
    if (!target) {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
        const comments = await Post.findPostComments(id)
        try {   


                res.status(200).json(comments)
            
        }
        catch {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        }
      
    }
})


module.exports=router
