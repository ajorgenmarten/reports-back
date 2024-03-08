import { Schema, SchemaTypes, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { User, Session } from './types'

const sessionSchema = new Schema<Session>({
    name: SchemaTypes.String,
    sid: SchemaTypes.String,
    secret: { type: SchemaTypes.String, select: false }
}, {
    versionKey: false,
    _id: false,
    timestamps: true
})

const userSchema = new Schema<User>({
    name: {type: SchemaTypes.String, required: true, min: 3},
    username: {type: SchemaTypes.String, required: true, min: 3, unique: true},
    email: {type: SchemaTypes.String, required: true, min: 6, unique: true },
    password:{type: SchemaTypes.String, required: true, select: false},
    status: {type: SchemaTypes.Boolean, require: true, default: false},
    code: {type: SchemaTypes.String, select: false },
    sessions: {type:  [sessionSchema], select: false },
    role: {type: SchemaTypes.String}
}, {
    versionKey: false,
    timestamps: true
})

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next()
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
    next()
})

userSchema.methods.checkPassword = function(password: string) {
    return bcrypt.compareSync(password, this.password)
}

export const UserModel = model('users', userSchema)