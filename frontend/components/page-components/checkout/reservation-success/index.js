// page components checkout success
import styles from './reservation-success.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
// contexts
import { useAuth } from '@/context/auth-context'
// hooks
import { formatDateWithWeekday } from '@/hooks/numberFormat'
// components
import BlackBtn from '@/components/UI/black-btn'
import OutlineBtn from '@/components/UI/outline-btn'
import SuccessRows from './success-rows'
import SuccessDeposit from './success-deposit'
// api path
import { GET_RESERVATION_PAYMENT } from '@/configs/api-path'

export default function ReservationSuccessSection() {
  const router = useRouter()
  const { reservation_id } = router.query
  const { auth, authIsReady } = useAuth() // 取得 auth.id, authIsReady
  const [res, setRes] = useState([]) // reservation data
  const [fetchReady, setFetchReady] = useState(false)
  const [title, setTitle] = useState('')

  const fetchOneReservation = async (reservation_id) => {
    setTitle('')
    try {
      const response = await axios.get(
        `${GET_RESERVATION_PAYMENT}/${reservation_id}`
      )

      if (response.data.status) {
        setRes(response.data.rows[0])
        setFetchReady(true)
        setTitle('訂單付款完成')
      } else {
        setTitle('路徑錯誤！')
      }
    } catch (error) {
      console.error('Error fetching reservation results:', error)
    }
  }

  useEffect(() => {
    if (router.isReady && authIsReady && auth.id) {
      fetchOneReservation(reservation_id)
    }
  }, [router.isReady, authIsReady, auth.id, reservation_id])

  return (
    <section className={styles.sectionContainer}>
      <h3 className={styles.titleStyles}>{title}</h3>

      {res && (
        <div className={styles.contentContainer}>
          <img className={styles.ghostImg} src="/ghost/ghost_03.png" alt="" />

          <SuccessRows
            label="密室主題"
            content={`${res.branch_name} - ${res.theme_name}`}
          />
          <SuccessRows
            label="預約日期"
            content={formatDateWithWeekday(res.reservation_date)}
          />
          <SuccessRows label="預約人數" content={`${res.participants} 人`} />
          <SuccessRows
            label="預約場次"
            content={`${res.start_time} ~ ${res.end_time}`}
          />

          <SuccessDeposit
            deposit={`訂金金額：${res.deposit} 元`}
            payment_date={res.payment_date}
          />
        </div>
      )}

      <div className={styles.btnStack}>
        <OutlineBtn
          btnText="回首頁"
          onClick={() => router.push('/')}
          href={null}
          paddingType="medium"
        />
        <BlackBtn
          btnText="檢視行程"
          onClick={() => router.push('/user/reservation/ongoing')}
          href={null}
          paddingType="medium"
        />
      </div>
    </section>
  )
}
