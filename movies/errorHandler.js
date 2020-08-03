module.exports = (err, req, res, next) => {
    let status
    let message
    console.log(err)
    console.log(err.name)
    switch (err.name) {
        case "ValidationError":
            status = 400
            let arrMessage = []
            if (err.errors) {
                for (let index in err.errors) {
                    arrMessage.push(err.errors[index].message)
                }
            } else {
                arrMessage.push(err.message)
            }
            message = arrMessage            
            break
        case "JsonWebTokenError":
            status = 401
            message = err.message
            break
        default:
            status = 500
            message = "Internal Server Error"
            break
    }

    res.status(status).json(message)
}