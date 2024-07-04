import zod from 'zod'

const UserSchema = zod.object({
  username: zod.string().min(5, 'Username must be at least 3 characters long').max(20, 'Username must be 20 characters or less'),
  password: zod.string().min(6, 'Password must be at least 6 characters long').max(20, 'Password must be 20 characters or less'),
  description: zod.string().max(100, 'Description must be 100 characters or less').nullish()
})

export function ValidateData (data) {
  return UserSchema.safeParse(data)
}

export function validatePartial(data) {
  return UserSchema.partial().safeParse(data)
}