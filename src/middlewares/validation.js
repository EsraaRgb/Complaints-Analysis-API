const dataMethods = ["body", "params", "query", "headers"]

const validate = (Schema) => {
    return (req, res, next) => {
        try {
            const validationArr = []
            dataMethods.forEach((key) => {
                if (Schema[key]) {
                    const validationResult = Schema[key].validate(req[key], {
                        abortEarly: false,
                    })
                    if (validationResult?.error) {
                        validationArr.push(validationResult.error.details)
                    }
                }
            })
            if (validationArr.length) {
                res.status(400).json({ message: "Validation error", validationArr })
            } else {
                next()
            }
        } catch (error) {
            res.status(500).json({ message: "catch error", message: err.message })
        }
    }
}

module.exports = validate
