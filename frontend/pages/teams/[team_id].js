import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '@/components/layout'

import styles from './teams.module.css'
import PdBtnContained from '@/components/UI/pd-btn-contained'

export default function TeamInfo() {
  const router = useRouter()

  const [oneTeam, setOneTeam] = useState({
    team_id: 0,
    theme_name: '',
    team_title: '',
    nick_name: '',
    difficulty: '',
    branch_name: '',
    reservation_date: '',
    start_time: '',
    end_time: '',
  })

  const getTeam = async (team_id) => {
    const url = 'http://localhost:3001/teams/api/' + team_id

    try {
      const res = await fetch(url)
      //
      const resData = await res.json()

      // if (resData.status === 'success') {
      //   // 檢查是否為物件資料類型(基本保護)
      //   if (resData.data.oneTeam.team_id) {
      //     // 設定到狀態中 ===> 進入update階段，觸發重新渲染(re-render)
      //     setOneTeam(resData.data.oneTeam)
      //   }
      // }
      if (resData.success) {
        const teamData = resData.data
        if (teamData && teamData.team_id) {
          setOneTeam({
            branch_name: teamData.branch_name || '',
            difficulty: teamData.difficulty || '',
            end_time: teamData.end_time || '',
            nick_name: teamData.nick_name || '',
            reservation_date: teamData.reservation_date || '',
            start_time: teamData.start_time || '',
            team_id: teamData.team_id || 0,
            team_title: teamData.team_title || '',
            theme_name: teamData.theme_name || '',
          })
          console.log('Team data set successfully', teamData)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      console.log(router.query)
      const { team_id } = router.query
      getTeam(team_id)
      console.log(oneTeam)
    }

    //
  }, [router.isReady])

  return (
    <>
      <IndexLayout title="糾團">
        <div className={styles.teamsPage}>
          <div className={styles.pageTitle}>
            <h2>團隊內頁</h2>
          </div>
          <div className="container">
            <div className="row">
              <div className={`${styles.teamsSection} row`}>
                <div
                  className={`${styles.teamUnite} borderbox`}
                  key={oneTeam.team_id}
                >
                  <div className={styles.borderbox}>
                    <div className="row">
                      <div className="col-9">
                        <div className="teamTitle">
                          <h3>{oneTeam.theme_name}</h3>
                          難度:<span>{oneTeam.difficulty}</span>
                        </div>
                        <h5>團名：{oneTeam.team_title}</h5>
                        <p>
                          團長：{oneTeam.nick_name}
                          <br />
                          日期：{oneTeam.reservation_date}
                          <br />
                          開始時間：{oneTeam.start_time}
                          <br />
                          結束時間：{oneTeam.end_time}
                          <br />
                          場次：{oneTeam.branch_name}
                          <br />
                          人數：2 / 6
                        </p>
                        <p>
                          目前人數
                          <br />
                          團長的話
                          <br />
                        </p>
                      </div>
                      <div className="col-3">
                        {' '}
                        <div className="teamPhoto">
                          {/* <img src={catImage} alt="cat" /> */}
                          <img
                            src="/teams/collage-maker-02.jpg"
                            alt="cat"
                            width={'100%'}
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <PdBtnContained
                          btnText="申請加入 / 管理團員"
                          color="grey"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.borderbox}>
                    <h4>留言給團長</h4>
                    <inputarea></inputarea>

                    <div style={{ textAlign: 'center' }}>
                      <PdBtnContained btnText="送出留言" color="grey" />
                    </div>
                  </div>

                  <div className={styles.borderbox}>
                    <div>
                      <h4>留言區</h4>
                    </div>
                    <div>圖 名 時間 留言內容</div>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IndexLayout>
    </>
  )
}