import joi from 'joi'

export const addBook = async (req, res, next) => {
    const schema = joi.object({
        bookName: joi.string()
            .required()
            .min(3)
            .max(30),
        auther: joi.string()
            .required()
            .min(3)
            .max(30)
            .optional(),
        genre: joi.string()
            .required()
            .min(3)
            .max(30),
        publisher: joi.string()
            .required()
            .min(3)
            .max(30),
        price: joi.number()
            .required(),
        stock: joi.number()
            .required(),
    });

    schema.validateAsync(req.body)
        .then(() => {
            return next();
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err.message })
        })
}

export const updateBook = async (req, res, next) => {
    const schema = joi.object({
        id: joi.string()
            .required(),
        bookName: joi.string()
            .min(3)
            .max(30)
            .optional(),
        auther: joi.string()
            .min(3)
            .max(30)
            .optional(),
        genre: joi.string()
            .min(3)
            .max(30)
            .optional(),
        publisher: joi.string()
            .min(3)
            .max(30)
            .optional(),
        price: joi.number()
            .optional(),
        stock: joi.number()
            .optional(),
    });

    schema.validateAsync(req.body)
        .then(() => {
            return next();
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err.message })
        })
}