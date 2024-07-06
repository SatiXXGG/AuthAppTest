import zod from 'zod'

const AppSchema = zod.object({
  title: zod.string().min(5, 'title must be at least 3 characters long').max(20, 'title must be 20 characters or less'),
  description: zod.string().max(100, 'Description must be 100 characters or less').nullish()
})

export function ValidateAppData (data) {
  return AppSchema.safeParse(data)
}

export function validateAppPartial(data) {
  return AppSchema.partial().safeParse(data)
}