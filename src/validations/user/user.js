import joi from 'joi'

export const signup = async (req, res, next) => {
    const schema = joi.object({
        name: joi.string()
            .required()
            .min(3)
            .max(30),
        email: joi.string()
            .email()
            .required()
            .lowercase(),
        password: joi.string()
            .required()
            .min(5),
        role: joi.string().valid('librarian', 'customer').optional(),
    });

    schema.validateAsync(req.body)
        .then(() => {
            return next();
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err.message })
        })
}

export const login = async (req, res, next) => {
    const schema = joi.object({
        email: joi.string()
            .email()
            .required()
            .lowercase(),
        password: joi.string()
            .required()
            .min(5),
    });

    schema.validateAsync(req.body)
        .then(() => {
            return next();
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err.message })
        })
}

export const updateUser = async (req, res, next) => {
    const schema = joi.object({
        name: joi.string()
            .required()
            .min(3)
            .max(30)
            .optional(),
        email: joi.string()
            .email()
            .required()
            .lowercase()
            .optional(),
        password: joi.string()
            .required()
            .min(5)
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