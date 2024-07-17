import { z } from 'zod'

// Helper to remove '-' from mobile
const sanitizeMobile = (mobile_phone) => mobile_phone.replace(/-/g, '')

// Form validation schema
const schemaForm = z.object({
  name: z
    .string()
    .min(2, {
      message: '請填寫姓名，長度為 2 ~ 20 個字元',
    })
    .max(20, {
      message: '請填寫姓名，長度為 2 ~ 20 個字元',
    }),
  mobile_phone: z
    .string({
      message: '請填寫正確電話號碼',
    })
    .nullable()
    .transform((val) => sanitizeMobile(val || ''))
    .refine(
      (val) => {
        if (val === '') return true
        const mobilePattern = /^09\d{2}\d{3}\d{3}$/
        return mobilePattern.test(val)
      },
      {
        message: '請填寫正確電話號碼',
      }
    ),
})

export default schemaForm
