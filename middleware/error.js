const errorHandler = (err, req, res, next) => {

    message = err.message
    statusCode = err.statusCode || 500

    //Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = `Resource not found`
        statusCode = 404
    }

    // Mongoose dublicate Key
    if (err.code === 11000) {
        message = `Dublicate field valuse entred`
        statusCode = 400
    }

    // Mongoose Validation
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message);
        statusCode = 400
    }

    res.status(statusCode).json({
        success: false,
        error: message
    })
}

module.exports = errorHandler