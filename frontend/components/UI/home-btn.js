import { Button } from '@mui/material'
import Link from 'next/link'

export default function HomeBtn({
  linkSrc = '',
  btnText = '請輸入按鈕文字',
  color = '#7B7B7B',
  borderColor = '#7B7B7B',
  backgroundColor = 'unset',
  hoverColor = '#7B7B7B',
  hoverBorderColor = '#D9D9D9',
  hoverBackgroundColor = '#D9D9D9',
}) {
  return (
    <>
      <Link href={linkSrc}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            color: color,
            fontFamily: 'Noto Serif JP',
            lineHeight: 2.5,
            borderRadius: '100px',
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            textTransform: 'none',
            padding: {
              xs: '10px 25px', // 小於600px寬度時
              sm: '16px 40px', // 大於等於600px寬度時
            },
            fontSize: {
              xs: '16px', // 小於600px寬度時
              sm: '20px', // 大於等於600px寬度時
            },
            ':hover': {
              color: hoverColor,
              borderColor: hoverBorderColor,
              backgroundColor: hoverBackgroundColor,
            },
          }}
        >
          <span>{btnText}</span>
        </Button>
      </Link>
    </>
  )
}
