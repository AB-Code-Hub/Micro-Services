import Joi from "joi";


export const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(55).required(),
    });

    return schema.validate(data);
}

export const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(55).required(),
    });

    return schema.validate(data);
}
export const logoutValidation = (data) => {
    const schema = Joi.object({
        token: Joi.string().required(),
    });

    return schema.validate(data);
}